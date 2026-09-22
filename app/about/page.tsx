import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container static-page">
      <h1>About VELOUR</h1>
      <p>
        VELOUR is a premium minimal fashion house designing considered apparel
        for men and women. We believe in fewer, better things: silhouettes that
        outlast trends, materials chosen for how they age, and construction
        that earns its keep.
      </p>
      <h2>Our Philosophy</h2>
      <p>
        Every collection starts with fabric — Italian wools, sandwashed silks,
        long-staple cashmeres and organic cottons. We design in a tight
        palette so pieces work together season after season.
      </p>
      <h2>Made to Last</h2>
      <p>
        We produce in small runs with partners we visit, and we stand behind
        every seam with a 30-day return promise. This page is a demo stub.
      </p>
    </div>
  );
}
