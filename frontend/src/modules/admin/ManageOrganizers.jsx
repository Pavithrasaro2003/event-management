import React, { useState, useEffect, useContext } from 'react';
import { getOrganizers, createOrganizer, updateOrganizer, deleteOrganizer } from '../../services/admin.service';
import { ThemeContext } from '../../context/ThemeContext';

const gold = '#c9a84c';
const goldLight = '#f5d270';

/* ── tiny SVG icons ─────────────────────────────────────────────── */
const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const SaveIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={goldLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

/* ── reusable themed input ──────────────────────────────────────── */
const ThemedInput = ({ label, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && (
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: gold }}>
        {label}
      </label>
    )}
    <input
      {...props}
      style={{
        width: '100%',
        background: 'var(--input-bg)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '10px 14px',
        color: 'var(--text)',
        fontSize: 14,
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box',
      }}
      onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.1)'; }}
      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
    />
  </div>
);

/* ── main component ─────────────────────────────────────────────── */
const ManageOrganizers = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');

  useEffect(() => { fetchOrganizers(); }, []);

  const fetchOrganizers = async () => {
    try {
      const data = await getOrganizers();
      setOrganizers(data);
    } catch (err) {
      console.error('Failed to fetch organizers:', err);
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOrganizer({ name, email, password });
      setMessage('success:Organizer created successfully!');
      setName(''); setEmail(''); setPassword('');
      fetchOrganizers();
      setTimeout(() => setMessage(''), 3500);
    } catch (err) {
      setMessage('error:' + (err.response?.data?.message || err.response?.data?.error || 'Failed to create organizer'));
    }
  };

  // START EDIT
  const handleEditClick = (org) => {
    setEditingId(org.id);
    setEditName(org.name);
    setEditEmail(org.email);
    setEditPassword('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName(''); setEditEmail(''); setEditPassword('');
  };

  // UPDATE
  const handleUpdateSubmit = async (id) => {
    try {
      const updateData = { name: editName, email: editEmail };
      if (editPassword) updateData.password = editPassword;
      await updateOrganizer(id, updateData);
      setEditingId(null);
      fetchOrganizers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update organizer');
    }
  };

  // DELETE
  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this organizer? This will also delete their events and bookings.')) {
      try {
        await deleteOrganizer(id);
        fetchOrganizers();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete organizer');
      }
    }
  };

  /* ── inline styles that read CSS variables ──────────────────── */
  const panelStyle = {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.45)' : '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    transition: 'background 0.2s, border-color 0.2s',
  };

  const panelHeaderStyle = {
    padding: '1rem 1.5rem',
    borderBottom: '1px solid var(--border)',
    background: isDark ? 'rgba(201,168,76,0.04)' : 'rgba(201,168,76,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const tableHeadCell = {
    padding: '12px 16px',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: gold,
    background: isDark ? 'rgba(201,168,76,0.06)' : 'rgba(201,168,76,0.07)',
    borderBottom: '1px solid var(--border)',
    whiteSpace: 'nowrap',
  };

  const tableCell = {
    padding: '14px 16px',
    fontSize: 14,
    color: 'var(--text)',
    borderBottom: '1px solid var(--border)',
    verticalAlign: 'middle',
  };

  const tableCellMuted = { ...tableCell, color: 'var(--muted)' };

  const btnPrimary = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 14px', borderRadius: 8,
    background: 'linear-gradient(135deg,#c9a84c,#f5d270)',
    color: '#0f0f0f', border: 'none',
    fontWeight: 700, fontSize: 13, cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.15s',
  };

  const btnSecondary = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 14px', borderRadius: 8,
    background: 'transparent',
    color: 'var(--muted)',
    border: '1px solid var(--border)',
    fontWeight: 600, fontSize: 13, cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const btnDanger = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '6px 12px', borderRadius: 8,
    background: 'rgba(231,76,60,0.1)',
    color: '#e74c3c',
    border: '1px solid rgba(231,76,60,0.3)',
    fontWeight: 600, fontSize: 12, cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const btnEdit = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '6px 12px', borderRadius: 8,
    background: isDark ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.12)',
    color: gold,
    border: '1px solid rgba(201,168,76,0.3)',
    fontWeight: 600, fontSize: 12, cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const isSuccess = message.startsWith('success:');
  const msgText = message.replace(/^(success|error):/, '');

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }} className="fade-in">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 13,
          background: 'linear-gradient(135deg,#c9a84c,#f5d270)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(201,168,76,0.35)',
          flexShrink: 0,
        }}>
          <UsersIcon />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.3px' }}>
            Manage Organizers
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>
            Create, edit and remove organizer accounts
          </p>
        </div>
      </div>

      {/* ── Alert Message ────────────────────────────────────────── */}
      {message && (
        <div style={{
          marginBottom: '1.5rem', padding: '12px 16px', borderRadius: 10,
          background: isSuccess ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
          border: `1px solid ${isSuccess ? 'rgba(46,204,113,0.35)' : 'rgba(231,76,60,0.35)'}`,
          color: isSuccess ? '#2ecc71' : '#e74c3c',
          fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>{isSuccess ? '✓' : '✕'}</span> {msgText}
        </div>
      )}

      {/* ── Create Panel ─────────────────────────────────────────── */}
      <div style={{ ...panelStyle, marginBottom: '1.5rem' }}>
        <div style={panelHeaderStyle}>
          <div style={{ width: 6, height: 20, borderRadius: 3, background: `linear-gradient(to bottom,${goldLight},${gold})` }} />
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
            Create New Organizer
          </h2>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <form onSubmit={handleCreateSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
              <ThemedInput
                label="Name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <ThemedInput
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <ThemedInput
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <div style={{ paddingBottom: 0 }}>
                <button
                  type="submit"
                  style={{ ...btnPrimary, padding: '11px 20px', whiteSpace: 'nowrap' }}
                  onMouseOver={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
                >
                  <PlusIcon /> Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ── Organizers Table ─────────────────────────────────────── */}
      <div style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div style={{ width: 6, height: 20, borderRadius: 3, background: `linear-gradient(to bottom,${goldLight},${gold})` }} />
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text)', flex: 1 }}>
            Registered Organizers
          </h2>
          <span style={{
            background: isDark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.15)',
            color: gold, border: '1px solid rgba(201,168,76,0.25)',
            padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
          }}>
            {organizers.length} total
          </span>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '3rem', color: 'var(--muted)' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid rgba(201,168,76,0.3)`, borderTopColor: gold, animation: 'spin 0.8s linear infinite' }} />
            Loading organizers…
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : organizers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
            No organizers found. Create one above.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...tableHeadCell, width: 60 }}>#</th>
                  <th style={tableHeadCell}>Name</th>
                  <th style={tableHeadCell}>Email</th>
                  <th style={tableHeadCell}>Password</th>
                  <th style={{ ...tableHeadCell, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizers.map((org, idx) => (
                  <tr key={org.id} style={{ transition: 'background 0.15s' }}
                    onMouseOver={e => { if (editingId !== org.id) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {editingId === org.id ? (
                      <>
                        <td style={tableCellMuted}>#{org.id}</td>
                        <td style={tableCell}>
                          <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            required
                            style={{
                              width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border)',
                              borderRadius: 8, padding: '7px 10px', color: 'var(--text)', fontSize: 13,
                              outline: 'none', boxSizing: 'border-box',
                            }}
                            onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = '0 0 0 2px rgba(201,168,76,0.12)'; }}
                            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                          />
                        </td>
                        <td style={tableCell}>
                          <input
                            type="email"
                            value={editEmail}
                            onChange={e => setEditEmail(e.target.value)}
                            required
                            style={{
                              width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border)',
                              borderRadius: 8, padding: '7px 10px', color: 'var(--text)', fontSize: 13,
                              outline: 'none', boxSizing: 'border-box',
                            }}
                            onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = '0 0 0 2px rgba(201,168,76,0.12)'; }}
                            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                          />
                        </td>
                        <td style={tableCell}>
                          <input
                            type="password"
                            value={editPassword}
                            onChange={e => setEditPassword(e.target.value)}
                            placeholder="Leave blank to keep"
                            style={{
                              width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border)',
                              borderRadius: 8, padding: '7px 10px', color: 'var(--text)', fontSize: 13,
                              outline: 'none', boxSizing: 'border-box',
                            }}
                            onFocus={e => { e.target.style.borderColor = gold; e.target.style.boxShadow = '0 0 0 2px rgba(201,168,76,0.12)'; }}
                            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                          />
                        </td>
                        <td style={{ ...tableCell, textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button style={btnPrimary} onClick={() => handleUpdateSubmit(org.id)}
                              onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                              onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                              <SaveIcon /> Save
                            </button>
                            <button style={btnSecondary} onClick={handleCancelEdit}
                              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--muted)'}
                              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                              <XIcon /> Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={tableCellMuted}>
                          <span style={{
                            background: isDark ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.12)',
                            color: gold, padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                          }}>
                            #{org.id}
                          </span>
                        </td>
                        <td style={{ ...tableCell, fontWeight: 600 }}>{org.name}</td>
                        <td style={tableCellMuted}>{org.email}</td>
                        <td style={tableCellMuted}>
                          <span style={{ letterSpacing: 2, fontSize: 16 }}>••••••••</span>
                        </td>
                        <td style={{ ...tableCell, textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button style={btnEdit} onClick={() => handleEditClick(org)}
                              onMouseOver={e => e.currentTarget.style.background = 'rgba(201,168,76,0.2)'}
                              onMouseOut={e => e.currentTarget.style.background = isDark ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.12)'}>
                              <EditIcon /> Edit
                            </button>
                            <button style={btnDanger} onClick={() => handleDeleteClick(org.id)}
                              onMouseOver={e => e.currentTarget.style.background = 'rgba(231,76,60,0.2)'}
                              onMouseOut={e => e.currentTarget.style.background = 'rgba(231,76,60,0.1)'}>
                              <TrashIcon /> Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrganizers;
