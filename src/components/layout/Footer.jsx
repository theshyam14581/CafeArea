import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Link className="brand footer-brand" to="/">
            <span className="brand-icon">
              <Coffee size={18} />
            </span>
            <span>
              the good<span className="brand-script">cup</span>
              <small>CAFE & KITCHEN</small>
            </span>
          </Link>
          <p>A little corner for all the good things.</p>
        </div>

        <div className="footer-links">
          <div>
            <b>WANDER AROUND</b>
            <Link to="/menu">Our menu</Link>
            <a href="/#story">Our story</a>
            <a href="/#visit">Find us</a>
          </div>

          <div>
            <b>COME SAY HELLO</b>
            <span>12, Rosewood Lane</span>
            <span>Indiranagar, Bengaluru</span>
            <a href="tel:+918012345678">+91 80 1234 5678</a>
          </div>

          <div>
            <b>FOLLOW THE CRUMBS</b>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <Instagram size={15} /> Instagram
            </a>
            <Link to="/admin" className="owner-footer">
              Owner access ↗
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 The Good Cup. Made with a little extra care.</span>
        <span>Good things take time. Coffee takes about 4 minutes.</span>
      </div>
    </footer>
  );
}
