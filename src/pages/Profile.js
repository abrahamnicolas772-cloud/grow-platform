import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { 
  User, Mail, Phone, Briefcase, Code, MapPin, Calendar, Globe, 
  Edit2, Save, X, Camera, Award, Image, 
  BookOpen, CheckCircle, TrendingUp, Clock, Building, AlertCircle
} from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

// Icônes SVG personnalisées (car lucide-react ne les a plus)
const TwitterIcon = ({ size = 14, color = '#60a5fa' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const LinkedinIcon = ({ size = 14, color = '#60a5fa' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const GithubIcon = ({ size = 14, color = '#60a5fa' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    occupation: '',
    skills: '',
    address: '',
    city: '',
    country: '',
    birthDate: '',
    website: '',
    twitter: '',
    linkedin: '',
    github: '',
    coverPhoto: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [message, setMessage] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    averageScore: 0,
  });

  // États pour le crop
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Chargement automatique des données du profil
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);
    
    // Charger toutes les informations du profil
    const savedProfile = localStorage.getItem(`userProfile_${userData.id}`);
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      setFormData({
        name: profileData.name || userData.name || '',
        email: profileData.email || userData.email || '',
        phone: profileData.phone || '',
        bio: profileData.bio || '',
        occupation: profileData.occupation || '',
        skills: profileData.skills || '',
        address: profileData.address || '',
        city: profileData.city || '',
        country: profileData.country || '',
        birthDate: profileData.birthDate || '',
        website: profileData.website || '',
        twitter: profileData.twitter || '',
        linkedin: profileData.linkedin || '',
        github: profileData.github || '',
        coverPhoto: profileData.coverPhoto || '',
      });
    } else {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: '',
        bio: '',
        occupation: '',
        skills: '',
        address: '',
        city: '',
        country: '',
        birthDate: '',
        website: '',
        twitter: '',
        linkedin: '',
        github: '',
        coverPhoto: '',
      });
    }
    
    // Charger la photo unique de l'utilisateur
    const savedPhoto = localStorage.getItem(`userPhoto_${userData.id}`);
    if (savedPhoto) setProfilePhoto(savedPhoto);
    
    // Charger la cover photo
    const savedCover = localStorage.getItem(`userCover_${userData.id}`);
    if (savedCover) setCoverPhoto(savedCover);
    
    loadUserData(userData.id);
  }, [navigate]);

  const loadUserData = async (userId) => {
    try {
      const enrollmentsRes = await api.getUserEnrollments(userId);
      const enrollmentsData = enrollmentsRes.data;
      
      // Enrichir avec la progression réelle
      const enrichedEnrollments = [];
      let totalLessonsAll = 0;
      let completedLessonsAll = 0;
      let completedCount = 0;
      
      for (const enrollment of enrollmentsData) {
        const lessonsKey = `completed_lessons_${enrollment.course_id}_${userId}`;
        const savedLessons = localStorage.getItem(lessonsKey);
        const completedLessons = savedLessons ? Object.keys(JSON.parse(savedLessons)).length : 0;
        
        let totalLessons = 0;
        try {
          const courseDetail = await api.getCourse(enrollment.course_id);
          if (courseDetail.data.modules) {
            for (const module of courseDetail.data.modules) {
              const lessonsRes = await api.getModuleLessons(module.id);
              totalLessons += lessonsRes.data.length;
            }
          }
        } catch (err) {}
        
        const progress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
        const isCompleted = progress === 100;
        
        enrichedEnrollments.push({
          ...enrollment,
          course_title: enrollment.course_title,
          progress,
          completed_lessons: completedLessons,
          total_lessons: totalLessons,
          isCompleted
        });
        
        totalLessonsAll += totalLessons;
        completedLessonsAll += completedLessons;
        if (isCompleted) completedCount++;
      }
      
      setEnrollments(enrichedEnrollments);
      
      const totalCourses = enrollmentsData.length;
      const avgScore = totalCourses > 0 
        ? Math.round(enrichedEnrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / totalCourses)
        : 0;
      
      setStats({
        totalCourses,
        completedCourses: completedCount,
        totalLessons: totalLessonsAll,
        completedLessons: completedLessonsAll,
        averageScore: avgScore,
      });
    } catch (err) {
      console.error('Erreur chargement données', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestion de la cover photo
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPhoto(reader.result);
        localStorage.setItem(`userCover_${user.id}`, reader.result);
        setMessage({ type: 'success', text: 'Cover photo mise à jour !' });
        setTimeout(() => setMessage(null), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestion du fichier sélectionné (avatar)
  const onFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => {
      image.onload = resolve;
    });
    
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    
    return canvas.toDataURL('image/jpeg');
  };

  const saveCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setProfilePhoto(croppedImage);
      localStorage.setItem(`userPhoto_${user.id}`, croppedImage);
      setCropModalOpen(false);
      setImageToCrop(null);
      setMessage({ type: 'success', text: 'Photo mise à jour !' });
      setTimeout(() => setMessage(null), 3000);
      window.dispatchEvent(new Event('userPhotoUpdated'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Erreur crop', err);
      setMessage({ type: 'error', text: 'Erreur lors du recadrage' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const profileData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
      occupation: formData.occupation,
      skills: formData.skills,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      birthDate: formData.birthDate,
      website: formData.website,
      twitter: formData.twitter,
      linkedin: formData.linkedin,
      github: formData.github,
      coverPhoto: formData.coverPhoto,
    };
    
    localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(profileData));
    
    const updatedUser = { ...user, name: formData.name, email: formData.email };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    setEditMode(false);
    setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
    setTimeout(() => setMessage(null), 3000);
    setLoading(false);
    
    window.dispatchEvent(new Event('storage'));
  };

  // Styles
  const pageStyle = {
    position: 'relative',
    minHeight: '100vh',
    paddingTop: '80px',
    fontFamily: "'Inter', 'Montserrat', sans-serif",
    backgroundImage: 'url("https://i.postimg.cc/3wxVp0ny/photo-2026-05-26-11-00-53.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    overflowX: 'hidden',
  };

  const darkOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(3px)',
    zIndex: 0,
    pointerEvents: 'none',
  };

  const containerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem',
    position: 'relative',
    zIndex: 1,
  };

  const layoutStyle = {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
  };

  const mainStyle = {
    flex: 1,
  };

  const cardStyle = {
    background: 'rgba(20, 30, 55, 0.6)',
    backdropFilter: 'blur(12px)',
    borderRadius: '1rem',
    overflow: 'hidden',
    border: '1px solid rgba(59,130,246,0.2)',
    marginBottom: '1rem',
  };

  const cardContentStyle = {
    padding: '1rem',
  };

  // Cover styles
  const coverContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '200px',
    borderRadius: '1rem 1rem 0 0',
    overflow: 'hidden',
    background: coverPhoto ? 'none' : 'linear-gradient(135deg, #1e3a5f, #3b82f6, #06b6d4)',
  };

  const coverImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const coverOverlayStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(transparent, rgba(20, 30, 55, 0.7))',
  };

  const editCoverButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(0,0,0,0.6)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.4rem 0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    cursor: 'pointer',
    fontSize: '0.75rem',
    backdropFilter: 'blur(4px)',
    transition: 'background 0.2s',
  };

  const avatarContainerStyle = {
    position: 'relative',
    display: 'inline-block',
    marginTop: '-50px',
    marginBottom: '0.5rem',
    zIndex: 2,
  };

  const avatarStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid rgba(20, 30, 55, 0.8)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  };

  const editPhotoButtonStyle = {
    position: 'absolute',
    bottom: '5px',
    right: '5px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '0.7rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '0.8rem',
    marginBottom: '1rem',
  };

  const statCardStyle = {
    background: 'rgba(20, 30, 55, 0.4)',
    borderRadius: '0.8rem',
    padding: '0.6rem',
    textAlign: 'center',
    border: '1px solid rgba(59,130,246,0.15)',
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '0.8rem',
  };

  const infoItemStyle = {
    padding: '0.4rem 0',
    borderBottom: '1px solid rgba(59,130,246,0.08)',
    fontSize: '0.8rem',
    color: '#cbd5e1',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 0',
    border: 'none',
    borderBottom: '1px solid rgba(59,130,246,0.3)',
    background: 'transparent',
    color: 'white',
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const textareaStyle = {
    ...inputStyle,
    border: '1px solid rgba(59,130,246,0.3)',
    borderRadius: '0.5rem',
    padding: '0.5rem',
    resize: 'vertical',
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white',
    border: 'none',
    padding: '0.4rem 1rem',
    borderRadius: '1.5rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    fontSize: '0.75rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
  };

  const buttonSecondaryStyle = {
    background: 'transparent',
    color: '#94a3b8',
    border: '1px solid rgba(59,130,246,0.3)',
    padding: '0.4rem 1rem',
    borderRadius: '1.5rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    fontSize: '0.75rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '0.8rem',
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.9)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const modalContentStyle = {
    width: '90%',
    maxWidth: '500px',
    background: '#1e293b',
    borderRadius: '1rem',
    overflow: 'hidden',
    position: 'relative',
  };

  const cropContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '300px',
    background: '#0f172a',
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={darkOverlayStyle} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative', zIndex: 1 }}>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={darkOverlayStyle} />
      <div style={containerStyle}>
        <div style={layoutStyle}>
          <Sidebar />
          <div style={mainStyle}>
            {/* En-tête du profil AVEC COVER */}
            <div style={cardStyle}>
              {/* Cover Photo */}
              <div style={coverContainerStyle}>
                {coverPhoto && <img src={coverPhoto} alt="Cover" style={coverImageStyle} />}
                <div style={coverOverlayStyle} />
                <button style={editCoverButtonStyle} onClick={() => coverInputRef.current?.click()}>
                  <Image size={14} /> Edit Cover
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  style={{ display: 'none' }}
                  ref={coverInputRef}
                />
              </div>
              
              {/* Avatar et nom */}
              <div style={{ ...cardContentStyle, textAlign: 'center', paddingTop: '0.5rem' }}>
                <div style={avatarContainerStyle}>
                  <img
                    src={profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || user?.name || '')}&background=3b82f6&color=fff&size=100`}
                    alt="Avatar"
                    style={avatarStyle}
                  />
                  <label style={editPhotoButtonStyle}>
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFileSelect}
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                    />
                  </label>
                </div>
                {!editMode ? (
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.2rem' }}>{formData.name || user?.name}</h2>
                ) : (
                  <input name="name" value={formData.name} onChange={handleInputChange} style={{ ...inputStyle, textAlign: 'center', fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.2rem' }} placeholder="Nom" />
                )}
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{formData.email || user?.email}</p>
                {!editMode ? (
                  <button style={buttonStyle} onClick={() => setEditMode(true)}>
                    <Edit2 size={14} /> Edit Profile
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button style={buttonSecondaryStyle} onClick={() => setEditMode(false)}><X size={14} /> Cancel</button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div style={{ ...cardStyle, background: message.type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}` }}>
                <div style={cardContentStyle}>
                  <p style={{ color: message.type === 'success' ? '#22c55e' : '#ef4444', textAlign: 'center', fontSize: '0.8rem' }}>{message.text}</p>
                </div>
              </div>
            )}

            {/* Formulaire d'édition */}
            {editMode && (
              <div style={cardStyle}>
                <div style={cardContentStyle}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.8rem' }}>Edit Profile</h3>
                  <form onSubmit={handleUpdateProfile}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.8rem', marginBottom: '0.8rem' }}>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem', display: 'block' }}>Cover Photo URL</label>
                        <input type="text" name="coverPhoto" value={formData.coverPhoto} onChange={handleInputChange} style={inputStyle} placeholder="https://..." />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem', display: 'block' }}>Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={inputStyle} required />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem', display: 'block' }}>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={inputStyle} required />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem', display: 'block' }}>Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={inputStyle} placeholder="+509 XX XX XXXX" />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem', display: 'block' }}>Occupation</label>
                        <input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} style={inputStyle} placeholder="Developer, Designer, ..." />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem', display: 'block' }}>Skills</label>
                        <input type="text" name="skills" value={formData.skills} onChange={handleInputChange} style={inputStyle} placeholder="React, Python, UI/UX, ..." />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem', display: 'block' }}>Birth Date</label>
                        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem', display: 'block' }}>Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} style={inputStyle} placeholder="Address" />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem', display: 'block' }}>City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} style={inputStyle} placeholder="City" />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem', display: 'block' }}>Country</label>
                        <input type="text" name="country" value={formData.country} onChange={handleInputChange} style={inputStyle} placeholder="Country" />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem', display: 'block' }}>Website</label>
                        <input type="url" name="website" value={formData.website} onChange={handleInputChange} style={inputStyle} placeholder="https://..." />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem', display: 'block' }}>Twitter</label>
                        <input type="text" name="twitter" value={formData.twitter} onChange={handleInputChange} style={inputStyle} placeholder="@username" />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem', display: 'block' }}>LinkedIn</label>
                        <input type="text" name="linkedin" value={formData.linkedin} onChange={handleInputChange} style={inputStyle} placeholder="linkedin.com/in/..." />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem', display: 'block' }}>GitHub</label>
                        <input type="text" name="github" value={formData.github} onChange={handleInputChange} style={inputStyle} placeholder="github.com/username" />
                      </div>
                      <div style={{ gridColumn: '1/-1' }}>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem', display: 'block' }}>Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="3" style={textareaStyle} placeholder="Tell us about yourself..." />
                      </div>
                    </div>
                    <button type="submit" style={buttonStyle} disabled={loading}>
                      <Save size={14} /> {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Affichage des informations (mode lecture) */}
            {!editMode && (
              <div style={cardStyle}>
                <div style={cardContentStyle}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <User size={16} /> Personal Information
                  </h3>
                  <div style={infoGridStyle}>
                    <div style={infoItemStyle}><User size={14} color="#60a5fa" /> <strong>Name:</strong> {formData.name || user?.name || 'Not specified'}</div>
                    <div style={infoItemStyle}><Mail size={14} color="#60a5fa" /> <strong>Email:</strong> {formData.email || user?.email || 'Not specified'}</div>
                    <div style={infoItemStyle}><Phone size={14} color="#60a5fa" /> <strong>Phone:</strong> {formData.phone || 'Not specified'}</div>
                    <div style={infoItemStyle}><Briefcase size={14} color="#60a5fa" /> <strong>Occupation:</strong> {formData.occupation || 'Not specified'}</div>
                    <div style={infoItemStyle}><Code size={14} color="#60a5fa" /> <strong>Skills:</strong> {formData.skills || 'Not specified'}</div>
                    <div style={infoItemStyle}><Calendar size={14} color="#60a5fa" /> <strong>Birth Date:</strong> {formData.birthDate ? new Date(formData.birthDate).toLocaleDateString() : 'Not specified'}</div>
                    <div style={infoItemStyle}><MapPin size={14} color="#60a5fa" /> <strong>Location:</strong> {[formData.address, formData.city, formData.country].filter(Boolean).join(', ') || 'Not specified'}</div>
                    <div style={infoItemStyle}><Globe size={14} color="#60a5fa" /> <strong>Website:</strong> {formData.website ? <a href={formData.website} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>{formData.website}</a> : 'Not specified'}</div>
                    <div style={infoItemStyle}><TwitterIcon size={14} color="#60a5fa" /> <strong>Twitter:</strong> {formData.twitter || 'Not specified'}</div>
                    <div style={infoItemStyle}><LinkedinIcon size={14} color="#60a5fa" /> <strong>LinkedIn:</strong> {formData.linkedin || 'Not specified'}</div>
                    <div style={infoItemStyle}><GithubIcon size={14} color="#60a5fa" /> <strong>GitHub:</strong> {formData.github || 'Not specified'}</div>
                    <div style={{ gridColumn: '1/-1' }} className="info-item"><strong>Bio:</strong> {formData.bio || 'Not specified'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistiques */}
            <div style={cardStyle}>
              <div style={cardContentStyle}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <TrendingUp size={16} /> Learning Statistics
                </h3>
                <div style={statsGridStyle}>
                  <div style={statCardStyle}>
                    <BookOpen size={20} color="#60a5fa" style={{ marginBottom: '0.2rem' }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#60a5fa' }}>{stats.totalCourses}</div>
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Courses Enrolled</div>
                  </div>
                  <div style={statCardStyle}>
                    <CheckCircle size={20} color="#22c55e" style={{ marginBottom: '0.2rem' }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#22c55e' }}>{stats.completedCourses}</div>
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Completed</div>
                  </div>
                  <div style={statCardStyle}>
                    <Award size={20} color="#f59e0b" style={{ marginBottom: '0.2rem' }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.completedLessons}/{stats.totalLessons}</div>
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Lessons Done</div>
                  </div>
                  <div style={statCardStyle}>
                    <TrendingUp size={20} color="#8b5cf6" style={{ marginBottom: '0.2rem' }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#8b5cf6' }}>{stats.averageScore}%</div>
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Avg Score</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cours suivis */}
            <div style={cardStyle}>
              <div style={cardContentStyle}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <BookOpen size={16} /> My Courses
                </h3>
                {enrollments.length === 0 ? (
                  <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '0.8rem' }}>No courses enrolled yet.</p>
                ) : (
                  <div style={gridStyle}>
                    {enrollments.map((enrollment) => (
                      <div key={enrollment.id} style={{ background: 'rgba(59,130,246,0.08)', borderRadius: '0.6rem', padding: '0.6rem' }}>
                        <div style={{ fontWeight: '500', fontSize: '0.85rem', marginBottom: '0.2rem', color: 'white' }}>{enrollment.course_title}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Progress: {enrollment.progress}%</span>
                          <Link to={`/learning/${enrollment.course_id}`} style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.7rem' }}>Continue →</Link>
                        </div>
                        <div style={{ width: '100%', height: '3px', background: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${enrollment.progress}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de recadrage */}
      {cropModalOpen && imageToCrop && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <div style={cropContainerStyle}>
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div style={{ padding: '0.8rem', display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
              <button style={buttonSecondaryStyle} onClick={() => { setCropModalOpen(false); setImageToCrop(null); }}>Cancel</button>
              <button style={buttonStyle} onClick={saveCroppedImage}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;