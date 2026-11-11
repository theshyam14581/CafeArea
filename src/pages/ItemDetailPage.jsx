import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock3, Leaf, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useMenuData } from '../hooks/useMenuData.js';
import { money } from '../utils/formatters.js';
import { categoryImage } from '../data/images.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: dishes } = useMenuData();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [qty, setQty] = useState(1);

  const item = dishes.find((x) => x.id === id);

  if (!item) {
    return (
      <main className="page-main">
        <div className="empty-state">
          <h3>That dish isn't on our menu.</h3>
          <p>It may have been moved or is seasonally unavailable.</p>
          <Link className="button button-dark" to="/menu">
            Browse our full menu
          </Link>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(item, qty);
    showToast(`${qty} × ${item.name} added to your bag`);
  };

  return (
    <main className="detail-page">
      <div className="detail-image">
        <img
          src={item.image}
          alt={item.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = categoryImage(item.category);
          }}
        />
        <span className="food-tag">{item.category}</span>
      </div>

      <div className="detail-copy">
        <button
          className="text-link"
          style={{ marginBottom: 16, border: 'none', cursor: 'pointer' }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="eyebrow">FRESH FROM OUR KITCHEN</div>
        <h1>{item.name}</h1>

        <div className="detail-rating">
          <span className="stars">★★★★★</span>
          <small>4.9 · Guest favourite (250+ reviews)</small>
        </div>

        <p className="detail-description">{item.description}</p>

        <div className="detail-meta">
          <span>
            <Clock3 size={16} /> Ready in {item.prepTime || '15 min'}
          </span>
          <span>
            <span className={`veg-dot ${item.isVeg ? 'veg' : 'non-veg'}`} />
            {item.isVeg ? '100% Vegetarian' : 'Non-Vegetarian'}
          </span>
          {item.spiceLevel && <span>Spice: {item.spiceLevel}</span>}
        </div>

        <div className="detail-price">
          {money(item.price)} <small>per serving</small>
        </div>

        <div className="quantity-row">
          <div className="quantity">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              aria-label="Decrease quantity"
            >
              <Minus size={15} />
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty(qty + 1)} aria-label="Increase quantity">
              <Plus size={15} />
            </button>
          </div>

          <button className="button button-dark" onClick={handleAddToCart}>
            Add to bag · {money(item.price * qty)} <ShoppingBag size={16} />
          </button>
        </div>

        <div className="detail-note">
          <Leaf size={17} />
          <span>Made fresh to order with thoughtfully sourced natural ingredients.</span>
        </div>
      </div>
    </main>
  );
}
