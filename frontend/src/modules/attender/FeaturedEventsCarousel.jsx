import React, { useState, useEffect, useRef } from 'react';
import BookingFormModal from './BookingFormModal';

const sampleEvents = [
  {
    id: 'feat-1',
    title: "Yuvan Shankar Raja Live Concert",
    venue: "Chennai Trade Centre",
    date: "15 July 2026",
    price: "999",
    capacity: 1000,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 'feat-2',
    title: "Anirudh Ravichander Live Concert",
    venue: "Nehru Stadium",
    date: "22 July 2026",
    price: "1499",
    capacity: 1000,
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 'feat-3',
    title: "HipHop Tamizha Live Concert",
    venue: "Coimbatore Codissia",
    date: "05 August 2026",
    price: "799",
    capacity: 1000,
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 'feat-4',
    title: "A.R. Rahman Musical Night",
    venue: "YMCA Grounds",
    date: "12 August 2026",
    price: "1999",
    capacity: 1000,
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 'feat-5',
    title: "Vijay Antony Live Show",
    venue: "Madurai",
    date: "20 August 2026",
    price: "699",
    capacity: 1000,
    imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 'feat-6',
    title: "Comedy Night Live",
    venue: "Music Academy",
    date: "25 August 2026",
    price: "499",
    capacity: 1000,
    imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 'feat-7',
    title: "IPL Watch Party",
    venue: "Phoenix Mall",
    date: "30 August 2026",
    price: "299",
    capacity: 1000,
    imageUrl: "https://plus.unsplash.com/premium_photo-1722122222077-332c43cfbed0?auto=format&fit=crop&q=80&w=1200",
  }
];

const gold = 'var(--accent, #c9a84c)';
const goldLight = '#f5d270';

const FeaturedEventsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsData, setEventsData] = useState(sampleEvents);
  const timeoutRef = useRef(null);

  useEffect(() => {
    import('../../services/event.service').then(({ getAllEvents }) => {
      getAllEvents().then(realEvents => {
        // Map real event IDs and prices back to our carousel data based on title
        const updatedEvents = sampleEvents.map(sample => {
          const realEvent = realEvents.find(e => e.title === sample.title);
          if (realEvent) {
            return { ...sample, id: realEvent.id, price: realEvent.price, capacity: realEvent.capacity };
          }
          return sample;
        });
        setEventsData(updatedEvents);
      }).catch(console.error);
    });
  }, []);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === eventsData.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);
    }
    return () => resetTimeout();
  }, [currentIndex, isPaused, eventsData.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === eventsData.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? eventsData.length - 1 : prev - 1));
  };

  const handleBookNow = (event) => {
    setSelectedEvent(event);
  };

  return (
    <>
    <div 
      style={{ marginBottom: '2.5rem', position: 'relative' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ color: goldLight, fontWeight: 800, fontSize: 20, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Featured Events
        </h3>
      </div>

      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '350px', 
        borderRadius: '22px', 
        overflow: 'hidden',
        boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
        background: 'var(--card)'
      }}>
        {/* Carousel Items */}
        <div style={{
          display: 'flex',
          height: '100%',
          transition: 'transform 0.6s ease-in-out',
          transform: `translateX(-${currentIndex * 100}%)`,
        }}>
          {eventsData.map((event, index) => (
            <div key={event.id} style={{
              minWidth: '100%',
              height: '100%',
              position: 'relative',
              backgroundImage: `url(${event.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
              {/* Gradient Overlay */}
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)' 
              }} />
              
              {/* Content */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, bottom: 0,
                padding: '3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                maxWidth: '60%',
                color: '#fff',
                fontFamily: "'Inter', sans-serif"
              }}>
                <span style={{ 
                  background: `linear-gradient(90deg, ${gold}, #f5d270)`, 
                  color: '#0f0f0f', 
                  fontWeight: 800, 
                  fontSize: 10, 
                  borderRadius: 20, 
                  padding: '4px 12px', 
                  marginBottom: 16, 
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  alignSelf: 'flex-start'
                }}>
                  Premium Event
                </span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 1rem 0', lineHeight: 1.1, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                  {event.title}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem', fontSize: '1rem', color: '#ccc' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: goldLight }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span style={{color: '#fff'}}>{event.venue}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: goldLight }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span style={{color: '#fff'}}>{event.date}</span>
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <button 
                    onClick={() => handleBookNow(event)}
                    className="btn-gold" 
                    style={{ 
                      padding: '0.85rem 2rem', 
                      fontSize: '1.1rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      boxShadow: '0 8px 24px rgba(212,175,55,0.3)',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: 700
                    }}
                  >
                    Book Now
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Starting at</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: goldLight }}>{event.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={handlePrev}
          style={{
            position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.5)', border: `1px solid rgba(201,168,76,0.3)`,
            color: '#fff', width: '40px', height: '40px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.8)'; e.currentTarget.style.color = '#000'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.color = '#fff'; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        
        <button 
          onClick={handleNext}
          style={{
            position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.5)', border: `1px solid rgba(201,168,76,0.3)`,
            color: '#fff', width: '40px', height: '40px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.8)'; e.currentTarget.style.color = '#000'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.color = '#fff'; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        {/* Dot Indicators */}
        <div style={{
          position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '8px', zIndex: 10
        }}>
          {eventsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: currentIndex === idx ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: currentIndex === idx ? goldLight : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
    
    {selectedEvent && (
      <BookingFormModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        onSuccess={() => setSelectedEvent(null)} 
      />
    )}
    </>
  );
};

export default FeaturedEventsCarousel;
