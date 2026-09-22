"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useCart } from "@/lib/store";
import { ALL_PRODUCTS } from "@/lib/api";
import type { Product } from "@/lib/types";
import { money } from "@/lib/format";
import { insforge } from "@/lib/insforge";
import {
  IconBag, IconClose, IconMenu, IconSearch, IconUser, IconSun, IconMoon,
} from "./Icons";
import SmartImage from "./SmartImage";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/women", label: "Women" },
  { href: "/men", label: "Men" },
  { href: "/outerwear", label: "Outerwear" },
  { href: "/accessories", label: "Accessories" },
  { href: "/sale", label: "Sale" },
];

const PREDICTIVE_SUGGESTIONS = [
  "Cashmere Sweater",
  "White Linen",
  "Wool Coat",
  "Leather Handbag",
  "Silk Slip Dress",
  "Outerwear",
  "Sale",
  "Accessories",
];

interface UserProfile {
  id: string;
  email?: string;
  profile?: {
    name?: string;
  };
}

export default function Navbar() {
  const { count } = useCart();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Read initial theme set by inline script or default
    const active = (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light";
    setTheme(active);

    // Observer for changes if mutated externally
    const observer = new MutationObserver(() => {
      const current = (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light";
      setTheme(current);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
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

  useEffect(() => {
    const checkAuth = () => {
      insforge.auth.getCurrentUser().then(({ data }) => {
        setCurrentUser(data?.user ?? null);
      }).catch(() => setCurrentUser(null));
    };

    checkAuth();
    window.addEventListener("insforge-auth-change", checkAuth);
    return () => window.removeEventListener("insforge-auth-change", checkAuth);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [searchProducts, setSearchProducts] = useState<Product[]>(ALL_PRODUCTS);

  useEffect(() => {
    if (searchOpen) {
      searchRef.current?.focus();
      // Fetch fresh products from database so newly added items are searchable immediately
      fetch("/api/admin/products")
        .then((r) => r.json())
        .then((res) => {
          if (res.products && Array.isArray(res.products) && res.products.length > 0) {
            const mapped: Product[] = res.products.map((row: any) => ({
              id: String(row.id),
              slug: String(row.slug || row.id),
              name: String(row.name),
              category: row.category,
              subcategory: String(row.subcategory || ""),
              price: Number(row.price || 0),
              compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
              description: String(row.description || ""),
              sizes: Array.isArray(row.sizes) ? row.sizes : ["XS", "S", "M", "L"],
              images: Array.isArray(row.images) && row.images.length > 0 ? row.images : ["/images/products/wool-coat-1.jpg"],
              featured: Boolean(row.featured),
              isNew: Boolean(row.is_new),
              trending: Boolean(row.trending),
              material: row.material,
              color: row.color,
            }));
            setSearchProducts(mapped);
          }
        })
        .catch(() => {});
    }
  }, [searchOpen]);

  useEffect(() => {
    const raw = query.trim().toLowerCase();
    if (!raw) {
      setResults([]);
      return;
    }

    const tokens = raw.split(/\s+/).filter(Boolean);

    // Multi-attribute tokenized predictive scoring
    const scored = searchProducts.map((p) => {
      const nameLower = p.name.toLowerCase();
      const subLower = (p.subcategory || "").toLowerCase();
      const catLower = (p.category || "").toLowerCase();
      const matLower = (p.material || "").toLowerCase();
      const colorLower = (p.color || "").toLowerCase();
      const descLower = (p.description || "").toLowerCase();

      const corpus = `${nameLower} ${subLower} ${catLower} ${matLower} ${colorLower} ${descLower}`;

      let score = 0;

      // Exact substring match in name gets highest priority
      if (nameLower.includes(raw)) score += 60;
      else if (corpus.includes(raw)) score += 35;

      // Token matching
      let tokensMatched = 0;
      for (const t of tokens) {
        if (nameLower.includes(t)) {
          score += 25;
          tokensMatched++;
        } else if (subLower.includes(t) || catLower.includes(t)) {
          score += 20;
          tokensMatched++;
        } else if (matLower.includes(t) || colorLower.includes(t)) {
          score += 15;
          tokensMatched++;
        } else if (descLower.includes(t)) {
          score += 10;
          tokensMatched++;
        }
      }

      if (tokensMatched === tokens.length) score += 30; // all tokens present

      // Sale boost when querying sale / discount
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

  useEffect(() => {
    document.body.style.overflow = drawerOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen, searchOpen]);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const t = query.trim().toLowerCase();
    if (!t) return;
    const first = results[0];
    if (first) {
      setSearchOpen(false);
      router.push(`/product/${first.id}`);
    }
  };

  return (
    <>
      <div className="announcement">
        FREE WORLDWIDE SHIPPING OVER $75
      </div>

      <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-inner container">
          <button
            className="nav-icon-btn nav-burger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <IconMenu />
          </button>

          <nav className="nav-links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="nav-link">
                {l.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="nav-logo">VELOUR</Link>

          <div className="nav-actions">
            <button
              className="nav-icon-btn nav-theme-btn"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <IconSun /> : <IconMoon />}
            </button>
            <button
              className="nav-icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <IconSearch />
            </button>
            <Link
              href={currentUser ? "/profile" : "/login"}
              className="nav-icon-btn"
              aria-label={currentUser ? `Account (${currentUser.profile?.name || currentUser.email})` : "Account"}
              title={currentUser ? `Signed in as ${currentUser.profile?.name || currentUser.email}` : "Sign In / Account"}
            >
              {currentUser ? (
                <span className="nav-user-badge">
                  {(currentUser.profile?.name || currentUser.email || "U")[0].toUpperCase()}
                </span>
              ) : (
                <IconUser />
              )}
            </Link>
            <Link href="/cart" className="nav-icon-btn nav-cart" aria-label="Cart">
              <IconBag />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`drawer-overlay ${drawerOpen ? "open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside className={`drawer ${drawerOpen ? "open" : ""}`} aria-hidden={!drawerOpen}>
        <div className="drawer-head">
          <span className="nav-logo">VELOUR</span>
          <button className="nav-icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <IconClose />
          </button>
        </div>
        <nav className="drawer-links">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setDrawerOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href={currentUser ? "/profile" : "/login"} onClick={() => setDrawerOpen(false)}>
            {currentUser ? "My Profile & Orders" : "Account / Sign In"}
          </Link>
        </nav>
        <div className="drawer-footer">
          <button className="drawer-theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? <IconSun /> : <IconMoon />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </aside>

      {/* Search overlay */}
      <div className={`search-overlay ${searchOpen ? "open" : ""}`} aria-hidden={!searchOpen}>
        <div className="search-panel container">
          <div className="search-bar">
            <form onSubmit={submitSearch} className="search-form">
              <IconSearch />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="search-input"
              />
            </form>
            <button className="nav-icon-btn" onClick={() => setSearchOpen(false)} aria-label="Close search">
              <IconClose />
            </button>
          </div>

          {!query.trim() ? (
            <div className="search-predictions">
              <p className="search-predictions-title">Trending Searches & Quick Suggestions</p>
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
                    🔍 {s}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--line)" }}>
                <p className="search-predictions-title">Explore Collections</p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {[
                    { label: "Women's Collection", href: "/women" },
                    { label: "Men's Collection", href: "/men" },
                    { label: "Outerwear & Coats", href: "/outerwear" },
                    { label: "Fine Accessories", href: "/accessories" },
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
                  <p className="search-empty">No exact matches for “{query}”.</p>
                  <div className="search-predictions" style={{ marginTop: "18px" }}>
                    <p className="search-predictions-title">Try searching for:</p>
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
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
                        <span className="search-result-cat">{p.category} · {p.subcategory || "Collection"}</span>
                      </span>
                      <span className="search-result-price" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                        <span>{money(p.price)}</span>
                        {p.compareAtPrice && p.compareAtPrice > p.price && (
                          <span style={{ fontSize: "11px", color: "#8b261e", fontWeight: 600 }}>
                            Sale -{Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)}%
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
    </>
  );
}
