import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getOrganizerAllBookings } from '../../services/booking.service';

const gold = 'var(--accent)';
const goldLight = '#f5d270';

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
const OrganizerBookings = () => {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(true);
  const [error, setError]         = useState('');

  const LIMIT = 10;

  const fetchBookings = useCallback(async (pg = 1, q = search) => {
    setLoading(true);
    setError('');
    try {
      const data = await getOrganizerAllBookings(pg, LIMIT, q);
      if (pg === 1) setBookings(data);
      else setBookings((prev) => [...prev, ...data]);
      setHasMore(data.length === LIMIT);
      setPage(pg);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchBookings(1); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings(1, search);
  };

  /* CSV Export */
  const exportCSV = () => {
    const headers = ['Booking ID','Customer Name','Email','Phone','City','State','Country','Event','Tickets','Amount','Payment Status','Booking Date'];
    const rows = bookings.map((b) => [
      b.id, b.customerName, b.customerEmail, b.customerPhone,
      b.customerCity, b.customerState, b.customerCountry,
      b.Event?.title, b.ticketCount, b.totalAmount,
      b.paymentStatus, fmtDate(b.createdAt),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'bookings.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1.5rem', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <Link to="/organizer/dashboard" style={{ color: 'var(--accent)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              ← Back to Dashboard
            </Link>
            <h2 style={{ color: 'var(--text)', fontWeight: 800, margin: 0 }}>📑 All Bookings</h2>
            <p style={{ color: 'var(--muted)', margin: '4px 0 0', fontSize: 14 }}>All customer bookings for your events</p>
          </div>
          <button
            onClick={exportCSV}
            disabled={bookings.length === 0}
            className="btn-outline-gold"
            style={{
              fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            📥 Export CSV
          </button>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or email…"
            className="input-premium"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-gold" style={{ fontSize: 14 }}>
            Search
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); fetchBookings(1, ''); }}
              className="btn-outline-gold"
              style={{ padding: '0.55rem 1rem' }}>
              Clear
            </button>
          )}
        </form>

        {error && <div className="alert alert-danger" style={{ borderRadius: 10 }}>{error}</div>}

        {/* Table Wrapper */}
        <div className="card-premium" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table-modern">
              <thead>
                <tr>
                  {['#','Customer','Email','Phone','Location','Event','Tickets','Amount','Payment','Date',''].map((h) => (
                    <th key={h}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                      <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id}>
                      <td style={td()}><span style={{ color: 'var(--accent)', fontWeight: 700 }}>#{b.id}</span></td>
                      <td style={td(true)}>{b.customerName || '—'}</td>
                      <td style={td()}>{b.customerEmail || '—'}</td>
                      <td style={td()}>{b.customerPhone || '—'}</td>
                      <td style={td()}>
                        {[b.customerCity, b.customerState, b.customerCountry].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td style={td(true)}>{b.Event?.title || '—'}</td>
                      <td style={{ ...td(), textAlign: 'center' }}>{b.ticketCount}</td>
                      <td style={{ ...td(), color: 'var(--accent)', fontWeight: 700 }}>{fmtCurrency(b.totalAmount)}</td>
                      <td style={td()}><PayBadge status={b.paymentStatus} /></td>
                      <td style={td()}>{fmtDate(b.createdAt)}</td>
                      <td style={td()}>
                        <Link
                          to={`/organizer/events/${b.Event?.id}/attendees`}
                          style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', border: `1px solid var(--border)`, borderRadius: 6, padding: '3px 10px', whiteSpace: 'nowrap' }}
                        >
                          View Event
                        </Link>
                      </td>
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

        {/* Load more */}
        {hasMore && !loading && bookings.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              onClick={() => fetchBookings(page + 1)}
              className="btn-outline-gold"
              style={{ padding: '0.6rem 2rem' }}
            >
              Load More
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

const td = (bold) => ({
  color: bold ? 'var(--text)' : 'var(--muted)',
  fontSize: 13,
  fontWeight: bold ? 600 : 400,
  whiteSpace: 'nowrap',
});

export default OrganizerBookings;
