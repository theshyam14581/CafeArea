import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { money } from '../../utils/formatters.js';
import { categoryImage, fallbackSvg } from '../../data/images.js';
import { useCart } from '../../context/CartContext.jsx';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <img
        src={item.image}
        alt={item.name}
        referrerPolicy="no-referrer"
        onError={(e) => {
          if (!e.currentTarget.dataset.fallback) {
            e.currentTarget.dataset.fallback = 'category';
            e.currentTarget.src = categoryImage(item.category);
          } else {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackSvg(item.name || item.category);
          }
        }}
      />
      <div className="cart-item-copy">
        <Link to={`/item/${item.id}`}>
          <b>{item.name}</b>
        </Link>
        <small>{item.category}</small>
        <div className="quantity">
          <button
            onClick={() => updateQuantity(item.id, -1)}
            aria-label="Decrease quantity"
          >
            <Minus size={13} />
          </button>
          <span>{item.qty}</span>
          <button
            onClick={() => updateQuantity(item.id, 1)}
            aria-label="Increase quantity"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>
      <strong>{money(item.price * item.qty)}</strong>
      <button
        className="icon-button remove-button"
        onClick={() => removeFromCart(item.id)}
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}
