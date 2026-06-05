import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.login({ email, password });
      setMessage({ type: 'success', text: '✅ Connexion réussie !' });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || '❌ Email ou mot de passe incorrect',
      });
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #02122E 0%, #0A2A73 100%)',
    padding: '1rem',
    fontFamily: "'Inter', sans-serif",
  };

  const cardStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '900px',
    width: '100%',
    background: 'white',
    borderRadius: '1.5rem',
    overflow: 'hidden',
    boxShadow: '0 20px 35px -10px rgba(0,0,0,0.3)',
  };

  const leftPanelStyle = {
    flex: 1,
    minWidth: '240px',
    background: 'linear-gradient(135deg, #02122E 0%, #0A2A73 100%)',
    padding: '2rem 1.5rem',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  };

  const logoImageStyle = {
    width: '200px',
    height: 'auto',
    filter: 'brightness(0) invert(1)',
  };

  const rightPanelStyle = {
    flex: 1,
    minWidth: '280px',
    padding: '2rem 1.8rem',
    background: 'white',
    position: 'relative',
  };

  const homeLinkStyle = {
    position: 'absolute',
    top: '1rem',
    left: '1.5rem',
    fontSize: '0.75rem',
    color: '#6B7280',
    textDecoration: 'none',
  };

  const formTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '1rem',
    marginTop: '1.5rem',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: '0.3rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 0',
    border: 'none',
    borderBottom: '1.5px solid #E5E7EB',
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: 'transparent',
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.6rem',
    background: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '2rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    margin: '0.8rem 0',
  };

  const dividerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    margin: '1rem 0',
    color: '#9CA3AF',
    fontSize: '0.7rem',
  };

  const dividerLineStyle = {
    flex: 1,
    height: '1px',
    background: '#E5E7EB',
  };

  const socialButtonsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.8rem',
    marginBottom: '1rem',
  };

  const socialButtonStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#F3F4F6',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };

  const footerStyle = {
    textAlign: 'center',
    fontSize: '0.7rem',
    color: '#6B7280',
  };

  const linkStyle = {
    color: '#4F46E5',
    textDecoration: 'none',
    fontWeight: '500',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Panneau gauche */}
        <div style={leftPanelStyle}>
          <img src="/logo.png" alt="GROW" style={logoImageStyle} />
          <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '1rem' }}>Grow Regularly, Over Wellness</div>
        </div>

        {/* Panneau droit */}
        <div style={rightPanelStyle}>
          <Link to="/" style={homeLinkStyle}>← Back</Link>

          <h2 style={formTitleStyle}>Welcome Back</h2>

          {message && (
            <div style={{ marginBottom: '0.8rem', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem', background: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24' }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} onFocus={(e) => e.target.style.borderBottomColor = '#4F46E5'} onBlur={(e) => e.target.style.borderBottomColor = '#E5E7EB'} />
            </div>

            <div style={{ marginBottom: '0.5rem', position: 'relative' }}>
              <label style={labelStyle}>Password</label>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} onFocus={(e) => e.target.style.borderBottomColor = '#4F46E5'} onBlur={(e) => e.target.style.borderBottomColor = '#E5E7EB'} />
              <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0', bottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>{showPassword ? '🙈' : '👁️'}</span>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '0.5rem' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.7rem', color: '#4F46E5', textDecoration: 'none' }}>Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} style={{ ...buttonStyle, background: loading ? '#9CA3AF' : '#4F46E5', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? '...' : 'Sign In'}
            </button>
          </form>

          <div style={dividerStyle}>
            <div style={dividerLineStyle}></div>
            <span>or</span>
            <div style={dividerLineStyle}></div>
          </div>

          <div style={socialButtonsStyle}>
            <div style={socialButtonStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#4285F4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/></svg>
            </div>
            <div style={socialButtonStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.69 4.54-4.69 1.31 0 2.68.23 2.68.23v2.97h-1.5c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24c5.74-.9 10.13-5.9 10.13-11.93z"/></svg>
            </div>
            <div style={socialButtonStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z"/></svg>
            </div>
          </div>

          <div style={footerStyle}>
            No account?{' '}
            <Link to="/register" style={linkStyle}>Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
