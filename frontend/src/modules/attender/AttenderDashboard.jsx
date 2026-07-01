import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import FeaturedEventsCarousel from './FeaturedEventsCarousel';

const gold = '#c9a84c';
const goldLight = '#f5d270';

const AttenderDashboard = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const cards = [
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={goldLight} strokeWidth="1.5">
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
        </svg>
      ),
      title: 'Browse Events',
      desc: 'Discover amazing events and book your tickets.',
      to: '/attender/events',
      primary: true,
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
      title: 'My Bookings',
      desc: 'View and download your booking invoices.',
      to: '/attender/bookings',
      primary: false,
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }} className="fade-in">
      {/* Welcome Banner */}
      <div style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 100%)'
          : 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.06) 100%)',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: 22, padding: '2.5rem',
        marginBottom: '2rem',
        boxShadow: isDark ? '0 16px 48px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.08)',
        position: 'relative', overflow: 'hidden',
        backdropFilter: 'blur(8px)',
      }}>
        {/* decorative orb */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle,rgba(201,168,76,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: '1.5rem' }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: 'linear-gradient(135deg,#c9a84c,#f5d270)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(201,168,76,0.4)', flexShrink: 0,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>Welcome back</div>
            <h1 style={{ color: goldLight, fontWeight: 800, fontSize: 26, margin: 0 }}>
              {user?.name || 'Guest'}
            </h1>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>
              Ready for your next great experience?
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['Book tickets instantly', 'Download invoice PDF', 'Manage all bookings'].map((f) => (
            <div key={f} style={{
              padding: '6px 14px', borderRadius: 20,
              background: isDark ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.22)',
              color: 'var(--muted)', fontSize: 12,
            }}>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Featured Events Carousel */}
      <FeaturedEventsCarousel />

      {/* Quick-access Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.25rem' }}>
        {cards.map((c, i) => (
          <Link key={i} to={c.to} style={{ textDecoration: 'none' }}>
            <div style={{
              background: c.primary
                ? (isDark ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.08)')
                : 'var(--card)',
              border: `1px solid ${c.primary ? 'rgba(201,168,76,0.35)' : 'var(--border)'}`,
              borderRadius: 18, padding: '1.75rem', cursor: 'pointer',
              transition: 'transform 0.22s, box-shadow 0.22s, background 0.22s',
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.25)' : '0 4px 16px rgba(0,0,0,0.07)',
            }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = isDark
                  ? '0 20px 48px rgba(0,0,0,0.4)'
                  : '0 12px 32px rgba(0,0,0,0.12)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isDark
                  ? '0 8px 32px rgba(0,0,0,0.25)'
                  : '0 4px 16px rgba(0,0,0,0.07)';
              }}
            >
              <div style={{ marginBottom: '1rem' }}>{c.icon}</div>
              <h3 style={{ color: c.primary ? goldLight : 'var(--text)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                {c.title}
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {c.desc}
              </p>
              <div style={{
                marginTop: '1.25rem',
                color: c.primary ? gold : 'var(--muted)',
                fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                Go now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AttenderDashboard;
