import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Coffee } from 'lucide-react';
import { useMenuData } from '../hooks/useMenuData.js';
import { categories } from '../data/menu.js';
import FoodCard from '../components/menu/FoodCard.jsx';

export default function MenuPage() {
  const { items: dishes, loading } = useMenuData();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') || 'All';
  const [category, setCategory] = useState(categoryParam);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');

  // Sync category if URL search param changes
  useEffect(() => {
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filtered = useMemo(() => {
    return dishes
      .filter((i) => {
        const matchesCategory =
          category === 'All' ||
          i.category.toLowerCase() === category.toLowerCase() ||
          (category === 'Indian' && i.category.toLowerCase().includes('indian'));
        const matchesSearch =
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.description?.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === 'price-low') return a.price - b.price;
        if (sort === 'price-high') return b.price - a.price;
        return Number(b.featured || b.popularity) - Number(a.featured || a.popularity);
      });
  }, [dishes, category, search, sort]);

  return (
    <main className="page-main">
      <div className="page-intro">
        <div className="eyebrow">A MENU CRAFTED WITH LOVE & PASSION</div>
        <h1>
          Good things <em>are cooking.</em>
        </h1>
        <p>Hand-crafted coffees, comforting regional favorites, and fresh cafe bites.</p>
      </div>

      <div className="menu-toolbar">
        <div className="filter-chips">
          {['All', ...categories.map((c) => c.name)].map((c) => (
            <button
              className={category === c ? 'active' : ''}
              onClick={() => handleCategorySelect(c)}
              key={c}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="menu-controls">
          <label className="search-box">
            <Search size={16} />
            <input
              placeholder="Find dishes, coffee, sweets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort menu"
          >
            <option value="popular">Most loved</option>
            <option value="price-low">Price: Low to high</option>
            <option value="price-high">Price: High to low</option>
          </select>
        </div>
      </div>

      <p className="result-count">
        {filtered.length} delicious {filtered.length === 1 ? 'choice' : 'choices'} to savor
      </p>

      {filtered.length ? (
        <div className="food-grid menu-grid">
          {filtered.map((item, i) => (
            <FoodCard item={item} key={item.id} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Coffee size={36} />
          <h3>No dishes found</h3>
          <p>Try searching for something else or clear the category filter.</p>
          <button
            className="button button-outline"
            onClick={() => {
              setSearch('');
              handleCategorySelect('All');
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </main>
  );
}
