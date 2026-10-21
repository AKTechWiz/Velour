"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "./types";
import { insforge } from "./insforge";
import { getProductById, ALL_PRODUCTS } from "./api";

/* ------------------------------ Toast ------------------------------ */

interface Toast {
  id: number;
  message: string;
  kind: "success" | "info" | "error";
}


interface ToastContextValue {
  push: (message: string, kind?: Toast["kind"]) => void;
}

const ToastContext = createContext<ToastContextValue>({ push: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, kind: Toast["kind"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.kind}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ------------------------------- Cart ------------------------------ */

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  miniBagOpen: boolean;
  setMiniBagOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (productId: string, size: string, qty: number) => void;
  updateQuantity: (productId: string, size: string, qty: number) => void;
  increaseQuantity: (productId: string, size: string) => void;
  decreaseQuantity: (productId: string, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getSubtotal: () => number;
}


const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "velour-cart-v1";

function keyOf(productId: string, size: string) {
  return `${productId}__${size}`;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

function CartProviderInner({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [miniBagOpen, setMiniBagOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  // Sync auth state & load cart from InsForge if user is logged in
  useEffect(() => {
    const loadUserAndCart = async () => {
      try {
        const { data } = await insforge.auth.getCurrentUser();
        const currentUid = data?.user?.id ?? null;
        setUserId(currentUid);
        userIdRef.current = currentUid;

        if (currentUid) {
          // Fetch cart rows from InsForge database
          const { data: dbRows, error } = await insforge.database
            .from("carts")
            .select("product_id, size, quantity")
            .eq("user_id", currentUid);

          if (!error && dbRows && dbRows.length > 0) {
            const mappedItems: CartItem[] = [];
            for (const r of dbRows) {
              const p = (await getProductById(r.product_id)) || ALL_PRODUCTS.find((x) => x.id === r.product_id);
              if (p) {
                mappedItems.push({
                  productId: p.id,
                  name: p.name,
                  price: p.price,
                  size: r.size,
                  qty: r.quantity,
                  image: p.images[0] || "/images/products/green-lawn-1.jpg",
                });
              }
            }
            if (mappedItems.length > 0) {
              setItems(mappedItems);
            }
          }
        }
      } catch (err) {
        console.warn("Cart auth sync error:", err);
      }
    };

    loadUserAndCart();
    window.addEventListener("insforge-auth-change", loadUserAndCart);
    return () => window.removeEventListener("insforge-auth-change", loadUserAndCart);
  }, []);

  // Hydrate from localStorage for guest
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Write-through to localStorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const k = keyOf(item.productId, item.size);
      const existing = prev.find((i) => keyOf(i.productId, i.size) === k);
      const newQty = existing ? existing.qty + qty : qty;

      // Write-through to InsForge if logged in
      const currentUid = userIdRef.current;
      if (currentUid) {
        insforge.database
          .from("carts")
          .upsert([
            {
              user_id: currentUid,
              product_id: item.productId,
              size: item.size,
              quantity: newQty,
              updated_at: new Date().toISOString(),
            },
          ])
          .then(({ error }) => {
            if (error) console.warn("Cart DB sync error:", error);
          });
      }

      if (existing) {
        return prev.map((i) => (keyOf(i.productId, i.size) === k ? { ...i, qty: newQty } : i));
      }
      return [...prev, { ...item, qty }];
    });
    setMiniBagOpen(true);
  }, []);

  const updateQty = useCallback((productId: string, size: string, qty: number) => {
    const currentUid = userIdRef.current;
    if (currentUid) {
      if (qty <= 0) {
        insforge.database
          .from("carts")
          .delete()
          .eq("user_id", currentUid)
          .eq("product_id", productId)
          .eq("size", size)
          .then(({ error }) => {
            if (error) console.warn("Cart DB delete error:", error);
          });
      } else {
        insforge.database
          .from("carts")
          .upsert([
            {
              user_id: currentUid,
              product_id: productId,
              size: size,
              quantity: qty,
              updated_at: new Date().toISOString(),
            },
          ])
          .then(({ error }) => {
            if (error) console.warn("Cart DB upsert error:", error);
          });
      }
    }

    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => keyOf(i.productId, i.size) !== keyOf(productId, size))
        : prev.map((i) => (keyOf(i.productId, i.size) === keyOf(productId, size) ? { ...i, qty } : i))
    );
  }, []);

  const increaseQuantity = useCallback(
    (productId: string, size: string) => {
      setItems((prev) => {
        const target = prev.find((i) => keyOf(i.productId, i.size) === keyOf(productId, size));
        const newQty = (target?.qty || 0) + 1;
        const currentUid = userIdRef.current;
        if (currentUid) {
          insforge.database
            .from("carts")
            .upsert([
              {
                user_id: currentUid,
                product_id: productId,
                size: size,
                quantity: newQty,
                updated_at: new Date().toISOString(),
              },
            ])
            .then(({ error }) => {
              if (error) console.warn("Cart DB increase error:", error);
            });
        }
        return prev.map((i) =>
          keyOf(i.productId, i.size) === keyOf(productId, size) ? { ...i, qty: newQty } : i
        );
      });
    },
    []
  );

  const decreaseQuantity = useCallback(
    (productId: string, size: string) => {
      setItems((prev) => {
        const target = prev.find((i) => keyOf(i.productId, i.size) === keyOf(productId, size));
        if (!target) return prev;
        const newQty = target.qty - 1;
        const currentUid = userIdRef.current;

        if (currentUid) {
          if (newQty <= 0) {
            insforge.database
              .from("carts")
              .delete()
              .eq("user_id", currentUid)
              .eq("product_id", productId)
              .eq("size", size)
              .then(({ error }) => {
                if (error) console.warn("Cart DB decrease-delete error:", error);
              });
          } else {
            insforge.database
              .from("carts")
              .upsert([
                {
                  user_id: currentUid,
                  product_id: productId,
                  size: size,
                  quantity: newQty,
                  updated_at: new Date().toISOString(),
                },
              ])
              .then(({ error }) => {
                if (error) console.warn("Cart DB decrease error:", error);
              });
          }
        }

        return prev
          .map((i) =>
            keyOf(i.productId, i.size) === keyOf(productId, size) ? { ...i, qty: newQty } : i
          )
          .filter((i) => i.qty > 0);
      });
    },
    []
  );

  const removeItem = useCallback((productId: string, size: string) => {
    const currentUid = userIdRef.current;
    if (currentUid) {
      insforge.database
        .from("carts")
        .delete()
        .eq("user_id", currentUid)
        .eq("product_id", productId)
        .eq("size", size)
        .then(({ error }) => {
          if (error) console.warn("Cart DB remove error:", error);
        });
    }

    setItems((prev) => prev.filter((i) => keyOf(i.productId, i.size) !== keyOf(productId, size)));
  }, []);

  const clearCart = useCallback(() => {
    const currentUid = userIdRef.current;
    if (currentUid) {
      insforge.database
        .from("carts")
        .delete()
        .eq("user_id", currentUid)
        .then(({ error }) => {
          if (error) console.warn("Cart DB clear error:", error);
        });
    }
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    return {
      items,
      count,
      subtotal,
      miniBagOpen,
      setMiniBagOpen,
      addItem,
      updateQty,
      updateQuantity: updateQty,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      clearCart,
      getCartCount: () => count,
      getSubtotal: () => subtotal,
    };
  }, [items, miniBagOpen, setMiniBagOpen, addItem, updateQty, increaseQuantity, decreaseQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProviderInner>{children}</CartProviderInner>
    </ToastProvider>
  );
}
