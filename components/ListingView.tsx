"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product, Category } from "@/lib/types";
import type { SortKey } from "@/lib/api";
import ProductCard from "./ProductCard";
import ScrollReveal from "./ScrollReveal";
import ProductFilters, { type FilterState } from "./ProductFilters";
import { FABRIC_OPTIONS, PIECE_COUNT_OPTIONS, OCCASION_OPTIONS } from "@/lib/data";

interface ListingViewProps {
  initialProducts: Product[];
  category: Category;
  currentSub: string;
  subcategories: string[];
  categoryTitle: string;
  categoryDescription?: string;
  initialSort?: SortKey;
}

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "Unstitched"];
const PAGE_SIZE = 12;

export default function ListingView({
  initialProducts,
  category,
  currentSub,
  subcategories,
  categoryTitle,
  categoryDescription,
  initialSort = "featured",
}: ListingViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial filter state from props & URL search params
  const [filters, setFilters] = useState<FilterState>(() => {
    const fabricParam = searchParams.get("fabric");
    const pieceParam = searchParams.get("piece");
    const sortParam = (searchParams.get("sort") as SortKey) || initialSort;

    return {
      fabrics: fabricParam ? fabricParam.split(",") : [],
      pieceCounts: pieceParam ? pieceParam.split(",") : [],
      occasions: [],
      sizes: [],
      minPrice: null,
      maxPrice: null,
      inStockOnly: false,
      sort: sortParam,
      gridCols: 3,
    };
  });

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Sync grid density preference with localStorage on client
  useEffect(() => {
    try {
      const savedCols = localStorage.getItem("velour_grid_cols");
      if (savedCols && ["2", "3", "4"].includes(savedCols)) {
        setFilters((prev) => ({ ...prev, gridCols: Number(savedCols) as 2 | 3 | 4 }));
      }
    } catch {}
  }, []);

  // Update localStorage when gridCols changes
  const handleFilterChange = (newFilters: FilterState) => {
    if (newFilters.gridCols !== filters.gridCols) {
      try {
        localStorage.setItem("velour_grid_cols", String(newFilters.gridCols));
      } catch {}
    }
    setFilters(newFilters);
    setVisibleCount(PAGE_SIZE); // reset pagination when filter changes
  };

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      fabrics: [],
      pieceCounts: [],
      occasions: [],
      sizes: [],
      minPrice: null,
      maxPrice: null,
      inStockOnly: false,
    }));
    setVisibleCount(PAGE_SIZE);
  };

  // Min and max prices in current catalog for the range inputs
  const priceRange = useMemo(() => {
    if (initialProducts.length === 0) return { min: 0, max: 50000 };
    const prices = initialProducts.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices) / 1000) * 1000,
      max: Math.ceil(Math.max(...prices) / 1000) * 1000,
    };
  }, [initialProducts]);

  // Client-side filtering & sorting
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Subcategory pill filter (if not "all")
    if (currentSub && currentSub !== "all") {
      const target = currentSub.toLowerCase();
      result = result.filter((p) => p.subcategory.toLowerCase() === target);
    }

    // Fabric filter
    if (filters.fabrics.length > 0) {
      const selected = filters.fabrics.map((f) => f.toLowerCase());
      result = result.filter(
        (p) =>
          (p.fabric && selected.includes(p.fabric.toLowerCase())) ||
          (p.material && selected.some((s) => p.material!.toLowerCase().includes(s)))
      );
    }

    // Piece Count filter
    if (filters.pieceCounts.length > 0) {
      const selected = filters.pieceCounts.map((pc) => pc.toLowerCase());
      result = result.filter((p) => p.pieceCount && selected.includes(p.pieceCount.toLowerCase()));
    }

    // Occasion filter
    if (filters.occasions.length > 0) {
      const selected = filters.occasions.map((o) => o.toLowerCase());
      result = result.filter((p) => p.occasion && selected.includes(p.occasion.toLowerCase()));
    }

    // Size filter
    if (filters.sizes.length > 0) {
      result = result.filter(
        (p) => p.sizes && filters.sizes.some((sz) => p.sizes.includes(sz))
      );
    }

    // Price range
    if (filters.minPrice !== null) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== null) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }

    // In Stock Only
    if (filters.inStockOnly) {
      result = result.filter((p) => (typeof p.stock === "number" ? p.stock > 0 : true));
    }

    // Sorting
    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case "discount":
        result.sort((a, b) => {
          const discA = a.compareAtPrice && a.compareAtPrice > a.price ? (a.compareAtPrice - a.price) / a.compareAtPrice : 0;
          const discB = b.compareAtPrice && b.compareAtPrice > b.price ? (b.compareAtPrice - b.price) / b.compareAtPrice : 0;
          return discB - discA;
        });
        break;
      case "featured":
      default:
        result.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) || Number(b.trending) - Number(a.trending)
        );
        break;
    }

    return result;
  }, [initialProducts, currentSub, filters]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const pillHref = (s: string) => {
    const params = new URLSearchParams();
    if (s !== "all") params.set("sub", s.toLowerCase());
    if (filters.sort !== "featured") params.set("sort", filters.sort);
    const qs = params.toString();
    return `/${category}${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      {/* EDITORIAL HERO & BREADCRUMBS */}
      <div className="container page-head">
        <nav aria-label="Breadcrumb" className="listing-breadcrumbs">
          <Link href="/">Home</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">{categoryTitle}</span>
          {currentSub && currentSub !== "all" && (
            <>
              <span className="crumb-sep">/</span>
              <span className="crumb-current" style={{ textTransform: "capitalize" }}>
                {currentSub}
              </span>
            </>
          )}
        </nav>

        <h1 className="listing-title">{categoryTitle}</h1>
        <p className="listing-subtitle">
          {categoryDescription ||
            `${filteredProducts.length} handcrafted piece${filteredProducts.length === 1 ? "" : "s"} — tailored in pure lawns, raw silks, and hand-embellished velvets.`}
        </p>
      </div>

      {/* SUBCATEGORY PILLS */}
      {subcategories.length > 0 && (
        <div className="container">
          <div className="subcategory-scroll-track" role="tablist" aria-label="Subcategories">
            <Link
              href={pillHref("all")}
              className={`sub-pill ${!currentSub || currentSub === "all" ? "active" : ""}`}
            >
              All
            </Link>
            {subcategories.map((s) => (
              <Link
                key={s}
                href={pillHref(s)}
                className={`sub-pill ${currentSub.toLowerCase() === s.toLowerCase() ? "active" : ""}`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FILTER & SORT TOOLBAR */}
      <div className="container">
        <ProductFilters
          availableFabrics={FABRIC_OPTIONS}
          availablePieceCounts={PIECE_COUNT_OPTIONS}
          availableOccasions={OCCASION_OPTIONS}
          availableSizes={ALL_SIZES}
          priceRange={priceRange}
          activeFilters={filters}
          totalMatching={filteredProducts.length}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* LISTING GRID */}
      <div className="container listing-content-wrap">
        {filteredProducts.length === 0 ? (
          <div className="listing-empty-state">
            <p className="empty-title">No pieces match your selected filters</p>
            <p className="empty-desc">
              Try removing some filters or exploring our other collections.
            </p>
            <button type="button" className="pill active" onClick={handleResetFilters}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div
              className={`product-grid density-cols-${filters.gridCols}`}
              aria-live="polite"
            >
              {displayedProducts.map((p, i) => (
                <ScrollReveal key={p.id} delay={(i % 4) * 60}>
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>

            {/* PROGRESSIVE PAGINATION / LOAD MORE */}
            <div className="listing-pagination-wrap">
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min(
                      100,
                      (displayedProducts.length / filteredProducts.length) * 100
                    )}%`,
                  }}
                />
              </div>
              <p className="pagination-counter">
                Showing {displayedProducts.length} of {filteredProducts.length} pieces
              </p>

              {hasMore ? (
                <button
                  type="button"
                  className="load-more-btn"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                >
                  Load More Pieces
                </button>
              ) : (
                filteredProducts.length > PAGE_SIZE && (
                  <p className="all-loaded-text">You have viewed all {filteredProducts.length} pieces</p>
                )
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
