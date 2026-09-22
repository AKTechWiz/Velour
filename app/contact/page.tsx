import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container static-page">
      <h1>Contact</h1>
      <p>
        Questions about an order, a return, or a piece you love? Write to us
        and we will reply within one business day.
      </p>
      <h2>Email</h2>
      <p>care@velour.example</p>
      <h2>Hours</h2>
      <p>Monday – Friday, 9:00 – 18:00 CET.</p>
      <h2>Flagship</h2>
      <p>12 Rue de Mode, Paris (demo address).</p>
    </div>
  );
}
