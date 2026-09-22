export interface Product {
  id: string;
  slug?: string;
  name: string;
  category: "women" | "men" | "outerwear" | "sale" | "accessories";
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  sizes: string[];
  images: string[];
  featured: boolean;
  isNew: boolean;
  trending: boolean;
  material?: string;
  color?: string;
  stock?: number;
  createdAt?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface ShippingInfo {
  address: string;
  city: string;
  zip: string;
  country: string;
}

export interface Order {
  orderNumber: string;
  customer: CustomerInfo;
  shipping: ShippingInfo;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
}
