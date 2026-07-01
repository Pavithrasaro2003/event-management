import React, { useState, useEffect } from 'react';
import { getPendingSubmissions, approvePayment, rejectPayment } from '../../services/payment.service';

const gold = 'var(--accent)';
const goldLight = '#f5d270';

const PaymentVerification = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const data = await getPendingSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this payment? This will confirm the booking.')) return;
    setActionLoading(id);
    try {
      await approvePayment(id);
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
      alert('Payment approved and booking confirmed!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this payment?')) return;
    setActionLoading(id);
    try {
      await rejectPayment(id);
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
      alert('Payment rejected.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div className="spinner-border" style={{ color: goldLight, width: 44, height: 44 }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#c9a84c,#f5d270)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div>
          <h1 style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 24, margin: 0 }}>Payment Verification</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>Verify manual UPI payments submitted by attenders</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="card-premium fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" style={{ marginBottom: '1rem' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <h3 style={{ color: 'var(--text)' }}>All Caught Up!</h3>
          <p style={{ color: 'var(--muted)' }}>There are no pending payment verifications at the moment.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {submissions.map((sub) => (
            <div key={sub.id} className="card-premium fade-in" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', padding: '1.5rem 2rem' }}>
              
              <div style={{ flex: 1, minWidth: 250 }}>
                <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 4 }}>Booking <span style={{ color: goldLight }}>#{sub.bookingId}</span></div>
                <h4 style={{ color: 'var(--text)', fontSize: 18, marginBottom: 8 }}>{sub.Event?.title}</h4>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--muted)', fontSize: 13 }}>
                  <span><strong style={{ color: 'var(--text)' }}>User:</strong> {sub.User?.name}</span>
                  <span><strong style={{ color: 'var(--text)' }}>Tickets:</strong> {sub.Booking?.ticketCount}</span>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 250, background: 'var(--glass)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--muted)', fontSize: 12 }}>Transaction ID</span>
                  <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600, fontFamily: 'monospace' }}>{sub.transactionId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--muted)', fontSize: 12 }}>UPI ID Used</span>
                  <span style={{ color: 'var(--text)', fontSize: 13 }}>{sub.upiId || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--muted)', fontSize: 12 }}>Amount</span>
                  <span style={{ color: goldLight, fontSize: 16, fontWeight: 800 }}>₹{sub.amount.toFixed(2)}</span>
                </div>
                <div style={{ textAlign: 'right', marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
                  Submitted: {new Date(sub.createdAt).toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', minWidth: 150 }}>
                <button 
                  onClick={() => handleApprove(sub.id)} 
                  disabled={actionLoading === sub.id}
                  className="btn-gold" 
                  style={{ background: '#2ecc71', color: '#fff', border: 'none', padding: '0.8rem', opacity: actionLoading === sub.id ? 0.7 : 1 }}
                >
                  {actionLoading === sub.id ? 'Processing...' : 'Approve Payment'}
                </button>
                <button 
                  onClick={() => handleReject(sub.id)} 
                  disabled={actionLoading === sub.id}
                  style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', borderRadius: 12, padding: '0.8rem', cursor: 'pointer', fontWeight: 600, opacity: actionLoading === sub.id ? 0.7 : 1 }}
                >
                  Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;
