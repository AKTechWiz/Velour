import type { Metadata } from "next";
import ListingPage from "@/components/ListingPage";
import type { SortKey } from "@/lib/api";

export const metadata: Metadata = { title: "Archive & Seasonal Sale | VELOUR" };

const SORTS: SortKey[] = ["featured", "price-asc", "price-desc", "newest"];

export default async function SalePage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const sub = sp.sub ?? "all";
  const sort = (SORTS.includes(sp.sort as SortKey) ? sp.sort : "featured") as SortKey;
  return <ListingPage category="sale" sub={sub} sort={sort} />;
}
