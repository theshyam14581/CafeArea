import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { categoryImage } from '../../data/images.js';

export default function CategoryCard({ category, index = 0, total = 4 }) {
  const paddedIndex = String(index + 1).padStart(2, '0');
  const paddedTotal = String(total).padStart(2, '0');

  return (
    <Link
      className={`category-card cat-${index}`}
      to={`/menu?category=${encodeURIComponent(category.name)}`}
    >
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = categoryImage(category.name);
        }}
      />
      <span className="category-count">
        {paddedIndex} / {paddedTotal}
      </span>
      <span className="category-label">
        <b>{category.name}</b>
        <small>{category.subtitle}</small>
      </span>
      <span className="category-arrow">
        <ArrowUpRight size={17} />
      </span>
    </Link>
  );
}
