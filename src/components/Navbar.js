import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import NotificationBell from './NotificationBell';

function Navbar() {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('grow_language') || 'en';
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('grow_language', language);
  }, [language]);

  const toggleLanguage = () => {
    // Cycle through languages: en -> fr -> ht -> en
    const languages = ['en', 'fr', 'ht'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const getLanguageLabel = () => {
    switch(language) {
      case 'en': return 'EN';
      case 'fr': return 'FR';
      case 'ht': return 'HT';
      default: return 'EN';
    }
  };

  const loadUserData = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      const photo = localStorage.getItem(`userPhoto_${userData.id}`);
      setProfilePhoto(photo);
    } else {
      setUser(null);
      setProfilePhoto(null);
    }
  };

  useEffect(() => {
    loadUserData();

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const handleStorageChange = () => {
      loadUserData();
    };
    window.addEventListener('storage', handleStorageChange);

    const handleForceUpdate = () => {
      loadUserData();
    };
    window.addEventListener('userPhotoUpdated', handleForceUpdate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userPhotoUpdated', handleForceUpdate);
    };
  }, []);

  useEffect(() => {
    loadUserData();
  }, [location]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setProfilePhoto(null);
    navigate('/');
  };

  const navStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: isScrolled ? 'white' : 'white',
    boxShadow: isScrolled ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
    padding: '0.6rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem',
    transition: 'all 0.3s',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  };

  const logoImageStyle = {
    height: '55px',
    width: 'auto',
  };

  const searchContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flex: 1,
    maxWidth: '350px',
  };

  const searchInputStyle = {
    flex: 1,
    padding: '0.5rem 1rem',
    border: '1px solid #cbd5e1',
    borderRadius: '2rem',
    outline: 'none',
    fontSize: '0.85rem',
    background: '#f8fafc',
    color: '#1e293b',
  };

  const searchButtonStyle = {
    padding: '0.5rem 1rem',
    background: '#0a2540',
    color: 'white',
    border: 'none',
    borderRadius: '2rem',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.8rem',
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#1e293b',
    fontWeight: '500',
    transition: 'color 0.2s',
    fontSize: '0.85rem',
  };

  const activeLinkStyle = {
    ...linkStyle,
    color: '#0a2540',
    fontWeight: '600',
  };

  const loginButtonStyle = {
    background: 'transparent',
    color: '#0a2540',
    border: '1.5px solid #0a2540',
    padding: '0.4rem 1rem',
    borderRadius: '2rem',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.8rem',
  };

  const signupButtonStyle = {
    background: '#0a2540',
    color: 'white',
    padding: '0.4rem 1rem',
    borderRadius: '2rem',
    textDecoration: 'none',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem',
  };

  const logoutButtonStyle = {
    background: '#0a2540',
    color: 'white',
    padding: '0.4rem 1rem',
    borderRadius: '2rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.8rem',
  };

  const languageButtonStyle = {
    background: 'transparent',
    color: '#0a2540',
    border: '1.5px solid #0a2540',
    padding: '0.3rem 0.8rem',
    borderRadius: '2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontWeight: '500',
    fontSize: '0.75rem',
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  };

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #0a2540',
  };

  const userNameStyle = {
    fontWeight: '500',
    fontSize: '0.75rem',
    color: '#1e293b',
    maxWidth: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={navStyle}>
      <div style={logoStyle} onClick={() => navigate('/')}>
        <img src="/logo.png" alt="GROW" style={logoImageStyle} />
      </div>

      <form onSubmit={handleSearchSubmit} style={searchContainerStyle}>
        <input
          type="text"
          placeholder={language === 'en' ? "Search..." : language === 'fr' ? "Rechercher..." : "Chèche..."}
          value={searchTerm}
          onChange={handleSearchChange}
          style={searchInputStyle}
        />
        <button type="submit" style={searchButtonStyle}>
          {language === 'en' ? "Search" : language === 'fr' ? "Rechercher" : "Chèche"}
        </button>
      </form>

      <div style={navLinksStyle}>
        <Link to="/" style={isActive('/') ? activeLinkStyle : linkStyle}>
          {language === 'en' ? "Home" : language === 'fr' ? "Accueil" : "Akèy"}
        </Link>
        <Link to="/courses" style={isActive('/courses') ? activeLinkStyle : linkStyle}>
          {language === 'en' ? "Courses" : language === 'fr' ? "Cours" : "Kou"}
        </Link>
        <Link to="/mentors" style={isActive('/mentors') ? activeLinkStyle : linkStyle}>
          {language === 'en' ? "Mentors" : "Mentors"}
        </Link>
        <Link to="/resources" style={isActive('/resources') ? activeLinkStyle : linkStyle}>
          {language === 'en' ? "Resources" : language === 'fr' ? "Ressources" : "Resous"}
        </Link>
        <Link to="/pricing" style={isActive('/pricing') ? activeLinkStyle : linkStyle}>
          {language === 'en' ? "Pricing" : language === 'fr' ? "Tarifs" : "Pri"}
        </Link>

        {/* Notification Bell */}
        <NotificationBell />

        <button onClick={toggleLanguage} style={languageButtonStyle}>
          <Globe size={14} />
          {getLanguageLabel()}
        </button>

        {user ? (
          <>
            <Link to="/dashboard" style={isActive('/dashboard') ? activeLinkStyle : linkStyle}>
              {language === 'en' ? "Dashboard" : language === 'fr' ? "Tableau de bord" : "Tablo"}
            </Link>
            <div style={userInfoStyle} onClick={() => navigate('/profile')}>
              <img
                src={profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0a2540&color=fff&size=32`}
                alt="Avatar"
                style={avatarStyle}
              />
              <span style={userNameStyle}>{user.name.split(' ')[0]}</span>
            </div>
            <button style={logoutButtonStyle} onClick={handleLogout}>
              {language === 'en' ? "Logout" : language === 'fr' ? "Déconnexion" : "Dekonekte"}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={loginButtonStyle}>
              {language === 'en' ? "Log in" : language === 'fr' ? "Connexion" : "Konekte"}
            </Link>
            <Link to="/register" style={signupButtonStyle}>
              {language === 'en' ? "Sign up" : language === 'fr' ? "Inscription" : "Enskri"}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;