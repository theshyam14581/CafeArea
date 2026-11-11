import React, { useState } from 'react';
import { Check, Coffee } from 'lucide-react';

export default function AdminSettings({ toast }) {
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cafe-settings') || '{}');
    } catch {
      return {};
    }
  });

  const save = (e) => {
    e.preventDefault();
    localStorage.setItem('cafe-settings', JSON.stringify(settings));
    toast('Cafe preferences saved in this browser');
  };

  const field = (label, key, placeholder = '') => (
    <label>
      {label}
      <input
        value={settings[key] || ''}
        placeholder={placeholder}
        onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
      />
    </label>
  );

  return (
    <form className="admin-panel settings-form" onSubmit={save}>
      <div className="panel-heading">
        <div>
          <span className="eyebrow">MAKE THIS PLACE YOURS</span>
          <h2>Cafe settings</h2>
        </div>
        <button className="button button-dark" type="submit">
          Save changes <Check size={15} />
        </button>
      </div>

      <div className="settings-grid">
        {field('Cafe name', 'name', 'The Good Cup')}
        {field('WhatsApp number', 'whatsapp', '918012345678')}
        {field('UPI ID for payments', 'upiId', 'thegoodcup@okaxis')}
        {field('Address', 'address', '12, Rosewood Lane, Indiranagar, Bengaluru')}
        {field('Contact email', 'email', 'hello@thegoodcup.in')}
        {field('Opening hours', 'hours', 'Daily · 8am – 10pm')}
        {field('GST / tax rate', 'tax', '5%')}
      </div>

      <div className="settings-note">
        <Coffee size={18} />
        <span>Settings customize the live storefront, UPI payment details, and receipt invoices.</span>
      </div>
    </form>
  );
}
