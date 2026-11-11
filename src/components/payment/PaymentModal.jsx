import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  QrCode,
  CreditCard,
  Building2,
  Smartphone,
  Copy,
  Check,
  ShieldCheck,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { money, generateTransactionId } from '../../utils/formatters.js';
import { getUpiQrUrl, generateUpiString } from '../../utils/qrCode.js';

export default function PaymentModal({ isOpen, onClose, total, onPaymentSuccess, customerName }) {
  const [activeTab, setActiveTab] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [statusText, setStatusText] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 min timer

  // Form states
  const [userUpiId, setUserUpiId] = useState('');
  const [cardData, setCardData] = useState({ number: '', name: customerName || '', expiry: '', cvv: '' });
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');

  const cafeUpiId = 'thegoodcup@okaxis';

  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setOtpStep(false);
      setCountdown(300);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const copyUpi = () => {
    navigator.clipboard?.writeText(cafeUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = String(countdown % 60).padStart(2, '0');

  // Simulate payment processing
  const completePayment = (method, details = {}) => {
    setStatus('processing');
    setStatusText('Contacting payment gateway...');

    setTimeout(() => {
      setStatusText('Verifying payment approval with bank...');
    }, 1000);

    setTimeout(() => {
      const txnId = generateTransactionId(method);
      setStatus('success');
      setStatusText('Payment Verified!');

      setTimeout(() => {
        onPaymentSuccess({
          paymentMethod: method,
          paymentStatus: 'Paid',
          transactionId: txnId,
          details
        });
      }, 1200);
    }, 2200);
  };

  const handleCardNumber = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardData({ ...cardData, number: val });
  };

  const handleExpiry = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setCardData({ ...cardData, expiry: val });
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    setOtpStep(true);
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    completePayment('Card', { last4: cardData.number.slice(-4) });
  };

  return (
    <div className="payment-overlay" role="dialog" aria-modal="true">
      <div className="payment-modal">
        {/* Header */}
        <div className="payment-modal-header">
          <div>
            <span className="eyebrow">SECURE PAYMENT</span>
            <h3>Complete your payment</h3>
          </div>
          <button className="payment-close-btn" onClick={onClose} aria-label="Close payment modal">
            <X size={20} />
          </button>
        </div>

        {/* Amount strip */}
        <div className="payment-amount-strip">
          <span>Amount Payable</span>
          <strong>{money(total)}</strong>
        </div>

        {status === 'processing' || status === 'success' ? (
          <div className="payment-status-view">
            {status === 'processing' ? (
              <>
                <Loader2 size={46} className="spinner-icon" />
                <h4>Processing Payment</h4>
                <p>{statusText}</p>
                <small>Please do not refresh or close this window.</small>
              </>
            ) : (
              <>
                <div className="success-check-badge">
                  <CheckCircle2 size={54} />
                </div>
                <h4>Payment Successful!</h4>
                <p>Your order has been confirmed.</p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="payment-tabs">
              <button
                className={`payment-tab ${activeTab === 'upi' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('upi');
                  setOtpStep(false);
                }}
              >
                <QrCode size={16} />
                <span>UPI / QR</span>
              </button>
              <button
                className={`payment-tab ${activeTab === 'card' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('card');
                  setOtpStep(false);
                }}
              >
                <CreditCard size={16} />
                <span>Cards</span>
              </button>
              <button
                className={`payment-tab ${activeTab === 'netbanking' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('netbanking');
                  setOtpStep(false);
                }}
              >
                <Building2 size={16} />
                <span>Net Banking</span>
              </button>
            </div>

            {/* TAB: UPI */}
            {activeTab === 'upi' && (
              <div className="payment-body">
                <div className="upi-qr-section">
                  <div className="qr-container">
                    <img
                      src={getUpiQrUrl(total, cafeUpiId)}
                      alt="UPI QR Code"
                      className="qr-image"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=upi://pay?pa=thegoodcup@okaxis';
                      }}
                    />
                    <div className="qr-timer">
                      QR expires in <span>{minutes}:{seconds}</span>
                    </div>
                  </div>

                  <div className="upi-details">
                    <p className="qr-instruction">
                      Scan with any UPI App (GPay, PhonePe, Paytm, BHIM, CRED)
                    </p>

                    <div className="upi-id-box">
                      <div>
                        <small>CAFE UPI ID</small>
                        <b>{cafeUpiId}</b>
                      </div>
                      <button className="copy-btn" onClick={copyUpi} type="button">
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <div className="upi-apps-row">
                      <span className="app-badge">Google Pay</span>
                      <span className="app-badge">PhonePe</span>
                      <span className="app-badge">Paytm</span>
                      <span className="app-badge">BHIM</span>
                    </div>

                    <div className="upi-input-block">
                      <label>Or enter your UPI ID</label>
                      <div className="upi-input-group">
                        <input
                          placeholder="yourname@okhdfcbank"
                          value={userUpiId}
                          onChange={(e) => setUserUpiId(e.target.value)}
                        />
                        <button
                          className="button button-dark upi-pay-btn"
                          type="button"
                          onClick={() => completePayment('UPI', { upiId: userUpiId || cafeUpiId })}
                        >
                          Request
                        </button>
                      </div>
                    </div>

                    <button
                      className="button button-green full-button simulate-btn"
                      type="button"
                      onClick={() => completePayment('UPI', { note: 'Scanned QR Code' })}
                    >
                      <CheckCircle2 size={16} /> I have completed the UPI payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CARD */}
            {activeTab === 'card' && (
              <div className="payment-body">
                {!otpStep ? (
                  <form onSubmit={handleCardSubmit} className="card-form">
                    <div className="virtual-card">
                      <div className="card-top">
                        <span className="card-chip">■■■</span>
                        <span className="card-brand">DEBIT / CREDIT</span>
                      </div>
                      <div className="card-number-display">
                        {cardData.number || '•••• •••• •••• ••••'}
                      </div>
                      <div className="card-bottom">
                        <div>
                          <small>CARD HOLDER</small>
                          <b>{cardData.name || 'YOUR NAME'}</b>
                        </div>
                        <div>
                          <small>EXPIRES</small>
                          <b>{cardData.expiry || 'MM/YY'}</b>
                        </div>
                      </div>
                    </div>

                    <label>
                      Card Number
                      <input
                        placeholder="4532 8920 1234 5678"
                        required
                        value={cardData.number}
                        onChange={handleCardNumber}
                        maxLength={19}
                      />
                    </label>

                    <label>
                      Name on Card
                      <input
                        placeholder="Full Name"
                        required
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      />
                    </label>

                    <div className="card-row">
                      <label>
                        Expiry Date
                        <input
                          placeholder="MM/YY"
                          required
                          value={cardData.expiry}
                          onChange={handleExpiry}
                          maxLength={5}
                        />
                      </label>
                      <label>
                        CVV / CVC
                        <input
                          type="password"
                          placeholder="•••"
                          required
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={(e) =>
                            setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })
                          }
                        />
                      </label>
                    </div>

                    <button className="button button-dark full-button" type="submit">
                      Proceed to Pay {money(total)} <ArrowRight size={16} />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpVerify} className="otp-form">
                    <div className="otp-header">
                      <ShieldCheck size={36} color="#4c7658" />
                      <h4>Bank OTP Verification</h4>
                      <p>
                        We sent a 4-digit code to your registered mobile number for card ending in{' '}
                        <b>{cardData.number.slice(-4) || '••••'}</b>.
                      </p>
                    </div>

                    <label>
                      Enter One-Time Password (OTP)
                      <input
                        placeholder="Enter 4-digit OTP"
                        required
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="otp-input"
                      />
                    </label>

                    <div className="otp-helper">
                      <span>Demo OTP: <b>1234</b></span>
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => setOtp('1234')}
                      >
                        Auto-fill OTP
                      </button>
                    </div>

                    <button className="button button-green full-button" type="submit">
                      Verify & Confirm Payment <Check size={16} />
                    </button>
                    <button
                      type="button"
                      className="button button-outline full-button"
                      onClick={() => setOtpStep(false)}
                    >
                      ← Back to Card Details
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB: NET BANKING */}
            {activeTab === 'netbanking' && (
              <div className="payment-body">
                <p className="form-hint" style={{ marginBottom: 14 }}>
                  Select your bank to proceed with secure net banking payment.
                </p>
                <div className="banks-grid">
                  {[
                    { id: 'HDFC', name: 'HDFC Bank' },
                    { id: 'SBI', name: 'State Bank of India' },
                    { id: 'ICICI', name: 'ICICI Bank' },
                    { id: 'Axis', name: 'Axis Bank' },
                    { id: 'Kotak', name: 'Kotak Mahindra' },
                    { id: 'PNB', name: 'Punjab National Bank' }
                  ].map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      className={`bank-card ${selectedBank === bank.id ? 'selected' : ''}`}
                      onClick={() => setSelectedBank(bank.id)}
                    >
                      <Building2 size={20} />
                      <span>{bank.name}</span>
                    </button>
                  ))}
                </div>

                <button
                  className="button button-dark full-button"
                  type="button"
                  onClick={() => completePayment('Online', { bank: selectedBank })}
                >
                  Pay {money(total)} via {selectedBank} <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Footer security note */}
            <div className="payment-footer-note">
              <ShieldCheck size={15} />
              <span>256-Bit SSL Encrypted & RBI Guidelines Compliant</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
