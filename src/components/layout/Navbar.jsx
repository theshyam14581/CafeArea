import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Coffee, ShoppingBag, ArrowUpRight, Menu as MenuIcon, X } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount } = useCart();

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="topbar">
      <Link className="brand" to="/" onClick={closeMenu}>
        <span className="brand-icon">
          <Coffee size={19} />
        </span>
        <span>
          the good<span className="brand-script">cup</span>
          <small>CAFE & KITCHEN</small>
        </span>
      </Link>

      <button
        className="mobile-toggle icon-button"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={22} /> : <MenuIcon size={22} />}
      </button>

      <nav className={mobileOpen ? 'nav open' : 'nav'}>
        <NavLink to="/" onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/menu" onClick={closeMenu}>
          Our menu
        </NavLink>
        <a href="/#story" onClick={closeMenu}>
          Our story
        </a>
        <a href="/#visit" onClick={closeMenu}>
          Visit us
        </a>
      </nav>

      <div className="top-actions">
        <Link className="admin-link" to="/admin" onClick={closeMenu}>
          Owner studio <ArrowUpRight size={14} />
        </Link>
        <Link
          className="bag-button"
          to="/cart"
          aria-label={`Shopping bag with ${cartCount} items`}
          onClick={closeMenu}
        >
          <ShoppingBag size={19} />
          {cartCount > 0 && <span>{cartCount}</span>}
        </Link>
      </div>
    </header>
  );
}
