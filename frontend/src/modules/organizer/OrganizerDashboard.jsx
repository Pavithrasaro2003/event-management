import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  getDashboardStats,
  getDashboardUpcomingEvents,
  getDashboardRecentBookings,
  getDashboardRevenue,
  getDashboardNotifications,
} from '../../services/booking.service';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend
);

/* ── icons ───────────────────────────────────────────────────────────────── */
const Icons = {
  Event: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  List: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Bookings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Ticket: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>,
  Mic: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>,
  Star: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Crown: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="2 22 22 22 20 2 15 9 12 2 9 9 4 2 2 22"/></svg>,
  TrendingUp: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

/* ── helpers ─────────────────────────────────────────────────────────────── */
const gold = '#D4AF37';
const goldLight = '#f5d270';

const card = (extra = {}) => ({
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  boxShadow: 'var(--shadow)',
  ...extra,
});

const statIconSvgs = [
  <Icons.Event key="0" />,
  <Icons.Star key="1" />,
  <Icons.Bell key="2" />,
  <Icons.Ticket key="3" />,
  <Icons.TrendingUp key="4" />,
  <Icons.Bookings key="5" />,
  <Icons.List key="6" />,
];
const statLabels = ['Total Events','Active','Upcoming','Tickets Sold','Revenue','Bookings','Pending Payments'];
const statKeys  = ['totalEvents','activeEvents','upcomingEvents','totalTicketsSold','totalRevenue','totalBookings','pendingPayments'];

const fmtCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const fmtTime = (d) =>
  new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

/* ─────────────────────────────────────────────────────────────────────────── */
const OrganizerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const offerScrollRef = useRef(null);

  const [stats,         setStats]         = useState(null);
  const [upcoming,      setUpcoming]      = useState([]);
  const [recentBooks,   setRecentBooks]   = useState([]);
  const [revenue,       setRevenue]       = useState({ monthly: [], perEvent: [] });
  const [notifications, setNotifications] = useState([]);
  const [unread,        setUnread]        = useState(0);
  const [showNotif,     setShowNotif]     = useState(false);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');

  /* fetch all dashboard data concurrently */
  useEffect(() => {
    const load = async () => {
      try {
        const [s, u, r, rv, n] = await Promise.all([
          getDashboardStats(),
          getDashboardUpcomingEvents(),
          getDashboardRecentBookings(),
          getDashboardRevenue(),
          getDashboardNotifications(),
        ]);
        setStats(s);
        setUpcoming(u);
        setRecentBooks(r);
        setRevenue(rv);
        setNotifications(n.notifications || []);
        setUnread(n.unreadCount || 0);
      } catch (err) {
        setError('Failed to load dashboard. Please refresh.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ── Auto-scroll offer tickets ───────────────────────────────────────── */
  useEffect(() => {
    const el = offerScrollRef.current;
    if (!el) return;
    let pos = 0;
    const speed = 0.5;
    let paused = false;
    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    const timer = setInterval(() => {
      if (!paused && el) {
        pos += speed;
        if (pos >= el.scrollWidth / 2) pos = 0;
        el.scrollLeft = pos;
      }
    }, 16);
    return () => { clearInterval(timer); el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave); };
  }, []);

  /* ── Chart data ──────────────────────────────────────────────────────── */

  const monthlyRevenueChart = {
    labels: revenue.monthly.map((m) => m.month),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: revenue.monthly.map((m) => m.revenue),
        backgroundColor: 'rgba(212,175,55,0.7)',
        borderColor: gold,
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const ticketsSoldChart = {
    labels: revenue.monthly.map((m) => m.month),
    datasets: [
      {
        label: 'Tickets Sold',
        data: revenue.monthly.map((m) => m.tickets),
        fill: true,
        backgroundColor: 'rgba(212,175,55,0.15)',
        borderColor: goldLight,
        pointBackgroundColor: goldLight,
        tension: 0.4,
      },
    ],
  };

  const perEventChart = {
    labels: revenue.perEvent.map((e) => e.event),
    datasets: [
      {
        label: 'Revenue per Event',
        data: revenue.perEvent.map((e) => e.revenue),
        backgroundColor: [
          'rgba(212,175,55,0.8)','rgba(245,210,112,0.8)',
          'rgba(255,180,50,0.8)','rgba(180,130,30,0.8)',
          'rgba(240,200,90,0.8)','rgba(160,120,20,0.8)',
        ],
        borderColor: 'var(--card)',
        borderWidth: 2,
      },
    ],
  };

  const chartOpts = (titleText) => ({
    responsive: true,
    plugins: {
      legend: { labels: { color: 'var(--muted)' } },
      title: { display: true, text: titleText, color: gold, font: { size: 14 } },
    },
    scales: {
      x: { ticks: { color: 'var(--muted)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: 'var(--muted)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  });

  const doughnutOpts = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: 'var(--muted)', padding: 16 } },
      title: { display: true, text: 'Revenue by Event', color: gold, font: { size: 14 } },
    },
  };

  /* ── Loading state ───────────────────────────────────────────────────── */
  if (loading)
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div className="spinner-border" style={{ color: gold, width: 48, height: 48 }} />
        <p style={{ color: gold, fontSize: 16 }}>Loading dashboard…</p>
      </div>
    );

  /* ── Error state ─────────────────────────────────────────────────────── */
  if (error)
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'var(--card)', border: '1px solid #e74c3c', borderRadius: 12, padding: '2rem', textAlign: 'center', color: '#e74c3c' }}>
          ⚠️ {error}
          <br />
          <button onClick={() => window.location.reload()} style={{ marginTop: 12, padding: '6px 20px', borderRadius: 8, border: '1px solid #e74c3c', background: 'transparent', color: '#e74c3c', cursor: 'pointer' }}>
            Retry
          </button>
        </div>
      </div>
    );

  /* ── Main render ─────────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', padding: '0 0 3rem 0', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Top navbar ──────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '0.85rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: gold }}>
             <Icons.Event />
          </div>
          <div>
            <div style={{ color: goldLight, fontWeight: 700, fontSize: 17, lineHeight: 1.2 }}>EventPro</div>
            <div style={{ color: 'var(--muted)', fontSize: 11 }}>Organizer Dashboard</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 10, padding: '6px 12px', color: gold, cursor: 'pointer', position: 'relative' }}
            >
              <Icons.Bell />
              {unread > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -6, background: '#e74c3c', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotif && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, width: 340, zIndex: 200, boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: goldLight, fontWeight: 700 }}>Notifications</span>
                  <span style={{ background: '#e74c3c', color: '#fff', borderRadius: 20, padding: '1px 8px', fontSize: 11 }}>{unread} new</span>
                </div>
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '1.5rem' }}>No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--glass)', transition: 'background 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'var(--glass)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <p style={{ color: 'var(--text)', fontSize: 13, margin: 0, lineHeight: 1.4 }}>{n.message}</p>
                        <p style={{ color: 'var(--muted)', fontSize: 11, margin: '4px 0 0' }}>{fmtDate(n.time)} · {fmtTime(n.time)}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ color: 'var(--muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--text)' }}>{user?.name || user?.email}</span>
          </div>
          <button
            onClick={logout}
            style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid rgba(231,76,60,0.4)', background: 'rgba(231,76,60,0.1)', color: '#e74c3c', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ── Page content ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Page title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: goldLight, fontWeight: 800, fontSize: 28, margin: 0 }}>Event Management Dashboard</h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0' }}>Real-time overview of your events, bookings, and revenue</p>
        </div>

        {/* ── Quick Actions ──────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {[
            { to: '/organizer/create-event', icon: <Icons.Plus />, label: 'Create Event', primary: true },
            { to: '/organizer/events',       icon: <Icons.List />, label: 'My Events' },
            { to: '/organizer/bookings',     icon: <Icons.Bookings />, label: 'View Bookings' },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '0.55rem 1.2rem', borderRadius: 10, textDecoration: 'none',
                background: a.primary ? `linear-gradient(90deg, ${gold}, ${goldLight})` : 'var(--glass)',
                border: `1px solid ${a.primary ? 'transparent' : 'var(--border)'}`,
                color: a.primary ? '#0f0f0f' : gold,
                fontWeight: 700, fontSize: 14, transition: 'opacity 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = 0.85)}
              onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
            >
              <div style={{display: 'flex', alignItems: 'center'}}>{a.icon}</div> {a.label}
            </Link>
          ))}
        </div>

        {/* ── Stats Cards ────────────────────────────────────────────── */}
        <div className="row g-3 mb-4">
          {statKeys.map((key, i) => {
            const val = stats?.[key] ?? 0;
            const display = key === 'totalRevenue' ? fmtCurrency(val) : val.toLocaleString();
            return (
              <div className="col-6 col-md-4 col-lg-3 col-xl-auto" key={key} style={{ flex: '1 1 160px', minWidth: 160 }}>
                <div className="card-premium" style={{ padding: '1.1rem 1.25rem', height: '100%' }}>
                  <div style={{ color: goldLight, marginBottom: 8 }}>{statIconSvgs[i]}</div>
                  <div style={{ color: goldLight, fontWeight: 800, fontSize: 22, lineHeight: 1 }}>{display}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>{statLabels[i]}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Offer Tickets Scroll ────────────────────────────────────── */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ color: goldLight, fontWeight: 700, margin: 0, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icons.Ticket /> Offer Tickets
            </h4>
            <span style={{ color: gold, fontSize: 12, fontWeight: 600, border: `1px solid var(--border)`, borderRadius: 8, padding: '4px 14px' }}>
              Limited Time Deals
            </span>
          </div>
          <div style={{
            display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.75rem',
            scrollbarWidth: 'thin', scrollbarColor: `${gold} transparent`,
            WebkitOverflowScrolling: 'touch',
          }}>
            {[
              { icon: <Icons.Mic />, title: 'Early Bird Special', desc: 'Get 30% off on all music events booked before the event date!', badge: '30% OFF' },
              { icon: <Icons.Star />, title: 'Group Discount', desc: 'Book 5+ tickets for any event and enjoy flat 20% savings on total.', badge: '20% OFF' },
              { icon: <Icons.Crown />, title: 'VIP Upgrade Offer', desc: 'Upgrade to VIP seating at just ₹299 extra per ticket this weekend.', badge: '₹299 Only' },
            ].map((offer, i) => (
              <div
                key={i}
                className="card-premium"
                style={{
                  minWidth: 240, maxWidth: 240,
                  padding: '1.1rem 1.25rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ color: goldLight, marginBottom: 8 }}>{offer.icon}</div>
                <span style={{
                  display: 'inline-block',
                  background: `linear-gradient(90deg,${gold},${goldLight})`,
                  color: '#0f0f0f', fontWeight: 800, fontSize: 10,
                  borderRadius: 20, padding: '2px 10px', marginBottom: 8,
                  letterSpacing: '0.5px',
                }}>
                  {offer.badge}
                </span>
                <h6 style={{ color: 'var(--text)', fontWeight: 700, fontSize: 14, margin: '0 0 6px' }}>{offer.title}</h6>
                <p style={{ color: 'var(--muted)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>{offer.desc}</p>
                <button className="btn-outline-gold" style={{ marginTop: 14, width: '100%', fontSize: 12 }}>
                  Grab Offer →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Upcoming Events ────────────────────────────────────────── */}
        <Section title="Upcoming Events" icon={<Icons.Event />} action={{ to: '/organizer/events', label: 'View All' }}>
          {upcoming.length === 0 ? (
            <EmptyState icon={<Icons.Event />} message="No upcoming events" />
          ) : (
            <div className="row g-3">
              {upcoming.map((ev) => {
                const total = ev.totalCapacityOrig || (ev.capacity + ev.ticketsSold) || 1;
                const pct = Math.min(100, Math.round((ev.ticketsSold / total) * 100));
                return (
                  <div className="col-md-6 col-xl-4" key={ev.id}>
                    <div className="card-premium" style={{ padding: '1.1rem', height: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <span style={{ fontSize: 10, color: gold, border: `1px solid ${gold}`, borderRadius: 20, padding: '1px 8px', fontWeight: 600 }}>{ev.category}</span>
                          <h6 style={{ color: goldLight, fontWeight: 700, margin: '6px 0 2px', fontSize: 15 }}>{ev.title}</h6>
                          <p style={{ color: 'var(--muted)', fontSize: 12, margin: 0 }}>📍 {ev.location}</p>
                          <p style={{ color: 'var(--muted)', fontSize: 12, margin: '2px 0 0' }}>📅 {ev.date} · {ev.startTime}</p>
                        </div>
                        <StatusBadge status={ev.status} />
                      </div>

                      {/* Progress bar */}
                      <div style={{ margin: '10px 0 4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ color: 'var(--muted)', fontSize: 11 }}>Tickets Sold</span>
                          <span style={{ color: goldLight, fontSize: 11, fontWeight: 600 }}>{ev.ticketsSold} / {total}</span>
                        </div>
                        <div style={{ background: 'var(--glass)', borderRadius: 20, height: 7, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg,${gold},${goldLight})`, borderRadius: 20, transition: 'width 1s' }} />
                        </div>
                        <div style={{ textAlign: 'right', fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{pct}% sold</div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                        <StatMini label="Revenue" value={fmtCurrency(ev.revenue)} />
                        <StatMini label="Bookings" value={ev.bookingCount} />
                        <StatMini label="Available" value={ev.availableTickets} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        {/* ── Recent Customer Bookings ───────────────────────────────── */}
        <Section title="Recent Customer Bookings" icon={<Icons.Bookings />} action={{ to: '/organizer/bookings', label: 'View All' }}>
          {recentBooks.length === 0 ? (
            <EmptyState icon={<Icons.Bookings />} message="No bookings yet" />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table-modern">
                <thead>
                  <tr>
                    {['Customer','Email','Phone','Location','Event','Tickets','Amount','Date','Payment'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '0 12px 8px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBooks.map((b) => (
                    <tr key={b.id} style={{ transition: 'background 0.2s' }}>
                      <Td bold>{b.customerName || b.User?.name || '—'}</Td>
                      <Td>{b.customerEmail || b.User?.email || '—'}</Td>
                      <Td>{b.customerPhone || '—'}</Td>
                      <Td>{[b.customerCity, b.customerState, b.customerCountry].filter(Boolean).join(', ') || '—'}</Td>
                      <Td>{b.Event?.title || '—'}</Td>
                      <Td center>{b.ticketCount}</Td>
                      <Td gold>{fmtCurrency(b.totalAmount)}</Td>
                      <Td>{fmtDate(b.createdAt)}</Td>
                      <Td><PayBadge status={b.paymentStatus} /></Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        {/* ── Revenue Analytics Charts ───────────────────────────────── */}
        <Section title="Revenue Analytics" icon={<Icons.TrendingUp />}>
          {revenue.monthly.length === 0 ? (
            <EmptyState icon={<Icons.TrendingUp />} message="No revenue data yet" />
          ) : (
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card-premium" style={{ padding: '1.25rem' }}>
                  <Bar data={monthlyRevenueChart} options={chartOpts('Monthly Revenue (₹)')} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="card-premium" style={{ padding: '1.25rem' }}>
                  <Line data={ticketsSoldChart} options={chartOpts('Monthly Tickets Sold')} />
                </div>
              </div>
              {revenue.perEvent.length > 0 && (
                <div className="col-md-6 col-lg-5 mx-auto">
                  <div className="card-premium" style={{ padding: '1.25rem' }}>
                    <Doughnut data={perEventChart} options={doughnutOpts} />
                  </div>
                </div>
              )}
            </div>
          )}
        </Section>

      </div>
    </div>
  );
};

/* ── Sub-components ──────────────────────────────────────────────────────── */

const Section = ({ title, icon, children, action }) => (
  <div style={{ marginBottom: '2.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <h4 style={{ color: goldLight, fontWeight: 700, margin: 0, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon} {title}
      </h4>
      {action && (
        <Link to={action.to} style={{ color: gold, fontSize: 13, fontWeight: 600, textDecoration: 'none', border: `1px solid var(--border)`, borderRadius: 8, padding: '4px 14px' }}>
          {action.label} →
        </Link>
      )}
    </div>
    {children}
  </div>
);

const EmptyState = ({ icon, message }) => (
  <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--glass)', border: '1px dashed var(--border)', borderRadius: 12 }}>
    <div style={{ fontSize: 40, marginBottom: 8, color: gold }}>{icon}</div>
    <p style={{ color: 'var(--muted)', margin: 0 }}>{message}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = { active: '#2ecc71', paused: '#f39c12', completed: '#3498db' };
  const c = colors[status] || '#aaa';
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: `1px solid ${c}`, color: c, background: `${c}22` }}>
      {status?.toUpperCase()}
    </span>
  );
};

const PayBadge = ({ status }) => {
  const colors = { paid: '#2ecc71', pending: '#f39c12', failed: '#e74c3c', refunded: '#9b59b6' };
  const c = colors[status] || '#888';
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: `1px solid ${c}`, color: c, background: `${c}22`, whiteSpace: 'nowrap' }}>
      {(status || 'pending').toUpperCase()}
    </span>
  );
};

const Td = ({ children, bold, gold: isGold, center }) => (
  <td style={{
    color: isGold ? goldLight : bold ? 'var(--text)' : 'var(--muted)',
    fontSize: 13,
    fontWeight: bold ? 600 : 400,
    textAlign: center ? 'center' : 'left',
    whiteSpace: 'nowrap',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
  }}>
    {children}
  </td>
);

const StatMini = ({ label, value }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ color: goldLight, fontWeight: 700, fontSize: 14 }}>{value}</div>
    <div style={{ color: 'var(--muted)', fontSize: 10 }}>{label}</div>
  </div>
);

export default OrganizerDashboard;
