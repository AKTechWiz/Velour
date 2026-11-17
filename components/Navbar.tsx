"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useCart } from "@/lib/store";
import { useWishlist } from "@/lib/wishlist";
import { ALL_PRODUCTS } from "@/lib/api";
import type { Product } from "@/lib/types";
import { money } from "@/lib/format";
import { insforge } from "@/lib/insforge";
import {
  IconBag,
  IconClose,
  IconHeart,
  IconSearch,
  IconUser,
  IconSun,
  IconMoon,
  IconChevronRight,
} from "./Icons";
import SmartImage from "./SmartImage";

// Roman Urdu & Fashion Synonyms dictionary
const SYNONYMS_MAP: Record<string, string[]> = {
  kurta: ["kurta", "shirt", "kameez", "top"],
  kameez: ["kameez", "kurta", "shirt"],
  shalwar: ["shalwar", "trouser", "pants"],
  trouser: ["trouser", "shalwar", "pants"],
  lawn: ["lawn", "cotton", "unstitched", "summer"],
  unstitched: ["unstitched", "lawn", "chiffon", "3-piece", "2-piece"],
  dupatta: ["dupatta", "shawl", "scarf"],
  festive: ["festive", "formal", "wedding", "embroidered", "velvet"],
  wedding: ["wedding", "festive", "formal", "bridal", "luxury pret"],
  velvet: ["velvet", "winter", "outerwear", "formal"],
  silk: ["silk", "raw silk", "chiffon"],
  waistcoat: ["waistcoat", "vest", "men"],
};

const PREDICTIVE_SUGGESTIONS = [
  "Embroidered Lawn 3-Piece",
  "Luxury Velvet Kurta",
  "Festive Silk Co-ord",
  "Men's Raw Silk Sherwani",
  "Chiffon Dupatta",
  "Pure Khaddar Winter Edit",
  "Wedding Guest Formals",
  "Sale",
];

interface UserProfile {
  id: string;
  email?: string;
  profile?: {
    name?: string;
  } | null;
}

export default function Navbar() {
  const { count: cartCount, setMiniBagOpen } = useCart();
  const { count: wishlistCount, setDrawerOpen: setWishlistOpen } = useWishlist();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Unified directory menu state (replaces scattered desktop links & burger)
  const [menuOpen, setMenuOpen] = useState(false);
  const menuLeaveTimer = useRef<NodeJS.Timeout | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const searchRef = useRef<HTMLInputElement>(null);

  // Theme Sync
  useEffect(() => {
    const active =
      (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light";
    setTheme(active);

    const observer = new MutationObserver(() => {
      const current =
        (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light";
      setTheme(current);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("velour-theme", next);
    } catch (e) {}
  };

  // Auth state
  useEffect(() => {
    const checkAuth = () => {
      insforge.auth
        .getCurrentUser()
        .then(({ data }) => {
          setCurrentUser(data?.user ?? null);
        })
        .catch(() => setCurrentUser(null));
    };

    checkAuth();
    window.addEventListener("insforge-auth-change", checkAuth);
    return () => window.removeEventListener("insforge-auth-change", checkAuth);
  }, []);

  // Escape key & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (searchOpen) setSearchOpen(false);
        if (menuOpen) setMenuOpen(false);
      }
    };

    if (menuOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  // Scroll listener: subtle elevation & auto-hide
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      if (y > 300) {
        if (y > lastScrollY.current && y - lastScrollY.current > 8 && !menuOpen && !searchOpen) {
          setNavHidden(true);
        } else if (lastScrollY.current - y > 8) {
          setNavHidden(false);
        }
      } else {
        setNavHidden(false);
      }
      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen, searchOpen]);

  // Focus search input on open
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 120);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [searchOpen]);

  // Enhanced search scoring
  const searchProducts = ALL_PRODUCTS;
  useEffect(() => {
    const raw = query.trim().toLowerCase();
    if (!raw) {
      setResults([]);
      return;
    }

    const tokens = raw.split(/\s+/).filter(Boolean);
    const expandedTokens = new Set<string>(tokens);
    for (const t of tokens) {
      if (SYNONYMS_MAP[t]) {
        SYNONYMS_MAP[t].forEach((syn) => expandedTokens.add(syn));
      }
    }

    const scored = searchProducts.map((p) => {
      const nameLower = p.name.toLowerCase();
      const subLower = (p.subcategory || "").toLowerCase();
      const catLower = (p.category || "").toLowerCase();
      const matLower = (p.material || "").toLowerCase();
      const colorLower = (p.color || "").toLowerCase();
      const descLower = (p.description || "").toLowerCase();

      const corpus = `${nameLower} ${subLower} ${catLower} ${matLower} ${colorLower} ${descLower}`;
      let score = 0;

      if (nameLower.includes(raw)) score += 70;
      else if (corpus.includes(raw)) score += 40;

      expandedTokens.forEach((t) => {
        if (nameLower.includes(t)) score += 30;
        else if (subLower.includes(t) || catLower.includes(t)) score += 20;
        else if (matLower.includes(t) || descLower.includes(t)) score += 15;
      });

      if ((raw.includes("sale") || raw.includes("discount")) && p.compareAtPrice && p.compareAtPrice > p.price) {
        score += 50;
      }

      return { product: p, score };
    });

    const matched = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.product);

    setResults(matched.slice(0, 8));
  }, [query, searchProducts]);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    if (results[0]) {
      setSearchOpen(false);
      router.push(`/product/${results[0].id}`);
    }
  };

  const handleMenuEnter = () => {
    if (menuLeaveTimer.current) clearTimeout(menuLeaveTimer.current);
    setMenuOpen(true);
  };

  const handleMenuLeave = () => {
    menuLeaveTimer.current = setTimeout(() => {
      setMenuOpen(false);
    }, 280);
  };

  return (
    <>
      <header
        className={`nav-header ${scrolled ? "nav-scrolled" : ""} ${
          navHidden ? "nav-hidden" : ""
        }`}
      >
        <div className="container nav-inner">
          {/* Column 1: Left - Minimalist Luxury Menu Trigger */}
          <div className="nav-col-left">
            <button
              type="button"
              className="nav-menu-trigger-btn"
              onClick={() => setMenuOpen((prev) => !prev)}
              onMouseEnter={handleMenuEnter}
              aria-label="Toggle directory menu"
              aria-expanded={menuOpen}
              title="Collections & Directory"
            >
              <span className="nav-menu-icon-bars" aria-hidden="true">
                <span className="bar bar-1" />
                <span className="bar bar-2" />
              </span>
              <span className="nav-menu-label">Menu</span>
            </button>
          </div>

          {/* Column 2: Center - Brand Wordmark */}
          <div className="nav-col-center">
            <Link href="/" className="nav-logo" aria-label="VELOUR Home">
              VELOUR
            </Link>
          </div>

          {/* Column 3: Right - Minimal Luxury Action Utilities */}
          <div className="nav-col-right nav-actions">
            {/* Theme Toggle */}
            <button
              type="button"
              className="nav-icon-btn nav-action-theme"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {theme === "dark" ? <IconSun /> : <IconMoon />}
            </button>

            {/* Predictive Search */}
            <button
              type="button"
              className="nav-icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              title="Search collections"
            >
              <IconSearch />
            </button>

            {/* Wishlist Trigger */}
            <button
              type="button"
              className="nav-icon-btn nav-wishlist-btn"
              onClick={() => setWishlistOpen(true)}
              aria-label={`Wishlist (${wishlistCount} items)`}
              title="Saved Pieces"
            >
              <IconHeart />
              {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
            </button>

            {/* User Account */}
            <Link
              href={currentUser ? "/profile" : "/login"}
              className="nav-icon-btn nav-action-user"
              aria-label={
                currentUser
                  ? `Account (${currentUser.profile?.name || currentUser.email})`
                  : "Sign In"
              }
              title={
                currentUser
                  ? `Signed in as ${currentUser.profile?.name || currentUser.email}`
                  : "Sign In / Account"
              }
            >
              {currentUser ? (
                <span className="nav-user-badge">
                  {(currentUser.profile?.name || currentUser.email || "U")[0].toUpperCase()}
                </span>
              ) : (
                <IconUser />
              )}
            </Link>

            {/* Mini Bag Trigger */}
            <button
              type="button"
              className="nav-icon-btn nav-cart-btn"
              onClick={() => setMiniBagOpen(true)}
              aria-label={`Shopping Bag (${cartCount} items)`}
              title="Shopping Bag"
            >
              <IconBag />
              {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          EDITORIAL LUXURY DIRECTORY DRAWER
          ======================================================== */}
      {menuOpen && (
        <>
          <div
            className="drawer-overlay open"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="drawer drawer-left open nav-unified-drawer"
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
            aria-label="Site Navigation Directory"
          >
            <div className="drawer-header nav-editorial-drawer-header">
              <Link href="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
                VELOUR
              </Link>
              <button
                type="button"
                className="drawer-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close directory menu"
              >
                <IconClose />
              </button>
            </div>

            <nav className="nav-editorial-directory-body">
              {/* Primary Atelier Categories */}
              <div className="nav-editorial-category-list">
                <span className="nav-editorial-kicker">Collections</span>
                
                <Link
                  href="/women"
                  className="nav-editorial-link"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-editorial-num">01</span>
                  <span className="nav-editorial-name">Ready-to-Wear</span>
                </Link>

                <Link
                  href="/festive"
                  className="nav-editorial-link"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-editorial-num">02</span>
                  <span className="nav-editorial-name">Festive &amp; Formals</span>
                </Link>

                <Link
                  href="/unstitched"
                  className="nav-editorial-link"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-editorial-num">03</span>
                  <span className="nav-editorial-name">Luxury Unstitched</span>
                </Link>

                <Link
                  href="/outerwear"
                  className="nav-editorial-link"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-editorial-num">04</span>
                  <span className="nav-editorial-name">Velvet Winter Capsule</span>
                </Link>

                <Link
                  href="/festive?sub=Bridal+Couture"
                  className="nav-editorial-link"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-editorial-num">05</span>
                  <span className="nav-editorial-name">Haute Couture &amp; Bridal</span>
                </Link>

                <Link
                  href="/men"
                  className="nav-editorial-link"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-editorial-num">06</span>
                  <span className="nav-editorial-name">Men&apos;s Eastern</span>
                </Link>

                <Link
                  href="/accessories"
                  className="nav-editorial-link"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-editorial-num">07</span>
                  <span className="nav-editorial-name">Fine Accessories</span>
                </Link>

                <Link
                  href="/sale"
                  className="nav-editorial-link nav-editorial-sale"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-editorial-num">08</span>
                  <span className="nav-editorial-name">Curated Seasonal Archive</span>
                </Link>
              </div>

              {/* Editorial & Flagship Salons */}
              <div className="nav-editorial-subnav">
                <span className="nav-editorial-kicker">Maison &amp; Salons</span>
                <div className="nav-editorial-sublinks">
                  <Link href="/#lookbook" onClick={() => setMenuOpen(false)}>
                    Campaign Lookbook
                  </Link>
                  <Link href="/about" onClick={() => setMenuOpen(false)}>
                    Karigar Guild &amp; Heritage
                  </Link>
                  <Link href="/contact" onClick={() => setMenuOpen(false)}>
                    Flagship Salons (Karachi · Lahore)
                  </Link>
                  <Link href="/track" onClick={() => setMenuOpen(false)}>
                    Track Your Shipment
                  </Link>
                  <Link href={currentUser ? "/profile" : "/login"} onClick={() => setMenuOpen(false)}>
                    {currentUser ? "Client Profile & Orders" : "Sign In / Register"}
                  </Link>
                  <button
                    type="button"
                    className="nav-editorial-btn-link"
                    onClick={() => {
                      setMenuOpen(false);
                      setWishlistOpen(true);
                    }}
                  >
                    Saved Pieces ({wishlistCount})
                  </button>
                </div>
              </div>

              {/* Bespoke Concierge Card */}
              <div className="nav-editorial-concierge">
                <div className="nav-concierge-header">
                  <span className="nav-concierge-dot" />
                  <span className="nav-concierge-kicker">Atelier Concierge</span>
                </div>
                <p className="nav-concierge-text">
                  Private bridal appointments, custom measurements, and bespoke order advisory.
                </p>
                <a
                  href="https://wa.me/923008259142?text=Hello%20Velour%20Concierge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-concierge-btn"
                >
                  Connect with Stylist
                </a>
              </div>
            </nav>

            <div className="drawer-footer nav-editorial-drawer-footer">
              <button className="drawer-theme-toggle" onClick={toggleTheme}>
                {theme === "dark" ? <IconSun /> : <IconMoon />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ========================================================
          PREDICTIVE SEARCH OVERLAY
          ======================================================== */}
      {searchOpen && (
        <div className="search-overlay open" role="dialog" aria-modal="true">
          <div className="search-panel container">
            <div className="search-bar">
              <form onSubmit={submitSearch} className="search-form">
                <IconSearch />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search kurtas, lawn, dupattas, fabrics, collections…"
                  className="search-input"
                />
              </form>
              <button
                type="button"
                className="nav-icon-btn"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <IconClose />
              </button>
            </div>

            {!query.trim() ? (
              <div className="search-predictions">
                <p className="search-predictions-title">Trending in Pakistan &amp; Suggestions</p>
                <div className="search-chips">
                  {PREDICTIVE_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="search-chip"
                      onClick={() => {
                        setQuery(s);
                        searchRef.current?.focus();
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6, display: "inline-block", verticalAlign: "middle" }}>
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      {s}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "24px",
                    paddingTop: "20px",
                    borderTop: "1px solid var(--line)",
                  }}
                >
                  <p className="search-predictions-title">Explore Collections</p>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    {[
                      { label: "Women's RTW", href: "/women" },
                      { label: "Unstitched Lawn", href: "/unstitched" },
                      { label: "Men's Kurtas", href: "/men" },
                      { label: "Festive Velvet", href: "/festive" },
                      { label: "Seasonal Sale", href: "/sale" },
                    ].map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="search-chip"
                        style={{ background: "transparent", border: "1px solid var(--line)" }}
                        onClick={() => setSearchOpen(false)}
                      >
                        {c.label} →
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="search-results">
                {results.length === 0 ? (
                  <div>
                    <p className="search-empty">No exact matches found for “{query}”.</p>
                    <div className="search-predictions" style={{ marginTop: "18px" }}>
                      <p className="search-predictions-title">Try popular fashion keywords:</p>
                      <div className="search-chips">
                        {PREDICTIVE_SUGGESTIONS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className="search-chip"
                            onClick={() => {
                              setQuery(s);
                              searchRef.current?.focus();
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "var(--muted)",
                        }}
                      >
                        Found {results.length} predicted match{results.length === 1 ? "" : "es"}
                      </span>
                    </div>

                    {results.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.id}`}
                        className="search-result"
                        onClick={() => setSearchOpen(false)}
                      >
                        <span className="search-result-img">
                          <SmartImage src={p.images[0]} alt={p.name} fill sizes="64px" />
                        </span>
                        <span>
                          <span className="search-result-name">{p.name}</span>
                          <span className="search-result-cat">
                            {p.category} · {p.subcategory || "Collection"}
                          </span>
                        </span>
                        <span
                          className="search-result-price"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                          }}
                        >
                          <span>{money(p.price)}</span>
                          {p.compareAtPrice && p.compareAtPrice > p.price && (
                            <span
                              style={{
                                fontSize: "11px",
                                color: "var(--danger)",
                                fontWeight: 600,
                              }}
                            >
                              Sale -
                              {Math.round(
                                ((p.compareAtPrice - p.price) / p.compareAtPrice) * 100
                              )}
                              %
                            </span>
                          )}
                        </span>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
