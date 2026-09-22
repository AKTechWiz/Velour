import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin Dashboard · VELOUR",
  description: "VELOUR admin — manage products, images, and inventory.",
  robots: { index: false, follow: false },
};

/**
 * Admin layout — uses the root app layout (fonts, StoreProvider) but
 * we override the body background via admin.css targeting .admin-body
 * which is set on the <div> wrapper in the admin page.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
