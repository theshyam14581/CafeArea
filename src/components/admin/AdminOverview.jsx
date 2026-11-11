import React from 'react';
import { ArrowRight } from 'lucide-react';
import { money } from '../../utils/formatters.js';
import { menuItems } from '../../data/menu.js';
import { categoryImage, fallbackSvg } from '../../data/images.js';

export default function AdminOverview({ orders, setTab }) {
  const today = new Date().toDateString();
  const todays = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const revenue = todays.reduce((n, o) => n + (o.totals?.total || o.total || 0), 0);

  const stats = [
    ['Today’s sales', money(revenue), '↗', 'Updated just now'],
    ['Orders today', todays.length, '▤', 'Since the doors opened'],
    [
      'Need a little love',
      orders.filter((o) => ['Pending', 'Confirmed'].includes(o.status)).length,
      '◷',
      'Ready for your attention'
    ],
    ['All time orders', orders.length, '✓', 'Looking good']
  ];

  return (
    <>
      <div className="stats-grid">
        {stats.map((x, i) => (
          <div className="stat-card" key={x[0]}>
            <span>{x[0]}</span>
            <strong>{x[1]}</strong>
            <small className={`stat-icon stat-${i}`}>{x[2]}</small>
            <small>{x[3]}</small>
          </div>
        ))}
      </div>

      <div className="admin-content-grid">
        <div className="admin-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">THE LATEST</span>
              <h2>Recent orders</h2>
            </div>
            <button className="text-link" onClick={() => setTab('Orders')}>
              See all <ArrowRight size={14} />
            </button>
          </div>

          {orders.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ORDER</th>
                    <th>GUEST</th>
                    <th>WHEN</th>
                    <th>TOTAL</th>
                    <th>PAYMENT</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 6).map((o, i) => (
                    <tr key={o._id || i}>
                      <td>
                        <b>{o.orderNumber || o._id?.slice(-7) || '—'}</b>
                      </td>
                      <td>
                        {o.customer?.name || o.name || 'Guest'}
                        <small>{o.customer?.phone || o.phone}</small>
                      </td>
                      <td>
                        {new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </td>
                      <td>{money(o.totals?.total || o.total)}</td>
                      <td>
                        <span className={`payment-tag ${(o.paymentStatus || 'pending').toLowerCase()}`}>
                          {o.payment || 'Cash'} · {o.paymentStatus || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${(o.status || 'pending').toLowerCase()}`}>
                          {o.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty">
              <span>☕</span>
              <b>It’s a fresh start.</b>
              <p>Your orders will find their way here.</p>
            </div>
          )}
        </div>

        <div className="admin-panel best-panel">
          <div className="eyebrow">THE CROWD FAVOURITES</div>
          <h2>Little bestsellers.</h2>
          {menuItems
            .filter((x) => x.featured)
            .slice(0, 4)
            .map((m, i) => (
              <div className="best-item" key={m.id}>
                <span className="best-number">0{i + 1}</span>
                <img
                  src={m.image}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.fallback) {
                      e.currentTarget.dataset.fallback = 'category';
                      e.currentTarget.src = categoryImage(m.category);
                    } else {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackSvg(m.name || m.category);
                    }
                  }}
                  alt=""
                />
                <div>
                  <b>{m.name}</b>
                  <small>{m.category}</small>
                </div>
                <strong>{money(m.price)}</strong>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
