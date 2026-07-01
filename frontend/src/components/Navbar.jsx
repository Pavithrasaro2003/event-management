import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const gold = '#c9a84c';
const goldLight = '#f5d270';

/* ── SVG Icons ──────────────────────────────────────────────────── */
const NavIcon = ({ type }) => {
  const icons = {
    dashboard: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    events: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    ticket: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
      </svg>
    ),
    plus: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
    bookings: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    organizers: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    logout: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
    user: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    sun: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
    ),
    moon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
  };
  return icons[type] || null;
};

/* ── Navbar ─────────────────────────────────────────────────────── */
const Navbar = () => {
  const { user, role, logoutContext } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const isDark = theme === 'dark';

  if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 13px', borderRadius: 8,
    textDecoration: 'none',
    color: isActive(path) ? goldLight : (isDark ? '#aaaaaa' : '#555555'),
    background: isActive(path) ? 'rgba(201,168,76,0.12)' : 'transparent',
    fontWeight: isActive(path) ? 700 : 500,
    fontSize: 14,
    transition: 'all 0.18s',
    border: isActive(path) ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent',
    whiteSpace: 'nowrap',
  });

  const adminLinks = [
    { to: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/admin/organizers', icon: 'organizers', label: 'Organizers' },
  ];
  const organizerLinks = [
    { to: '/organizer/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/organizer/events', icon: 'events', label: 'My Events' },
    { to: '/organizer/create-event', icon: 'plus', label: 'Create Event' },
    { to: '/organizer/bookings', icon: 'bookings', label: 'Bookings' },
  ];
  const attenderLinks = [
    { to: '/attender/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/attender/events', icon: 'ticket', label: 'Browse Events' },
    { to: '/attender/bookings', icon: 'bookings', label: 'My Bookings' },
  ];

  const links = role === 'admin' ? adminLinks
    : role === 'organizer' ? organizerLinks
    : role === 'attender' ? attenderLinks
    : [];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 1000,
      background: 'var(--nav-bg)',
      borderBottom: '1px solid var(--nav-border)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: isDark ? '0 2px 20px rgba(0,0,0,0.5)' : '0 2px 12px rgba(0,0,0,0.08)',
      transition: 'background 0.22s, border-color 0.22s, box-shadow 0.22s',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0.65rem 1.5rem', display: 'flex', alignItems: 'center', gap: 20 }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#c9a84c,#f5d270)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 12px rgba(201,168,76,0.4)',
          }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="#0f0f0f" stroke="none">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
            </svg>
          </div>
          <div>
            <div style={{ color: goldLight, fontWeight: 800, fontSize: 16, lineHeight: 1.1, letterSpacing: '-0.3px' }}>EventPro</div>
            <div style={{ color: isDark ? '#555' : '#aaa', fontSize: 10, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Ticket Platform</div>
          </div>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, flexWrap: 'wrap' }}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={linkStyle(l.to)}
              onMouseOver={e => {
                if (!isActive(l.to)) {
                  e.currentTarget.style.color = goldLight;
                  e.currentTarget.style.background = 'rgba(201,168,76,0.08)';
                }
              }}
              onMouseOut={e => {
                if (!isActive(l.to)) {
                  e.currentTarget.style.color = isDark ? '#aaaaaa' : '#555555';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <NavIcon type={l.icon} /> {l.label}
            </Link>
          ))}
        </div>

        {/* Right: theme toggle + user info + logout */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>

            {/* Theme toggle */}
            <button
              className="theme-toggle"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              onClick={() => toggleTheme()}
              aria-label="Toggle theme"
            >
              <NavIcon type={isDark ? 'sun' : 'moon'} />
            </button>

            {/* User badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 8,
              background: isDark ? 'rgba(201,168,76,0.07)' : 'rgba(201,168,76,0.09)',
              border: '1px solid rgba(201,168,76,0.2)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg,#c9a84c,#f5d270)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0f0f0f',
              }}>
                <NavIcon type="user" />
              </div>
              <div>
                <div style={{ color: 'var(--text)', fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>{user.name}</div>
                <div style={{ color: gold, fontSize: 10, textTransform: 'capitalize' }}>{role}</div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logoutContext}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8,
                border: '1px solid rgba(231,76,60,0.35)',
                background: 'rgba(231,76,60,0.08)',
                color: '#e74c3c', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                transition: 'background 0.18s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(231,76,60,0.18)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(231,76,60,0.08)'; }}
            >
              <NavIcon type="logout" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
