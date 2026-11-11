import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { money } from '../../utils/formatters.js';

export default function AdminReports({ orders }) {
  const data = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    const dayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === d.toDateString()
    );
    return {
      day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      amount: dayOrders.reduce((n, o) => n + (o.totals?.total || o.total || 0), 0),
      count: dayOrders.length
    };
  });

  const max = Math.max(...data.map((x) => x.amount), 1);

  const downloadCsv = () => {
    const rows = [
      ['Order', 'Customer', 'Date', 'Status', 'Payment', 'Total'],
      ...orders.map((o) => [
        o.orderNumber || o._id,
        o.customer?.name || o.name,
        o.createdAt,
        o.status,
        o.payment,
        o.totals?.total || o.total
      ])
    ];
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'the-good-cup-sales.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const totalSales = orders.reduce((n, o) => n + (o.totals?.total || o.total || 0), 0);
  const completedOrders = orders.filter((o) => o.status === 'Completed').length;
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <span>Orders recorded</span>
          <strong>{orders.length}</strong>
          <small>All time</small>
        </div>
        <div className="stat-card">
          <span>Sales recorded</span>
          <strong>{money(totalSales)}</strong>
          <small>All time</small>
        </div>
        <div className="stat-card">
          <span>Completed</span>
          <strong>{completedOrders}</strong>
          <small>Orders</small>
        </div>
        <div className="stat-card">
          <span>Cancelled</span>
          <strong>{cancelledOrders}</strong>
          <small>Orders</small>
        </div>
      </div>

      <div className="admin-panel report-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">A LITTLE LOOK BACK</span>
            <h2>Last 7 days performance</h2>
          </div>
          <button className="button button-outline" onClick={downloadCsv}>
            Download CSV <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="bar-chart">
          {data.map((d) => (
            <div className="bar-col" key={d.day}>
              <div className="bar-track">
                <div
                  className="bar"
                  style={{
                    height: `${Math.max((d.amount / max) * 100, d.amount ? 6 : 2)}%`
                  }}
                  title={money(d.amount)}
                />
              </div>
              <span>{d.day}</span>
              <small>{d.count} orders</small>
            </div>
          ))}
        </div>
        <div className="form-hint">
          Reports reflect all orders processed by the cafe.
        </div>
      </div>
    </>
  );
}
