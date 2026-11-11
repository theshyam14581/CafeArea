import React from 'react';
import { money } from '../../utils/formatters.js';

export default function AdminCustomers({ orders }) {
  const map = new Map();

  orders.forEach((o) => {
    const c = o.customer || o;
    const key = c.phone || c.name;
    if (key) {
      const existing = map.get(key) || { name: c.name, phone: c.phone, count: 0, total: 0 };
      map.set(key, {
        name: c.name,
        phone: c.phone,
        count: existing.count + 1,
        total: existing.total + (o.totals?.total || o.total || 0)
      });
    }
  });

  const customers = [...map.values()];

  return (
    <div className="admin-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">OUR LITTLE COMMUNITY</span>
          <h2>Guests</h2>
        </div>
        <span className="result-count">{customers.length} guests</span>
      </div>

      {customers.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>GUEST</th>
                <th>WHATSAPP</th>
                <th>ORDERS</th>
                <th>LIFETIME SPEND</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={i}>
                  <td>
                    <b>{c.name}</b>
                  </td>
                  <td>{c.phone}</td>
                  <td>{c.count}</td>
                  <td>{money(c.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">
          <span>♡</span>
          <b>Good company takes time.</b>
          <p>Guests who place an order will appear here.</p>
        </div>
      )}
    </div>
  );
}
