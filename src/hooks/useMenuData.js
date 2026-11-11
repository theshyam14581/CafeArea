import { useState, useEffect } from 'react';
import { menuItems as defaultMenuItems } from '../data/menu.js';
import { categoryImage } from '../data/images.js';

export function useMenuData() {
  const [items, setItems] = useState(defaultMenuItems);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const defaultMap = new Map(defaultMenuItems.map((m) => [m.id, m]));

    fetch('/api/menu')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !Array.isArray(data) || data.length === 0) return;
        const normalized = data.map((dish) => {
          const id = dish.itemId || dish.id;
          const fallbackItem = defaultMap.get(id);
          const validImage =
            dish.image && typeof dish.image === 'string' && dish.image.startsWith('http')
              ? dish.image
              : (fallbackItem?.image || categoryImage(dish.category));

          return {
            ...dish,
            id,
            image: validImage,
            isVeg: dish.classification ? dish.classification !== 'non-veg' : dish.isVeg,
            prepTime: typeof dish.prepTime === 'number' ? `${dish.prepTime} min` : dish.prepTime || '15 min'
          };
        });
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
