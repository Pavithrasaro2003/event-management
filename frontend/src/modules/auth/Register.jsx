import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const gold = 'var(--accent)';
const goldLight = '#f5d270';

const Icons = {
  User: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Mail: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Lock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  UserPlus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  Spin: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
};

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('attender');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/attender/register', { name, email, password });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'attender', label: 'Attender', desc: 'Browse & book event tickets' },
    { value: 'organizer', label: 'Organizer', desc: 'Create & manage events' },
    { value: 'admin', label: 'Admin', desc: 'Platform administration' },
  ];

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'var(--bg)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ position: 'fixed', top: '10%', right: '15%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(212,175,55,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div className="fade-in" style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, margin: '0 auto 1.25rem',
            background: `linear-gradient(135deg, ${gold}, #f5d270)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(212,175,55,0.35)',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          </div>
          <h1 style={{ color: 'var(--text)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.5px', margin: 0 }}>Create Account</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>Join EventPro and start your journey</p>
        </div>

        <div className="card-premium" style={{ padding: '2.5rem' }}>
          {error && <Alert type="error" msg={error} />}
          {success && <Alert type="success" msg={success} />}

          <form onSubmit={handleSubmit}>
            <Field label="Full Name" icon={<Icons.User />}>
              <input className="input-premium" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required style={inputSt} />
            </Field>

            <Field label="Email Address" icon={<Icons.Mail />}>
              <input className="input-premium" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputSt} />
            </Field>

            <Field label="Password" icon={<Icons.Lock />}>
              <input className="input-premium" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" required style={inputSt} />
            </Field>

            {/* Role selection removed, default is 'attender' */}

            <button type="submit" disabled={loading} className="btn-gold" style={{
              width: '100%', padding: '0.85rem', fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? (
                <><Icons.Spin /> Creating…</>
              ) : (
                <><Icons.UserPlus /> Create Account</>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--muted)', fontSize: 13 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: gold, fontWeight: 700, textDecoration: 'none' }}>Sign in here</Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const Alert = ({ type, msg }) => (
  <div style={{
    background: type === 'error' ? 'rgba(231,76,60,0.1)' : 'rgba(46,204,113,0.1)',
    border: `1px solid ${type === 'error' ? 'rgba(231,76,60,0.3)' : 'rgba(46,204,113,0.3)'}`,
    borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem',
    color: type === 'error' ? '#e74c3c' : '#2ecc71', fontSize: 13,
  }}>{msg}</div>
);

const Field = ({ label, icon, children }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <label style={labelSt}>{label}</label>
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)', zIndex: 1 }}>{icon}</span>
      {React.cloneElement(children, { style: { ...children.props.style, paddingLeft: 42 } })}
    </div>
  </div>
);

const labelSt = { display: 'block', color: 'var(--muted)', fontSize: 12, marginBottom: 8, fontWeight: 600, letterSpacing: '0.5px' };
const inputSt = { width: '100%' };

export default Register;
