import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Droplets, HelpCircle, CreditCard } from 'lucide-react';

function Pricing() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState('usd');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const formatPrice = (usd, htg) => currency === 'htg' ? `${htg.toLocaleString()} HTG` : `$${usd} USD`;

  const plans = [
    { id: 'free', name: 'Free', price: 0, priceHtg: 0, desc: '1 free course', features: ['1 free course', 'Community support', 'Basic quizzes'], btn: 'Start Free', popular: false, icon: <Droplets size={16} />, action: () => navigate('/courses') },
    { id: 'flow', name: 'Flow', price: 49, priceHtg: 6615, desc: 'Full access - 1 month', features: ['All courses', 'Mentor access', 'Certificates', 'Projects', '1 month access'], btn: 'Buy Flow', popular: true, icon: <Zap size={16} />, action: () => { if (user?.email === 'admin@grow.com') { navigate('/learning/2'); } else { navigate('/checkout/2'); } } },
  ];

  const ps = { position: 'relative', minHeight: '100vh', paddingTop: '70px', fontFamily: 'Inter, sans-serif', backgroundImage: 'url("https://i.postimg.cc/3wxVp0ny/photo-2026-05-26-11-00-53.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' };
  const ov = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)', zIndex: 0, pointerEvents: 'none' };
  const ct = { maxWidth: '1000px', margin: '0 auto', padding: '1rem 2rem', position: 'relative', zIndex: 1 };
  const hd = { textAlign: 'center', marginBottom: '1.5rem' };
  const tt = { fontSize: '1.8rem', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
  const pg = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', maxWidth: '750px', margin: '0 auto' };
  const pc = (pop) => ({ background: pop ? 'rgba(59,130,246,0.15)' : 'rgba(20,30,55,0.5)', backdropFilter: 'blur(12px)', borderRadius: '1.2rem', padding: '1.5rem', border: pop ? '2px solid #3b82f6' : '1px solid rgba(59,130,246,0.2)', position: 'relative' });
  const pbd = { position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', padding: '0.2rem 1rem', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: '700' };
  const pn = { fontSize: '1rem', fontWeight: '700', color: 'white', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' };
  const ppr = { fontSize: '2rem', fontWeight: '800', color: '#60a5fa', marginBottom: '0.3rem' };
  const pds = { color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1rem' };
  const ft = { display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0', color: '#cbd5e1', fontSize: '0.8rem' };
  const pbt = (pop) => ({ width: '100%', padding: '0.6rem', marginTop: '1rem', background: pop ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(59,130,246,0.2)', color: 'white', border: pop ? 'none' : '1px solid rgba(59,130,246,0.3)', borderRadius: '0.8rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' });

  return (
    <div style={ps}><div style={ov} /><div style={ct}>
      <div style={hd}><h1 style={tt}>Choose Your Plan</h1><p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Start free, upgrade anytime.</p></div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setCurrency('usd')} style={{ padding: '0.25rem 0.8rem', borderRadius: '1.5rem', border: currency === 'usd' ? '2px solid #3b82f6' : '1px solid rgba(59,130,246,0.3)', background: currency === 'usd' ? 'rgba(59,130,246,0.2)' : 'rgba(20,30,55,0.5)', color: 'white', cursor: 'pointer', fontSize: '0.7rem' }}>USD</button>
        <button onClick={() => setCurrency('htg')} style={{ padding: '0.25rem 0.8rem', borderRadius: '1.5rem', border: currency === 'htg' ? '2px solid #3b82f6' : '1px solid rgba(59,130,246,0.3)', background: currency === 'htg' ? 'rgba(59,130,246,0.2)' : 'rgba(20,30,55,0.5)', color: 'white', cursor: 'pointer', fontSize: '0.7rem' }}>HTG</button>
      </div>
      <div style={pg}>
        {plans.map(p => (
          <div key={p.id} style={pc(p.popular)}>
            {p.popular && <div style={pbd}>Most Popular</div>}
            <div style={pn}>{p.icon} {p.name}</div>
            <div style={ppr}>{formatPrice(p.price, p.priceHtg)}</div>
            <p style={pds}>{p.desc}</p>
            {p.features.map((f, i) => <div key={i} style={ft}><Check size={14} color="#22c55e" /> {f}</div>)}
            <button onClick={p.action} style={pbt(p.popular)}>{p.id === 'free' ? p.btn : <><CreditCard size={14} /> {p.btn}</>}</button>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '3rem', padding: '1.5rem', background: 'rgba(20,30,55,0.4)', borderRadius: '1rem' }}>
        <h3 style={{ color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><HelpCircle size={18} color="#60a5fa" /> Need help?</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Contact us for a personalized recommendation.</p>
      </div>
    </div></div>
  );
}

export default Pricing;
