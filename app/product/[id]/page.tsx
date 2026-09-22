import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import ProductDetail from "@/components/ProductDetail";
import { getProduct, getRelated } from "@/lib/api";

export const revalidate = 60;

export async function generateMetadata({

  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const related = await getRelated(product.id, 4);

  return (
    <>
      <div className="container">
        <p className="pdp-sub" style={{ paddingTop: 28 }}>
          <Link href={`/${product.category}`} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
            {product.category === "women" ? "Women" : "Men"}
          </Link>
          {" / "}{product.subcategory}
        </p>
        <ProductDetail product={product} />
      </div>

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 20 }}>
          <div className="container">
            <ScrollReveal className="section-head">
              <div>
                <p className="section-eyebrow">Complete the Look</p>
                <h2 className="section-title">You May Also Like</h2>
              </div>
            </ScrollReveal>
            <div className="product-grid">
              {related.map((p, i) => (
                <ScrollReveal key={p.id} delay={(i % 4) * 90}>
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
