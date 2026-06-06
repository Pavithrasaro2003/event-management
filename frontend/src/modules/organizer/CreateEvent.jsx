import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../services/event.service';

const gold = 'var(--accent)';
const goldLight = '#f5d270';

const Icons = {
  ArrowLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Calendar: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  MapPin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Users: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Tag: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Image: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Spin: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
};

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', category: '',
    date: '', startTime: '', endTime: '',
    location: '', capacity: '', price: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEvent(formData);
      setSuccess('Event created successfully!');
      setTimeout(() => navigate('/organizer/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <button onClick={() => navigate('/organizer/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 13, marginBottom: '1.5rem', padding: 0, transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--text)'} onMouseOut={e=>e.currentTarget.style.color='var(--muted)'}>
        <Icons.ArrowLeft /> Back to Dashboard
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 26, margin: '0 0 8px', letterSpacing: '-0.3px' }}>Create New Event</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>Set up your event details to start selling tickets</p>
      </div>

      {error && <Alert type="error" msg={error} />}
      {success && <Alert type="success" msg={success} />}

      <form onSubmit={handleSubmit} className="card-premium fade-in" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelSt}>Event Title *</label>
            <input className="input-premium" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Summer Music Festival 2025" required style={inputSt} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelSt}>Description *</label>
            <textarea className="input-premium" name="description" value={formData.description} onChange={handleChange} placeholder="Describe what makes your event special..." rows={4} required style={{ ...inputSt, resize: 'vertical' }} />
          </div>

          <div>
            <label style={labelSt}>Category</label>
            <input className="input-premium" type="text" name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Music, Tech, Conference" style={inputSt} />
          </div>

          <div>
            <label style={labelSt}><Icons.Image /> Image URL</label>
            <input className="input-premium" type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" style={inputSt} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <hr style={{ borderColor: 'var(--border)', margin: '1rem 0' }} />
            <h5 style={{ color: 'var(--text)', fontWeight: 700, fontSize: 14, marginBottom: '1.5rem' }}>Schedule & Location</h5>
          </div>

          <div>
            <label style={labelSt}><Icons.Calendar /> Date *</label>
            <input className="input-premium" type="date" name="date" value={formData.date} onChange={handleChange} required style={inputSt} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelSt}><Icons.Clock /> Start Time</label>
              <input className="input-premium" type="time" name="startTime" value={formData.startTime} onChange={handleChange} style={inputSt} />
            </div>
            <div>
              <label style={labelSt}><Icons.Clock /> End Time</label>
              <input className="input-premium" type="time" name="endTime" value={formData.endTime} onChange={handleChange} style={inputSt} />
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelSt}><Icons.MapPin /> Location / Venue *</label>
            <input className="input-premium" type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Grand Convention Center, Mumbai" required style={inputSt} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <hr style={{ borderColor: 'var(--border)', margin: '1rem 0' }} />
            <h5 style={{ color: 'var(--text)', fontWeight: 700, fontSize: 14, marginBottom: '1.5rem' }}>Ticketing Details</h5>
          </div>

          <div>
            <label style={labelSt}><Icons.Users /> Total Capacity *</label>
            <input className="input-premium" type="number" name="capacity" value={formData.capacity} onChange={handleChange} min={1} placeholder="e.g. 500" required style={inputSt} />
          </div>

          <div>
            <label style={labelSt}><Icons.Tag /> Ticket Price (₹) *</label>
            <input className="input-premium" type="number" name="price" value={formData.price} onChange={handleChange} min={0} step="0.01" placeholder="e.g. 999.00" required style={inputSt} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <button type="button" onClick={() => navigate('/organizer/dashboard')} className="btn-outline-gold">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? <><Icons.Spin /> Saving...</> : <><Icons.Plus /> Create Event</>}
          </button>
        </div>
      </form>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const Alert = ({ type, msg }) => (
  <div style={{
    background: type === 'error' ? 'rgba(231,76,60,0.1)' : 'rgba(46,204,113,0.1)',
    border: `1px solid \${type === 'error' ? 'rgba(231,76,60,0.3)' : 'rgba(46,204,113,0.3)'}`,
    borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem',
    color: type === 'error' ? '#e74c3c' : '#2ecc71', fontSize: 14,
    display: 'flex', alignItems: 'center', gap: 10,
  }}>
    {msg}
  </div>
);

const labelSt = { display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 12, marginBottom: 8, fontWeight: 600, letterSpacing: '0.5px' };
const inputSt = { width: '100%' };

export default CreateEvent;
