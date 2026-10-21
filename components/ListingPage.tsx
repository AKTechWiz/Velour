import type { Category } from "@/lib/types";
import { getProducts, type SortKey } from "@/lib/api";
import { SUBCATEGORIES } from "@/lib/data";
import ListingView from "@/components/ListingView";

interface Props {
  category: Category;
  sub?: string;
  sort?: SortKey;
}

interface CategoryMeta {
  title: string;
  description: string;
}

const CATEGORY_META: Record<Category, CategoryMeta> = {
  women: {
    title: "Women's Pret & Formals",
    description:
      "Handcrafted luxury lawn, raw silk co-ords, and artisanal kurtas tailored for effortless grace.",
  },
  unstitched: {
    title: "Unstitched Luxury Editions",
    description:
      "Combed Swiss lawn, pure chiffon, and winter khaddar fabrics with dense botanical and zardozi embroideries.",
  },
  festive: {
    title: "Festive & Wedding Pret",
    description:
      "Heirloom velvet, organza, and raw silk ensembles adorned with hand-cut sequins, tilla, and intricate embellishments.",
  },
  men: {
    title: "Men's Kurtas & Waistcoats",
    description:
      "Impeccably tailored long-staple cotton, linen, and raw silk kurtas paired with structured waistcoats.",
  },
  outerwear: {
    title: "Velvet & Winter Ensembles",
    description:
      "Plush micro-velvets, embroidered pashmina shawls, and structured silhouettes for winter celebrations.",
  },
  sale: {
    title: "Archive & Seasonal Sale",
    description:
      "A curated selection of past-season classics and limited-run luxury pieces at exceptional value.",
  },
  accessories: {
    title: "Fine Handcrafted Accessories",
    description:
      "Artisanal leather khussas, embellished clutches, and woven heirloom shawls.",
  },
};

export default async function ListingPage({ category, sub = "all", sort = "featured" }: Props) {
  // Fetch initial products for this category
  const products = await getProducts({ category });
  const subs = SUBCATEGORIES[category] || [];
  const meta = CATEGORY_META[category] || {
    title: category.toUpperCase(),
    description: "Considered luxury apparel and artisanal staples.",
  };

  return (
    <ListingView
      initialProducts={products}
      category={category}
      currentSub={sub}
      subcategories={subs}
      categoryTitle={meta.title}
      categoryDescription={meta.description}
      initialSort={sort}
    />
  );
}
