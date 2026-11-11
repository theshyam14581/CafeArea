import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );
    setTimeout(() => {
      removeToast(id);
    }, 280);
  }, [removeToast]);

  const showToast = useCallback((msgOrOptions, durationOrType = 3500) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    let newToast = {
      id,
      title: 'Added to Bag',
      message: '',
      type: 'cart',
      duration: 3500,
      image: null,
      isExiting: false,
    };

    if (typeof msgOrOptions === 'string') {
      newToast.message = msgOrOptions;
      if (typeof durationOrType === 'number') {
        newToast.duration = durationOrType;
      }

      const lower = msgOrOptions.toLowerCase();
      if (lower.includes('added to') || lower.includes('bag') || lower.includes('cart')) {
        newToast.type = 'cart';
        newToast.title = 'Added to Bag';
      } else if (
        lower.includes('welcome') ||
        lower.includes('signed in') ||
        lower.includes('signed out') ||
        lower.includes('success')
      ) {
        newToast.type = 'success';
        newToast.title = 'Success';
      } else if (
        lower.includes('error') ||
        lower.includes('failed') ||
        lower.includes('invalid')
      ) {
        newToast.type = 'error';
        newToast.title = 'Notice';
      } else {
        newToast.type = 'info';
        newToast.title = 'Notification';
      }
    } else if (typeof msgOrOptions === 'object' && msgOrOptions !== null) {
      newToast = {
        ...newToast,
        ...msgOrOptions,
        id,
      };
      if (!newToast.title) {
        newToast.title = newToast.type === 'cart' ? 'Added to Bag' : 'Notification';
      }
    }

    // Keep up to 3 toasts active at once
    setToasts((prev) => [...prev.slice(-2), newToast]);

    const timer = setTimeout(() => {
      dismissToast(id);
    }, newToast.duration);

    timersRef.current[id] = timer;
    return id;
  }, [dismissToast]);

  const toastMessage = toasts.length > 0 ? toasts[toasts.length - 1].message : '';

  return (
    <ToastContext.Provider value={{ toastMessage, toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
