"use client";

import { useRouter } from "next/navigation";
import type { SortKey } from "@/lib/api";

const OPTIONS: [SortKey, string][] = [
  ["featured", "Featured"],
  ["price-asc", "Price: Low to High"],
  ["price-desc", "Price: High to Low"],
  ["newest", "Newest"],
];

export default function SortSelect({
  category,
  sub,
  sort,
}: {
  category: string;
  sub: string;
  sort: SortKey;
}) {
  const router = useRouter();

  return (
    <select
      className="sort-select"
      value={sort}
      aria-label="Sort products"
      onChange={(e) => {
        const params = new URLSearchParams({ sub, sort: e.target.value });
        router.push(`/${category}?${params.toString()}`);
      }}
    >
      {OPTIONS.map(([v, l]) => (
        <option key={v} value={v}>{l}</option>
      ))}
    </select>
  );
}
