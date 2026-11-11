import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, CheckCircle2, AlertCircle, Info, X, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export default function Toast() {
  const { toasts, dismissToast, toastMessage } = useToast();

  if (!toasts || toasts.length === 0) {
    if (!toastMessage) return null;
  }

  return (
    <aside
      className="toast-container"
      aria-label="Notifications"
      role="region"
    >
      {toasts.map((toast) => {
        const isCart = toast.type === 'cart';

        return (
          <div
            key={toast.id}
            className={`toast-card toast-${toast.type || 'info'} ${
              toast.isExiting ? 'toast-exit' : 'toast-enter'
            }`}
            role="status"
            aria-live="polite"
          >
            <div className="toast-icon-wrap">
              {toast.image ? (
                <>
                  <img
                    src={toast.image}
                    alt={toast.title}
                    className="toast-thumb"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="toast-icon-badge toast-icon-corner">
                    {isCart && <ShoppingBag size={11} />}
                    {toast.type === 'success' && <CheckCircle2 size={11} />}
                    {toast.type === 'error' && <AlertCircle size={11} />}
                    {toast.type === 'info' && <Info size={11} />}
                  </span>
                </>
              ) : (
                <span className="toast-icon-badge">
                  {isCart && <ShoppingBag size={18} />}
                  {toast.type === 'success' && <CheckCircle2 size={18} />}
                  {toast.type === 'error' && <AlertCircle size={18} />}
                  {toast.type === 'info' && <Info size={18} />}
                </span>
              )}
            </div>

            <div className="toast-content">
              <div className="toast-header-row">
                <span className="toast-title">{toast.title}</span>
                <button
                  type="button"
                  className="toast-close-btn"
                  onClick={() => dismissToast(toast.id)}
                  aria-label="Close notification"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="toast-message">{toast.message}</p>

              {isCart && (
                <div className="toast-actions">
                  <Link
                    to="/cart"
                    className="toast-cart-link"
                    onClick={() => dismissToast(toast.id)}
                  >
                    <span>View bag</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              )}
            </div>

            <div
              className="toast-progress"
              style={{
                animationDuration: `${toast.duration || 3500}ms`,
              }}
            />
          </div>
        );
      })}
    </aside>
  );
}
