import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.forgotPassword({ email });
      setMessage({ type: 'success', text: 'If this email exists, a reset link has been sent.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #02122E 0%, #0A2A73 100%)', padding: '1rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '440px', width: '100%', background: 'white', borderRadius: '1.5rem', padding: '2.5rem 2rem', boxShadow: '0 20px 35px -10px rgba(0,0,0,0.3)' }}>
        <Link to="/login" style={{ fontSize: '0.8rem', color: '#6B7280', textDecoration: 'none' }}>← Back to login</Link>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Forgot Password?</h2>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1.5rem' }}>Enter your email and we'll send you a reset link.</p>
        
        {message && (
          <div style={{ padding: '0.6rem', borderRadius: '0.5rem', marginBottom: '1rem', background: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24', fontSize: '0.8rem' }}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4B5563' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" style={{ width: '100%', padding: '0.7rem 0', border: 'none', borderBottom: '1.5px solid #E5E7EB', fontSize: '0.9rem', outline: 'none', background: 'transparent' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.7rem', background: loading ? '#9CA3AF' : '#4F46E5', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
