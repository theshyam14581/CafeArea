import React from 'react';
import { useToast } from '../../context/ToastContext.jsx';

export default function Toast() {
  const { toastMessage } = useToast();

  return (
    <div
      className="toast"
      role="status"
      aria-live="polite"
      data-show={Boolean(toastMessage)}
    >
      {toastMessage}
    </div>
  );
}
