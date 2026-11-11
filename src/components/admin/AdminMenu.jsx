import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { money } from '../../utils/formatters.js';
import { menuItems as defaultMenuItems, categories } from '../../data/menu.js';
import { categoryImage, defaultFoodPlaceholder } from '../../data/images.js';

export default function AdminMenu({ toast, token }) {
  const [items, setItems] = useState(defaultMenuItems);
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: categories[0].name,
    description: '',
    image: ''
  });

  useEffect(() => {
    fetch('/api/menu')
      .then((r) => (r.ok ? r.json() : null))
      .then((rows) => {
        if (rows?.length) {
          setItems(
            rows.map((m) => ({
              ...m,
              id: m.itemId,
              _id: m._id,
              isVeg: m.classification !== 'non-veg'
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    const item = {
      itemId: `menu-${Date.now()}`,
      name: form.name,
      price: Number(form.price),
      category: form.category,
      description: form.description,
      classification: 'veg',
      available: true,
      image: form.image || defaultFoodPlaceholder,
      prepTime: 15,
      portionSize: '1 serving'
    };

    try {
      const r = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(item)
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.message || 'Could not save menu item');
      }
      const saved = await r.json();
      setItems([{ ...saved, id: saved.itemId, _id: saved._id, isVeg: true }, ...items]);
      toast('Dish saved to your menu');
    } catch (err) {
      toast(err.message === 'Failed to fetch' ? 'Menu API is offline. Dish saved locally.' : err.message);
      setItems([{ ...item, id: item.itemId, isVeg: true }, ...items]);
    }
    setForm({ name: '', price: '', category: categories[0].name, description: '', image: '' });
  };

  const deleteItem = async (m) => {
    if (!m._id) {
      setItems(items.filter((x) => x.id !== m.id));
      toast('Item removed from demo menu');
      return;
    }
    try {
      const r = await fetch(`/api/menu/${m._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!r.ok) throw new Error();
      setItems(items.filter((x) => x._id !== m._id));
      toast('Dish marked unavailable');
    } catch {
      toast('Could not update the menu. Check the API connection.');
    }
  };

  return (
    <div className="admin-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">ON THE MENU</span>
          <h2>Your menu items ({items.length})</h2>
        </div>
      </div>

      <form className="add-menu-form" onSubmit={addItem}>
        <input
          required
          placeholder="Dish name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          min="1"
          required
          placeholder="Price ₹"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {categories.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="button button-dark" type="submit">
          Add dish <Plus size={15} />
        </button>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>DISH</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>TYPE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id || m._id}>
                <td>
                  <div className="menu-row">
                    <img
                      src={m.image}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = categoryImage(m.category);
                      }}
                      alt=""
                    />
                    <b>{m.name}</b>
                  </div>
                </td>
                <td>{m.category}</td>
                <td>{money(m.price)}</td>
                <td>
                  <span className={`veg-dot ${m.isVeg ? 'veg' : 'non-veg'}`} />{' '}
                  {m.isVeg ? 'Veg' : 'Non-veg'}
                </td>
                <td>
                  <button
                    className="icon-button"
                    onClick={() => deleteItem(m)}
                    aria-label={`Remove ${m.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="form-hint">Menu changes are synchronized with the cafe database.</p>
    </div>
  );
}
