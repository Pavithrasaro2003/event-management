import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../../services/event.service';
import BookingFormModal from './BookingFormModal';

const gold = 'var(--accent)';
const goldLight = '#f5d270';

const Icons = {
  ArrowLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  MapPin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Calendar: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Ticket: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>,
  TicketFill: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>,
  Check: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  AlertCircle: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

const getEventImage = (title) => {
  if (!title) return 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1200';
  const t = title.toLowerCase();
  
  if (t.includes('yuvan')) {
    return 'https://images.unsplash.com/photo-1484755560693-a4074577af3a?auto=format&fit=crop&q=80&w=1200';
  }
  if (t.includes('anirudh') || t.includes('aniruth')) {
    return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200';
  }
  if (t.includes('hiphop') || t.includes('hip hop')) {
    return 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200';
  }
  if (t.includes('rahman') || t.includes('a.r. rahman')) {
    return 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=1200';
  }
  if (t.includes('vijay antony') || t.includes('vijay')) {
    return 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=1200';
  }
  if (t.includes('comedy')) {
    return 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80&w=1200';
  }
  if (t.includes('ipl') || t.includes('cricket') || t.includes('watch party')) {
    return 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200';
  }
  if (t.includes('marriage') || t.includes('wedding')) {
    return 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200';
  }
  if (t.includes('birthday')) {
    return 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200';
  }
  if (t.includes('music') || t.includes('concert') || t.includes('live')) {
    return 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1200';
  }
  if (t.includes('party')) {
    return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200';
  }
  
  return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200';
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch {
        setMessage('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBookingSuccess = (booking) => {
    setShowModal(false);
    setMessage('Booking successful! Redirecting to payment...');
    setTimeout(() => navigate(`/attender/payment/${booking.id}`), 1000);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', flexDirection: 'column', gap: 16 }}>
      <div className="spinner-border" style={{ color: goldLight, width: 44, height: 44 }} />
      <p style={{ color: 'var(--muted)' }}>Loading event details…</p>
    </div>
  );

  if (!event) return (
    <div style={{ maxWidth: 600, margin: '4rem auto', textAlign: 'center', padding: '2rem', background: 'var(--card)', border: '1px solid #e74c3c', borderRadius: 16, color: '#e74c3c' }}>
      {message || 'Event not found.'}
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      {/* Back button */}
      <button onClick={() => navigate('/attender/events')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 13, marginBottom: '1.5rem', padding: 0, transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--text)'} onMouseOut={e=>e.currentTarget.style.color='var(--muted)'}>
        <Icons.ArrowLeft /> Back to Events
      </button>

      <div className="card-premium fade-in" style={{ overflow: 'hidden', padding: 0 }}>
        {/* Large Event Image */}
        <div style={{ height: 320, background: 'var(--border)', backgroundImage: `url(${event.imageUrl || (event.title.toLowerCase().includes('birthday') ? 'https://images.unsplash.com/photo-1530103862676-de8892bf30ef?auto=format&fit=crop&q=80&w=1200' : event.title.toLowerCase().includes('marriage') ? 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200' : 'https://via.placeholder.com/860x400/1a1a1a/D4AF37?text=Event')})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)' }} />
          
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem' }}>
            {event.category && (
              <span style={{ fontSize: 10, color: gold, border: `1px solid ${gold}`, borderRadius: 20, padding: '2px 10px', fontWeight: 700, letterSpacing: '0.8px', marginBottom: 12, display: 'inline-block', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
                {event.category.toUpperCase()}
              </span>
            )}
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 32, margin: '0 0 12px', letterSpacing: '-0.5px', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>{event.title}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: '#ccc', fontSize: 14 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7, color: goldLight }}>
                <Icons.MapPin /> <span style={{color: '#fff'}}>{event.location}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7, color: goldLight }}>
                <Icons.Calendar /> <span style={{color: '#fff'}}>{event.date}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7, color: goldLight }}>
                <Icons.Clock /> <span style={{color: '#fff'}}>{event.startTime} – {event.endTime}</span>
              </span>
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          <h5 style={{ color: gold, fontWeight: 700, fontSize: 13, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '1rem' }}>About this Event</h5>
          <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: 15, marginBottom: '2rem' }}>{event.description}</p>

          <hr style={{ borderColor: 'var(--border)', margin: '2rem 0' }} />

          {/* Pricing + booking box */}
          <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.1)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: goldLight }}>₹{event.price}</span>
                <span style={{ color: 'var(--muted)', fontSize: 14 }}>per ticket</span>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icons.Ticket /> {event.capacity} tickets available
              </div>
            </div>

            {event.capacity > 0 ? (
              <button
                onClick={() => setShowModal(true)}
                className="btn-gold"
                style={{ padding: '1rem 2.5rem', fontSize: 16, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(212,175,55,0.2)' }}
              >
                <Icons.TicketFill /> Book Now
              </button>
            ) : (
              <button disabled style={{ padding: '1rem 2.5rem', borderRadius: 12, border: 'none', background: 'var(--border)', color: 'var(--muted)', fontWeight: 700, cursor: 'not-allowed', fontSize: 16 }}>
                Sold Out
              </button>
            )}
          </div>

          {message && (
            <div style={{
              marginTop: '1.5rem', borderRadius: 12, padding: '1rem 1.25rem', fontSize: 14,
              background: message.includes('successful') ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
              border: `1px solid ${message.includes('successful') ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
              color: message.includes('successful') ? '#2ecc71' : '#e74c3c',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              {message.includes('successful') ? <Icons.Check /> : <Icons.AlertCircle />}
              {message}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <BookingFormModal event={event} onClose={() => setShowModal(false)} onSuccess={handleBookingSuccess} />
      )}
    </div>
  );
};

export default EventDetails;
