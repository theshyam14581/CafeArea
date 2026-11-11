// Generates a clean, scannable QR Code image URL or reliable SVG fallback
export function getUpiQrUrl(amount, upiId = 'thegoodcup@okaxis', name = 'The Good Cup') {
  const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=Cafe%20Order`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(upiString)}`;
}

export function generateUpiString(amount, upiId = 'thegoodcup@okaxis', name = 'The Good Cup') {
  return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=Cafe%20Order`;
}
