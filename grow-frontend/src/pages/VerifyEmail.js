import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';

function VerifyEmail() {
  const [message, setMessage] = useState({ type: 'info', text: 'Verifying your email...' });
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage({ type: 'error', text: 'Invalid verification link.' });
      return;
    }
    api.verifyEmail({ token })
      .then(() => {
        setMessage({ type: 'success', text: 'Email verified! Redirecting to login...' });
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch(() => {
        setMessage({ type: 'error', text: 'Invalid or expired verification link.' });
      });
  }, [token, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #02122E 0%, #0A2A73 100%)', padding: '1rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '440px', width: '100%', background: 'white', borderRadius: '1.5rem', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 20px 35px -10px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
        <div style={{ padding: '1rem', borderRadius: '0.5rem', background: message.type === 'success' ? '#d4edda' : message.type === 'error' ? '#f8d7da' : '#e3f2fd', color: message.type === 'success' ? '#155724' : message.type === 'error' ? '#721c24' : '#1e3a5f', fontSize: '0.9rem' }}>
          {message.text}
        </div>
        {message.type === 'error' && (
          <Link to="/login" style={{ display: 'inline-block', marginTop: '1rem', color: '#4F46E5', textDecoration: 'none', fontWeight: '500' }}>Go to login</Link>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;

