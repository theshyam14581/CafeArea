import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import AdminOverview from '../components/admin/AdminOverview.jsx';
import AdminOrders from '../components/admin/AdminOrders.jsx';
import AdminMenu from '../components/admin/AdminMenu.jsx';
import AdminCustomers from '../components/admin/AdminCustomers.jsx';
import AdminReports from '../components/admin/AdminReports.jsx';
import AdminSettings from '../components/admin/AdminSettings.jsx';

export default function AdminPage() {
  const { showToast } = useToast();
  const [token, setToken] = useState(() => sessionStorage.getItem('owner-token') || '');
  const [tab, setTab] = useState('Overview');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((r) => (r.ok ? r.json() : []))
        .then((data) => {
          setOrders(Array.isArray(data) ? data : data.orders || []);
        })
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Check your details and try again');
      }
      sessionStorage.setItem('owner-token', data.token);
      setToken(data.token);
      showToast('Welcome back, Owner!');
    } catch (err) {
      // In offline / preview demo mode, provide convenient access or display error
      if (err.message === 'Failed to fetch') {
        // Offer demo login
        const demoToken = `DEMO_TOKEN_${Date.now()}`;
        sessionStorage.setItem('owner-token', demoToken);
        setToken(demoToken);
        showToast('Signed in with Demo Admin Access');
      } else {
        setError(err.message);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('owner-token');
    setToken('');
    showToast('Signed out successfully');
  };

  if (!token) {
    return (
      <main className="admin-login-wrap">
        <form className="admin-login" onSubmit={handleLogin}>
          <Link className="brand" to="/">
            <span className="brand-icon">
              <Coffee size={19} />
            </span>
            <span>
              the good<span className="brand-script">cup</span>
              <small>OWNER STUDIO</small>
            </span>
          </Link>

          <div className="eyebrow">JUST FOR THE PEOPLE BEHIND THE COUNTER</div>
          <h1>
            Welcome <em>back.</em>
          </h1>
          <p>Sign in to manage dishes, orders, payments and reports.</p>

          <label>
            Email address
            <input
              type="email"
              required
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              placeholder="shyambairwa16@gmail.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              placeholder="Your owner password"
            />
          </label>

          {error && <div className="error-box">{error}</div>}

          <button className="button button-dark full-button" type="submit">
            Sign in to Studio <ArrowRight size={16} />
          </button>

          <small className="form-hint" style={{ marginTop: 14 }}>
            Default owner credentials: <b>shyambairwa16@gmail.com</b> / <b>shyambairwa16</b>
          </small>

          <Link to="/" className="text-link back-link">
            ← Back to the cafe website
          </Link>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-layout">
      <AdminSidebar
        tab={tab}
        setTab={setTab}
        ordersCount={orders.length}
        onLogout={handleLogout}
      />

      <section className="admin-main">
        <div className="admin-head">
          <div>
            <div className="eyebrow">CAFE CONTROL CENTER</div>
            <h1>{tab === 'Overview' ? 'A lovely day to be open.' : tab}</h1>
          </div>
          <div className="owner-avatar">GC</div>
        </div>

        {loading ? (
          <div className="empty-state">Loading cafe data...</div>
        ) : tab === 'Overview' ? (
          <AdminOverview orders={orders} setTab={setTab} />
        ) : tab === 'Orders' ? (
          <AdminOrders
            orders={orders}
            setOrders={setOrders}
            token={token}
            toast={showToast}
          />
        ) : tab === 'Menu' ? (
          <AdminMenu toast={showToast} token={token} />
        ) : tab === 'Customers' ? (
          <AdminCustomers orders={orders} />
        ) : tab === 'Reports' ? (
          <AdminReports orders={orders} />
        ) : (
          <AdminSettings toast={showToast} />
        )}
      </section>
    </main>
  );
}
