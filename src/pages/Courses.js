import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, Clock, Users, Target, Code2, BarChart, Palette, Smartphone, Zap, Flame, CheckCircle, Search, Grid, List } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [user, setUser] = useState(null);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

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

  const ps = { position: 'relative', minHeight: '100vh', paddingTop: '70px', fontFamily: 'Inter, sans-serif', backgroundImage: 'url("https://i.postimg.cc/3wxVp0ny/photo-2026-05-26-11-00-53.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' };
  const ov = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)', zIndex: 0, pointerEvents: 'none' };
  const ct = { maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem', position: 'relative', zIndex: 1 };
  const lo = { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' };
  const mn = { flex: 1 };
  const hd = { marginBottom: '1rem' };
  const tt = { fontSize: '1.8rem', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
  const si = { flex: 1, padding: '0.5rem 0.8rem', background: 'rgba(20,30,55,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.8rem', color: 'white', fontSize: '0.85rem', outline: 'none' };
  const cb = (a, co) => ({ padding: '0.3rem 0.8rem', fontSize: '0.7rem', background: a ? `linear-gradient(135deg, ${co}, ${co}cc)` : 'rgba(20,30,55,0.6)', border: a ? 'none' : '1px solid rgba(59,130,246,0.2)', borderRadius: '1.5rem', color: a ? 'white' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' });
  const vb = (a) => ({ padding: '0.3rem 0.6rem', fontSize: '0.7rem', background: a ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(20,30,55,0.6)', borderRadius: '0.4rem', color: a ? 'white' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' });
  const gs = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' };
  const ls = { display: 'flex', flexDirection: 'column', gap: '0.6rem' };
  const cd = { background: 'rgba(20,30,55,0.6)', backdropFilter: 'blur(12px)', borderRadius: '0.8rem', overflow: 'hidden', border: '1px solid rgba(59,130,246,0.2)', cursor: 'pointer' };
  const im = { width: '100%', height: '100%', objectFit: 'cover' };
  const bn = { position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '1rem', fontSize: '0.6rem', zIndex: 2 };
  const bp = { position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'linear-gradient(135deg, #f59e0b, #ea580c)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '1rem', fontSize: '0.6rem', zIndex: 2 };
  const be = { position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '1rem', fontSize: '0.6rem', zIndex: 2 };
  const cc = { padding: '0.7rem' };
  const lv = (l) => ({ display: 'inline-block', padding: '0.1rem 0.4rem', fontSize: '0.6rem', borderRadius: '0.3rem', background: `rgba(${l==='Beginner'?'16,185,129':l==='Intermediate'?'245,158,11':'239,68,68'},0.2)`, color: getLevelColor(l), marginBottom: '0.2rem' });
  const cti = { fontSize: '0.9rem', fontWeight: '700', color: 'white', marginBottom: '0.2rem' };
  const cdsc = { fontSize: '0.7rem', color: '#cbd5e1', marginBottom: '0.4rem', lineHeight: '1.3' };
  const mt = { display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginBottom: '0.1rem' };
  const pr = { fontSize: '1rem', fontWeight: 'bold', color: '#60a5fa' };
  const btnBuy = { width: '100%', padding: '0.3rem', borderRadius: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.4rem', fontSize: '0.7rem', border: 'none', color: 'white', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' };
  const btnEnr = { width: '100%', padding: '0.3rem', borderRadius: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.4rem', fontSize: '0.7rem', border: 'none', color: 'white', background: 'linear-gradient(135deg, #22c55e, #16a34a)' };

  if (loading) return <div style={ps}><div style={ov} /><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative', zIndex: 1 }}><div className="loading-spinner"></div></div></div>;

  return (
    <div style={ps}><div style={ov} /><div style={ct}><div style={lo}><Sidebar /><div style={mn}>
      <div style={hd}><h1 style={tt}>Explore Our Catalog</h1><p style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Premium courses</p></div>
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.8rem' }}><input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={si} /></div>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>{categories.map(c => <button key={c.id} style={cb(selectedCategory===c.id,c.color)} onClick={()=>setSelectedCategory(c.id)}>{c.icon} {c.name}</button>)}</div>
      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.8rem', justifyContent: 'flex-end' }}><button style={vb(viewMode==='grid')} onClick={()=>setViewMode('grid')}><Grid size={12} /> Grid</button><button style={vb(viewMode==='list')} onClick={()=>setViewMode('list')}><List size={12} /> List</button></div>
      {filteredCourses.length===0 ? <div style={{ textAlign:'center', padding:'2rem', background:'rgba(20,30,55,0.6)', borderRadius:'0.8rem' }}><Search size={30} color="#94a3b8" /><p style={{ color:'white', marginTop:'0.5rem' }}>No courses</p></div> :
      <div style={viewMode==='grid'?gs:ls}>
        {filteredCourses.map(c => (
          <div key={c.id} style={viewMode==='grid'?cd:{...cd,display:'flex',minHeight:'100px'}} onClick={()=>navigate(`/courses/${c.id}`)}>
            <div style={viewMode==='grid'?{height:'130px',overflow:'hidden',position:'relative'}:{width:'150px',flexShrink:0,height:'100%',position:'relative'}}>
              <img src={c.image_url||`https://picsum.photos/id/${c.id+10}/400/250`} alt="" style={im} />
              {c.isNew&&<div style={bn}><Zap size={8}/>New</div>}
              {c.isPopular&&<div style={bp}><Flame size={8}/>Popular</div>}
              {enrolledIds.includes(c.id)&&<div style={be}><CheckCircle size={8}/>Enrolled</div>}
            </div>
            <div style={cc}>
              <div style={lv(c.level)}>{c.level}</div>
              <h3 style={cti}>{c.title}</h3>
              <p style={cdsc}>{c.description?.substring(0,70)}...</p>
              <div style={mt}><span><BookOpen size={10}/>{c.modules_count||0} mod</span><span><Star size={10}/>{c.rating.toFixed(1)}</span></div>
              <div style={mt}><span><Clock size={10}/>{c.duration}h</span><span><Users size={10}/>{c.students.toLocaleString()}</span></div>
              <div style={pr}>$29 USD</div>
              <button onClick={e=>{e.stopPropagation();handleBuy(c.id)}} style={enrolledIds.includes(c.id)?btnEnr:btnBuy}>
                {enrolledIds.includes(c.id)?'Start Learning':'Buy - $29'}
              </button>
            </div>
          </div>
        ))}
      </div>}
    </div></div></div></div>
  );
}

export default Courses;
