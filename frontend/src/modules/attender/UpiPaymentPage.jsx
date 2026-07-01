import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitPayment, getMySubmission } from '../../services/payment.service';
import { getMyBookings } from '../../services/booking.service';

const gold = 'var(--accent)';
const goldLight = '#f5d270';

const UpiPaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Payment states
  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const [showQRModal, setShowQRModal] = useState(false);

  // Form states
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');
  
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', name: '' });
  const [selectedWallet, setSelectedWallet] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const paymentMethods = [
    { id: 'UPI', label: 'UPI / QR' },
    { id: 'CARD', label: 'Debit / Credit Card' },
    { id: 'WALLET', label: 'Mobile Wallets' },
    { id: 'NETBANKING', label: 'Net Banking' },
    { id: 'VOUCHER', label: 'Gift Voucher' },
    { id: 'PAYLATER', label: 'Pay Later' },
  ];

  const wallets = ['Amazon Pay Balance', 'Mobikwik', 'Paytm', 'Payzapp'];
  const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Canara Bank', 'Axis Bank'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookings = await getMyBookings();
        const found = bookings.find(b => b.id === Number(bookingId));
        if (found) setBooking(found);

        try {
          const sub = await getMySubmission(bookingId);
          if (sub) setSubmission(sub);
        } catch (err) {}
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSubmitting(true);
    setError('');

    let finalTxId = '';
    let finalUpiId = '';

    if (selectedMethod === 'UPI') {
      if (!transactionId.trim()) {
        setError('Transaction ID is required');
        setSubmitting(false);
        return;
      }
      finalTxId = transactionId;
      finalUpiId = upiId;
    } else {
      // Mock transactions for other methods to avoid breaking backend
      finalTxId = `TXN-${selectedMethod}-${Date.now()}`;
      finalUpiId = `MOCK-${selectedMethod}`;
      
      if (selectedMethod === 'CARD' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.name)) {
        setError('Please fill all card details');
        setSubmitting(false);
        return;
      }
      if (selectedMethod === 'WALLET' && !selectedWallet) {
        setError('Please select a wallet');
        setSubmitting(false);
        return;
      }
      if (selectedMethod === 'NETBANKING' && !selectedBank) {
        setError('Please select a bank');
        setSubmitting(false);
        return;
      }
      if (selectedMethod === 'VOUCHER' && !voucherCode) {
        setError('Please enter a voucher code');
        setSubmitting(false);
        return;
      }
    }

    try {
      const data = await submitPayment({
        bookingId: Number(bookingId),
        transactionId: finalTxId,
        upiId: finalUpiId
      });
      setSubmission(data.submission);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit payment details');
    } finally {
      setSubmitting(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('kcpavithra23@oksbi');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div className="spinner-border" style={{ color: goldLight, width: 44, height: 44 }} />
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#e74c3c' }}>
        <h3>Booking not found or you don't have permission to view it.</h3>
        <button onClick={() => navigate('/attender/bookings')} className="btn-gold" style={{ marginTop: '1rem' }}>Back to Bookings</button>
      </div>
    );
  }

  const isSubmitted = !!submission;
  const isApproved = booking.paymentStatus === 'paid' || submission?.status === 'approved';
  
  if (isApproved) {
    return (
      <div style={{ maxWidth: 600, margin: '4rem auto', textAlign: 'center' }} className="card-premium fade-in">
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(46,204,113,0.15)', border: '2px solid #2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ color: '#2ecc71', marginBottom: '1rem' }}>Payment Verified!</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Your payment has been successfully verified by the admin. Your booking is confirmed.</p>
        <button onClick={() => navigate('/attender/bookings')} className="btn-gold" style={{ padding: '0.8rem 2rem' }}>Go to My Bookings</button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div style={{ maxWidth: 600, margin: '4rem auto', textAlign: 'center' }} className="card-premium fade-in">
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(243,156,18,0.15)', border: '2px solid #f39c12', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f39c12" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <h3 style={{ color: '#f39c12', marginBottom: '1rem' }}>Verification Pending</h3>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>Your payment proof has been submitted successfully.<br/>Our admin team will verify the transaction shortly.</p>
        
        <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>Transaction ID</span>
            <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{submission.transactionId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>Amount Submitted</span>
            <span style={{ color: goldLight, fontSize: 13, fontWeight: 600 }}>₹{submission.amount.toFixed(2)}</span>
          </div>
        </div>

        <button onClick={() => navigate('/attender/bookings')} className="btn-outline-gold" style={{ padding: '0.8rem 2rem' }}>View My Bookings</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ color: 'var(--text)', fontWeight: 800, fontSize: 28, marginBottom: '2rem' }}>Complete Your Payment</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        
        {/* Left Section - Payment Options */}
        <div className="card-premium fade-in" style={{ padding: 0, display: 'flex', overflow: 'hidden' }}>
          
          {/* Sidebar */}
          <div style={{ width: '35%', background: 'var(--glass)', borderRight: '1px solid var(--border)', padding: '1.5rem 0' }}>
            <h3 style={{ padding: '0 1.5rem', marginBottom: '1.5rem', color: 'var(--muted)', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Payment Options</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => { setSelectedMethod(method.id); setError(''); }}
                  style={{
                    background: selectedMethod === method.id ? 'rgba(245, 210, 112, 0.1)' : 'transparent',
                    borderLeft: selectedMethod === method.id ? `4px solid ${goldLight}` : '4px solid transparent',
                    color: selectedMethod === method.id ? goldLight : 'var(--text)',
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    border: 'none',
                    fontSize: 15,
                    fontWeight: selectedMethod === method.id ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Form Area */}
          <div style={{ width: '65%', padding: '2rem' }}>
            
            {error && <div style={{ color: '#e74c3c', fontSize: 13, background: 'rgba(231,76,60,0.1)', padding: '0.8rem', borderRadius: 8, marginBottom: '1.5rem' }}>{error}</div>}

            {selectedMethod === 'UPI' && (
              <div className="fade-in">
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text)' }}>Pay by any UPI App</h3>
                <button 
                  onClick={() => setShowQRModal(true)}
                  className="btn-outline-gold" 
                  style={{ width: '100%', padding: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  Scan QR Code to Pay
                </button>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text)', marginBottom: '1rem', fontSize: 15 }}>I Have Completed Payment</h4>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}>UPI Transaction ID *</label>
                    <input type="text" className="input-premium" value={transactionId} onChange={e => setTransactionId(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}>Your UPI ID Used (Optional)</label>
                    <input type="text" className="input-premium" value={upiId} onChange={e => setUpiId(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'CARD' && (
              <div className="fade-in">
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text)' }}>Debit / Credit Card</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}>Card Number</label>
                  <input type="text" className="input-premium" value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}>Expiry (MM/YY)</label>
                    <input type="text" className="input-premium" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}>CVV</label>
                    <input type="password" maxLength={4} className="input-premium" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}>Name on Card</label>
                  <input type="text" className="input-premium" value={cardDetails.name} onChange={e => setCardDetails({...cardDetails, name: e.target.value})} />
                </div>
              </div>
            )}

            {selectedMethod === 'WALLET' && (
              <div className="fade-in">
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text)' }}>Mobile Wallets</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {wallets.map(wallet => (
                    <label key={wallet} style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1rem', border: '1px solid var(--border)', borderRadius: 8, background: selectedWallet === wallet ? 'rgba(245,210,112,0.05)' : 'transparent', borderColor: selectedWallet === wallet ? goldLight : 'var(--border)' }}>
                      <input type="radio" name="wallet" checked={selectedWallet === wallet} onChange={() => setSelectedWallet(wallet)} style={{ accentColor: goldLight, transform: 'scale(1.2)' }} />
                      <span style={{ color: 'var(--text)' }}>{wallet}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {selectedMethod === 'NETBANKING' && (
              <div className="fade-in">
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text)' }}>Net Banking</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {banks.map(bank => (
                    <button
                      key={bank}
                      onClick={() => setSelectedBank(bank)}
                      style={{
                        padding: '1rem',
                        border: `1px solid ${selectedBank === bank ? goldLight : 'var(--border)'}`,
                        borderRadius: 8,
                        background: selectedBank === bank ? 'rgba(245,210,112,0.05)' : 'transparent',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedMethod === 'VOUCHER' && (
              <div className="fade-in">
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text)' }}>Gift Voucher</h3>
                <div>
                  <label style={{ display: 'block', color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}>Enter Voucher Code</label>
                  <input type="text" className="input-premium" value={voucherCode} onChange={e => setVoucherCode(e.target.value)} />
                </div>
              </div>
            )}

            {selectedMethod === 'PAYLATER' && (
              <div className="fade-in">
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text)' }}>Pay Later</h3>
                <div style={{ background: 'rgba(245,210,112,0.1)', border: `1px solid ${goldLight}`, padding: '1.5rem', borderRadius: 8 }}>
                  <p style={{ color: goldLight, fontSize: 15, marginBottom: 10 }}>Confirm your booking now and pay within 24 hours.</p>
                  <p style={{ color: 'var(--muted)', fontSize: 13 }}>Your tickets will be reserved but held until full payment is received.</p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Section - Booking Summary */}
        <div className="card-premium fade-in" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3 style={{ color: 'var(--text)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Booking Summary</h3>
          
          <h4 style={{ color: goldLight, fontSize: 18, marginBottom: '1rem' }}>{booking.Event?.title}</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--muted)', fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tickets</span>
              <span style={{ color: 'var(--text)' }}>{booking.ticketCount}</span>
            </div>
            
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dotted var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16 }}>Amount Payable</span>
              <span style={{ color: '#2ecc71', fontSize: 24, fontWeight: 800 }}>₹{booking.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={submitting} 
            style={{ 
              width: '100%', 
              marginTop: '2rem', 
              padding: '1rem', 
              background: '#2ecc71', 
              color: '#000', 
              border: 'none', 
              borderRadius: 8, 
              fontSize: 16, 
              fontWeight: 700, 
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? 'Processing...' : (selectedMethod === 'UPI' ? 'Submit Proof' : 'Pay Now')}
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={() => setShowQRModal(false)}>
          <div className="card-premium fade-in" style={{ padding: '2.5rem', maxWidth: 400, width: '100%', position: 'relative', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowQRModal(false)} style={{ position: 'absolute', top: 15, right: 15, background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            
            <h3 style={{ color: 'var(--text)', marginBottom: '1rem' }}>Scan to Pay</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: '2rem' }}>Pay using GPay / PhonePe / Paytm</p>
            
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 16, marginBottom: '1.5rem', display: 'inline-block' }}>
              <img src="/upi-qr.png" alt="UPI QR Code" style={{ width: 220, height: 220, objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/220?text=Please+Upload+upi-qr.png'; }} />
            </div>

            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 8 }}>UPI ID: kcpavithra23@oksbi</p>
            <button onClick={copyUpiId} className="btn-outline-gold" style={{ padding: '0.5rem 1rem', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {copied ? 'Copied!' : 'Copy UPI ID'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UpiPaymentPage;
