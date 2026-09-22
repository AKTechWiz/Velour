"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { insforge } from "@/lib/insforge";

/* ============================================================
   TYPES
   ============================================================ */
interface Product {
  id: string;
  slug: string;
  name: string;
  category: "women" | "men" | "outerwear" | "sale" | "accessories";
  subcategory: string;
  price: number;
  compare_at_price?: number;
  description: string;
  sizes: string[];
  images: string[];
  featured: boolean;
  is_new: boolean;
  trending: boolean;
  material?: string;
  color?: string;
  stock: number;
  created_at?: string;
}

interface Toast {
  id: number;
  message: string;
  kind: "success" | "error" | "info";
}

/* ============================================================
   ICONS
   ============================================================ */
const Icon = {
  Products: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Upload: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  Plus: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
  Link: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  Stats: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
};

/* ============================================================
   EMPTY PRODUCT FORM
   ============================================================ */
const emptyProduct = (): Partial<Product> => ({
  name: "",
  slug: "",
  category: "women",
  subcategory: "Outerwear",
  price: 0,
  compare_at_price: undefined,
  description: "",
  sizes: ["XS", "S", "M", "L", "XL"],
  images: [],
  featured: false,
  is_new: false,
  trending: false,
  material: "",
  color: "",
  stock: 20,
});

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function AdminDashboard() {
  const [tab, setTab] = useState<"products" | "upload">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product>>(emptyProduct());
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | "women" | "men" | "outerwear" | "sale" | "accessories">("all");

  // Discount percentage state for calculator
  const [discountPercent, setDiscountPercent] = useState(0);

  // Upload state (Main Tab)
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);
  const [uploadProductId, setUploadProductId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragover, setDragover] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Modal Upload & Paste state for Box 1 (Main) and Box 2 (Hover)
  const [mainUploading, setMainUploading] = useState(false);
  const [hoverUploading, setHoverUploading] = useState(false);
  const [mainDragover, setMainDragover] = useState(false);
  const [hoverDragover, setHoverDragover] = useState(false);
  const mainFileRef = useRef<HTMLInputElement>(null);
  const hoverFileRef = useRef<HTMLInputElement>(null);

  // Auth state
  const [adminUser, setAdminUser] = useState<{ email?: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data }) => {
      if (data?.user) {
        setAdminUser(data.user);
      }
      setAuthChecked(true);
    }).catch(() => setAuthChecked(true));
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter email and password");
      return;
    }
    setLoginLoading(true);
    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      if (error) throw error;
      setAdminUser(data.user);
      toast("Signed in as administrator", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleQuickAccess = () => {
    setAdminUser({ email: "admin@velour.com" });
    toast("Welcome to VELOUR Admin Console", "info");
  };

  /* ---- Toast helper ---- */
  const toast = useCallback((message: string, kind: Toast["kind"] = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  /* ---- Load products ---- */
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load products");
      setProducts((json.products as Product[]) || []);
    } catch (e: unknown) {
      toast("Failed to load products from InsForge", "error");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (adminUser) {
      loadProducts();
    }
  }, [adminUser, loadProducts]);

  /* ---- Open add modal ---- */
  const openAdd = () => {
    setEditProduct(emptyProduct());
    setDiscountPercent(0);
    setIsEditing(false);
    setModalOpen(true);
  };

  /* ---- Open edit modal ---- */
  const openEdit = (p: Product) => {
    setEditProduct({ ...p });
    const pct = p.compare_at_price && p.compare_at_price > p.price
      ? Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100)
      : 0;
    setDiscountPercent(pct);
    setIsEditing(true);
    setModalOpen(true);
  };

  /* ---- Quick toggle flag from table row ---- */
  const quickToggleFlag = async (product: Product, flag: "featured" | "is_new" | "trending") => {
    const nextVal = !product[flag];
    setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, [flag]: nextVal } : p));
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, [flag]: nextVal }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast(`${product.name}: ${flag === "is_new" ? "New" : flag} ${nextVal ? "enabled" : "disabled"}`, "success");
    } catch {
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, [flag]: !nextVal } : p));
      toast("Could not update badge status", "error");
    }
  };

  /* ---- Save product ---- */
  const saveProduct = async () => {
    setSaving(true);
    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save product");

      toast(isEditing ? "Product updated in InsForge database" : "Product created successfully", "success");
      setModalOpen(false);
      loadProducts();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to save product";
      toast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  /* ---- Delete product ---- */
  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This change will persist in the database.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete product");

      toast("Product deleted from InsForge", "success");
      loadProducts();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to delete";
      toast(msg, "error");
    } finally {
      setDeleting(null);
    }
  };

  /* ---- File upload ---- */
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setUploadFiles((prev) => [...prev, ...arr]);
    arr.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => setUploadPreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeUploadFile = (idx: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== idx));
    setUploadPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadImages = async () => {
    if (!uploadFiles.length) return toast("No files selected", "error");
    if (!uploadProductId.trim()) return toast("Enter or select a Product ID", "error");

    setUploading(true);
    setUploadProgress(30);

    try {
      const formData = new FormData();
      formData.append("productId", uploadProductId.trim());
      uploadFiles.forEach((f) => {
        formData.append("files", f);
      });

      setUploadProgress(60);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      setUploadProgress(100);
      toast(`Successfully uploaded ${json.count || uploadFiles.length} image(s) to InsForge Storage!`, "success");
      setUploadFiles([]);
      setUploadPreviews([]);
      setUploadProductId("");
      loadProducts();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Upload failed";
      toast(msg, "error");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  /* ---- Upload Single Image for Box 1 (Main) or Box 2 (Hover) ---- */
  const uploadSingleBoxImage = async (file: File, index: 0 | 1) => {
    if (!file.type.startsWith("image/")) {
      return toast("Please select a valid image file", "error");
    }

    const isMain = index === 0;
    if (isMain) setMainUploading(true);
    else setHoverUploading(true);

    try {
      const formData = new FormData();
      const pid = (editProduct.slug || editProduct.id || "product").trim();
      formData.append("productId", pid);
      formData.append("files", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      const uploadedUrl = (json.uploadedUrls as string[])?.[0];
      if (uploadedUrl) {
        setEditProduct((prev) => {
          const imgs = [...(prev.images || [])];
          imgs[index] = uploadedUrl;
          return { ...prev, images: imgs };
        });
        toast(`${isMain ? "Main display picture" : "Hover preview picture"} uploaded to InsForge Storage!`, "success");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast(msg, "error");
    } finally {
      if (isMain) setMainUploading(false);
      else setHoverUploading(false);
    }
  };

  /* ---- Paste image directly from clipboard to Box 1 or Box 2 ---- */
  const handlePasteToBox = async (index: 0 | 1) => {
    const isMain = index === 0;
    try {
      if (!navigator.clipboard?.read) {
        toast(`Tip: Press Ctrl+V to paste image into ${isMain ? "Main" : "Hover"} picture`, "info");
        return;
      }
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type);
            const ext = type.split("/")[1] || "jpg";
            const file = new File([blob], `pasted-${isMain ? "main" : "hover"}-${Date.now()}.${ext}`, { type });
            await uploadSingleBoxImage(file, index);
            return;
          }
        }
      }
      toast("No image found in clipboard. Copy an image first, then paste!", "info");
    } catch {
      toast(`Click on the ${isMain ? "Main" : "Hover"} box or press Ctrl+V to paste`, "info");
    }
  };

  /* ---- Interactive Price & Discount Calculator ---- */
  const handleOriginalPriceChange = (origVal: number) => {
    const compareAt = origVal > 0 ? origVal : undefined;
    let newPrice = editProduct.price || 0;
    if (compareAt && discountPercent > 0) {
      newPrice = Math.round(compareAt * (1 - discountPercent / 100) * 100) / 100;
    }
    setEditProduct({ ...editProduct, compare_at_price: compareAt, price: newPrice });
  };

  const handleDiscountPercentChange = (pctVal: number) => {
    const pct = Math.max(0, Math.min(99, pctVal));
    setDiscountPercent(pct);
    const orig = editProduct.compare_at_price || editProduct.price || 0;
    if (orig > 0) {
      const newPrice = Math.round(orig * (1 - pct / 100) * 100) / 100;
      setEditProduct({ ...editProduct, compare_at_price: orig, price: newPrice });
    }
  };

  const handleSalePriceChange = (saleVal: number) => {
    const sale = Math.max(0, saleVal);
    const orig = editProduct.compare_at_price;
    if (orig && orig > sale) {
      const pct = Math.round(((orig - sale) / orig) * 100);
      setDiscountPercent(pct);
    } else {
      setDiscountPercent(0);
    }
    setEditProduct({ ...editProduct, price: sale });
  };

  /* ---- Global Paste Listener (Ctrl+V) ---- */
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items || items.length === 0) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        if (modalOpen) {
          const targetIdx: 0 | 1 = (!editProduct.images?.[0] || editProduct.images[0] === "") ? 0 : 1;
          uploadSingleBoxImage(imageFiles[0], targetIdx);
        } else if (tab === "upload") {
          setUploadFiles((prev) => [...prev, ...imageFiles]);
          imageFiles.forEach((f) => {
            const reader = new FileReader();
            reader.onload = (ev) => setUploadPreviews((prev) => [...prev, ev.target?.result as string]);
            reader.readAsDataURL(f);
          });
          toast(`Pasted ${imageFiles.length} image(s) from clipboard!`, "info");
        }
      }
    };

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [modalOpen, tab, editProduct.slug, editProduct.id]);

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      filterCategory === "all" ||
      p.category === filterCategory ||
      (filterCategory === "sale" && Boolean(p.compare_at_price && p.compare_at_price > p.price)) ||
      (filterCategory === "outerwear" && (p.subcategory || "").toLowerCase() === "outerwear");
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.slug.toLowerCase().includes(term) ||
      p.subcategory.toLowerCase().includes(term) ||
      (p.material && p.material.toLowerCase().includes(term));
    return matchesCat && matchesSearch;
  });

  /* ---- Stats ---- */
  const totalProducts = products.length;
  const womenCount = products.filter((p) => p.category === "women").length;
  const menCount = products.filter((p) => p.category === "men").length;
  const newCount = products.filter((p) => p.is_new).length;

  /* ---- Auth Gate Screen ---- */
  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0e0d", color: "rgba(240,237,232,0.5)" }}>
        Loading VELOUR Admin…
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f0e0d", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{
          width: "100%",
          maxWidth: "420px",
          background: "#161412",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "8px",
          padding: "40px 32px",
          textAlign: "center",
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
        }}>
          <h1 style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: "28px",
            letterSpacing: "0.24em",
            color: "#f0ede8",
            marginBottom: "8px",
          }}>
            VELOUR
          </h1>
          <p style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#a79c8e",
            marginBottom: "28px",
          }}>
            Admin Console
          </p>

          <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}>
            {loginError && (
              <div style={{
                background: "rgba(235, 87, 87, 0.12)",
                border: "1px solid rgba(235, 87, 87, 0.3)",
                color: "#eb5757",
                fontSize: "13px",
                padding: "10px 12px",
                borderRadius: "4px",
              }}>
                {loginError}
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(240,237,232,0.5)", marginBottom: "6px" }}>
                Email
              </label>
              <input
                type="email"
                className="admin-form-input"
                placeholder="admin@velour.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(240,237,232,0.5)", marginBottom: "6px" }}>
                Password
              </label>
              <input
                type="password"
                className="admin-form-input"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              style={{ width: "100%", marginTop: "8px", justifyContent: "center", padding: "14px" }}
              disabled={loginLoading}
            >
              {loginLoading ? "Authenticating…" : "Sign In to Admin"}
            </button>
          </form>

          <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: "12px", color: "rgba(240,237,232,0.25)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            <span>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          </div>

          <button
            type="button"
            onClick={handleQuickAccess}
            className="admin-btn admin-btn-secondary"
            style={{ width: "100%", justifyContent: "center", padding: "14px" }}
          >
            Instant Admin Access (Direct Preview)
          </button>

          <div style={{ marginTop: "24px" }}>
            <Link href="/" style={{ fontSize: "12px", color: "rgba(240,237,232,0.45)", textDecoration: "none" }}>
              ← Return to VELOUR Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     RENDER ADMIN DASHBOARD
     ============================================================ */
  return (
    <div className="admin-shell" style={{ position: "fixed", inset: 0, zIndex: 9999, overflow: "hidden" }}>
      {/* ---- Top Bar ---- */}
      <header className="admin-topbar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="admin-logo">VELOUR</span>
          <span className="admin-logo-tag">Admin Console</span>
        </div>
        <div className="admin-topbar-right">
          <Link href="/" className="admin-topbar-store-link" target="_blank">
            View Store <Icon.Link />
          </Link>
          <div className="admin-user-pill">
            <div className="admin-user-avatar">
              {(adminUser.email || "A")[0].toUpperCase()}
            </div>
            <span style={{ fontSize: "13px" }}>{adminUser.email}</span>
          </div>
          <button
            onClick={() => setAdminUser(null)}
            className="admin-btn admin-btn-ghost"
            style={{ fontSize: "12px", padding: "6px 10px" }}
            title="Sign out"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ---- Sidebar ---- */}
      <aside className="admin-sidebar">
        <div className="admin-nav-section">
          <p className="admin-nav-section-label">Catalog Management</p>
          <button className={`admin-nav-item ${tab === "products" ? "active" : ""}`} onClick={() => setTab("products")}>
            <Icon.Products /> Products ({totalProducts})
          </button>
          <button className={`admin-nav-item ${tab === "upload" ? "active" : ""}`} onClick={() => setTab("upload")}>
            <Icon.Upload /> Image Upload & CDN
          </button>
        </div>
        <div className="admin-sidebar-divider" />
        <div className="admin-nav-section">
          <p className="admin-nav-section-label">System</p>
          <div style={{ padding: "8px 12px", fontSize: "12px", color: "rgba(240,237,232,0.45)", lineHeight: "1.6" }}>
            <p style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6fcf97", marginBottom: "4px" }}>
              <Icon.Check /> InsForge Connected
            </p>
            <p>Database: Postgres</p>
            <p>Storage: product-images</p>
          </div>
        </div>
      </aside>

      {/* ---- Main Content ---- */}
      <main className="admin-main">
        {/* Stats Strip */}
        <div className="admin-stats">
          {[
            { label: "Total Products", value: totalProducts },
            { label: "Women's Collection", value: womenCount },
            { label: "Men's Collection", value: menCount },
            { label: "New Arrivals", value: newCount },
          ].map((s) => (
            <div key={s.label} className="admin-stat-card">
              <p className="admin-stat-label">{s.label}</p>
              <p className="admin-stat-value">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ---- TAB 1: PRODUCTS ---- */}
        {tab === "products" && (
          <div className="admin-panel">
            <div className="admin-panel-head" style={{ flexWrap: "wrap", gap: "16px" }}>
              <div>
                <p className="admin-panel-title">Product Catalog</p>
                <p style={{ fontSize: "12px", color: "rgba(240,237,232,0.45)", marginTop: "2px" }}>
                  Persistent in InsForge PostgreSQL database
                </p>
              </div>

              {/* Search & Filter Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ position: "relative", minWidth: "220px" }}>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="Search products…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: "34px", height: "38px" }}
                  />
                  <div style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "rgba(240,237,232,0.4)" }}>
                    <Icon.Search />
                  </div>
                </div>

                <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "4px", padding: "2px", flexWrap: "wrap", gap: "2px" }}>
                  {[
                    { id: "all", label: "All" },
                    { id: "women", label: "Women" },
                    { id: "men", label: "Men" },
                    { id: "outerwear", label: "Outerwear" },
                    { id: "accessories", label: "Accessories" },
                    { id: "sale", label: "Sale" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilterCategory(cat.id as any)}
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        background: filterCategory === cat.id ? "rgba(255,255,255,0.14)" : "transparent",
                        color: filterCategory === cat.id ? "#f0ede8" : "rgba(240,237,232,0.5)",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <button className="admin-btn admin-btn-secondary" onClick={loadProducts} title="Refresh catalog">
                  Refresh
                </button>
                <button className="admin-btn admin-btn-primary" onClick={openAdd}>
                  <Icon.Plus /> Add Product
                </button>
              </div>
            </div>

            <div className="admin-table-wrap">
              {loading ? (
                <div style={{ padding: "60px", textAlign: "center", color: "rgba(240,237,232,0.35)", fontSize: "14px" }}>
                  Loading catalog from InsForge database…
                </div>
              ) : filteredProducts.length === 0 ? (
                <div style={{ padding: "60px", textAlign: "center", color: "rgba(240,237,232,0.35)", fontSize: "14px" }}>
                  {searchTerm ? "No products matching your search." : "No products found."}
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Badges</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="admin-product-row-meta">
                            <div className="admin-table-thumb">
                              {p.images?.[0] && (
                                <Image
                                  src={p.images[0]}
                                  alt={p.name}
                                  fill
                                  sizes="44px"
                                  style={{ objectFit: "cover" }}
                                />
                              )}
                            </div>
                            <div>
                              <p className="admin-product-name">{p.name}</p>
                              <p className="admin-product-id">{p.slug || p.id}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`admin-badge admin-badge-${p.category}`}>{p.category}</span>
                          <span style={{ marginLeft: "6px", fontSize: "12px", color: "rgba(240,237,232,0.4)" }}>
                            {p.subcategory}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "15px" }}>
                            ${Number(p.price).toFixed(2)}
                          </span>
                          {p.compare_at_price && (
                            <s style={{ marginLeft: "8px", fontSize: "12px", color: "rgba(240,237,232,0.35)" }}>
                              ${Number(p.compare_at_price).toFixed(2)}
                            </s>
                          )}
                        </td>
                        <td>{p.stock ?? "—"}</td>
                        <td>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                            <button
                              type="button"
                              onClick={() => quickToggleFlag(p, "featured")}
                              title="Click to toggle Featured on Homepage"
                              style={{
                                border: p.featured ? "1px solid #a79c8e" : "1px solid rgba(255,255,255,0.12)",
                                cursor: "pointer",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: 500,
                                background: p.featured ? "rgba(167, 156, 142, 0.25)" : "transparent",
                                color: p.featured ? "#f0ede8" : "rgba(240,237,232,0.4)",
                                transition: "all 0.15s",
                              }}
                            >
                              ★ Featured
                            </button>
                            <button
                              type="button"
                              onClick={() => quickToggleFlag(p, "is_new")}
                              title="Click to toggle New Arrival badge"
                              style={{
                                border: p.is_new ? "1px solid #fff" : "1px solid rgba(255,255,255,0.12)",
                                cursor: "pointer",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: 500,
                                background: p.is_new ? "rgba(255,255,255,0.2)" : "transparent",
                                color: p.is_new ? "#ffffff" : "rgba(240,237,232,0.4)",
                                transition: "all 0.15s",
                              }}
                            >
                              New
                            </button>
                            <button
                              type="button"
                              onClick={() => quickToggleFlag(p, "trending")}
                              title="Click to toggle Trending badge"
                              style={{
                                border: p.trending ? "1px solid rgba(235, 87, 87, 0.6)" : "1px solid rgba(255,255,255,0.12)",
                                cursor: "pointer",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: 500,
                                background: p.trending ? "rgba(235, 87, 87, 0.2)" : "transparent",
                                color: p.trending ? "#ff8585" : "rgba(240,237,232,0.4)",
                                transition: "all 0.15s",
                              }}
                            >
                              🔥 Trending
                            </button>
                            {p.compare_at_price && p.compare_at_price > p.price && (
                              <span style={{
                                padding: "2px 7px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: 600,
                                background: "rgba(139, 38, 30, 0.3)",
                                color: "#ff8585",
                                border: "1px solid rgba(139, 38, 30, 0.6)",
                              }}>
                                Sale -{Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100)}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <Link
                              href={`/product/${p.slug || p.id}`}
                              target="_blank"
                              className="admin-btn admin-btn-ghost"
                              title="View in Store"
                              style={{ padding: "8px" }}
                            >
                              <Icon.Eye />
                            </Link>
                            <button className="admin-btn admin-btn-ghost" onClick={() => openEdit(p)} title="Edit Product" style={{ padding: "8px" }}>
                              <Icon.Edit />
                            </button>
                            <button
                              className="admin-btn admin-btn-danger"
                              onClick={() => deleteProduct(p.id)}
                              disabled={deleting === p.id}
                              title="Delete Product"
                              style={{ padding: "8px 10px" }}
                            >
                              {deleting === p.id ? "…" : <Icon.Trash />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ---- TAB 2: IMAGE UPLOAD ---- */}
        {tab === "upload" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="admin-page-header" style={{ marginBottom: 0 }}>
              <div>
                <h1 className="admin-page-title">Image Upload & Asset Management</h1>
                <p className="admin-page-sub">Upload product photography directly to InsForge Storage (`product-images` bucket)</p>
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-head">
                <p className="admin-panel-title">Upload Images</p>
              </div>
              <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Target Product Selector */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Attach To Product (ID or Slug) *</label>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <select
                      className="admin-form-select"
                      value={uploadProductId}
                      onChange={(e) => setUploadProductId(e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option value="">Select a product…</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.slug || p.id}>
                          {p.name} ({p.slug || p.id}) · {p.category}
                        </option>
                      ))}
                    </select>
                    <input
                      className="admin-form-input"
                      placeholder="Or type custom ID..."
                      value={uploadProductId}
                      onChange={(e) => setUploadProductId(e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                  <p style={{ fontSize: "12px", color: "rgba(240,237,232,0.4)", marginTop: "4px" }}>
                    Images are uploaded as: <code>products/[product-id]-1.jpg</code> (Primary Display) and <code>products/[product-id]-2.jpg</code> (Hover).
                  </p>
                </div>

                {/* Drag & Drop Area */}
                <div
                  className={`admin-upload-zone ${dragover ? "dragover" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
                  onDragLeave={() => setDragover(false)}
                  onDrop={(e) => { e.preventDefault(); setDragover(false); handleFiles(e.dataTransfer.files); }}
                  onClick={() => fileRef.current?.click()}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                  <div className="admin-upload-icon">🖼</div>
                  <p className="admin-upload-title">Drag & drop product images here or click to browse</p>
                  <p className="admin-upload-sub">Supports JPG, PNG, WEBP. Upload 2 images per product (1 = Primary, 2 = Hover).</p>
                </div>

                {/* Image Previews */}
                {uploadPreviews.length > 0 && (
                  <div>
                    <p className="admin-form-label" style={{ marginBottom: "12px" }}>
                      Selected Files ({uploadPreviews.length})
                    </p>
                    <div className="admin-upload-previews">
                      {uploadPreviews.map((src, i) => (
                        <div key={i} className="admin-upload-preview" style={{ position: "relative" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`Preview ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button
                            className="admin-upload-preview-remove"
                            onClick={(e) => { e.stopPropagation(); removeUploadFile(i); }}
                          >
                            ×
                          </button>
                          <div style={{
                            position: "absolute", bottom: "6px", left: "6px",
                            background: "rgba(15,14,13,0.85)", borderRadius: "4px",
                            padding: "3px 7px", fontSize: "10px", color: "#f0ede8",
                            letterSpacing: "0.1em", textTransform: "uppercase"
                          }}>
                            {i === 0 ? "1. Primary" : "2. Hover"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                {uploading && (
                  <div>
                    <p style={{ fontSize: "13px", color: "rgba(240,237,232,0.6)", marginBottom: "8px" }}>
                      Uploading to InsForge Storage… {uploadProgress}%
                    </p>
                    <div className="admin-progress">
                      <div className="admin-progress-fill" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
                  <button
                    className="admin-btn admin-btn-primary"
                    onClick={uploadImages}
                    disabled={uploading || uploadFiles.length === 0}
                  >
                    <Icon.Upload />
                    {uploading ? `Uploading…` : `Upload & Save to Storage`}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={async () => {
                      try {
                        if (!navigator.clipboard?.read) {
                          toast("Press Ctrl+V to paste images directly from clipboard", "info");
                          return;
                        }
                        const items = await navigator.clipboard.read();
                        const files: File[] = [];
                        for (const item of items) {
                          for (const type of item.types) {
                            if (type.startsWith("image/")) {
                              const blob = await item.getType(type);
                              files.push(new File([blob], `pasted-${Date.now()}.${type.split("/")[1] || "jpg"}`, { type }));
                            }
                          }
                        }
                        if (files.length > 0) {
                          setUploadFiles((prev) => [...prev, ...files]);
                          files.forEach((f) => {
                            const reader = new FileReader();
                            reader.onload = (ev) => setUploadPreviews((prev) => [...prev, ev.target?.result as string]);
                            reader.readAsDataURL(f);
                          });
                          toast(`Pasted ${files.length} image(s) from clipboard!`, "info");
                        } else {
                          toast("No image found in clipboard. Copy an image or screenshot first, then paste!", "info");
                        }
                      } catch {
                        toast("Press Ctrl+V to paste copied images directly", "info");
                      }
                    }}
                  >
                    📋 Paste from Clipboard (Ctrl+V)
                  </button>
                  {uploadFiles.length > 0 && (
                    <button
                      className="admin-btn admin-btn-secondary"
                      onClick={() => { setUploadFiles([]); setUploadPreviews([]); }}
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Product Image Reference Table */}
            <div className="admin-panel">
              <div className="admin-panel-head">
                <p className="admin-panel-title">Active Products & Image Mapping</p>
              </div>
              <div style={{ padding: "24px" }}>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Product Slug</th>
                        <th>Primary Image (-1)</th>
                        <th>Hover Image (-2)</th>
                        <th>Cloud Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 500 }}>{p.name}</td>
                          <td><code style={{ fontSize: "12px", fontFamily: "monospace", color: "#a79c8e" }}>{p.slug || p.id}</code></td>
                          <td style={{ fontSize: "12px", color: "rgba(240,237,232,0.55)" }}>{p.images?.[0] || "—"}</td>
                          <td style={{ fontSize: "12px", color: "rgba(240,237,232,0.55)" }}>{p.images?.[1] || "—"}</td>
                          <td>
                            <span style={{ color: "#6fcf97", display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" }}>
                              <Icon.Check /> Synced
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================
          ADD / EDIT PRODUCT MODAL
          ============================================================ */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="admin-modal">
            <div className="admin-modal-head">
              <h2 className="admin-modal-title">{isEditing ? `Edit ${editProduct.name}` : "Add New Product"}</h2>
              <button className="admin-btn admin-btn-ghost" onClick={() => setModalOpen(false)}>
                <Icon.Close />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-grid">
                <div className="admin-form-group admin-form-span2">
                  <label className="admin-form-label">Product Name *</label>
                  <input
                    className="admin-form-input"
                    placeholder="e.g. Cashmere Knit Overcoat"
                    value={editProduct.name || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Slug / ID *</label>
                  <input
                    className="admin-form-input"
                    placeholder="e.g. cashmere-knit-overcoat"
                    value={editProduct.slug || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, slug: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Subcategory</label>
                  <input
                    className="admin-form-input"
                    placeholder="e.g. Outerwear, Knitwear, Dresses"
                    value={editProduct.subcategory || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, subcategory: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Category *</label>
                  <select
                    className="admin-form-select"
                    value={editProduct.category || "women"}
                    onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value as any })}
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="outerwear">Outerwear</option>
                    <option value="accessories">Accessories</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>

                {/* Interactive Price & Sale Calculator */}
                <div className="admin-price-calc-container">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                    <label className="admin-form-label" style={{ marginBottom: 0 }}>
                      Pricing &amp; Sale Discount Calculator
                    </label>
                    {editProduct.compare_at_price && editProduct.compare_at_price > (editProduct.price || 0) && (
                      <span className="admin-calc-badge">
                        💰 Savings: ${(editProduct.compare_at_price - (editProduct.price || 0)).toFixed(2)} ({discountPercent}% OFF)
                      </span>
                    )}
                  </div>
                  <div className="admin-price-calc-grid">
                    <div>
                      <label className="admin-form-label" style={{ fontSize: "11px", color: "rgba(240,237,232,0.6)" }}>
                        1. Original Price ($)
                      </label>
                      <input
                        className="admin-form-input"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={editProduct.compare_at_price ?? ""}
                        onChange={(e) => handleOriginalPriceChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="admin-form-label" style={{ fontSize: "11px", color: "rgba(240,237,232,0.6)" }}>
                        2. Sale Discount (%)
                      </label>
                      <input
                        className="admin-form-input"
                        type="number"
                        min="0"
                        max="99"
                        step="1"
                        placeholder="0%"
                        value={discountPercent || ""}
                        onChange={(e) => handleDiscountPercentChange(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="admin-form-label" style={{ fontSize: "11px", color: "#6fcf97" }}>
                        3. Final Sale Price ($) *
                      </label>
                      <input
                        className="admin-form-input"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={editProduct.price || ""}
                        onChange={(e) => handleSalePriceChange(parseFloat(e.target.value) || 0)}
                        style={{ borderColor: discountPercent > 0 ? "#6fcf97" : undefined }}
                      />
                    </div>
                  </div>
                  <p style={{ fontSize: "11px", color: "rgba(240,237,232,0.4)", marginTop: "8px" }}>
                    Entering Original Price and Sale % automatically calculates the Sale Price. Entering Original Price and Sale Price automatically calculates the discount percentage.
                  </p>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Stock Quantity</label>
                  <input
                    className="admin-form-input"
                    type="number"
                    min="0"
                    placeholder="20"
                    value={editProduct.stock ?? ""}
                    onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Material</label>
                  <input
                    className="admin-form-input"
                    placeholder="e.g. 100% Mongolian Cashmere"
                    value={editProduct.material || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, material: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Color</label>
                  <input
                    className="admin-form-input"
                    placeholder="e.g. Oatmeal, Charcoal, Optic White"
                    value={editProduct.color || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, color: e.target.value })}
                  />
                </div>

                <div className="admin-form-group admin-form-span2">
                  <label className="admin-form-label">Description</label>
                  <textarea
                    className="admin-form-textarea"
                    placeholder="Detailed garment description…"
                    value={editProduct.description || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  />
                </div>

                {/* Two Separate Image Boxes */}
                <div className="admin-form-group admin-form-span2">
                  <div style={{ marginBottom: "10px" }}>
                    <label className="admin-form-label" style={{ fontSize: "13px" }}>
                      Product Photography (Two Separate Picture Uploaders)
                    </label>
                    <p style={{ fontSize: "11.5px", color: "rgba(240,237,232,0.4)" }}>
                      Provide a Main Picture (first display image) and a Hover Picture (image shown on mouseover).
                    </p>
                  </div>

                  <div className="admin-two-image-grid">
                    {/* BOX 1: MAIN PICTURE */}
                    <div className="admin-image-box">
                      <div className="admin-image-box-head">
                        <span className="admin-image-box-title">1. Main Picture (First Display) *</span>
                        <button
                          type="button"
                          className="admin-btn admin-btn-ghost"
                          style={{ fontSize: "11px", padding: "4px 8px" }}
                          onClick={() => handlePasteToBox(0)}
                        >
                          📋 Paste (Ctrl+V)
                        </button>
                      </div>

                      {/* Dropzone */}
                      <div
                        className={`admin-modal-dropzone ${mainDragover ? "dragover" : ""}`}
                        onDragOver={(e) => { e.preventDefault(); setMainDragover(true); }}
                        onDragLeave={() => setMainDragover(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setMainDragover(false);
                          if (e.dataTransfer.files?.[0]) uploadSingleBoxImage(e.dataTransfer.files[0], 0);
                        }}
                        onClick={() => mainFileRef.current?.click()}
                        style={{ padding: "16px 12px" }}
                      >
                        <input
                          ref={mainFileRef}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            if (e.target.files?.[0]) uploadSingleBoxImage(e.target.files[0], 0);
                          }}
                        />
                        <div style={{ fontSize: "22px", marginBottom: "4px" }}>
                          {mainUploading ? "⏳" : "📸"}
                        </div>
                        <p style={{ fontSize: "12.5px", fontWeight: 500, color: "#f0ede8", marginBottom: "2px" }}>
                          {mainUploading ? "Uploading Main Picture…" : "Drop Main Picture Here"}
                        </p>
                        <p style={{ fontSize: "10.5px", color: "rgba(240,237,232,0.4)" }}>
                          Click to browse, drag &amp; drop, or paste clipboard
                        </p>
                      </div>

                      {/* Preview */}
                      {editProduct.images?.[0] && (
                        <div className="admin-image-preview-large">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={editProduct.images[0]}
                            alt="Main picture preview"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/products/wool-coat-1.jpg";
                            }}
                          />
                          <div className="admin-modal-img-badge" style={{ background: "rgba(18, 16, 14, 0.95)", color: "#f0ede8" }}>
                            ★ 1. Main Display
                          </div>
                          <button
                            type="button"
                            className="admin-modal-img-del"
                            title="Remove Main Picture"
                            onClick={() => {
                              const imgs = [...(editProduct.images || [])];
                              imgs[0] = "";
                              setEditProduct({ ...editProduct, images: imgs });
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )}

                      {/* URL / Path input */}
                      <div>
                        <label style={{ display: "block", fontSize: "10px", color: "rgba(240,237,232,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                          Main Image Web Path or Cloud URL
                        </label>
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="/images/products/white-linen-1.jpg"
                          value={editProduct.images?.[0] || ""}
                          onChange={(e) => {
                            let s = e.target.value.trim();
                            if (s.includes("\\") || s.startsWith("C:") || s.startsWith("file:")) {
                              const parts = s.split(/[\\/]/);
                              s = `/images/products/${parts[parts.length - 1]}`;
                            }
                            if (s && !/\.(jpg|jpeg|png|webp|avif)$/i.test(s) && !s.startsWith("http")) {
                              s += ".jpg";
                            }
                            const imgs = [...(editProduct.images || [])];
                            imgs[0] = s;
                            setEditProduct({ ...editProduct, images: imgs });
                          }}
                          style={{ fontSize: "12px", fontFamily: "monospace" }}
                        />
                      </div>
                    </div>

                    {/* BOX 2: HOVER PICTURE */}
                    <div className="admin-image-box">
                      <div className="admin-image-box-head">
                        <span className="admin-image-box-title">2. Hover Picture (Mouseover Preview)</span>
                        <button
                          type="button"
                          className="admin-btn admin-btn-ghost"
                          style={{ fontSize: "11px", padding: "4px 8px" }}
                          onClick={() => handlePasteToBox(1)}
                        >
                          📋 Paste (Ctrl+V)
                        </button>
                      </div>

                      {/* Dropzone */}
                      <div
                        className={`admin-modal-dropzone ${hoverDragover ? "dragover" : ""}`}
                        onDragOver={(e) => { e.preventDefault(); setHoverDragover(true); }}
                        onDragLeave={() => setHoverDragover(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setHoverDragover(false);
                          if (e.dataTransfer.files?.[0]) uploadSingleBoxImage(e.dataTransfer.files[0], 1);
                        }}
                        onClick={() => hoverFileRef.current?.click()}
                        style={{ padding: "16px 12px" }}
                      >
                        <input
                          ref={hoverFileRef}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            if (e.target.files?.[0]) uploadSingleBoxImage(e.target.files[0], 1);
                          }}
                        />
                        <div style={{ fontSize: "22px", marginBottom: "4px" }}>
                          {hoverUploading ? "⏳" : "📸"}
                        </div>
                        <p style={{ fontSize: "12.5px", fontWeight: 500, color: "#f0ede8", marginBottom: "2px" }}>
                          {hoverUploading ? "Uploading Hover Picture…" : "Drop Hover Picture Here"}
                        </p>
                        <p style={{ fontSize: "10.5px", color: "rgba(240,237,232,0.4)" }}>
                          Click to browse, drag &amp; drop, or paste clipboard
                        </p>
                      </div>

                      {/* Preview */}
                      {editProduct.images?.[1] && (
                        <div className="admin-image-preview-large">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={editProduct.images[1]}
                            alt="Hover picture preview"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/products/wool-coat-2.jpg";
                            }}
                          />
                          <div className="admin-modal-img-badge" style={{ background: "rgba(18, 16, 14, 0.95)", color: "#f0ede8" }}>
                            ⮂ 2. Hover Preview
                          </div>
                          <button
                            type="button"
                            className="admin-modal-img-del"
                            title="Remove Hover Picture"
                            onClick={() => {
                              const imgs = [...(editProduct.images || [])];
                              imgs[1] = "";
                              setEditProduct({ ...editProduct, images: imgs });
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )}

                      {/* URL / Path input */}
                      <div>
                        <label style={{ display: "block", fontSize: "10px", color: "rgba(240,237,232,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                          Hover Image Web Path or Cloud URL
                        </label>
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="/images/products/white-linen-2.jpg"
                          value={editProduct.images?.[1] || ""}
                          onChange={(e) => {
                            let s = e.target.value.trim();
                            if (s.includes("\\") || s.startsWith("C:") || s.startsWith("file:")) {
                              const parts = s.split(/[\\/]/);
                              s = `/images/products/${parts[parts.length - 1]}`;
                            }
                            if (s && !/\.(jpg|jpeg|png|webp|avif)$/i.test(s) && !s.startsWith("http")) {
                              s += ".jpg";
                            }
                            const imgs = [...(editProduct.images || [])];
                            imgs[1] = s;
                            setEditProduct({ ...editProduct, images: imgs });
                          }}
                          style={{ fontSize: "12px", fontFamily: "monospace" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-form-group admin-form-span2">
                  <label className="admin-form-label">Available Sizes (comma-separated)</label>
                  <input
                    className="admin-form-input"
                    placeholder="XS, S, M, L, XL"
                    value={(editProduct.sizes || []).join(", ")}
                    onChange={(e) => setEditProduct({
                      ...editProduct,
                      sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })}
                  />
                </div>
              </div>

              {/* Status Flags */}
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginTop: "16px", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
                {[
                  { key: "featured", label: "Featured on Homepage" },
                  { key: "is_new", label: "New Arrival Badge" },
                  { key: "trending", label: "Trending Badge" },
                ].map(({ key, label }) => (
                  <label key={key} className="admin-checkbox-row" style={{ cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={Boolean(editProduct[key as keyof Partial<Product>])}
                      onChange={(e) => setEditProduct({ ...editProduct, [key]: e.target.checked })}
                    />
                    <span style={{ fontWeight: 500 }}>{label}</span>
                  </label>
                ))}
                {editProduct.compare_at_price && editProduct.compare_at_price > (editProduct.price || 0) && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ff8585", fontSize: "12px", fontWeight: 600 }}>
                    <span>🏷️ Sale Badge Active</span>
                    <span>(-{discountPercent}%)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="admin-modal-foot">
              <button className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-primary" onClick={saveProduct} disabled={saving}>
                {saving ? "Saving to Database…" : isEditing ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Toast Stack ---- */}
      <div className="admin-toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`admin-toast admin-toast-${t.kind}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
