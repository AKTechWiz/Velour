import type { Metadata } from "next";
import ListingPage from "@/components/ListingPage";
import type { SortKey } from "@/lib/api";

export const metadata: Metadata = {
  title: "Unstitched Luxury Lawn & Chiffon | VELOUR",
  description:
    "Explore VELOUR's unstitched luxury lawn, chiffon, and khaddar collections with box breakdown and bespoke stitching options.",
};

const SORTS: SortKey[] = ["featured", "price-asc", "price-desc", "newest", "discount"];

export default async function UnstitchedPage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const sub = sp.sub ?? "all";
  const sort = (SORTS.includes(sp.sort as SortKey) ? sp.sort : "featured") as SortKey;
  return <ListingPage category="unstitched" sub={sub} sort={sort} />;
}
