import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, Clock, Users, Target, Code2, BarChart, Palette, Smartphone, Zap, Flame, CheckCircle, Search, Grid, List, Menu, X } from 'lucide-react';
import api from '../services/api';

function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [user, setUser] = useState(null);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false); // pour mobile

  const categories = [
    { id: 'all', name: 'All Courses', icon: <Target size={14} />, color: '#6366f1' },
    { id: 'web', name: 'Web Development', icon: <Code2 size={14} />, color: '#3b82f6' },
    { id: 'data', name: 'Data Science', icon: <BarChart size={14} />, color: '#10b981' },
    { id: 'design', name: 'UI/UX Design', icon: <Palette size={14} />, color: '#f59e0b' },
    { id: 'marketing', name: 'Digital Marketing', icon: <Smartphone size={14} />, color: '#ec4899' },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { navigate('/login'); return; }
    setUser(JSON.parse(storedUser));
    loadCourses();
  }, [navigate]);

  useEffect(() => { filterCourses(); }, [searchTerm, selectedCategory, courses, enrolledIds]);

  const loadCourses = async () => {
    try {
      const response = await api.getCourses();
      const currentUser = JSON.parse(localStorage.getItem('user'));
      let enrolled = [];
      if (currentUser?.id) {
        try {
          const enrollmentsRes = await api.getUserEnrollments(currentUser.id);
          enrolled = enrollmentsRes.data.map(e => e.id);
          setEnrolledIds(enrolled);
        } catch (err) {}
      }
      const enrichedCourses = response.data.map((course, index) => ({
        ...course, rating: 4.5 + Math.random() * 0.5,
        students: Math.floor(Math.random() * 5000) + 500,
        duration: Math.floor(Math.random() * 40) + 10,
        level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
        isNew: index < 2, isPopular: index === 1, enrolled: enrolled.includes(course.id),
      }));
      setCourses(enrichedCourses);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const filterCourses = () => {
    let filtered = [...courses];
    if (searchTerm) filtered = filtered.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedCategory !== 'all') filtered = filtered.filter(c => c.title.toLowerCase().includes(selectedCategory.toLowerCase()));
    setFilteredCourses(filtered);
  };

  const handleBuy = (courseId) => {
    if (!user) { navigate('/login'); return; }
    if (user.email === 'admin@grow.com') { navigate(`/learning/${courseId}`); return; }
    if (enrolledIds.includes(courseId)) { navigate(`/learning/${courseId}`); return; }
    navigate(`/checkout/${courseId}`);
  };

  const isEnrolled = (courseId) => enrolledIds.includes(courseId);
  const getLevelColor = (l) => ({ Beginner: '#10b981', Intermediate: '#f59e0b', Advanced: '#ef4444' }[l] || '#3b82f6');

  const pageStyle = { position: 'relative', minHeight: '100vh', paddingTop: '70px', fontFamily: 'Inter, sans-serif', backgroundImage: 'url("https://i.postimg.cc/3wxVp0ny/photo-2026-05-26-11-00-53.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' };
  const overlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)', zIndex: 0, pointerEvents: 'none' };
  const container = { maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem', position: 'relative', zIndex: 1 };
  const layout = { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' };
  const mainContent = { flex: 1, minWidth: '280px' };
  const sidebarStyle = { width: '280px', flexShrink: 0, background: 'rgba(20,30,55,0.6)', backdropFilter: 'blur(12px)', borderRadius: '0.8rem', padding: '1rem', border: '1px solid rgba(59,130,246,0.2)' };

  if (loading) return <div style={pageStyle}><div style={overlay} /><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative', zIndex: 1, color: 'white' }}>Loading...</div></div>;

  return (
    <div style={pageStyle}>
      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none; }
          .sidebar-mobile-toggle { display: block; }
          .courses-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) {
          .sidebar-mobile-toggle { display: none; }
          .sidebar-desktop { display: block; }
        }
      `}</style>
      <div style={overlay} />
      <div style={container}>
        <div style={layout}>
          {/* Sidebar desktop */}
          <div className="sidebar-desktop" style={sidebarStyle}>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>Filters</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {categories.map(c => <button key={c.id} onClick={() => setSelectedCategory(c.id)} style={{ textAlign: 'left', padding: '0.5rem', background: selectedCategory === c.id ? `linear-gradient(135deg, ${c.color}, ${c.color}cc)` : 'rgba(20,30,55,0.6)', border: 'none', borderRadius: '0.5rem', color: selectedCategory === c.id ? 'white' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{c.icon} {c.name}</button>)}
            </div>
          </div>

          {/* Main content */}
          <div style={mainContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Explore Our Catalog</h1>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setViewMode('grid')} style={{ padding: '0.3rem 0.6rem', background: viewMode === 'grid' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(20,30,55,0.6)', borderRadius: '0.4rem', color: 'white', border: 'none', cursor: 'pointer' }}><Grid size={14} /></button>
                <button onClick={() => setViewMode('list')} style={{ padding: '0.3rem 0.6rem', background: viewMode === 'list' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(20,30,55,0.6)', borderRadius: '0.4rem', color: 'white', border: 'none', cursor: 'pointer' }}><List size={14} /></button>
                <button className="sidebar-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'rgba(59,130,246,0.2)', border: 'none', borderRadius: '0.4rem', padding: '0.3rem 0.6rem', color: 'white', cursor: 'pointer' }}>{sidebarOpen ? <X size={14} /> : <Menu size={14} />}</button>
              </div>
            </div>
            <input type="text" placeholder="Search courses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '0.5rem 0.8rem', background: 'rgba(20,30,55,0.6)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.8rem', color: 'white', marginBottom: '1rem' }} />
            {filteredCourses.length === 0 ? <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(20,30,55,0.6)', borderRadius: '0.8rem', color: '#94a3b8' }}>No courses found</div> :
              <div style={viewMode === 'grid' ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' } : { display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {filteredCourses.map(c => (
                  <div key={c.id} onClick={() => navigate(`/courses/${c.id}`)} style={{ background: 'rgba(20,30,55,0.6)', backdropFilter: 'blur(12px)', borderRadius: '0.8rem', overflow: 'hidden', border: '1px solid rgba(59,130,246,0.2)', cursor: 'pointer', display: viewMode === 'grid' ? 'block' : 'flex', minHeight: viewMode === 'list' ? '120px' : 'auto' }}>
                    <div style={{ position: 'relative', height: viewMode === 'grid' ? '130px' : '100%', width: viewMode === 'list' ? '150px' : '100%', flexShrink: 0 }}>
                      <img src={c.image_url || `https://picsum.photos/id/${(c.id * 10) % 100}/400/250`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {c.isNew && <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '1rem', fontSize: '0.6rem' }}><Zap size={8} /> New</div>}
                      {enrolledIds.includes(c.id) && <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '1rem', fontSize: '0.6rem' }}><CheckCircle size={8} /> Enrolled</div>}
                    </div>
                    <div style={{ padding: '0.7rem', flex: 1 }}>
                      <div style={{ display: 'inline-block', padding: '0.1rem 0.4rem', fontSize: '0.6rem', borderRadius: '0.3rem', background: `rgba(${c.level === 'Beginner' ? '16,185,129' : c.level === 'Intermediate' ? '245,158,11' : '239,68,68'},0.2)`, color: getLevelColor(c.level), marginBottom: '0.2rem' }}>{c.level}</div>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'white', marginBottom: '0.2rem' }}>{c.title}</h3>
                      <p style={{ fontSize: '0.7rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>{c.description?.substring(0, 70)}...</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginBottom: '0.1rem' }}><span><BookOpen size={10} /> {c.modules_count || 0} mod</span><span><Star size={10} /> {c.rating.toFixed(1)}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginBottom: '0.1rem' }}><span><Clock size={10} /> {c.duration}h</span><span><Users size={10} /> {c.students.toLocaleString()}</span></div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#60a5fa' }}>$29 USD</div>
                      <button onClick={(e) => { e.stopPropagation(); handleBuy(c.id); }} style={{ width: '100%', padding: '0.3rem', borderRadius: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.4rem', fontSize: '0.7rem', border: 'none', color: 'white', background: enrolledIds.includes(c.id) ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>{enrolledIds.includes(c.id) ? 'Start Learning' : 'Buy - $29'}</button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      </div>

      {/* Sidebar mobile (coulissante) */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '80%', maxWidth: '300px', background: 'rgba(20,30,55,0.95)', backdropFilter: 'blur(16px)', zIndex: 1000, padding: '1rem', borderRight: '1px solid rgba(59,130,246,0.3)', transform: 'translateX(0)', transition: 'transform 0.3s' }}>
          <button onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
          <h3 style={{ color: 'white', marginBottom: '1rem', marginTop: '2rem' }}>Filters</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {categories.map(c => <button key={c.id} onClick={() => { setSelectedCategory(c.id); setSidebarOpen(false); }} style={{ textAlign: 'left', padding: '0.5rem', background: selectedCategory === c.id ? `linear-gradient(135deg, ${c.color}, ${c.color}cc)` : 'rgba(20,30,55,0.6)', border: 'none', borderRadius: '0.5rem', color: selectedCategory === c.id ? 'white' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{c.icon} {c.name}</button>)}
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;