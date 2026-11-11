import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  QrCode,
  CreditCard,
  Banknote,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { money } from '../utils/formatters.js';
import PaymentModal from '../components/payment/PaymentModal.jsx';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart, subtotal, tax, total } = useCart();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    type: 'Takeaway',
    address: '',
    table: '',
    payment: 'UPI', // 'UPI' | 'Card' | 'Online' | 'Cash'
    instructions: ''
  });

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (method) => {
    setForm((prev) => ({ ...prev, payment: method }));
    if (method === 'Cash') {
      setPaymentVerified(false);
      setPaymentInfo(null);
    }
  };

  const handlePaymentSuccess = (info) => {
    setPaymentInfo(info);
    setPaymentVerified(true);
    setPaymentModalOpen(false);
    setForm((prev) => ({ ...prev, payment: info.paymentMethod }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart.length) return;

    // If online/UPI is chosen but not paid yet, prompt them to pay or choose Cash
    if (form.payment !== 'Cash' && !paymentVerified) {
      setPaymentModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    let savedOrder;

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      type: form.type,
      table: form.type === 'Dine-in' ? form.table : undefined,
      address: form.type === 'Delivery' ? form.address : undefined,
      instructions: form.instructions,
      payment: form.payment === 'Cash' ? 'Cash' : (paymentInfo?.paymentMethod || form.payment),
      paymentStatus: paymentVerified ? 'Paid' : 'Pending',
      transactionId: paymentInfo?.transactionId || '',
      items: cart.map((x) => ({ itemId: x.id, quantity: x.qty }))
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Could not place order');
      }

      savedOrder = await response.json();
    } catch (err) {
      // Graceful fallback for offline / demo mode
      savedOrder = {
        demo: true,
        orderNumber: `GC-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        customer: {
          name: form.name,
          phone: form.phone,
          address: form.address
        },
        items: cart.map((x) => ({
          name: x.name,
          quantity: x.qty,
          price: x.price,
          unitPrice: x.price,
          lineTotal: x.price * x.qty
        })),
        totals: {
          subtotal,
          tax,
          delivery: 0,
          total
        },
        type: form.type,
        table: form.table,
        instructions: form.instructions,
        payment: form.payment,
        paymentStatus: paymentVerified ? 'Paid' : 'Pending',
        transactionId: paymentInfo?.transactionId || (paymentVerified ? `TXN-${Date.now().toString().slice(-6)}` : ''),
        status: paymentVerified ? 'Confirmed' : 'Pending',
        invoiceNumber: `INV-${Date.now().toString().slice(-8)}`
      };
    } finally {
      setIsSubmitting(false);
    }

    try {
      sessionStorage.setItem('last-order', JSON.stringify(savedOrder));
    } catch {
      // ignore storage error
    }

    clearCart();
    navigate('/order-confirmation');
  };

  if (!cart.length) {
    return (
      <main className="page-main">
        <div className="empty-state">
          <ShoppingBag size={38} />
          <h3>Your bag is currently empty.</h3>
          <p>Explore our menu and add something delicious!</p>
          <Link className="button button-dark" to="/menu">
            Browse the menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-main checkout-page">
      <div className="eyebrow">ALMOST TIME FOR THE DELICIOUS PART</div>
      <h1>
        A few <em>little details.</em>
      </h1>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        <div className="form-card">
          <h2>1. Contact details</h2>
          <div className="form-grid">
            <label>
              Your name
              <input
                name="name"
                required
                minLength={2}
                value={form.name}
                onChange={update}
                placeholder="The name we’ll call out"
              />
            </label>
            <label>
              WhatsApp number
              <input
                name="phone"
                required
                pattern="[+0-9 ()-]{8,18}"
                value={form.phone}
                onChange={update}
                placeholder="+91 98765 43210"
              />
            </label>
          </div>

          <h2 className="form-subhead">2. Order dining preference</h2>
          <div className="order-types">
            {['Takeaway', 'Dine-in', 'Delivery'].map((t) => (
              <label className={form.type === t ? 'selected' : ''} key={t}>
                <input
                  type="radio"
                  name="type"
                  value={t}
                  checked={form.type === t}
                  onChange={update}
                />
                <span>{t}</span>
              </label>
            ))}
          </div>

          {form.type === 'Dine-in' && (
            <label className="wide-label">
              Table number
              <input
                name="table"
                value={form.table}
                onChange={update}
                placeholder="e.g. Table 04"
                required
              />
            </label>
          )}

          {form.type === 'Delivery' && (
            <label className="wide-label">
              Delivery address
              <textarea
                name="address"
                value={form.address}
                onChange={update}
                placeholder="House / flat no., street, landmark, area and pincode"
                required
              />
            </label>
          )}

          <label className="wide-label">
            Cooking or special instructions (optional)
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={update}
              placeholder="E.g., less spicy, extra napkins, cutlery required"
            />
          </label>

          <h2 className="form-subhead">3. Payment method</h2>
          <div className="payment-method-selector">
            {[
              {
                id: 'UPI',
                label: 'UPI / QR Code',
                sub: 'GPay, PhonePe, Paytm, CRED',
                icon: <QrCode size={18} />
              },
              {
                id: 'Card',
                label: 'Credit / Debit Card',
                sub: 'Visa, MasterCard, RuPay',
                icon: <CreditCard size={18} />
              },
              {
                id: 'Online',
                label: 'Net Banking',
                sub: 'HDFC, SBI, ICICI, Axis',
                icon: <Building2 size={18} />
              },
              {
                id: 'Cash',
                label: 'Cash at Cafe / COD',
                sub: 'Pay when served or delivered',
                icon: <Banknote size={18} />
              }
            ].map((p) => (
              <div
                key={p.id}
                className={`payment-method-tile ${form.payment === p.id ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange(p.id)}
              >
                <div className="tile-icon">{p.icon}</div>
                <div className="tile-copy">
                  <b>{p.label}</b>
                  <small>{p.sub}</small>
                </div>
                <input
                  type="radio"
                  name="payment"
                  value={p.id}
                  checked={form.payment === p.id}
                  onChange={() => handlePaymentMethodChange(p.id)}
                />
              </div>
            ))}
          </div>

          {/* Payment Verification Banner */}
          {form.payment !== 'Cash' && (
            <div className="payment-action-box">
              {paymentVerified ? (
                <div className="payment-verified-notice">
                  <CheckCircle2 size={20} color="#4c7658" />
                  <div>
                    <b>Payment Verified · {money(total)}</b>
                    <small>
                      Paid via {paymentInfo?.paymentMethod} · Txn #{paymentInfo?.transactionId}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setPaymentModalOpen(true)}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="payment-pending-prompt">
                  <div>
                    <b>Pay online for seamless contactless pickup</b>
                    <p>Instant UPI QR code or Card payment with zero extra charges.</p>
                  </div>
                  <button
                    type="button"
                    className="button button-green pay-now-btn"
                    onClick={() => setPaymentModalOpen(true)}
                  >
                    <QrCode size={16} /> Pay {money(total)} Now
                  </button>
                </div>
              )}
            </div>
          )}

          <p className="form-hint" style={{ marginTop: 15 }}>
            <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
            All online payments are encrypted and 100% secure. You will receive an instant invoice.
          </p>
        </div>

        {/* Order Summary Aside */}
        <aside className="summary-card">
          <h2>
            Your <em>order.</em>
          </h2>

          <div className="summary-items-list">
            {cart.map((x) => (
              <div className="summary-line" key={x.id}>
                <span>
                  {x.qty} × {x.name}
                </span>
                <span>{money(x.price * x.qty)}</span>
              </div>
            ))}
          </div>

          <div className="summary-line">
            <span>Kitchen care & GST (5%)</span>
            <span>{money(tax)}</span>
          </div>

          <div className="summary-total">
            <b>Total to pay</b>
            <strong>{money(total)}</strong>
          </div>

          <button
            className="button button-dark full-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Placing your order...'
            ) : form.payment !== 'Cash' && !paymentVerified ? (
              <>
                Pay & Place Order <ArrowRight size={17} />
              </>
            ) : (
              <>
                Confirm & Place Order <ArrowRight size={17} />
              </>
            )}
          </button>

          <small className="secure-note">
            By placing your order, you agree to receive order notifications on WhatsApp.
          </small>
        </aside>
      </form>

      {/* Online Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        total={total}
        onPaymentSuccess={handlePaymentSuccess}
        customerName={form.name}
      />
    </main>
  );
}
