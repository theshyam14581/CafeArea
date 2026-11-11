import React, { useState } from 'react';
import { money } from '../../utils/formatters.js';

export default function AdminOrders({ orders, setOrders, token, toast }) {
  const [filter, setFilter] = useState('All');
  const statuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  const updateStatus = async (o, status) => {
    try {
      const r = await fetch(`/api/orders/${o._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!r.ok) throw new Error();
      setOrders(orders.map((x) => (x._id === o._id ? { ...x, status } : x)));
      toast(`Order updated to ${status}`);
    } catch {
      toast('Could not update order. Check the API connection.');
    }
  };

  const updatePayment = async (o, paymentStatus) => {
    try {
      const r = await fetch(`/api/orders/${o._id}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus })
      });
      if (!r.ok) throw new Error();
      setOrders(orders.map((x) => (x._id === o._id ? { ...x, paymentStatus } : x)));
      toast(`Payment marked as ${paymentStatus}`);
    } catch {
      toast('Could not update payment status.');
    }
  };

  const visible = filter === 'All' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="admin-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">EVERYTHING IN ONE PLACE</span>
          <h2>Order book ({visible.length})</h2>
        </div>
        <select
          className="admin-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {['All', ...statuses].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {visible.length ? (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>GUEST</th>
                  <th>TYPE</th>
                  <th>ITEMS</th>
                  <th>TOTAL</th>
                  <th>PAYMENT</th>
                  <th>STATUS</th>
                  <th>UPDATE</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((o, i) => (
                  <tr key={o._id || i}>
                    <td>
                      <b>{o.orderNumber || o._id?.slice(-7) || '—'}</b>
                      {o.transactionId && <small>Txn: {o.transactionId}</small>}
                    </td>
                    <td>
                      {o.customer?.name || o.name || 'Guest'}
                      <small>{o.customer?.phone || o.phone}</small>
                    </td>
                    <td>
                      <span>{o.type || 'Takeaway'}</span>
                      {o.table && <small>Table {o.table}</small>}
                    </td>
                    <td>
                      <small>
                        {(o.items || [])
                          .map((it) => `${it.quantity}x ${it.name}`)
                          .join(', ')}
                      </small>
                    </td>
                    <td>
                      <b>{money(o.totals?.total || o.total)}</b>
                    </td>
                    <td>
                      <select
                        className="admin-inline-select"
                        value={o.paymentStatus || 'Pending'}
                        onChange={(e) => updatePayment(o, e.target.value)}
                      >
                        <option value="Pending">Pending ({o.payment || 'Cash'})</option>
                        <option value="Paid">Paid</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                    <td>
                      <span className={`status-pill ${(o.status || 'pending').toLowerCase()}`}>
                        {o.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <select
                        className="admin-inline-select"
                        value={o.status || 'Pending'}
                        onChange={(e) => updateStatus(o, e.target.value)}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="admin-empty">
          <span>☕</span>
          <b>No orders in this corner.</b>
          <p>New orders will show up here.</p>
        </div>
      )}
    </div>
  );
}
