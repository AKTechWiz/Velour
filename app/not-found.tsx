import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container cart-page">
      <div className="empty-state">
        <h2>Page not found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link href="/" className="btn">Back to Home</Link>
      </div>
    </div>
  );
}
