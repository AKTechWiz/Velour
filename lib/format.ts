export const FREE_SHIPPING_THRESHOLD_PKR = 5000;
export const STANDARD_SHIPPING_FEE_PKR = 250;

export function money(amount: number): string {
  const rounded = Math.round(amount);
  return `Rs. ${rounded.toLocaleString("en-PK")}`;
}

export function formatPkr(amount: number): string {
  return money(amount);
}

