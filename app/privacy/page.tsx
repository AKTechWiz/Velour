import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="container static-page">
      <h1>Privacy Policy</h1>
      <p>
        VELOUR is a demonstration storefront. No personal data is collected,
        transmitted, or stored on any server. Cart contents live only in your
        browser&apos;s localStorage, and checkout payment fields are clearly
        labelled dummies that are never processed.
      </p>
      <h2>What we store</h2>
      <p>
        Only your shopping bag, saved locally on your device so it survives a
        page refresh. You can clear it at any time via your browser settings.
      </p>
      <h2>Third parties</h2>
      <p>
        Product photography is loaded from Unsplash. No analytics, trackers,
        or advertising pixels are used.
      </p>
    </div>
  );
}
