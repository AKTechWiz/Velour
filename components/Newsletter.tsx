"use client";

import { useState } from "react";
import { useToast } from "@/lib/store";

export default function Newsletter() {
  const { push } = useToast();
  const [email, setEmail] = useState("");

  return (
    <section className="section newsletter">
      <div className="container">
        <h2>Join the VELOUR List</h2>
        <p>Early access to new drops, private sales and styling notes. No noise.</p>
        <form
          className="newsletter-form"
          onSubmit={(e) => {
            e.preventDefault();
            push("Thanks for subscribing — welcome to VELOUR");
            setEmail("");
          }}
        >
          <input
            type="email"
            placeholder="Email address"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
