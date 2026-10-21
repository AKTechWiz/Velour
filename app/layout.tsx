import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { WishlistProvider } from "@/lib/wishlist";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MiniBagDrawer from "@/components/MiniBagDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#12100e" },
  ],
};

export const metadata: Metadata = {
  title: { default: "VELOUR — Luxury Pakistani Apparel & Contemporary Pret", template: "%s · VELOUR" },
  description:
    "Discover luxury ready-to-wear, unstitched lawn, festive ensembles, and bespoke menswear. Express nationwide delivery across Pakistan.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", sizes: "32x32",   type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('velour-theme');var p=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var t=s||p;document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${serif.variable} ${sans.variable}`}>
        <StoreProvider>
          <WishlistProvider>
            <AnnouncementBar />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <MiniBagDrawer />
            <WishlistDrawer />
            <FloatingWhatsApp />
          </WishlistProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

