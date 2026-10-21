import { CourierPartner, Order, OrderStatus, PaymentMethod } from "./types";

export interface CityCoverage {
  name: string;
  province: string;
  courier: CourierPartner;
  transitDays: string;
  codAvailable: boolean;
  expressAvailable: boolean;
}

export const PAKISTAN_PROVINCES = [
  "Sindh",
  "Punjab",
  "Islamabad Capital Territory",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Azad Jammu & Kashmir",
  "Gilgit-Baltistan",
] as const;

export const PAKISTAN_CITIES: CityCoverage[] = [
  { name: "Karachi", province: "Sindh", courier: "TCS", transitDays: "1–2 Days", codAvailable: true, expressAvailable: true },
  { name: "Lahore", province: "Punjab", courier: "TCS", transitDays: "2–3 Days", codAvailable: true, expressAvailable: true },
  { name: "Islamabad", province: "Islamabad Capital Territory", courier: "TCS", transitDays: "2–3 Days", codAvailable: true, expressAvailable: true },
  { name: "Rawalpindi", province: "Punjab", courier: "TCS", transitDays: "2–3 Days", codAvailable: true, expressAvailable: true },
  { name: "Faisalabad", province: "Punjab", courier: "Leopards", transitDays: "2–3 Days", codAvailable: true, expressAvailable: false },
  { name: "Multan", province: "Punjab", courier: "Leopards", transitDays: "2–3 Days", codAvailable: true, expressAvailable: false },
  { name: "Peshawar", province: "Khyber Pakhtunkhwa", courier: "TCS", transitDays: "3–4 Days", codAvailable: true, expressAvailable: false },
  { name: "Quetta", province: "Balochistan", courier: "TCS", transitDays: "3–5 Days", codAvailable: true, expressAvailable: false },
  { name: "Sialkot", province: "Punjab", courier: "Leopards", transitDays: "2–3 Days", codAvailable: true, expressAvailable: false },
  { name: "Gujranwala", province: "Punjab", courier: "Leopards", transitDays: "2–3 Days", codAvailable: true, expressAvailable: false },
  { name: "Hyderabad", province: "Sindh", courier: "TCS", transitDays: "2–3 Days", codAvailable: true, expressAvailable: false },
  { name: "Abbottabad", province: "Khyber Pakhtunkhwa", courier: "PostEx", transitDays: "3–4 Days", codAvailable: true, expressAvailable: false },
  { name: "Bahawalpur", province: "Punjab", courier: "Leopards", transitDays: "3–4 Days", codAvailable: true, expressAvailable: false },
  { name: "Sargodha", province: "Punjab", courier: "Leopards", transitDays: "3–4 Days", codAvailable: true, expressAvailable: false },
  { name: "Sukkur", province: "Sindh", courier: "TCS", transitDays: "3–4 Days", codAvailable: true, expressAvailable: false },
  { name: "Mirpur (AJK)", province: "Azad Jammu & Kashmir", courier: "Trax", transitDays: "3–5 Days", codAvailable: true, expressAvailable: false },
  { name: "Gilgit", province: "Gilgit-Baltistan", courier: "TCS", transitDays: "4–6 Days", codAvailable: false, expressAvailable: false },
];

export const BANK_TRANSFER_DETAILS = {
  bankName: "Meezan Bank Limited",
  accountTitle: "VELOUR APPAREL PRIVATE LIMITED",
  accountNumber: "0102-0104859201",
  iban: "PK45MEZN0001020104859201",
  branch: "Clifton Block 4, Karachi",
  raastId: "03008259142", // State Bank Raast P2M ID
};

export const JAZZCASH_DETAILS = {
  tillId: "00284918",
  merchantName: "Velour Luxury Studio",
  mobileNumber: "0300-8259142",
};

export const EASYPAISA_DETAILS = {
  tillId: "948102",
  merchantName: "Velour Apparel",
  mobileNumber: "0345-8259142",
};

/**
 * Validates and formats Pakistani mobile phone numbers
 * Accepts: 03001234567, 0300-1234567, +923001234567, 923001234567
 */
export function validatePakistanPhone(phone: string): { valid: boolean; formatted: string; carrier?: string } {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  
  // Regex matches: +923XXXXXXXXX, 923XXXXXXXXX, or 03XXXXXXXXX
  const regex = /^(?:(?:\+?92)|0)?(3[0-4][0-9]{8})$/;
  const match = cleaned.match(regex);
  
  if (!match) {
    return { valid: false, formatted: phone };
  }
  
  const nationalNumber = match[1]; // 3XXXXXXXXX
  const prefix = nationalNumber.substring(0, 3);
  
  // Carrier detection
  let carrier = "Mobile";
  if (/^30[0-9]/.test(prefix)) carrier = "Jazz";
  else if (/^34[0-9]/.test(prefix)) carrier = "Telenor";
  else if (/^31[0-9]/.test(prefix)) carrier = "Zong";
  else if (/^33[0-9]/.test(prefix)) carrier = "Ufone";
  else if (/^32[0-9]/.test(prefix)) carrier = "Warid/Jazz";

  // Formatted as: +92 300 1234567
  const formatted = `+92 ${nationalNumber.substring(0, 3)} ${nationalNumber.substring(3, 10)}`;

  return { valid: true, formatted, carrier };
}

/**
 * Generates an authentic Pakistani courier tracking number
 */
export function generateTrackingNumber(courier: CourierPartner, city: string): string {
  const cityCode = city.substring(0, 3).toUpperCase();
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  switch (courier) {
    case "TCS":
      return `TCS-${cityCode}-${randomDigits}`;
    case "Leopards":
      return `LCS-${randomDigits}${cityCode}`;
    case "PostEx":
      return `PEX-${randomDigits}`;
    case "Trax":
      return `TRX-${cityCode}${randomDigits}`;
  }
}

export interface Milestone {
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
  current: boolean;
}

/**
 * Returns tracking milestones for an order based on its status
 */
export function getOrderMilestones(order: Order): Milestone[] {
  const status = order.status;
  const isCancelled = status === "cancelled";
  const isDelivered = status === "delivered";
  const isDispatched = status === "dispatched" || isDelivered;
  const isProcessing = status === "processing" || isDispatched;
  const isConfirmed = status === "confirmed" || isProcessing;

  const baseDate = new Date(order.createdAt || Date.now());
  const formatD = (offsetDays: number) => {
    const d = new Date(baseDate.getTime() + offsetDays * 86400000);
    return d.toLocaleDateString("en-PK", { month: "short", day: "numeric", year: "numeric" });
  };

  return [
    {
      title: "Order Placed",
      description: `Order ${order.orderNumber} placed via ${order.paymentMethod.toUpperCase()}`,
      date: formatD(0),
      time: "10:30 AM",
      completed: true,
      current: status === "pending",
    },
    {
      title: order.paymentMethod === "cod" ? "COD Phone Verified" : "Payment Verified",
      description: order.paymentMethod === "cod" 
        ? "Verified via 1-click WhatsApp OTP" 
        : "Electronic transfer authenticated",
      date: formatD(0),
      time: "11:15 AM",
      completed: isConfirmed,
      current: status === "confirmed",
    },
    {
      title: "Quality Check & Luxury Packaging",
      description: "Inspected and hand-wrapped with scented tissue & garment bag at Karachi Hub",
      date: formatD(1),
      time: "03:45 PM",
      completed: isProcessing,
      current: status === "processing",
    },
    {
      title: `Dispatched via ${order.courier} Express`,
      description: `AWB ${order.trackingNumber} handed over for transit to ${order.shipping.city}`,
      date: formatD(1),
      time: "07:30 PM",
      completed: isDispatched,
      current: status === "dispatched",
    },
    {
      title: "Delivered to Doorstep",
      description: `Successfully received by ${order.customer.name}`,
      date: formatD(2),
      time: "02:15 PM",
      completed: isDelivered,
      current: isDelivered,
    },
  ];
}
