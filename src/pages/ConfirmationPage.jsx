import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowUpRight, Printer, RefreshCw, MessageSquare, ShieldCheck } from 'lucide-react';
import { money, formatDateTime } from '../utils/formatters.js';

export default function ConfirmationPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('last-order');
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <main className="page-main">
        <div className="empty-state">
          <Check size={40} />
          <h2>Thanks for stopping by!</h2>
          <p>No active order in this browser session.</p>
          <Link className="button button-dark" to="/menu">
            Back to menu
          </Link>
        </div>
      </main>
    );
  }

  const items = order.items || [];
  const total = order.totals?.total || order.total || 0;
  const cafePhone = import.meta.env.VITE_CAFE_WHATSAPP || '916367443262';
  const customerName = order.customer?.name || order.name || 'Friend';
  const firstName = customerName.split(' ')[0];
  const isPaid = order.paymentStatus === 'Paid';

  // Format WhatsApp message
  const whatsappText = encodeURIComponent(
    `*THE GOOD CUP - ORDER RECEIPT*\n` +
      `Order #: ${order.orderNumber || order._id}\n` +
      `Invoice #: ${order.invoiceNumber || 'INV-001'}\n` +
      `Customer: ${customerName}\n` +
      `Dining: ${order.type || order.orderType}${order.table ? ` (Table ${order.table})` : ''}\n` +
      `--------------------------\n` +
      items.map((x) => `• ${x.quantity}x ${x.name} - ${money((x.unitPrice || x.price) * x.quantity)}`).join('\n') +
      `\n--------------------------\n` +
      `*Total: ${money(total)}*\n` +
      `Payment: ${isPaid ? `PAID via ${order.payment || 'Online'}` : 'Cash on delivery / cafe'}\n` +
      (order.transactionId ? `Txn Ref: ${order.transactionId}\n` : '') +
      `\nThank you for choosing The Good Cup!`
  );

  return (
    <main className="page-main confirmation-page">
      <div className="success-icon">
        <Check size={28} />
      </div>

      <div className="eyebrow">YOUR ORDER IS CONFIRMED & IN GOOD HANDS</div>
      <h1>
        Thank you, <em>{firstName}.</em>
      </h1>
      <p className="confirm-intro">
        Our kitchen is already preparing your delicious order with love.
      </p>

      {order.demo && (
        <p className="demo-notice">
          Notice: Operating in offline preview mode. Your receipt and payment details are safely stored in your session.
        </p>
      )}

      {/* Payment Status Banner */}
      <div className={`receipt-payment-banner ${isPaid ? 'paid' : 'pending'}`}>
        <div className="banner-left">
          {isPaid ? <ShieldCheck size={20} /> : <span className="open-dot" />}
          <div>
            <b>
              {isPaid
                ? `Payment Confirmed · ${money(total)}`
                : `Payment Pending · Cash at Cafe / Counter`}
            </b>
            <small>
              Method: {order.payment || 'Cash'}
              {order.transactionId ? ` · Txn ID: ${order.transactionId}` : ''}
            </small>
          </div>
        </div>
        <span className={`status-pill ${isPaid ? 'completed' : 'pending'}`}>
          {isPaid ? 'PAID' : 'PAYMENT DUE'}
        </span>
      </div>

      {/* Printable Receipt Card */}
      <div className="receipt-card">
        <div className="receipt-top">
          <div>
            <span>THE GOOD CUP</span>
            <small>CAFE & ARTISAN KITCHEN</small>
          </div>
          <b>{order.orderNumber || order._id}</b>
        </div>

        <div className="receipt-meta">
          <span>ORDERED: {formatDateTime(order.createdAt)}</span>
          <span className={`status-pill ${(order.status || 'confirmed').toLowerCase()}`}>
            {order.status || 'Confirmed'}
          </span>
        </div>

        <div className="receipt-dining-info">
          <span>Dining: <b>{order.type}</b></span>
          {order.table && <span>Table: <b>{order.table}</b></span>}
          {order.customer?.address && (
            <span>Address: <b>{order.customer.address}</b></span>
          )}
        </div>

        <div className="receipt-divider" />

        {/* Itemized Rows */}
        <div className="receipt-items-table">
          {items.map((x, i) => (
            <div className="receipt-line" key={i}>
              <span>
                {x.quantity} × {x.name}
              </span>
              <strong>{money((x.unitPrice ?? x.price) * x.quantity)}</strong>
            </div>
          ))}
        </div>

        <div className="receipt-divider" />

        <div className="receipt-line muted">
          <span>Subtotal</span>
          <span>{money(order.totals?.subtotal || order.subtotal || total * 0.95)}</span>
        </div>
        <div className="receipt-line muted">
          <span>Kitchen care & GST (5%)</span>
          <span>{money(order.totals?.tax || order.tax || total * 0.05)}</span>
        </div>

        <div className="receipt-total">
          <b>Grand Total</b>
          <strong>{money(total)}</strong>
        </div>

        <div className="receipt-footer-notes">
          <span>Thank you for dining with us! Visit again.</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="confirm-actions">
        <a
          className="button button-green"
          href={`https://wa.me/${cafePhone}?text=${whatsappText}`}
          target="_blank"
          rel="noreferrer"
        >
          <MessageSquare size={16} /> Share Order on WhatsApp <ArrowUpRight size={15} />
        </a>

        <button className="button button-outline" onClick={() => window.print()}>
          <Printer size={16} /> Print Receipt
        </button>

        <Link className="button button-dark" to="/menu">
          <RefreshCw size={15} /> Order More Items
        </Link>
      </div>

      <p className="form-hint" style={{ marginTop: 20 }}>
        Tap WhatsApp to send your order and payment verification directly to the cafe kitchen.
      </p>
    </main>
  );
}
