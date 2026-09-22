"use client";

import Link from "next/link";
import { money } from "@/lib/format";
import { useCart } from "@/lib/store";
import SmartImage from "./SmartImage";
import { IconMinus, IconPlus, IconTrash } from "./Icons";

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_FLAT = 8;

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart();

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container cart-page">
        <div className="empty-state">
          <h2>Your bag is empty</h2>
          <p>Fill it with something beautiful.</p>
          <Link href="/women" className="btn">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1>Your Bag</h1>
      <div className="cart-layout">
        <div>
          {items.map((item) => (
            <div className="cart-item" key={`${item.productId}-${item.size}`}>
              <Link href={`/product/${item.productId}`} className="cart-item-img">
                <SmartImage src={item.image} alt={item.name} fill sizes="96px" style={{ objectFit: "cover" }} />
              </Link>
              <div>
                <Link href={`/product/${item.productId}`} className="cart-item-name">
                  {item.name}
                </Link>
                <p className="cart-item-meta">Size {item.size}</p>
                <div className="qty-stepper" style={{ marginBottom: 0 }}>
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                  >
                    <IconMinus />
                  </button>
                  <span>{item.qty}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                  >
                    <IconPlus />
                  </button>
                </div>
              </div>
              <div className="cart-item-right">
                <span className="cart-item-price">{money(item.price * item.qty)}</span>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeItem(item.productId, item.size)}
                >
                  <IconTrash width={15} height={15} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : money(shipping)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
          <Link href="/checkout" className="btn btn-wide">Proceed to Checkout</Link>
          <p className="shipping-note">
            {shipping > 0
              ? `Add ${money(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.`
              : "You've unlocked free shipping."}
          </p>
        </aside>
      </div>
    </div>
  );
}
