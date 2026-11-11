import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="page-main">
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <Coffee size={48} />
        <h1>Page Not Found</h1>
        <p>The page you are looking for doesn't exist or has moved.</p>
        <Link className="button button-dark" to="/">
          Return to Home <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
