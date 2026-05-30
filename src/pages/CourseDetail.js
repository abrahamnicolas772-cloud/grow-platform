import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Target, CheckCircle, Briefcase, Award, Clock, Layers, GraduationCap, Globe, ChevronDown, ChevronUp, PlayCircle, Users, Star, DollarSign, Eye, CreditCard } from 'lucide-react';
import api from '../services/api';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);
  const [lessons, setLessons] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    loadCourse();
    api.getUserEnrollments(u.id).then(r => setIsEnrolled(r.data.some(e => e.id === parseInt(id)))).catch(() => {});
  }, [id]);

  const loadCourse = async () => {
    try {
      const r = await api.getCourse(id); setCourse(r.data);
      if (r.data.modules) for (const m of r.data.modules) { const lr = await api.getModuleLessons(m.id); setLessons(prev => ({ ...prev, [m.id]: lr.data })); }
    } catch (err) {} finally { setLoading(false); }
  };

  const handleBuy = () => {
    if (!user) { navigate('/login'); return; }
    if (user.email === 'admin@grow.com' || isEnrolled) { navigate(`/learning/${id}`); return; }
    navigate(`/checkout/${id}`);
  };

  const ps = { position: 'relative', minHeight: '100vh', paddingTop: '70px', fontFamily: 'Inter, sans-serif', backgroundImage: 'url("https://i.postimg.cc/3wxVp0ny/photo-2026-05-26-11-00-53.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' };
  const ov = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)', zIndex: 0, pointerEvents: 'none' };
  const ct = { maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem', position: 'relative', zIndex: 1 };
  const tw = { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' };
  const mc = { flex: 2, minWidth: '280px' };
  const sb = { flex: 1, minWidth: '280px' };
  const cd = { background: 'rgba(20,30,55,0.5)', backdropFilter: 'blur(12px)', borderRadius: '0.8rem', overflow: 'hidden', border: '1px solid rgba(59,130,246,0.15)', marginBottom: '0.8rem' };
  const im = { width: '100%', height: '180px', objectFit: 'cover' };
  const cp = { padding: '0.8rem' };
  const tti = { fontSize: '1.3rem', fontWeight: '700', background: 'linear-gradient(135deg, #ffffff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.3rem' };
  const sti = { fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.3rem' };
  const tx = { color: '#cbd5e1', lineHeight: '1.4', marginBottom: '0.5rem', fontSize: '0.8rem' };
  const gd = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.4rem', marginBottom: '0.5rem' };
  const li = { display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0', color: '#cbd5e1', fontSize: '0.75rem' };
  const ms = { border: '1px solid rgba(59,130,246,0.15)', borderRadius: '0.6rem', marginBottom: '0.4rem', background: 'rgba(20,30,55,0.4)', overflow: 'hidden' };
  const mh = { padding: '0.5rem 0.8rem', background: 'rgba(30,41,59,0.5)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const mti = { fontSize: '0.8rem', fontWeight: '600', color: 'white', display: 'flex', alignItems: 'center', gap: '0.3rem' };
  const ll = { padding: '0.4rem 0.8rem', borderTop: '1px solid rgba(59,130,246,0.1)' };
  const lli = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0', borderBottom: '1px solid rgba(59,130,246,0.05)', fontSize: '0.75rem' };
  const sbc = { ...cd, position: 'sticky', top: '90px' };
  const pst = { fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa', marginBottom: '0.2rem' };
  const ebt = { width: '100%', padding: '0.6rem', background: isEnrolled ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', borderRadius: '0.6rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' };
  const ir = { display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(59,130,246,0.1)', fontSize: '0.75rem' };

  if (loading) return <div style={ps}><div style={ov} /><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative', zIndex: 1, color: 'white' }}>Loading...</div></div>;
  if (!course) return <div style={ps}><div style={ov} /><div style={{ ...ct, textAlign: 'center', color: '#ef4444' }}>Course not found</div></div>;

  return (
    <div style={ps}><div style={ov} /><div style={ct}><div style={tw}>
      <div style={mc}>
        <div style={cd}><img src={course.image_url||`https://picsum.photos/id/${(course.id||1)*10}/800/450`} alt="" style={im} /><div style={cp}><h1 style={tti}>{course.title}</h1><div style={{ display:'flex', gap:'0.8rem', marginBottom:'0.4rem', fontSize:'0.7rem', color:'#94a3b8' }}><span><Users size={12}/>1,247</span><span><Star size={12} color="#fbbf24"/>4.8</span><span><Clock size={12}/>8w</span><span><Globe size={12}/>EN</span></div><p style={tx}>{course.description||'Complete course.'}</p></div></div>
        <div style={cd}><div style={cp}><h2 style={sti}><Target size={16} color="#60a5fa"/>What you'll learn</h2><div style={gd}>{['Master HTML, CSS & JS','Build responsive sites','Understand React','Create full-stack apps','Deploy projects','Work with databases'].map((item,i)=><div key={i} style={li}><CheckCircle size={12} color="#22c55e"/>{item}</div>)}</div></div></div>
        <div style={cd}><div style={cp}><h2 style={sti}><BookOpen size={16} color="#60a5fa"/>Course content</h2>
          {course.modules?.map(m => {
            const ml = lessons[m.id] || [];
            return <div key={m.id} style={ms}><div style={mh} onClick={()=>setExpandedModule(expandedModule===m.id?null:m.id)}><h3 style={mti}><Layers size={14} color="#94a3b8"/>{m.title}</h3><div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}><span style={{ fontSize:'0.65rem', color:'#94a3b8' }}>{ml.length} lessons</span>{expandedModule===m.id?<ChevronUp size={14}/>:<ChevronDown size={14}/>}</div></div>
              {expandedModule===m.id && <div style={ll}>{ml.length>0?ml.map(l=><div key={l.id} style={lli}><div style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}><PlayCircle size={10} color="#60a5fa"/>{l.title}</div><span style={{ fontSize:'0.6rem', color:'#64748b' }}>{l.duration}min</span></div>):<p style={{ color:'#94a3b8', textAlign:'center', padding:'0.5rem', fontSize:'0.75rem' }}>No lessons</p>}</div>}
            </div>;
          })}
        </div></div>
      </div>
      <div style={sb}>
        <div style={sbc}><div style={cp}><div style={pst}><DollarSign size={20}/>29<span style={{ fontSize:'0.7rem', color:'#94a3b8' }}>USD</span></div><div style={{ fontSize:'0.7rem', color:'#94a3b8', marginBottom:'0.8rem' }}>Lifetime access</div>
          <button onClick={handleBuy} style={ebt}>{isEnrolled||user?.email==='admin@grow.com'?<><Eye size={14}/>Start learning</>:<><CreditCard size={14}/>Buy now - $29</>}</button>
          <div><div style={ir}><span><Clock size={12}/>Duration</span><span style={{ color:'white' }}>8 weeks</span></div><div style={ir}><span><BookOpen size={12}/>Lessons</span><span style={{ color:'white' }}>{Object.values(lessons).flat().length||'...'}</span></div><div style={ir}><span><GraduationCap size={12}/>Level</span><span style={{ color:'white' }}>All</span></div><div style={ir}><span><Award size={12}/>Certificate</span><span style={{ color:'white' }}>Yes</span></div></div></div></div>
      </div>
    </div></div></div>
  );
}

export default CourseDetail;
