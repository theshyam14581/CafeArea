import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';

export default function AdminSidebar({ tab, setTab, ordersCount = 0, onLogout }) {
  const navItems = [
    { name: 'Overview', icon: '◫' },
    { name: 'Orders', icon: '▤', count: ordersCount },
    { name: 'Menu', icon: '☷' },
    { name: 'Customers', icon: '♙' },
    { name: 'Reports', icon: '⌁' },
    { name: 'Settings', icon: '⚙' }
  ];

  return (
    <aside className="admin-sidebar">
      <Link className="brand" to="/">
        <span className="brand-icon">
          <Coffee size={19} />
        </span>
        <span>
          the good<span className="brand-script">cup</span>
          <small>OWNER STUDIO</small>
        </span>
      </Link>

      <div className="sidebar-caption">YOUR CAFE</div>

      <nav>
        {navItems.map((item) => (
          <button
            key={item.name}
            className={tab === item.name ? 'selected' : ''}
            onClick={() => setTab(item.name)}
          >
            <span>{item.icon}</span>
            {item.name}
            {item.name === 'Orders' && item.count > 0 && <i>{item.count}</i>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="online-label">
          <span className="open-dot" /> Cafe is open
        </div>
        <button onClick={onLogout}>Sign out ↗</button>
        <Link to="/">← View cafe site</Link>
      </div>
    </aside>
  );
}
