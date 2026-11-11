export const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export const formatDate = (date) => {
  try {
    return new Date(date || Date.now()).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return '';
  }
};

export const formatDateTime = (date) => {
  try {
    return new Date(date || Date.now()).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  } catch {
    return '';
  }
};

export const generateTransactionId = (method = 'UPI') => {
  const prefix = method.toUpperCase().replace(/\s+/g, '');
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${timestamp}${random}`;
};
