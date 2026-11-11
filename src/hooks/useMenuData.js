import { useState, useEffect } from 'react';
import { menuItems as defaultMenuItems } from '../data/menu.js';

export function useMenuData() {
  const [items, setItems] = useState(defaultMenuItems);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch('/api/menu')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !Array.isArray(data) || data.length === 0) return;
        const normalized = data.map((dish) => ({
          ...dish,
          id: dish.itemId || dish.id,
          isVeg: dish.classification ? dish.classification !== 'non-veg' : dish.isVeg,
          prepTime: typeof dish.prepTime === 'number' ? `${dish.prepTime} min` : dish.prepTime || '15 min'
        }));
        setItems(normalized);
      })
      .catch(() => {
        // Fall back gracefully to defaultMenuItems
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { items, loading };
}
