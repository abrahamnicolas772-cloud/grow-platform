import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Star, Award, Briefcase, Calendar, Mail, MapPin, 
  BookOpen, Users, Video, MessageCircle, ChevronRight, Search, Filter,
  X, CheckCircle, Clock, ThumbsUp, ExternalLink,
  GraduationCap, Code, Database, Layout, Smartphone, Shield, Globe
} from 'lucide-react';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import api from '../services/api';

function Mentors() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const expertiseAreas = [
    { id: 'all', name: 'All', icon: <Users size={14} /> },
    { id: 'web', name: 'Web', icon: <Code size={14} /> },
    { id: 'data', name: 'Data', icon: <Database size={14} /> },
    { id: 'design', name: 'Design', icon: <Layout size={14} /> },
    { id: 'mobile', name: 'Mobile', icon: <Smartphone size={14} /> },
    { id: 'security', name: 'Security', icon: <Shield size={14} /> },
  ];

  const ratingOptions = [
    { id: 'all', name: 'All' },
    { id: '4.5', name: '4.5+' },
    { id: '4.0', name: '4.0+' },
    { id: '3.5', name: '3.5+' },
  ];

  useEffect(() => { loadMentors(); loadCourses(); }, []);

  const loadCourses = async () => {
    try { const response = await api.getCourses(); setCourses(response.data); } catch (err) {}
  };

  const loadMentors = async () => {
    try {
      const fakeMentors = courses.map((course, index) => ({
        id: course.id,
        name: getMentorNameByCourse(course.title),
        title: getMentorTitleByCourse(course.title),
        expertise: getExpertiseByCourse(course.title),
        rating: 4.5 + Math.random() * 0.5,
        totalStudents: Math.floor(Math.random() * 5000) + 500,
        totalCourses: 1,
        experience: `${Math.floor(Math.random() * 10) + 3}+ years`,
        location: ['San Francisco', 'New York', 'London', 'Paris', 'Berlin'][Math.floor(Math.random() * 5)],
        email: `mentor${course.id}@grow.com`,
        bio: `Expert in ${course.title} with years of industry experience. Passionate about teaching.`,
        avatar: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${(index % 50) + 1}.jpg`,
        coverImage: `https://picsum.photos/id/${index + 10}/800/300`,
        specialties: course.title.split(' '),
        education: ['Master\'s in CS', 'Bachelor\'s in SE'],
        achievements: ['Published Author', 'Open Source Contributor', 'Speaker'],
        social: { linkedin: '#', twitter: '#', github: '#' },
        availableForMentoring: true,
        responseTime: 'within 24h',
        hourlyRate: Math.floor(Math.random() * 50) + 50
      }));
      setMentors(fakeMentors);
      setFilteredMentors(fakeMentors);
      setLoading(false);
    } catch (err) { setLoading(false); }
  };

  const getMentorNameByCourse = (t) => {
    const n = ['Sarah Johnson', 'Michael Chen', 'Emma Rodriguez', 'David Kim', 'Lisa Wang', 'James Wilson', 'Maria Garcia', 'Alex Kumar'];
    let h = 0; for (let i = 0; i < t.length; i++) { h = ((h << 5) - h) + t.charCodeAt(i); h |= 0; }
    return n[Math.abs(h) % n.length];
  };
  const getMentorTitleByCourse = (t) => {
    if (t.toLowerCase().includes('web') || t.toLowerCase().includes('react')) return 'Senior Full Stack Dev';
    if (t.toLowerCase().includes('data')) return 'Data Science Expert';
    if (t.toLowerCase().includes('design') || t.toLowerCase().includes('ui')) return 'UI/UX Director';
    return 'Senior Instructor';
  };
  const getExpertiseByCourse = (t) => {
    if (t.toLowerCase().includes('web') || t.toLowerCase().includes('react')) return 'web';
    if (t.toLowerCase().includes('data')) return 'data';
    if (t.toLowerCase().includes('design') || t.toLowerCase().includes('ui')) return 'design';
    if (t.toLowerCase().includes('mobile')) return 'mobile';
    if (t.toLowerCase().includes('security')) return 'security';
    return 'web';
  };

  useEffect(() => { filterMentors(); }, [searchTerm, selectedExpertise, selectedRating, mentors]);

  const filterMentors = () => {
    let f = [...mentors];
    if (searchTerm) f = f.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
    if (selectedExpertise !== 'all') f = f.filter(m => m.expertise === selectedExpertise);
    if (selectedRating !== 'all') f = f.filter(m => m.rating >= parseFloat(selectedRating));
    setFilteredMentors(f);
  };

  const resetFilters = () => { setSearchTerm(''); setSelectedExpertise('all'); setSelectedRating('all'); };
  const openMentorModal = (m) => { setSelectedMentor(m); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setSelectedMentor(null); };
  const bookSession = (m) => { alert(`Booking with ${m.name}. Coming soon!`); };

  const pageStyle = {
    minHeight: '100vh', paddingTop: '70px', fontFamily: "'Inter', sans-serif",
    backgroundImage: 'url("https://i.postimg.cc/3wxVp0ny/photo-2026-05-26-11-00-53.jpg")',
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
  };
  const darkOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)', zIndex: 0, pointerEvents: 'none' };
  const containerStyle = { maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem', position: 'relative', zIndex: 1 };
  const headerStyle = { marginBottom: '1rem', textAlign: 'center' };
  const titleStyle = { fontSize: '1.8rem', fontWeight: '700', background: 'linear-gradient(135deg, #ffffff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.3rem' };
  const searchContainerStyle = { display: 'flex', gap: '0.8rem', marginBottom: '0.8rem', flexWrap: 'wrap' };
  const searchInputStyle = { flex: 1, padding: '0.5rem 0.8rem', background: 'rgba(20,30,55,0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.8rem', color: 'white', fontSize: '0.8rem', outline: 'none' };
  const filterButtonStyle = { padding: '0.5rem 1rem', background: 'rgba(20,30,55,0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.8rem', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' };
  const filtersPanelStyle = { marginBottom: '0.8rem', padding: '0.8rem', background: 'rgba(20,30,55,0.5)', backdropFilter: 'blur(12px)', borderRadius: '0.8rem', border: '1px solid rgba(59,130,246,0.15)' };
  const filterGroupStyle = { marginBottom: '0.6rem' };
  const filterLabelStyle = { fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.3rem', display: 'block' };
  const filterOptionsStyle = { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' };
  const filterChipStyle = (active) => ({ padding: '0.2rem 0.6rem', background: active ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(30,41,59,0.5)', border: 'none', borderRadius: '1.5rem', color: active ? 'white' : '#94a3b8', cursor: 'pointer', fontSize: '0.7rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.2rem' });
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '0.8rem' };
  const cardStyle = { background: 'rgba(20,30,55,0.5)', backdropFilter: 'blur(12px)', borderRadius: '0.8rem', overflow: 'hidden', border: '1px solid rgba(59,130,246,0.15)', transition: 'transform 0.3s', cursor: 'pointer' };
  const cardHeaderStyle = { position: 'relative', height: '80px', background: 'linear-gradient(135deg, #1e3a8a, #312e81)' };
  const avatarStyle = { position: 'absolute', bottom: '-25px', left: '0.8rem', width: '55px', height: '55px', borderRadius: '50%', border: '3px solid #0a2540', objectFit: 'cover' };
  const cardContentStyle = { padding: '0.8rem', marginTop: '1.5rem' };
  const mentorNameStyle = { fontSize: '0.95rem', fontWeight: '600', color: 'white', marginBottom: '0.15rem' };
  const mentorTitleStyle = { fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.3rem' };
  const ratingStyle = { display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.3rem', fontSize: '0.75rem' };
  const statsStyle = { display: 'flex', gap: '0.8rem', marginBottom: '0.3rem', fontSize: '0.65rem', color: '#64748b' };
  const specialtiesStyle = { display: 'flex', flexWrap: 'wrap', gap: '0.2rem', marginBottom: '0.6rem' };
  const specialtyTagStyle = { padding: '0.15rem 0.4rem', background: 'rgba(59,130,246,0.1)', borderRadius: '0.8rem', fontSize: '0.6rem', color: '#60a5fa' };
  const buttonStyle = { width: '100%', padding: '0.35rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', borderRadius: '0.4rem', color: 'white', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' };
  const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' };
  const modalStyle = { maxWidth: '800px', width: '100%', maxHeight: '85vh', overflowY: 'auto', background: '#0a0a0f', borderRadius: '1rem', border: '1px solid rgba(59,130,246,0.3)', position: 'relative' };
  const modalCloseStyle = { position: 'absolute', top: '0.8rem', right: '0.8rem', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', zIndex: 1 };

  if (loading) {
    return (
      <div style={pageStyle}><div style={darkOverlay} /><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative', zIndex: 1 }}><div className="loading-spinner"></div></div></div>
    );
  }

  if (!showModal) {
    return (
      <div style={pageStyle}>
        <div style={darkOverlay} />
        <div style={containerStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>Expert Mentors</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Learn from industry experts and accelerate your career</p>
          </div>
          <div style={searchContainerStyle}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input type="text" placeholder="Search by name, expertise..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...searchInputStyle, paddingLeft: '2.2rem' }} />
            </div>
            <button style={filterButtonStyle} onClick={() => setShowFilters(!showFilters)}><Filter size={14} /> Filters</button>
          </div>
          {showFilters && (
            <div style={filtersPanelStyle}>
              <div style={filterGroupStyle}>
                <label style={filterLabelStyle}>Expertise</label>
                <div style={filterOptionsStyle}>
                  {expertiseAreas.map(a => (
                    <button key={a.id} style={filterChipStyle(selectedExpertise === a.id)} onClick={() => setSelectedExpertise(a.id)}>{a.icon} {a.name}</button>
                  ))}
                </div>
              </div>
              <div style={filterGroupStyle}>
                <label style={filterLabelStyle}>Rating</label>
                <div style={filterOptionsStyle}>
                  {ratingOptions.map(o => (
                    <button key={o.id} style={filterChipStyle(selectedRating === o.id)} onClick={() => setSelectedRating(o.id)}>{o.name}</button>
                  ))}
                </div>
              </div>
              <button onClick={resetFilters} style={{ fontSize: '0.65rem', color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}>Reset all</button>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''}</span>
          </div>
          {filteredMentors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(20,30,55,0.5)', borderRadius: '0.8rem' }}>
              <Users size={36} color="#64748b" />
              <h3 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1rem' }}>No mentors found</h3>
              <button onClick={resetFilters} style={{ ...buttonStyle, width: 'auto', padding: '0.3rem 1rem', marginTop: '0.5rem' }}>Clear filters</button>
            </div>
          ) : (
            <div style={gridStyle}>
              {filteredMentors.map((mentor) => (
                <div key={mentor.id} style={cardStyle} onClick={() => openMentorModal(mentor)}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={cardHeaderStyle}>
                    <img src={mentor.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <img src={mentor.avatar} alt={mentor.name} style={avatarStyle} />
                  </div>
                  <div style={cardContentStyle}>
                    <h3 style={mentorNameStyle}>{mentor.name}</h3>
                    <p style={mentorTitleStyle}>{mentor.title}</p>
                    <div style={ratingStyle}>
                      <Star size={12} color="#fbbf24" fill="#fbbf24" />
                      <span style={{ color: 'white', fontWeight: '600' }}>{mentor.rating}</span>
                      <span style={{ color: '#64748b' }}>({mentor.totalStudents.toLocaleString()})</span>
                    </div>
                    <div style={statsStyle}>
                      <span><Briefcase size={10} /> {mentor.experience}</span>
                      <span><BookOpen size={10} /> {mentor.totalCourses} courses</span>
                    </div>
                    <div style={specialtiesStyle}>
                      {mentor.specialties.slice(0, 3).map((s, i) => <span key={i} style={specialtyTagStyle}>{s}</span>)}
                    </div>
                    <button style={buttonStyle}>View Profile <ChevronRight size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={darkOverlay} />
      <div style={modalOverlayStyle} onClick={closeModal}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <button style={modalCloseStyle} onClick={closeModal}><X size={18} /></button>
          {selectedMentor && (
            <div>
              <div style={{ height: '150px', overflow: 'hidden' }}>
                <img src={selectedMentor.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.5rem', textAlign: 'center', marginTop: '-40px' }}>
                <img src={selectedMentor.avatar} alt={selectedMentor.name} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #0a2540', marginBottom: '0.5rem' }} />
                <h2 style={{ fontSize: '1.4rem', color: 'white', marginBottom: '0.3rem' }}>{selectedMentor.name}</h2>
                <p style={{ color: '#60a5fa', marginBottom: '0.8rem', fontSize: '0.85rem' }}>{selectedMentor.title}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.8rem', fontSize: '0.8rem' }}>
                  <span><Star size={14} color="#fbbf24" fill="#fbbf24" /> {selectedMentor.rating}</span>
                  <span><Users size={14} color="#60a5fa" /> {selectedMentor.totalStudents.toLocaleString()}</span>
                  <span><BookOpen size={14} color="#60a5fa" /> {selectedMentor.totalCourses} courses</span>
                  <span><Briefcase size={14} color="#60a5fa" /> {selectedMentor.experience}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                  <a href={selectedMentor.social.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8' }}><FaLinkedin size={16} /></a>
                  <a href={selectedMentor.social.twitter} target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8' }}><FaTwitter size={16} /></a>
                  <a href={selectedMentor.social.github} target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8' }}><FaGithub size={16} /></a>
                </div>
                <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                  <h3 style={{ color: 'white', marginBottom: '0.3rem', fontSize: '0.9rem' }}>About</h3>
                  <p style={{ color: '#cbd5e1', lineHeight: '1.5', fontSize: '0.8rem' }}>{selectedMentor.bio}</p>
                </div>
                <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                  <h3 style={{ color: 'white', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Expertise</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {selectedMentor.specialties.map((s, i) => <span key={i} style={specialtyTagStyle}>{s}</span>)}
                  </div>
                </div>
                <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                  <h3 style={{ color: 'white', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Education</h3>
                  {selectedMentor.education.map((e, i) => <p key={i} style={{ color: '#94a3b8', marginBottom: '0.15rem', fontSize: '0.8rem' }}>• {e}</p>)}
                </div>
                <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                  <h3 style={{ color: 'white', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Achievements</h3>
                  {selectedMentor.achievements.map((a, i) => <p key={i} style={{ color: '#94a3b8', marginBottom: '0.15rem', fontSize: '0.8rem' }}>🏆 {a}</p>)}
                </div>
                <div style={{ background: 'rgba(59,130,246,0.1)', borderRadius: '0.8rem', padding: '0.8rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', fontSize: '0.75rem' }}>
                    <div><p style={{ color: '#94a3b8' }}>Response</p><p style={{ color: 'white', fontWeight: '600' }}>{selectedMentor.responseTime}</p></div>
                    <div><p style={{ color: '#94a3b8' }}>Rate</p><p style={{ color: '#60a5fa', fontWeight: '700', fontSize: '1rem' }}>${selectedMentor.hourlyRate}/h</p></div>
                    <div><p style={{ color: '#94a3b8' }}>Available</p><p style={{ color: selectedMentor.availableForMentoring ? '#22c55e' : '#ef4444', fontWeight: '600' }}>{selectedMentor.availableForMentoring ? 'Yes' : 'No'}</p></div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                  <button onClick={() => bookSession(selectedMentor)} style={{ ...buttonStyle, width: 'auto', padding: '0.5rem 1.2rem' }} disabled={!selectedMentor.availableForMentoring}><Calendar size={14} /> Book Session</button>
                  <button onClick={() => alert(`Message to ${selectedMentor.name}: Coming soon!`)} style={{ ...buttonStyle, width: 'auto', padding: '0.5rem 1.2rem', background: 'rgba(59,130,246,0.2)' }}><MessageCircle size={14} /> Message</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mentors;