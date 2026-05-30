import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, User, LogOut, GraduationCap, Settings, Bell, Award, Shield } from 'lucide-react';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/courses', icon: <BookOpen size={20} />, label: 'My Courses' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  const sidebarStyle = {
    width: '280px',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(12px)',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    border: '1px solid rgba(71, 85, 105, 0.3)',
    alignSelf: 'start',
    position: 'sticky',
    top: '100px',
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #60a5fa, #a5b4fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '2rem',
    cursor: 'pointer',
    textAlign: 'center',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(71, 85, 105, 0.3)',
  };

  const navItemStyle = (active) => ({
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    color: active ? '#ffffff' : '#94a3b8',
    backgroundColor: active ? 'rgba(59,130,246,0.2)' : 'transparent',
    fontWeight: active ? '600' : '500',
    marginBottom: '0.5rem',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
  });

  const iconStyle = {
    width: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const logoutStyle = {
    ...navItemStyle(false),
    marginTop: '2rem',
    borderTop: '1px solid rgba(71, 85, 105, 0.3)',
    paddingTop: '1rem',
    color: '#ef4444',
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={sidebarStyle}>
      <div style={logoStyle} onClick={() => navigate('/')}>
        GROW
      </div>
      <nav>
        {menuItems.map((item) => (
          <div
            key={item.path}
            style={navItemStyle(isActive(item.path))}
            onClick={() => navigate(item.path)}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.1)';
                e.currentTarget.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }
            }}
          >
            <span style={iconStyle}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}

        {/* Admin link - visible only for admin */}
        {user?.email === 'admin@grow.com' && (
          <div
            style={navItemStyle(isActive('/admin'))}
            onClick={() => navigate('/admin')}
            onMouseEnter={(e) => {
              if (!isActive('/admin')) {
                e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.1)';
                e.currentTarget.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/admin')) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }
            }}
          >
            <span style={iconStyle}><Shield size={20} /></span>
            <span>Admin</span>
          </div>
        )}
      </nav>
      <div style={logoutStyle} onClick={handleLogout}>
        <span style={iconStyle}><LogOut size={20} /></span>
        <span>Logout</span>
      </div>
    </div>
  );
}

export default Sidebar;
