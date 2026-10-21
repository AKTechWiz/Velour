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
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | VELOUR Luxury Pakistani Apparel`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} — VELOUR`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
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

  // Schema.org Product structured data for SEO & Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "VELOUR",
    },
    offers: {
      "@type": "Offer",
      url: `https://velour.pk/product/${product.id}`,
      priceCurrency: "PKR",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        typeof product.stock === "number" && product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "VELOUR Atelier",
      },
    },
  };

  const categoryLabelMap: Record<string, string> = {
    women: "Women",
    men: "Men",
    unstitched: "Unstitched",
    festive: "Festive & Bridal",
    outerwear: "Outerwear & Velvet",
    sale: "Archive Sale",
    accessories: "Accessories",
  };

  const categoryLabel = categoryLabelMap[product.category] || product.category;

  return (
    <>
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container">
        {/* Luxury Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="pdp-breadcrumbs">
          <Link href="/">Home</Link>
          <span className="crumb-sep">/</span>
          <Link href={`/${product.category}`}>{categoryLabel}</Link>
          {product.subcategory && (
            <>
              <span className="crumb-sep">/</span>
              <Link href={`/${product.category}?sub=${encodeURIComponent(product.subcategory.toLowerCase())}`}>
                {product.subcategory}
              </Link>
            </>
          )}
          <span className="crumb-sep">/</span>
          <span className="crumb-current">{product.name}</span>
        </nav>

        {/* 60/40 Split Gallery & Sticky Buy Box */}
        <ProductDetail product={product} />
      </div>

      {/* Cross-Sell Discovery */}
      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 40, borderTop: "1px solid var(--line)" }}>
          <div className="container">
            <ScrollReveal className="section-head">
              <div>
                <p className="section-eyebrow">Curated Recommendations</p>
                <h2 className="section-title">Complete the Look</h2>
              </div>
              <Link href={`/${product.category}`} className="section-link">
                Explore More in {categoryLabel} →
              </Link>
            </ScrollReveal>
            <div className="product-grid">
              {related.map((p, i) => (
                <ScrollReveal key={p.id} delay={(i % 4) * 80}>
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
