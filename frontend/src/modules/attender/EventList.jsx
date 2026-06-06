import React, { useState, useEffect } from 'react';
import { getAllEvents } from '../../services/event.service';
import { Link } from 'react-router-dom';

const gold = 'var(--accent)';

const Icons = {
  Mic: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>,
  Star: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Crown: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="2 22 22 22 20 2 15 9 12 2 9 9 4 2 2 22"/></svg>,
  Search: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  MapPin: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Calendar: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  ArrowRight: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
};

const offerTickets = [
  { icon: <Icons.Mic />, title: 'Early Bird Special', desc: 'Get 30% off on events booked before the event date!', badge: '30% OFF' },
  { icon: <Icons.Star />, title: 'Group Discount', desc: 'Book 5+ tickets and enjoy flat 20% savings.', badge: '20% OFF' },
  { icon: <Icons.Crown />, title: 'VIP Upgrade', desc: 'Upgrade to VIP seating at just ₹299 extra per ticket.', badge: '₹299 Only' },
];

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const scrollRef = React.useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Auto-scroll offer tickets
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let pos = 0;
    const speed = 0.6;
    let paused = false;
    el.addEventListener('mouseenter', () => { paused = true; });
    el.addEventListener('mouseleave', () => { paused = false; });
    const raf = setInterval(() => {
      if (!paused && el) {
        pos += speed;
        if (pos >= el.scrollWidth / 2) pos = 0;
        el.scrollLeft = pos;
      }
    }, 16);
    return () => clearInterval(raf);
  }, []);

  const filtered = events.filter(e =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', flexDirection: 'column', gap: 16 }}>
      <div className="spinner-border" style={{ color: gold, width: 44, height: 44 }} />
      <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading events…</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 26, margin: 0, letterSpacing: '-0.3px' }}>Upcoming Events</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: '4px 0 0' }}>{events.length} events available</p>
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: gold }}>
            <Icons.Search />
          </span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search events or locations…"
            style={{
              paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
              background: 'var(--glass)', border: '1px solid var(--border)',
              borderRadius: 10, color: 'var(--text)', fontSize: 13, outline: 'none', width: 240,
            }}
          />
        </div>
      </div>

      {/* Offer Tickets — auto-scrolling */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 17, margin: 0 }}>Special Offers</h3>
          <span style={{ color: gold, fontSize: 11, fontWeight: 600, border: '1px solid var(--border)', borderRadius: 20, padding: '3px 12px' }}>Limited Time</span>
        </div>
        <div ref={scrollRef} style={{
          display: 'flex', gap: '1rem', overflowX: 'hidden',
          paddingBottom: '0.5rem', cursor: 'default',
        }}>
          {/* Duplicate for seamless loop */}
          {[...offerTickets, ...offerTickets].map((offer, i) => (
            <div key={i} className="card-premium fade-in" style={{
              minWidth: 220, padding: '1rem 1.1rem',
              flexShrink: 0, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ color: gold, marginBottom: 6 }}>{offer.icon}</div>
              <span style={{ display: 'inline-block', background: `linear-gradient(90deg, \${gold}, #f5d270)`, color: '#0f0f0f', fontWeight: 800, fontSize: 9, borderRadius: 20, padding: '2px 8px', marginBottom: 6, letterSpacing: '0.5px' }}>
                {offer.badge}
              </span>
              <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{offer.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 11, lineHeight: 1.5 }}>{offer.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--glass)', border: '1px dashed var(--border)', borderRadius: 16 }}>
          <Icons.Search />
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: 14 }}>No events found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.5rem' }}>
          {filtered.map(event => (
            <div key={event.id} className="card-premium fade-in" style={{
              display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden'
            }}>
              {/* Large Image Header */}
              <div style={{ height: 180, position: 'relative', background: 'var(--border)', backgroundImage: `url(\${event.imageUrl || 'https://via.placeholder.com/600x300/1a1a1a/D4AF37?text=Event'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                 {event.category && (
                  <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', fontSize: 10, color: gold, border: `1px solid \${gold}`, borderRadius: 20, padding: '2px 10px', fontWeight: 600, letterSpacing: '0.5px' }}>
                    {event.category.toUpperCase()}
                  </span>
                )}
                {/* Rating Badge */}
                <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', fontSize: 11, color: '#fff', borderRadius: 20, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                   <span style={{color: gold}}>★</span> 4.8
                </span>
              </div>
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ color: 'var(--text)', fontWeight: 800, fontSize: 18, marginBottom: 8, margin: '0 0 10px' }}>{event.title}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--muted)', fontSize: 13 }}>
                    <Icons.MapPin />
                    {event.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--muted)', fontSize: 13 }}>
                    <Icons.Calendar />
                    {event.date} &nbsp;|&nbsp; {event.startTime}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: gold, fontWeight: 800, fontSize: 20 }}>₹{event.price}</span>
                  <Link to={`/attender/events/\${event.id}`} className="btn-gold" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                    Book Now <Icons.ArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
