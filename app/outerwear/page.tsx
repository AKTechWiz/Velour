import type { Metadata } from "next";
import ListingPage from "@/components/ListingPage";
import type { SortKey } from "@/lib/api";

export const metadata: Metadata = { title: "Outerwear & Tailoring | VELOUR" };

const SORTS: SortKey[] = ["featured", "price-asc", "price-desc", "newest"];

export default async function OuterwearPage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const sub = sp.sub ?? "all";
  const sort = (SORTS.includes(sp.sort as SortKey) ? sp.sort : "featured") as SortKey;
  return <ListingPage category="outerwear" sub={sub} sort={sort} />;
}
