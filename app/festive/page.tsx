import type { Metadata } from "next";
import ListingPage from "@/components/ListingPage";
import type { SortKey } from "@/lib/api";

export const metadata: Metadata = {
  title: "Festive & Wedding Pret | VELOUR",
  description:
    "Heirloom velvet, organza, and raw silk ensembles adorned with hand-cut sequins and tilla embellishments.",
};

const SORTS: SortKey[] = ["featured", "price-asc", "price-desc", "newest", "discount"];

export default async function FestivePage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const sub = sp.sub ?? "all";
  const sort = (SORTS.includes(sp.sort as SortKey) ? sp.sort : "featured") as SortKey;
  return <ListingPage category="festive" sub={sub} sort={sort} />;
}
