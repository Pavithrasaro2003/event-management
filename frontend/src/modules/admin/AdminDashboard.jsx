import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const gold = 'var(--accent)';
const goldLight = '#f5d270';

const statCards = [
  { key: 'totalUsers', label: 'Total Users', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={goldLight} strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color: '#3498db' },
  { key: 'totalOrganizers', label: 'Organizers', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, color: '#2ecc71' },
  { key: 'totalAttenders', label: 'Attenders', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9b59b6" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>, color: '#9b59b6' },
  { key: 'totalEvents', label: 'Total Events', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, color: gold },
  { key: 'totalBookings', label: 'Total Bookings', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="1.5"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>, color: '#e74c3c' },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid rgba(201,168,76,0.3)`, borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'var(--muted)' }}>Loading dashboard…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: 500, margin: '4rem auto', textAlign: 'center', padding: '2rem', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.25)', borderRadius: 16, color: '#e74c3c' }}>
      {error}
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#c9a84c,#f5d270)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <div>
            <h1 style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 24, margin: 0 }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>Platform-wide analytics and management</p>
          </div>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <a href="/admin/payments" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '0.8rem 1.5rem', borderRadius: 12 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Verify Payments
          </a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
        {statCards.map((sc) => (
          <div key={sc.key} className="card-premium" style={{
            padding: '1.5rem',
            position: 'relative', overflow: 'hidden',
            border: `1px solid var(--border)`,
          }}
          >
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle,${sc.color}22 0%,transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ marginBottom: '0.75rem' }}>{sc.icon}</div>
            <div style={{ color: 'var(--text)', fontWeight: 800, fontSize: 30, lineHeight: 1 }}>{stats?.[sc.key] ?? 0}</div>
            <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>{sc.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
