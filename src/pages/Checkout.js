import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CreditCard, Lock, Shield } from 'lucide-react';
import api from '../services/api';

function Checkout() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    if (u.email === 'admin@grow.com') { navigate(`/learning/${courseId}`); return; }
    api.get(`/api/checkout-info/${courseId}`).then(r => setItem(r.data)).catch(() => navigate('/courses'));
  }, [courseId, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !cardExpiry || !cardCvc) { setMessage({ type: 'error', text: 'Fill all fields' }); return; }
    setLoading(true);
    try {
      await api.checkout({ user_id: user.id, course_id: parseInt(courseId), amount: item.price, payment_method: 'card' });
      setMessage({ type: 'success', text: 'Success! Redirecting...' });
      setTimeout(() => navigate(`/learning/${courseId}`), 2000);
    } catch (err) { setMessage({ type: 'error', text: err.response?.data?.error || 'Payment failed' }); }
    finally { setLoading(false); }
  };
  const ps = { minHeight: '100vh', paddingTop: '70px', fontFamily: 'Inter, sans-serif', backgroundImage: 'url("https://i.postimg.cc/3wxVp0ny/photo-2026-05-26-11-00-53.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' };
  const ov = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)', zIndex: 0 };
  const ct = { maxWidth: '900px', margin: '0 auto', padding: '2rem', position: 'relative', zIndex: 1 };
  const cd = { background: 'rgba(20,30,55,0.6)', backdropFilter: 'blur(12px)', borderRadius: '0.8rem', padding: '1.2rem', border: '1px solid rgba(59,130,246,0.2)', marginBottom: '1rem' };
  const inp = { width: '100%', padding: '0.5rem', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.4rem', color: 'white', fontSize: '0.8rem', outline: 'none' };
  const bt = { width: '100%', padding: '0.7rem', background: loading ? '#64748b' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', borderRadius: '0.4rem', fontSize: '0.85rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' };

  if (!item) return <div style={ps}><div style={ov} /></div>;
  return (
    <div style={ps}><div style={ov} /><div style={ct}>
      <Link to="/courses" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.8rem', marginBottom: '1rem', display: 'inline-block' }}>← Back</Link>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
        <div style={cd}><h2 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.8rem' }}>Order Summary</h2>
          <div style={{ padding: '0.6rem', background: 'rgba(59,130,246,0.1)', borderRadius: '0.4rem', marginBottom: '0.8rem' }}><p style={{ color: 'white', fontWeight: '600', fontSize: '0.85rem' }}>{item.title}</p><p style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{item.description}</p><p style={{ color: '#60a5fa', fontSize: '0.65rem', marginTop: '0.2rem' }}>{item.duration}</p></div>
          <div style={{ borderTop: '1px solid rgba(59,130,246,0.2)', paddingTop: '0.6rem' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', color: '#94a3b8', fontSize: '0.75rem' }}><span>Price</span><span>${item.price}.00</span></div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', color: '#94a3b8', fontSize: '0.75rem' }}><span>Tax</span><span>$0.00</span></div><div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(59,130,246,0.2)', color: 'white', fontWeight: '700', fontSize: '0.9rem' }}><span>Total</span><span style={{ color: '#60a5fa' }}>${item.price}.00</span></div></div>
          <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#22c55e', fontSize: '0.65rem' }}><Shield size={12} /> Verified by server</div>
        </div>
        <div style={cd}><h2 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CreditCard size={18} /> Payment</h2>
          {message && <div style={{ padding: '0.5rem', borderRadius: '0.4rem', marginBottom: '0.8rem', background: message.type==='success'?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)', color: message.type==='success'?'#22c55e':'#ef4444', fontSize: '0.75rem' }}>{message.text}</div>}
          <form onSubmit={handlePayment}><div style={{ marginBottom: '0.6rem' }}><label style={{ color: '#94a3b8', fontSize: '0.65rem', display: 'block', marginBottom: '0.1rem' }}>Card Number</label><input value={cardNumber} onChange={e=>setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" maxLength={19} style={inp} /></div>
          <div style={{ marginBottom: '0.6rem' }}><label style={{ color: '#94a3b8', fontSize: '0.65rem', display: 'block', marginBottom: '0.1rem' }}>Cardholder</label><input value={cardName} onChange={e=>setCardName(e.target.value)} placeholder="John Doe" style={inp} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.8rem' }}><div><label style={{ color: '#94a3b8', fontSize: '0.65rem', display: 'block', marginBottom: '0.1rem' }}>Expiry</label><input value={cardExpiry} onChange={e=>setCardExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} style={inp} /></div><div><label style={{ color: '#94a3b8', fontSize: '0.65rem', display: 'block', marginBottom: '0.1rem' }}>CVC</label><input value={cardCvc} onChange={e=>setCardCvc(e.target.value)} placeholder="123" maxLength={4} style={inp} /></div></div>
          <button type="submit" disabled={loading} style={bt}><Lock size={14} /> {loading ? 'Processing...' : `Pay $${item.price}.00`}</button></form>
          <p style={{ color: '#64748b', fontSize: '0.6rem', textAlign: 'center', marginTop: '0.6rem' }}>Simulated payment.</p>
        </div>
      </div>
    </div></div>
  );
}

export default Checkout;
