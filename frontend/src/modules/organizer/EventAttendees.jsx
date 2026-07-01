import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookingsByEvent } from '../../services/booking.service';

const gold = 'var(--accent)';
const goldLight = '#f5d270';

const Icons = {
  ArrowLeft: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Users: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Box: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
};

const fmtCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const PayBadge = ({ status }) => {
  const colors = { paid: '#2ecc71', pending: '#f39c12', failed: '#e74c3c', refunded: '#9b59b6' };
  const c = colors[status] || '#888';
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
      border: `1px solid ${c}`, color: c, background: `${c}22`, whiteSpace: 'nowrap' }}>
      {(status || 'pending').toUpperCase()}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────────────────── */
const EventAttendees = () => {
  const { id: eventId } = useParams();
  const [bookings, setBookings]   = useState([]);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [sort, setSort]           = useState('latest');
  const [error, setError]         = useState('');

  const fetchAttendees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getBookingsByEvent(eventId, sort, search);
      setBookings(data.bookings || []);
      setEventData(data.event || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendees.');
    } finally {
      setLoading(false);
    }
  }, [eventId, sort, search]);

  useEffect(() => { fetchAttendees(); }, [fetchAttendees]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAttendees();
  };

  /* CSV Export */
  const exportCSV = () => {
    const headers = ['Booking ID','Customer Name','Email','Phone','City','State','Country','Tickets','Amount','Payment Status','Booking Date'];
    const rows = bookings.map((b) => [
      b.id, b.customerName, b.customerEmail, b.customerPhone,
      b.customerCity, b.customerState, b.customerCountry,
      b.ticketCount, b.totalAmount, b.paymentStatus, fmtDate(b.createdAt),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `event-${eventId}-attendees.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <Link to="/organizer/dashboard" style={{ color: 'var(--muted)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--text)'} onMouseOut={e=>e.currentTarget.style.color='var(--muted)'}>
            <Icons.ArrowLeft /> Back to Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ color: gold }}><Icons.Users /></div>
            <h2 style={{ color: 'var(--text)', fontWeight: 800, margin: 0, fontSize: 24, letterSpacing: '-0.5px' }}>
              Event Attendees {eventData && <span style={{ color: 'var(--muted)', fontWeight: 600 }}>/ {eventData.title}</span>}
            </h2>
          </div>
          <p style={{ color: 'var(--muted)', margin: '6px 0 0 34px', fontSize: 14 }}>Manage customers booked for this event</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={bookings.length === 0}
          className="btn-outline-gold"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Icons.Download /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: 300 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: gold }}>
              <Icons.Search />
            </span>
            <input
              className="input-premium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search attendees…"
              style={{ width: '100%', paddingLeft: 40 }}
            />
          </div>
          <button type="submit" className="btn-gold" style={{ padding: '0.65rem 1.5rem' }}>
            Search
          </button>
        </form>

        <select
          className="input-premium"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="latest" style={{ color: '#000' }}>Latest First</option>
          <option value="oldest" style={{ color: '#000' }}>Oldest First</option>
          <option value="name_asc" style={{ color: '#000' }}>Name (A-Z)</option>
        </select>
      </div>

      {error && (
        <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', color: '#e74c3c', fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="card-premium fade-in" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--glass)' }}>
                {['#','Customer','Email','Phone','Location','Company/Notes','Tickets','Amount','Payment','Date'].map((h) => (
                  <th key={h} style={{ padding: '14px', color: gold, fontSize: 11, fontWeight: 700, textAlign: 'left', letterSpacing: '0.5px', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border)' }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && !loading ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--muted)' }}>
                    <div style={{ marginBottom: 16 }}><Icons.Box /></div>
                    <p style={{ margin: 0 }}>No attendees found</p>
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id}
                    style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'var(--glass)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={td()}><span style={{ color: gold, fontWeight: 700 }}>#{b.id}</span></td>
                    <td style={td(true)}>{b.customerName || '—'}</td>
                    <td style={td()}>{b.customerEmail || '—'}</td>
                    <td style={td()}>{b.customerPhone || '—'}</td>
                    <td style={td()}>
                      {[b.customerCity, b.customerState, b.customerCountry].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td style={td()}>
                      <div style={{ fontSize: 12, color: 'var(--text)' }}>{b.customerCompany || '—'}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.specialNotes}</div>
                    </td>
                    <td style={{ ...td(), textAlign: 'center' }}>{b.ticketCount}</td>
                    <td style={{ ...td(), color: goldLight, fontWeight: 700 }}>{fmtCurrency(b.totalAmount)}</td>
                    <td style={td()}><PayBadge status={b.paymentStatus} /></td>
                    <td style={td()}>{fmtDate(b.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Loading skeleton rows */}
        {loading && (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3,4,5].map((i) => (
              <div key={i} style={{ height: 42, background: 'var(--glass)', borderRadius: 8, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

const td = (bold) => ({
  padding: '14px',
  color: bold ? 'var(--text)' : 'var(--muted)',
  fontSize: 13,
  fontWeight: bold ? 600 : 400,
  whiteSpace: 'nowrap',
});

export default EventAttendees;
