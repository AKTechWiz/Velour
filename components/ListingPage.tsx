import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import SortSelect from "./SortSelect";
import { getProducts, type SortKey } from "@/lib/api";
import { SUBCATEGORIES } from "@/lib/data";

interface Props {
  category: "women" | "men" | "outerwear" | "sale" | "accessories";
  sub: string;
  sort: SortKey;
}

const TITLE_MAP: Record<string, string> = {
  women: "Women",
  men: "Men",
  outerwear: "Outerwear & Tailoring",
  sale: "Archive & Seasonal Sale",
  accessories: "Fine Accessories",
};

export default async function ListingPage({ category, sub, sort }: Props) {
  const products = await getProducts({ category, sub, sort });
  const subs = SUBCATEGORIES[category] || [];
  const title = TITLE_MAP[category] || category;
  const pillHref = (s: string) =>
    s === "all"
      ? `/${category}?sub=all&sort=${sort}`
      : `/${category}?sub=${encodeURIComponent(s.toLowerCase())}&sort=${sort}`;

  return (
    <>
      <div className="container page-head">
        <h1>{title}</h1>
        <p>
          {products.length} piece{products.length === 1 ? "" : "s"} — considered
          staples in wool, silk and organic cotton.
        </p>
      </div>

      <div className="container listing-toolbar">
        <div className="filter-pills" role="tablist" aria-label="Filter by subcategory">
          <Link href={pillHref("all")} className={`pill ${sub === "all" ? "active" : ""}`}>
            All
          </Link>
          {subs.map((s) => (
            <Link
              key={s}
              href={pillHref(s)}
              className={`pill ${sub.toLowerCase() === s.toLowerCase() ? "active" : ""}`}
            >
              {s}
            </Link>
          ))}
        </div>

        <SortSelect category={category} sub={sub} sort={sort} />
      </div>

      <div className="container" style={{ paddingBottom: 96 }}>
        {products.length === 0 ? (
          <p className="listing-empty">Nothing here yet — try another category.</p>
        ) : (
          <div className="product-grid">
            {products.map((p, i) => (
              <ScrollReveal key={p.id} delay={(i % 4) * 80}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
