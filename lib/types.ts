export interface UnstitchedDetails {
  shirtMeters: number;
  dupattaMeters: number;
  trouserMeters: number;
  extraBorderMeters?: number;
  boxIncludes?: string[];
}

export interface ModelInfo {
  height: string;
  sizeWorn: string;
}

export type Category = "women" | "men" | "unstitched" | "festive" | "outerwear" | "sale" | "accessories";

export interface Product {
  id: string;
  slug?: string;
  name: string;
  category: Category;
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
  fabric?: string;
  pieceCount?: "1-Piece" | "2-Piece" | "3-Piece";
  workType?: "Embroidered" | "Digital Print" | "Hand Embellished" | "Solid Dyed" | "Block Print";
  occasion?: "Everyday" | "Workwear" | "Festive" | "Wedding Guest" | "Bridal";
  unstitchedDetails?: UnstitchedDetails;
  stitchingAvailable?: boolean;
  stitchingFee?: number;
  modelInfo?: ModelInfo;
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

export type PaymentMethod = "cod" | "card" | "jazzcash" | "easypaisa" | "raast" | "bank_transfer";

export type OrderStatus = "pending" | "confirmed" | "processing" | "dispatched" | "delivered" | "cancelled";

export type CourierPartner = "TCS" | "Leopards" | "PostEx" | "Trax";

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface ShippingInfo {
  province: string;
  city: string;
  area?: string;
  address: string;
  nearestLandmark?: string;
  addressType: "home" | "office";
  zip?: string;
  country: string;
}

export interface Order {
  id?: string;
  orderNumber: string;
  trackingNumber: string;
  courier: CourierPartner;
  paymentMethod: PaymentMethod;
  codVerified?: boolean;
  customer: CustomerInfo;
  shipping: ShippingInfo;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount?: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery?: string;
}

