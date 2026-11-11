import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { money } from '../utils/formatters.js';
import { useCart } from '../context/CartContext.jsx';
import CartItem from '../components/cart/CartItem.jsx';

export default function CartPage() {
  const { cart, subtotal, tax, total } = useCart();

  return (
    <main className="page-main cart-page">
      <div className="eyebrow">A DELIGHTFUL CHOICE, IF WE DO SAY SO</div>
      <h1>
        Your little <em>bag.</em>
      </h1>

      {!cart.length ? (
        <div className="empty-state">
          <ShoppingBag size={40} />
          <h3>Your bag is waiting for something lovely.</h3>
          <p>Take a look around our fresh kitchen menu — we saved you a seat.</p>
          <Link className="button button-dark" to="/menu">
            Browse the menu <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <CartItem item={item} key={item.id} />
            ))}

            <Link className="text-link continue-link" to="/menu">
              ← Keep looking around the menu
            </Link>
          </div>

          <aside className="summary-card">
            <h2>
              A little <em>summary.</em>
            </h2>

            <div className="summary-line">
              <span>Your delicious food</span>
              <span>{money(subtotal)}</span>
            </div>

            <div className="summary-line">
              <span>Kitchen care & GST (5%)</span>
              <span>{money(tax)}</span>
            </div>

            <div className="summary-line">
              <span>Delivery charge</span>
              <span className="free-label">Calculated at checkout</span>
            </div>

            <div className="summary-total">
              <b>Your total</b>
              <strong>{money(total)}</strong>
            </div>

            <Link className="button button-dark full-button" to="/checkout">
              On to checkout <ArrowRight size={17} />
            </Link>
            <small className="secure-note">
              A few quick details and our kitchen will get cooking.
            </small>
          </aside>
        </div>
      )}
    </main>
  );
}
