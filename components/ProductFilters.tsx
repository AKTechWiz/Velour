"use client";

import React, { useState, useEffect, useId } from "react";
import { IconFilter, IconClose, IconCheck, IconGrid2, IconGrid3, IconGrid4 } from "./Icons";
import { money } from "@/lib/format";
import type { SortKey } from "@/lib/api";

export interface FilterState {
  fabrics: string[];
  pieceCounts: string[];
  occasions: string[];
  sizes: string[];
  minPrice: number | null;
  maxPrice: number | null;
  inStockOnly: boolean;
  sort: SortKey;
  gridCols: 2 | 3 | 4;
}

interface ProductFiltersProps {
  availableFabrics: readonly string[];
  availablePieceCounts: readonly string[];
  availableOccasions: readonly string[];
  availableSizes: readonly string[];
  priceRange: { min: number; max: number };
  activeFilters: FilterState;
  totalMatching: number;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest Arrivals" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "discount", label: "Biggest Discount" },
];

export default function ProductFilters({
  availableFabrics,
  availablePieceCounts,
  availableOccasions,
  availableSizes,
  priceRange,
  activeFilters,
  totalMatching,
  onFilterChange,
  onResetFilters,
}: ProductFiltersProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const filterTitleId = useId();

  // Count how many filters are active (excluding default sort & grid density)
  const activeCount =
    activeFilters.fabrics.length +
    activeFilters.pieceCounts.length +
    activeFilters.occasions.length +
    activeFilters.sizes.length +
    (activeFilters.minPrice !== null && activeFilters.minPrice > priceRange.min ? 1 : 0) +
    (activeFilters.maxPrice !== null && activeFilters.maxPrice < priceRange.max ? 1 : 0) +
    (activeFilters.inStockOnly ? 1 : 0);

  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen]);

  // Facet toggle helpers
  const toggleItem = (list: string[], item: string): string[] => {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  };

  const handleFabricToggle = (fabric: string) => {
    onFilterChange({
      ...activeFilters,
      fabrics: toggleItem(activeFilters.fabrics, fabric),
    });
  };

  const handlePieceCountToggle = (count: string) => {
    onFilterChange({
      ...activeFilters,
      pieceCounts: toggleItem(activeFilters.pieceCounts, count),
    });
  };

  const handleOccasionToggle = (occ: string) => {
    onFilterChange({
      ...activeFilters,
      occasions: toggleItem(activeFilters.occasions, occ),
    });
  };

  const handleSizeToggle = (sz: string) => {
    onFilterChange({
      ...activeFilters,
      sizes: toggleItem(activeFilters.sizes, sz),
    });
  };

  const handleSortChange = (newSort: SortKey) => {
    onFilterChange({ ...activeFilters, sort: newSort });
  };

  const handleGridChange = (cols: 2 | 3 | 4) => {
    onFilterChange({ ...activeFilters, gridCols: cols });
  };

  return (
    <div className="product-filters-wrapper">
      {/* TOOLBAR CONTROLS */}
      <div className="filters-toolbar">
        <div className="filters-toolbar-left">
          <button
            type="button"
            className={`filter-trigger-btn ${activeCount > 0 ? "has-active" : ""}`}
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-controls="filter-drawer"
          >
            <IconFilter width={17} height={17} />
            <span>Filter & Refine</span>
            {activeCount > 0 && <span className="filter-badge-count">{activeCount}</span>}
          </button>
        </div>

        <div className="filters-toolbar-right">
          {/* Grid column selector (desktop) */}
          <div className="grid-density-switcher" role="radiogroup" aria-label="Grid density">
            <button
              type="button"
              className={`density-btn ${activeFilters.gridCols === 2 ? "active" : ""}`}
              onClick={() => handleGridChange(2)}
              title="2 Columns (Editorial view)"
              aria-label="2 Columns"
            >
              <IconGrid2 width={18} height={18} />
            </button>
            <button
              type="button"
              className={`density-btn ${activeFilters.gridCols === 3 ? "active" : ""}`}
              onClick={() => handleGridChange(3)}
              title="3 Columns (Balanced view)"
              aria-label="3 Columns"
            >
              <IconGrid3 width={18} height={18} />
            </button>
            <button
              type="button"
              className={`density-btn ${activeFilters.gridCols === 4 ? "active" : ""}`}
              onClick={() => handleGridChange(4)}
              title="4 Columns (Compact view)"
              aria-label="4 Columns"
            >
              <IconGrid4 width={18} height={18} />
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="sort-dropdown-wrap">
            <label htmlFor="listing-sort-select" className="sr-only">
              Sort by
            </label>
            <select
              id="listing-sort-select"
              className="luxury-sort-select"
              value={activeFilters.sort}
              onChange={(e) => handleSortChange(e.target.value as SortKey)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ACTIVE FILTER CHIPS */}
      {activeCount > 0 && (
        <div className="active-chips-strip">
          <span className="chips-label">Active:</span>
          {activeFilters.fabrics.map((f) => (
            <button
              key={f}
              type="button"
              className="filter-chip"
              onClick={() => handleFabricToggle(f)}
              aria-label={`Remove fabric ${f} filter`}
            >
              <span>{f}</span>
              <IconClose width={12} height={12} />
            </button>
          ))}
          {activeFilters.pieceCounts.map((p) => (
            <button
              key={p}
              type="button"
              className="filter-chip"
              onClick={() => handlePieceCountToggle(p)}
              aria-label={`Remove piece count ${p} filter`}
            >
              <span>{p}</span>
              <IconClose width={12} height={12} />
            </button>
          ))}
          {activeFilters.occasions.map((o) => (
            <button
              key={o}
              type="button"
              className="filter-chip"
              onClick={() => handleOccasionToggle(o)}
              aria-label={`Remove occasion ${o} filter`}
            >
              <span>{o}</span>
              <IconClose width={12} height={12} />
            </button>
          ))}
          {activeFilters.sizes.map((s) => (
            <button
              key={s}
              type="button"
              className="filter-chip"
              onClick={() => handleSizeToggle(s)}
              aria-label={`Remove size ${s} filter`}
            >
              <span>Size: {s}</span>
              <IconClose width={12} height={12} />
            </button>
          ))}
          {(activeFilters.minPrice !== null && activeFilters.minPrice > priceRange.min) && (
            <button
              type="button"
              className="filter-chip"
              onClick={() => onFilterChange({ ...activeFilters, minPrice: null })}
            >
              <span>Min: {money(activeFilters.minPrice)}</span>
              <IconClose width={12} height={12} />
            </button>
          )}
          {(activeFilters.maxPrice !== null && activeFilters.maxPrice < priceRange.max) && (
            <button
              type="button"
              className="filter-chip"
              onClick={() => onFilterChange({ ...activeFilters, maxPrice: null })}
            >
              <span>Max: {money(activeFilters.maxPrice)}</span>
              <IconClose width={12} height={12} />
            </button>
          )}
          {activeFilters.inStockOnly && (
            <button
              type="button"
              className="filter-chip"
              onClick={() => onFilterChange({ ...activeFilters, inStockOnly: false })}
            >
              <span>In Stock Only</span>
              <IconClose width={12} height={12} />
            </button>
          )}
          <button type="button" className="clear-all-filters-btn" onClick={onResetFilters}>
            Clear All
          </button>
        </div>
      )}

      {/* FILTER DRAWER / BOTTOM SHEET MODAL */}
      {drawerOpen && (
        <>
          <div
            className="filter-drawer-backdrop open"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          <aside
            id="filter-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={filterTitleId}
            className="filter-drawer open"
          >
        <div className="filter-drawer-header">
          <div className="filter-drawer-title-group">
            <h2 id={filterTitleId} className="filter-drawer-title">
              Filter & Refine
            </h2>
            <span className="filter-drawer-count">{totalMatching} pieces</span>
          </div>
          <div className="filter-drawer-actions">
            {activeCount > 0 && (
              <button type="button" className="filter-drawer-reset" onClick={onResetFilters}>
                Clear All
              </button>
            )}
            <button
              type="button"
              className="filter-drawer-close"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close filters"
            >
              <IconClose width={20} height={20} />
            </button>
          </div>
        </div>

        <div className="filter-drawer-body">
          {/* 1. PIECE COUNT */}
          {availablePieceCounts.length > 0 && (
            <section className="filter-group">
              <h3 className="filter-group-title">Piece Count</h3>
              <div className="filter-pills-grid">
                {availablePieceCounts.map((piece) => {
                  const selected = activeFilters.pieceCounts.includes(piece);
                  return (
                    <button
                      key={piece}
                      type="button"
                      className={`filter-choice-pill ${selected ? "selected" : ""}`}
                      onClick={() => handlePieceCountToggle(piece)}
                    >
                      {selected && <IconCheck width={14} height={14} />}
                      <span>{piece}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* 2. FABRIC */}
          {availableFabrics.length > 0 && (
            <section className="filter-group">
              <h3 className="filter-group-title">Luxury Fabric</h3>
              <div className="filter-checkbox-list">
                {availableFabrics.map((fabric) => {
                  const checked = activeFilters.fabrics.includes(fabric);
                  return (
                    <label key={fabric} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleFabricToggle(fabric)}
                        className="filter-checkbox-native"
                      />
                      <span className="filter-checkbox-custom">
                        {checked && <IconCheck width={12} height={12} />}
                      </span>
                      <span className="filter-checkbox-label">{fabric}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          )}

          {/* 3. OCCASION */}
          {availableOccasions.length > 0 && (
            <section className="filter-group">
              <h3 className="filter-group-title">Occasion</h3>
              <div className="filter-pills-grid">
                {availableOccasions.map((occ) => {
                  const selected = activeFilters.occasions.includes(occ);
                  return (
                    <button
                      key={occ}
                      type="button"
                      className={`filter-choice-pill ${selected ? "selected" : ""}`}
                      onClick={() => handleOccasionToggle(occ)}
                    >
                      {selected && <IconCheck width={14} height={14} />}
                      <span>{occ}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* 4. SIZES */}
          {availableSizes.length > 0 && (
            <section className="filter-group">
              <h3 className="filter-group-title">Size</h3>
              <div className="filter-size-grid">
                {availableSizes.map((size) => {
                  const selected = activeFilters.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      className={`filter-size-btn ${selected ? "selected" : ""}`}
                      onClick={() => handleSizeToggle(size)}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* 5. PRICE RANGE IN PKR */}
          <section className="filter-group">
            <h3 className="filter-group-title">Price Range (PKR)</h3>
            <div className="price-range-inputs">
              <div className="price-input-box">
                <span className="currency-prefix">Rs.</span>
                <input
                  type="number"
                  aria-label="Minimum price"
                  placeholder={String(priceRange.min)}
                  value={activeFilters.minPrice ?? ""}
                  onChange={(e) =>
                    onFilterChange({
                      ...activeFilters,
                      minPrice: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="price-num-input"
                />
              </div>
              <span className="price-range-separator">—</span>
              <div className="price-input-box">
                <span className="currency-prefix">Rs.</span>
                <input
                  type="number"
                  aria-label="Maximum price"
                  placeholder={String(priceRange.max)}
                  value={activeFilters.maxPrice ?? ""}
                  onChange={(e) =>
                    onFilterChange({
                      ...activeFilters,
                      maxPrice: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="price-num-input"
                />
              </div>
            </div>
            {/* Quick price presets */}
            <div className="price-presets-row">
              <button
                type="button"
                className="price-preset-pill"
                onClick={() => onFilterChange({ ...activeFilters, minPrice: null, maxPrice: 10000 })}
              >
                Under Rs. 10k
              </button>
              <button
                type="button"
                className="price-preset-pill"
                onClick={() => onFilterChange({ ...activeFilters, minPrice: 10000, maxPrice: 20000 })}
              >
                Rs. 10k – 20k
              </button>
              <button
                type="button"
                className="price-preset-pill"
                onClick={() => onFilterChange({ ...activeFilters, minPrice: 20000, maxPrice: null })}
              >
                Above Rs. 20k
              </button>
            </div>
          </section>

          {/* 6. AVAILABILITY */}
          <section className="filter-group">
            <label className="filter-switch-row">
              <span className="filter-group-title" style={{ margin: 0 }}>
                In Stock Only
              </span>
              <input
                type="checkbox"
                checked={activeFilters.inStockOnly}
                onChange={(e) =>
                  onFilterChange({ ...activeFilters, inStockOnly: e.target.checked })
                }
                className="filter-switch-native"
              />
            </label>
          </section>
        </div>

        {/* STICKY BOTTOM DRAWER FOOTER */}
        <div className="filter-drawer-footer">
          <button
            type="button"
            className="filter-apply-btn"
            onClick={() => setDrawerOpen(false)}
          >
            Show {totalMatching} {totalMatching === 1 ? "Piece" : "Pieces"}
          </button>
        </div>
      </aside>
    </>
  )}
    </div>
  );
}
