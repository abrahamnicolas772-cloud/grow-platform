import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage({ type: 'error', text: 'Invalid or missing reset token.' });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setMessage({ type: 'error', text: 'Passwords do not match' }); return; }
    if (password.length < 6) { setMessage({ type: 'error', text: 'Password must be at least 6 characters' }); return; }
    setLoading(true);
    try {
      await api.resetPassword({ token, password });
      setMessage({ type: 'success', text: 'Password reset! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Error resetting password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #02122E 0%, #0A2A73 100%)', padding: '1rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '440px', width: '100%', background: 'white', borderRadius: '1.5rem', padding: '2.5rem 2rem', boxShadow: '0 20px 35px -10px rgba(0,0,0,0.3)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Reset Password</h2>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1.5rem' }}>Enter your new password.</p>
        
        {message && (
          <div style={{ padding: '0.6rem', borderRadius: '0.5rem', marginBottom: '1rem', background: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24', fontSize: '0.8rem' }}>
            {message.text}
          </div>
        )}
        
        {token && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4B5563' }}>New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 6 characters" style={{ width: '100%', padding: '0.7rem 0', border: 'none', borderBottom: '1.5px solid #E5E7EB', fontSize: '0.9rem', outline: 'none', background: 'transparent' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4B5563' }}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Repeat password" style={{ width: '100%', padding: '0.7rem 0', border: 'none', borderBottom: '1.5px solid #E5E7EB', fontSize: '0.9rem', outline: 'none', background: 'transparent' }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.7rem', background: loading ? '#9CA3AF' : '#4F46E5', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
