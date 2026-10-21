"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./types";
import { useToast } from "./store";

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  slug?: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product | WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "velour-wishlist-v1";

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (e) {
      console.warn("Failed to read wishlist from localStorage", e);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist wishlist", e);
    }
  }, [items, hydrated]);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.productId !== productId);
        return next;
      });
      push("Removed from wishlist", "info");
    },
    [push]
  );

  const toggleWishlist = useCallback(
    (product: Product | WishlistItem) => {
      const id = "id" in product ? product.id : product.productId;
      setItems((prev) => {
        const exists = prev.some((i) => i.productId === id);
        if (exists) {
          push(`Removed ${product.name} from wishlist`, "info");
          return prev.filter((i) => i.productId !== id);
        } else {
          push(`Saved ${product.name} to wishlist`);
          const newItem: WishlistItem = {
            productId: id,
            name: product.name,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            image: "images" in product ? product.images[0] : product.image,
            category: product.category,
            subcategory: product.subcategory,
            slug: product.slug,
          };
          return [newItem, ...prev];
        }
      });
    },
    [push]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      drawerOpen,
      setDrawerOpen,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [items, drawerOpen, isInWishlist, toggleWishlist, removeFromWishlist, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
