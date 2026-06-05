import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Video, FileText, Download, ExternalLink, Search, 
  Filter, Clock, User, Eye, ThumbsUp, ChevronRight, 
  ChevronDown, X, Calendar, Award, Star, TrendingUp,
  Code, Database, Layout, Smartphone, Shield, Cloud,
  ArrowRight, Sparkles, FolderOpen, FileCode, PlayCircle
} from 'lucide-react';
import api from '../services/api';

function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState([]);

  const categories = [
    { id: 'all', name: 'All', icon: <FolderOpen size={14} /> },
    { id: 'web', name: 'Web', icon: <Code size={14} /> },
    { id: 'data', name: 'Data', icon: <Database size={14} /> },
    { id: 'design', name: 'Design', icon: <Layout size={14} /> },
    { id: 'mobile', name: 'Mobile', icon: <Smartphone size={14} /> },
    { id: 'security', name: 'Security', icon: <Shield size={14} /> },
  ];

  const resourceTypes = [
    { id: 'all', name: 'All' },
    { id: 'article', name: 'Articles' },
    { id: 'video', name: 'Videos' },
    { id: 'course', name: 'Courses' },
    { id: 'tool', name: 'Tools' },
  ];

  useEffect(() => { loadCourses(); }, []);

  const loadCourses = async () => {
    try {
      const response = await api.getCourses();
      setCourses(response.data);
      const courseResources = response.data.map((course, index) => ({
        id: course.id, title: course.title,
        description: course.description || 'A comprehensive course.',
        type: 'course', category: getCourseCategory(course.title),
        duration: `${Math.floor(Math.random() * 20) + 10}h`,
        author: 'GROW Team', authorAvatar: 'https://ui-avatars.com/api/?name=GROW+Team&background=3b82f6&color=fff',
        date: new Date().toISOString(), views: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 1000) + 100, url: `/courses/${course.id}`,
        tags: course.title.split(' '), level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
        image: `https://picsum.photos/id/${index + 10}/400/250`, isInternal: true
      }));
      const externalResources = [
        { id: 1001, title: 'React Documentation', description: 'Official React docs with guides and API reference.', type: 'article', category: 'web', duration: '30 min', author: 'Meta', authorAvatar: 'https://ui-avatars.com/api/?name=Meta&background=10b981&color=fff', date: new Date().toISOString(), views: 150000, likes: 5000, url: 'https://react.dev', tags: ['React', 'JavaScript', 'Frontend'], level: 'All', image: 'https://picsum.photos/id/0/400/250', isInternal: false },
        { id: 1002, title: 'Python Data Science Handbook', description: 'Guide to data analysis with pandas, numpy, matplotlib.', type: 'ebook', category: 'data', duration: '120 pages', author: 'Jake VanderPlas', authorAvatar: 'https://ui-avatars.com/api/?name=J+V&background=f59e0b&color=fff', date: new Date().toISOString(), views: 50000, likes: 2500, url: 'https://jakevdp.github.io/', tags: ['Python', 'Data', 'Pandas'], level: 'Intermediate', image: 'https://picsum.photos/id/20/400/250', isInternal: false },
        { id: 1003, title: 'Figma UI/UX Tutorial', description: 'Master prototyping and design systems with Figma.', type: 'video', category: 'design', duration: '4h', author: 'DesignCourse', authorAvatar: 'https://ui-avatars.com/api/?name=DC&background=ec4899&color=fff', date: new Date().toISOString(), views: 250000, likes: 12000, url: 'https://youtube.com', tags: ['Figma', 'Design', 'UI/UX'], level: 'Beginner', image: 'https://picsum.photos/id/15/400/250', isInternal: false },
        { id: 1004, title: 'Git & GitHub Course', description: 'Master version control with Git.', type: 'course', category: 'web', duration: '3h', author: 'GROW Team', authorAvatar: 'https://ui-avatars.com/api/?name=GROW&background=8b5cf6&color=fff', date: new Date().toISOString(), views: 8000, likes: 450, url: '/courses/git', tags: ['Git', 'GitHub'], level: 'Beginner', image: 'https://picsum.photos/id/91/400/250', isInternal: true },
        { id: 1005, title: 'AWS Cloud Guide', description: 'Prep for AWS Cloud Practitioner certification.', type: 'article', category: 'cloud', duration: '45 min', author: 'AWS', authorAvatar: 'https://ui-avatars.com/api/?name=AWS&background=06b6d4&color=fff', date: new Date().toISOString(), views: 35000, likes: 2100, url: 'https://aws.amazon.com/training/', tags: ['AWS', 'Cloud'], level: 'Beginner', image: 'https://picsum.photos/id/42/400/250', isInternal: false }
      ];
      setResources([...courseResources, ...externalResources]);
      setFilteredResources([...courseResources, ...externalResources]);
      setLoading(false);
    } catch (err) { setLoading(false); }
  };

  const getCourseCategory = (t) => {
    if (t.toLowerCase().includes('web') || t.toLowerCase().includes('react')) return 'web';
    if (t.toLowerCase().includes('data')) return 'data';
    if (t.toLowerCase().includes('design') || t.toLowerCase().includes('ui')) return 'design';
    if (t.toLowerCase().includes('mobile')) return 'mobile';
    if (t.toLowerCase().includes('security')) return 'security';
    if (t.toLowerCase().includes('cloud') || t.toLowerCase().includes('aws')) return 'cloud';
    return 'web';
  };

  useEffect(() => { filterResources(); }, [searchTerm, selectedCategory, selectedType, resources]);

  const filterResources = () => {
    let f = [...resources];
    if (searchTerm) f = f.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
    if (selectedCategory !== 'all') f = f.filter(r => r.category === selectedCategory);
    if (selectedType !== 'all') f = f.filter(r => r.type === selectedType);
    setFilteredResources(f);
  };

  const resetFilters = () => { setSearchTerm(''); setSelectedCategory('all'); setSelectedType('all'); };

  const getTypeIcon = (type) => {
    switch(type) { case 'article': return <FileText size={14} />; case 'video': return <Video size={14} />; case 'ebook': return <BookOpen size={14} />; case 'course': return <Code size={14} />; case 'tool': return <Download size={14} />; default: return <FileText size={14} />; }
  };
  const getTypeColor = (type) => {
    switch(type) { case 'article': return '#3b82f6'; case 'video': return '#ef4444'; case 'ebook': return '#10b981'; case 'course': return '#8b5cf6'; case 'tool': return '#f59e0b'; default: return '#64748b'; }
  };
  const handleResourceClick = (r) => { if (r.isInternal) window.location.href = r.url; else window.open(r.url, '_blank'); };

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
  const categoriesStyle = { display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' };
  const categoryButtonStyle = (active) => ({ padding: '0.3rem 0.7rem', background: active ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(20,30,55,0.5)', backdropFilter: 'blur(12px)', border: 'none', borderRadius: '1.5rem', color: active ? 'white' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', transition: 'all 0.2s' });
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '0.8rem' };
  const cardStyle = { background: 'rgba(20,30,55,0.5)', backdropFilter: 'blur(12px)', borderRadius: '0.8rem', overflow: 'hidden', border: '1px solid rgba(59,130,246,0.15)', transition: 'transform 0.3s', cursor: 'pointer' };
  const cardImageStyle = { width: '100%', height: '120px', objectFit: 'cover' };
  const cardContentStyle = { padding: '0.8rem' };
  const resourceTypeBadgeStyle = (type) => ({ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.15rem 0.5rem', background: `rgba(${getTypeColor(type).slice(1)}, 0.15)`, borderRadius: '0.8rem', fontSize: '0.65rem', color: getTypeColor(type), marginBottom: '0.3rem' });
  const cardTitleStyle = { fontSize: '0.95rem', fontWeight: '600', color: 'white', marginBottom: '0.3rem' };
  const cardDescriptionStyle = { fontSize: '0.7rem', color: '#94a3b8', lineHeight: '1.4', marginBottom: '0.6rem' };
  const metaInfoStyle = { display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.65rem', color: '#64748b', marginBottom: '0.3rem' };
  const tagsStyle = { display: 'flex', flexWrap: 'wrap', gap: '0.2rem', marginTop: '0.3rem' };
  const tagStyle = { padding: '0.15rem 0.4rem', background: 'rgba(59,130,246,0.1)', borderRadius: '0.8rem', fontSize: '0.6rem', color: '#60a5fa' };
  const buttonStyle = { marginTop: '0.6rem', padding: '0.35rem 0.8rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', borderRadius: '0.4rem', color: 'white', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', width: '100%' };

  if (loading) {
    return <div style={pageStyle}><div style={darkOverlay} /><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative', zIndex: 1 }}><div className="loading-spinner"></div></div></div>;
  }

  return (
    <div style={pageStyle}>
      <div style={darkOverlay} />
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Learning Resources</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Free articles, tutorials, courses and tools</p>
        </div>
        <div style={searchContainerStyle}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input type="text" placeholder="Search resources..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...searchInputStyle, paddingLeft: '2.2rem' }} />
          </div>
          <button style={filterButtonStyle} onClick={() => setShowFilters(!showFilters)}><Filter size={14} /> Filters</button>
        </div>
        {showFilters && (
          <div style={{ marginBottom: '0.8rem' }}>
            <div style={{ marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Categories</span>
                <button onClick={resetFilters} style={{ fontSize: '0.65rem', color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}>Reset</button>
              </div>
              <div style={categoriesStyle}>{categories.map(c => <button key={c.id} style={categoryButtonStyle(selectedCategory === c.id)} onClick={() => setSelectedCategory(c.id)}>{c.icon} {c.name}</button>)}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.3rem', display: 'block' }}>Type</span>
              <div style={categoriesStyle}>{resourceTypes.map(t => <button key={t.id} style={categoryButtonStyle(selectedType === t.id)} onClick={() => setSelectedType(t.id)}>{t.name}</button>)}</div>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}</span>
          {(searchTerm || selectedCategory !== 'all' || selectedType !== 'all') && (
            <button onClick={resetFilters} style={{ fontSize: '0.65rem', color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
          )}
        </div>
        {filteredResources.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(20,30,55,0.5)', borderRadius: '0.8rem' }}>
            <FileText size={36} color="#64748b" />
            <h3 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1rem' }}>No resources found</h3>
            <button onClick={resetFilters} style={{ ...buttonStyle, width: 'auto', padding: '0.3rem 1rem', marginTop: '0.5rem' }}>Clear filters</button>
          </div>
        ) : (
          <div style={gridStyle}>
            {filteredResources.map((resource) => (
              <div key={resource.id} style={cardStyle} onClick={() => handleResourceClick(resource)}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <img src={resource.image} alt={resource.title} style={cardImageStyle} onError={(e) => { e.target.src = 'https://picsum.photos/id/1/400/250'; }} />
                <div style={cardContentStyle}>
                  <div style={resourceTypeBadgeStyle(resource.type)}>{getTypeIcon(resource.type)} <span style={{ textTransform: 'capitalize' }}>{resource.type}</span></div>
                  <h3 style={cardTitleStyle}>{resource.title}</h3>
                  <p style={cardDescriptionStyle}>{resource.description.substring(0, 80)}...</p>
                  <div style={metaInfoStyle}>
                    <img src={resource.authorAvatar} alt="" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                    <span>{resource.author}</span>
                    <span>•</span>
                    <Clock size={10} /><span>{resource.duration}</span>
                  </div>
                  <div style={metaInfoStyle}>
                    <Eye size={10} /><span>{resource.views.toLocaleString()}</span>
                    <ThumbsUp size={10} /><span>{resource.likes.toLocaleString()}</span>
                    <Award size={10} /><span>{resource.level}</span>
                  </div>
                  <div style={tagsStyle}>{resource.tags.slice(0, 3).map((tag, i) => <span key={i} style={tagStyle}>{tag}</span>)}</div>
                  <button style={buttonStyle}>{resource.isInternal ? 'View Course' : 'View Resource'} <ExternalLink size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Resources;