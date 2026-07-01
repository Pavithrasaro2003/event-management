import React, { useState, useEffect } from 'react';
import { getAllEvents, deleteEvent } from '../../services/event.service';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const gold = 'var(--accent)';
const goldLight = '#f5d270';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      const myEvents = data.filter(ev => ev.createdBy === user.id);
      setEvents(myEvents);
    } catch (err) {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid rgba(201,168,76,0.3)`, borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'var(--muted)' }}>Loading events…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#c9a84c,#f5d270)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <h1 style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 24, margin: 0 }}>My Events</h1>
            <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>{events.length} event{events.length !== 1 ? 's' : ''} created</p>
          </div>
        </div>
        <Link to="/organizer/create-event" className="btn-gold" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 13, textDecoration: 'none',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--glass)', border: '1px dashed var(--border)', borderRadius: 18 }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" style={{ marginBottom: 16 }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <h4 style={{ color: 'var(--accent)', marginBottom: 8 }}>No events yet</h4>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: 14 }}>Create your first event to get started.</p>
          <Link to="/organizer/create-event" className="btn-gold" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Create Event
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))', gap: '1.25rem' }}>
          {events.map(event => (
            <div key={event.id} className="card-premium" style={{
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}
            >
              {/* Header */}
              <div style={{ background: 'var(--glass)', borderBottom: '1px solid var(--border)', padding: '0.9rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {event.category && (
                  <span style={{ fontSize: 10, color: 'var(--accent)', border: `1px solid var(--accent)`, borderRadius: 20, padding: '1px 8px', fontWeight: 700, letterSpacing: '0.5px' }}>
                    {event.category.toUpperCase()}
                  </span>
                )}
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: '1px solid #2ecc7155', color: '#2ecc71', background: '#2ecc7118' }}>
                  {(event.status || 'active').toUpperCase()}
                </span>
              </div>

              <div style={{ padding: '1.1rem', flex: 1 }}>
                <h4 style={{ color: 'var(--text)', fontWeight: 700, fontSize: 15, margin: '0 0 8px' }}>{event.title}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--muted)', fontSize: 12 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {event.date} at {event.startTime}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--muted)', fontSize: 12 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {event.location}
                  </div>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.6, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {event.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 18 }}>₹{event.price}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 11 }}>Capacity: {event.capacity}</div>
                  </div>
                  <Link to={`/organizer/events/${event.id}/attendees`} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, background: 'var(--glass)', border: '1px solid var(--border)', color: 'var(--accent)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>
                    Attendees
                  </Link>
                </div>
              </div>

              <div style={{ padding: '0.75rem 1.1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleDelete(event.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 14px', fontSize: 12, borderRadius: 7, border: '1px solid rgba(231,76,60,0.35)', background: 'rgba(231,76,60,0.08)', color: '#e74c3c', cursor: 'pointer', fontWeight: 600 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
