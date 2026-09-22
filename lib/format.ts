export function money(centsOrDollars: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(centsOrDollars) ? 0 : 2,
  }).format(centsOrDollars);
}
