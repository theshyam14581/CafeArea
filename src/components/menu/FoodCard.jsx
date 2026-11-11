import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock3, Heart, Plus } from 'lucide-react';
import { money } from '../../utils/formatters.js';
import { categoryImage } from '../../data/images.js';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function FoodCard({ item, index = 0 }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [liked, setLiked] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item, 1);
    showToast(`${item.name} added to your bag`);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <article className="food-card" style={{ '--delay': `${index * 70}ms` }}>
      <Link to={`/item/${item.id}`} className="food-image">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = categoryImage(item.category);
          }}
        />
        <span className="food-tag">{item.tag || item.category}</span>
        <button
          className={`heart-button ${liked ? 'liked' : ''}`}
          aria-label={liked ? 'Remove from favorites' : 'Save item'}
          onClick={handleLike}
        >
          <Heart size={17} />
        </button>
      </Link>

      <div className="food-info">
        <div className="food-title">
          <Link to={`/item/${item.id}`}>
            <h3>{item.name}</h3>
          </Link>
          <strong>{money(item.price)}</strong>
        </div>

        <p>{item.description}</p>

        <div className="food-bottom">
          <span>
            <span className={`veg-dot ${item.isVeg ? 'veg' : 'non-veg'}`} />
            {item.isVeg ? 'Veg' : 'Non-veg'} <i>·</i> <Clock3 size={12} />{' '}
            {item.prepTime || '15 min'}
          </span>
          <button
            className="add-button"
            onClick={handleAdd}
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
