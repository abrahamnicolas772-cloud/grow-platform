import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) { setMessage({ type: 'error', text: 'You must accept the terms' }); return; }
    if (password !== confirmPassword) { setMessage({ type: 'error', text: 'Passwords do not match' }); return; }
    if (password.length < 6) { setMessage({ type: 'error', text: 'Password must be at least 6 characters' }); return; }
    setLoading(true);
    try {
      await api.register({ name, email, password });
      setMessage({ type: 'success', text: 'Account created! Check your email to verify.' });
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Registration error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #02122E 0%, #0A2A73 100%)', padding: '1rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '900px', width: '100%', background: 'white', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 35px -10px rgba(0,0,0,0.3)' }}>
        
        {/* Left Panel */}
        <div style={{ flex: 1, minWidth: '220px', background: 'linear-gradient(135deg, #02122E 0%, #0A2A73 100%)', padding: '2rem 1rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <img src="/logo.png" alt="GROW" style={{ width: '180px', filter: 'brightness(0) invert(1)', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Grow Regularly, Over Wellness</h1>
          <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>Start your learning journey today</p>
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, minWidth: '300px', padding: '2rem 2rem', background: 'white', position: 'relative' }}>
          <Link to="/" style={{ position: 'absolute', top: '1rem', left: '1.5rem', fontSize: '0.8rem', color: '#6B7280', textDecoration: 'none' }}>← Back</Link>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '0.3rem' }}>Create Account</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '1.5rem' }}>Join GROW and start learning</p>
          
          {message && (
            <div style={{ padding: '0.6rem', borderRadius: '0.5rem', marginBottom: '1rem', background: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24', fontSize: '0.8rem' }}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4B5563' }}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" style={{ width: '100%', padding: '0.6rem 0', border: 'none', borderBottom: '1.5px solid #E5E7EB', fontSize: '0.9rem', outline: 'none', background: 'transparent' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4B5563' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" style={{ width: '100%', padding: '0.6rem 0', border: 'none', borderBottom: '1.5px solid #E5E7EB', fontSize: '0.9rem', outline: 'none', background: 'transparent' }} />
            </div>
            <div style={{ marginBottom: '1rem', position: 'relative' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4B5563' }}>Password</label>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 6 characters" style={{ width: '100%', padding: '0.6rem 0', border: 'none', borderBottom: '1.5px solid #E5E7EB', fontSize: '0.9rem', outline: 'none', background: 'transparent' }} />
              <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0', bottom: '0.6rem', cursor: 'pointer', fontSize: '0.9rem' }}>{showPassword ? '🙈' : '👁️'}</span>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4B5563' }}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Repeat your password" style={{ width: '100%', padding: '0.6rem 0', border: 'none', borderBottom: '1.5px solid #E5E7EB', fontSize: '0.9rem', outline: 'none', background: 'transparent' }} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} style={{ width: '1rem', height: '1rem', accentColor: '#4F46E5' }} />
              <span style={{ fontSize: '0.7rem', color: '#4B5563' }}>I agree to the Terms of Service and Privacy Policy</span>
            </div>
            
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.7rem', background: loading ? '#9CA3AF' : '#4F46E5', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#6B7280', marginTop: '1.5rem' }}>
            Already have an account? <Link to="/login" style={{ color: '#4F46E5', fontWeight: '500', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
