import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users, Star, TrendingUp, Zap, GraduationCap, Globe, Building, Send, Sparkles
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import api from '../services/api';

function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterConfirm, setNewsletterConfirm] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const faq = [
    { keywords: ['price', 'cost', 'pricing'], answer: "Our courses are currently free. Soon we will offer premium plans starting at €29/month." },
    { keywords: ['certificate', 'certification', 'diploma'], answer: "Yes, you receive a certificate of completion at the end of each course." },
    { keywords: ['register', 'sign up'], answer: "Click 'Sign up' at the top right to create an account." },
    { keywords: ['login', 'sign in'], answer: "Use the 'Login' button at the top right." },
    { keywords: ['support', 'help'], answer: "Our support team is available at support@growplatform.com." },
    { keywords: ['quiz', 'test'], answer: "After each lesson, a quiz validates your knowledge." },
    { keywords: ['progress', 'tracking'], answer: "Your progress is shown on your dashboard." },
    { keywords: ['mobile', 'phone'], answer: "The platform is fully responsive on mobile, tablet, and desktop." },
    { keywords: ['free'], answer: "All basic courses are free. Premium options coming soon." },
    { keywords: ['mentor', 'coach'], answer: "Live mentoring sessions are organized every week." },
    { keywords: ['start', 'begin'], answer: "Create an account and click 'Enroll' on the course you like." },
    { keywords: ['download', 'pdf'], answer: "Certificates will be available as PDF soon." },
  ];

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await api.getCourses();
        const enriched = response.data.map((course, index) => ({
          ...course,
          rating: 4.5 + Math.random() * 0.5,
          students: Math.floor(Math.random() * 5000) + 500,
          duration: Math.floor(Math.random() * 40) + 10,
          level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
          isNew: index < 2,
          isPopular: index === 1,
        }));
        setCourses(enriched);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCourses(false);
      }
    };
    loadCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const popularCourses = filteredCourses.slice(0, 3);

  const testimonials = [
    { name: 'Jean-Paul M.', title: 'UI/UX Student', text: 'The UI/UX course helped me land my first design internship!', rating: 5, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Fatima D.', title: 'Full Stack Developer', text: 'Complete training, real projects. I learned more in 3 months than in 2 years.', rating: 5, avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'Mamadou S.', title: 'Marketing Specialist', text: 'The digital marketing course helped me launch my own agency.', rating: 4, avatar: 'https://randomuser.me/api/portraits/men/45.jpg' }
  ];

  const [statsValues, setStatsValues] = useState({ total_students: 300, satisfaction_rate: 98, average_rating: 4.9 });
  const [statsLoading, setStatsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setStatsValues({ total_students: 300, satisfaction_rate: 98, average_rating: 4.9 });
      setStatsLoading(false);
    }, 500);
  }, []);

  const stats = [
    { value: statsValues.total_students + '+', label: 'Students', icon: <Users size={48} strokeWidth={1.5} color="#60a5fa" /> },
    { value: statsValues.satisfaction_rate + '%', label: 'Satisfaction', icon: <Star size={48} strokeWidth={1.5} color="#fbbf24" /> },
    { value: statsValues.average_rating + '/5', label: 'Avg Rating', icon: <TrendingUp size={48} strokeWidth={1.5} color="#34d399" /> }
  ];

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    const lowerMsg = userMsg.toLowerCase();
    const matched = faq.find(item => item.keywords.some(keyword => lowerMsg.includes(keyword)));
    const reply = matched?.answer || "I don't have an answer yet. Please contact support@growplatform.com!";
    setTimeout(() => setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]), 300);
    setChatInput('');
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setEmailError('');
    setMessageError('');
    let isValid = true;
    if (!validateEmail(newsletterEmail)) { setEmailError('Invalid email address'); isValid = false; }
    if (!newsletterMessage.trim()) { setMessageError('Message cannot be empty'); isValid = false; }
    if (!isValid) return;
    setContactLoading(true);
    setTimeout(() => {
      setNewsletterConfirm('✅ Message sent! We will respond within 24 hours.');
      setNewsletterName('');
      setNewsletterEmail('');
      setNewsletterMessage('');
      setContactLoading(false);
      setTimeout(() => setNewsletterConfirm(''), 5000);
    }, 1500);
  };

  const handleScrollToCourses = () => {
    document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loadingCourses) return <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Chargement des cours...</div>;

  return (
    <div style={{ background: '#0a0a0f', color: 'white', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        @keyframes fadeScale { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .chat-popup { animation: fadeScale 0.2s ease-out; }
        .social-icon:hover { transform: translateY(-3px); color: #60a5fa !important; }
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; gap: 2rem !important; }
          .hero-grid p { margin-left: auto; margin-right: auto; }
          .cta-container { justify-content: center; }
        }
        @media (max-width: 768px) {
          .courses-grid, .testimonials-grid, .stats-grid, .contact-grid, .footer-grid { grid-template-columns: 1fr !important; }
          .stat-card { padding: 1.5rem !important; }
          .footer-social { justify-content: center; }
          .chat-popup { width: 90vw !important; right: 5vw !important; left: 5vw !important; height: 70vh !important; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 2rem !important; }
          .primary-cta, .secondary-cta { width: 100%; text-align: center; }
        }
      `}</style>

      {/* HERO SECTION */}
      <section style={{ minHeight: '70vh', background: 'linear-gradient(135deg, #02122E 0%, #051B4D 50%, #0A2A73 100%)', position: 'relative', overflow: 'hidden', paddingTop: '20px' }}>
        <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', animation: 'float 12s ease-in-out infinite reverse' }} />
        <div className="hero-grid" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'stretch' }}>
          <div style={{ color: 'white' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '800', lineHeight: '1.2', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Learn.{' '}<span style={{ color: '#3b82f6', display: 'inline-block' }}>Grow.</span> Succeed.
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', lineHeight: '1.6', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>Access premium expert-led courses and build skills that shape your future.</p>
            <div className="cta-container" style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
              <button onClick={handleScrollToCourses} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', padding: '0.9rem 2rem', borderRadius: '2.5rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }}>Start Learning →</button>
              <button onClick={() => navigate('/programs')} style={{ background: 'transparent', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)', padding: '0.9rem 2rem', borderRadius: '2.5rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>View Programs</button>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[{ label: 'Expert Courses', desc: '400+ lessons' }, { label: 'Certifications', desc: 'Recognized' }, { label: 'Flexible Learning', desc: 'Anytime, anywhere' }].map((f, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{f.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, background: '#0a0c10', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(59,130,246,0.4)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#1a1e2a', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(59,130,246,0.2)' }}>
                <span style={{ width: '12px', height: '12px', background: '#ff5f56', borderRadius: '50%' }}></span>
                <span style={{ width: '12px', height: '12px', background: '#ffbd2e', borderRadius: '50%' }}></span>
                <span style={{ width: '12px', height: '12px', background: '#27c93f', borderRadius: '50%' }}></span>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem', marginLeft: '0.5rem' }}>index.html</span>
              </div>
              <div style={{ flex: 1, padding: '1.2rem', fontFamily: 'monospace', fontSize: '0.7rem', lineHeight: '1.5', color: '#e2e8f0', overflowY: 'auto', background: '#0a0c10' }}>
                {/* Code mockup (inchangé) */}
                <div style={{ color: '#ff7b72' }}>{'<html>'}</div>
                <div style={{ marginLeft: '1rem' }}><div style={{ color: '#ff7b72' }}>{'<head>'}</div><div style={{ marginLeft: '1rem' }}><div><span style={{ color: '#d2a8ff' }}>&lt;title&gt;</span><span style={{ color: '#e2e8f0' }}>GROW Platform</span><span style={{ color: '#d2a8ff' }}>&lt;/title&gt;</span></div><div><span style={{ color: '#d2a8ff' }}>&lt;meta</span> <span style={{ color: '#79c0ff' }}>charset=</span><span style={{ color: '#a5d6ff' }}>"UTF-8"</span><span style={{ color: '#d2a8ff' }}>&gt;</span></div></div><div style={{ color: '#ff7b72' }}>{'</head>'}</div><div style={{ color: '#ff7b72' }}>{'<body>'}</div><div style={{ marginLeft: '1rem' }}><div><span style={{ color: '#d2a8ff' }}>&lt;div</span> <span style={{ color: '#79c0ff' }}>class=</span><span style={{ color: '#a5d6ff' }}>"course-card"</span><span style={{ color: '#d2a8ff' }}>&gt;</span></div><div style={{ marginLeft: '1rem' }}><div><span style={{ color: '#d2a8ff' }}>&lt;h2&gt;</span><span style={{ color: '#e2e8f0' }}>Full Stack Development</span><span style={{ color: '#d2a8ff' }}>&lt;/h2&gt;</span></div><div><span style={{ color: '#d2a8ff' }}>&lt;p&gt;</span><span style={{ color: '#e2e8f0' }}>Learn React, Node.js, MongoDB</span><span style={{ color: '#d2a8ff' }}>&lt;/p&gt;</span></div><div><span style={{ color: '#79c0ff' }}>const</span> <span style={{ color: '#d2a8ff' }}>modules</span> = [<span style={{ color: '#a5d6ff' }}>'HTML/CSS'</span>, <span style={{ color: '#a5d6ff' }}>'JavaScript'</span>, <span style={{ color: '#a5d6ff' }}>'React'</span>];</div><div><span style={{ color: '#79c0ff' }}>function</span> <span style={{ color: '#d2a8ff' }}>startCourse</span>() &#123;</div><div style={{ marginLeft: '1rem', color: '#79c0ff' }}>console.<span style={{ color: '#d2a8ff' }}>log</span>(<span style={{ color: '#a5d6ff' }}>"Learning GROW..."</span>);</div><div style={{ marginLeft: '1rem', color: '#79c0ff' }}><span style={{ color: '#ff7b72' }}>return</span> <span style={{ color: '#d2a8ff' }}>new</span> <span style={{ color: '#d2a8ff' }}>Promise</span>(<span style={{ color: '#79c0ff' }}>resolve</span> => &#123;</div><div style={{ marginLeft: '2rem', color: '#79c0ff' }}>setTimeout(() => resolve(<span style={{ color: '#a5d6ff' }}>'Certificate Ready'</span>), 3000);</div><div style={{ marginLeft: '1rem', color: '#79c0ff' }}>&#125;);</div><div>&#125;</div></div><div><span style={{ color: '#d2a8ff' }}>&lt;/div&gt;</span></div><div style={{ marginTop: '0.5rem', color: '#6b7280' }}>// Built with React + Flask</div></div><div style={{ color: '#ff7b72' }}>{'</body>'}</div></div><div style={{ color: '#ff7b72' }}>{'</html>'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section style={{ padding: '3rem 2rem', background: '#0f172a', borderTop: '1px solid rgba(59,130,246,0.1)', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>Trusted by innovative teams worldwide</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '3rem' }}>
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/google.svg" alt="Google" width="40" height="40" style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoft.svg" alt="Microsoft" width="40" height="40" style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" alt="GitHub" width="40" height="40" style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/stripe.svg" alt="Stripe" width="40" height="40" style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/figma.svg" alt="Figma" width="40" height="40" style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1b3e 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-block', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', background: 'linear-gradient(135deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>Our Story</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '700', marginBottom: '1.5rem' }}>About <span style={{ color: '#60a5fa' }}>GROW</span></h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1.5rem' }}>GROW (Grow Regularly, Over Wellness) is an e-learning platform dedicated to developers, designers, and digital marketers. We offer structured, written courses with hands-on quizzes and certifications.</p>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1.5rem' }}>Our mission is to make high-quality tech education accessible to everyone, with a focus on practical skills and real-world projects.</p>
            <button style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', padding: '0.9rem 2rem', borderRadius: '2.5rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('/courses')}>Explore Courses →</button>
          </div>
          <div style={{ background: '#0f172a', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 30px -12px rgba(0,0,0,0.3)' }}>
            <img src="https://i.postimg.cc/tTskRqTc/photo-2026-05-26-10-31-47.jpg" alt="About GROW Platform" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* POPULAR COURSES SECTION */}
      <section id="courses-section" style={{ padding: '80px 20px', background: 'linear-gradient(180deg, #0a1628 0%, #0d1b3e 50%, #0a1628 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ display: 'inline-block', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', background: 'linear-gradient(135deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Elite Collection</span>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: '700', background: 'linear-gradient(135deg, #ffffff, #93c5fd, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Popular Courses</h2>
          <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>Master in-demand skills with our expert-led courses</p>
        </div>
        <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1280px', margin: '0 auto' }}>
          {popularCourses.map(course => (
            <div key={course.id} onClick={() => navigate(`/courses/${course.id}`)} style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(20,30,55,0.8), rgba(15,25,45,0.9))', backdropFilter: 'blur(12px)', borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)', transition: 'all 0.3s' }}>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img src={course.image_url || `https://picsum.photos/id/${(course.id * 10) % 100}/400/250`} alt={course.title} style={{ width: '100%', height: '220px', objectFit: 'cover', transition: 'transform 0.6s' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, rgba(10,22,40,0.9), transparent)' }} />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white' }}>{course.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>{course.description?.substring(0, 100)}...</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <div><span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Starting at</span><div><span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#60a5fa' }}>$29</span><span style={{ fontSize: '0.6rem', color: '#64748b' }}> USD</span></div></div>
                  <button style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '2rem', cursor: 'pointer' }}>Enroll Now →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, #0f172a 0%, #0a0a0f 100%)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ display: 'inline-block', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', background: 'linear-gradient(135deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Success Stories</span>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: '700', background: 'linear-gradient(135deg, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>What Our Students Say</h2>
        </div>
        <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1280px', margin: '0 auto' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: 'rgba(20,30,55,0.5)', backdropFilter: 'blur(12px)', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid rgba(59,130,246,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <img src={t.avatar} alt={t.name} style={{ width: '55px', height: '55px', borderRadius: '50%', border: '2px solid #3b82f6' }} />
                <div><h4 style={{ fontWeight: '700' }}>{t.name}</h4><p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.title}</p></div>
              </div>
              <p style={{ color: '#e2e8f0', fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}><span style={{ color: '#fbbf24' }}>{"★".repeat(t.rating)}</span><span style={{ fontSize: '0.7rem', color: '#10b981' }}>✓ Trustpilot Verified</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1b3e 50%, #0a0a0f 100%)' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ display: 'inline-block', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', background: 'linear-gradient(135deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Platform Impact</span>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: '700', background: 'linear-gradient(135deg, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GROW by the Numbers</h2>
        </div>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {statsLoading ? Array(3).fill().map((_, i) => <div key={i} style={{ background: 'rgba(20,30,55,0.5)', borderRadius: '1.5rem', padding: '2rem', textAlign: 'center' }}><div style={{ width: '60px', height: '60px', background: '#334155', borderRadius: '1rem', margin: '0 auto' }}></div></div>) :
            stats.map((stat, idx) => (
              <div key={idx} style={{ background: 'rgba(20,30,55,0.5)', backdropFilter: 'blur(12px)', borderRadius: '1.5rem', padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.1))', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#60a5fa' }}>{stat.value}</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>{stat.label}</div>
              </div>
            ))
          }
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1b3e 100%)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ display: 'inline-block', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', background: 'linear-gradient(135deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Knowledge Base</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '700', background: 'linear-gradient(135deg, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faq.map((item, index) => {
              const question = item.keywords[0].charAt(0).toUpperCase() + item.keywords[0].slice(1);
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} style={{ background: 'rgba(20,30,55,0.4)', backdropFilter: 'blur(8px)', borderRadius: '1rem', border: '1px solid rgba(59,130,246,0.2)', overflow: 'hidden' }}>
                  <button onClick={() => setOpenFaqIndex(isOpen ? null : index)} style={{ width: '100%', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', fontWeight: '500', cursor: 'pointer', textAlign: 'left' }}>
                    <span>{question}</span>
                    <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                  </button>
                  {isOpen && <div style={{ padding: '0 1.5rem 1.2rem 1.5rem', color: '#cbd5e1', borderTop: '1px solid rgba(59,130,246,0.15)' }}>{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1b3e 100%)' }}>
        <div className="contact-grid" style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem' }}>
          <div><span style={{ display: 'inline-block', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', background: 'linear-gradient(135deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get in Touch</span><h2 style={{ fontSize: 'clamp(2rem,3vw,2.5rem)', fontWeight: '700', background: 'linear-gradient(135deg, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Let’s Talk</h2><p style={{ color: '#cbd5e1', marginBottom: '2rem' }}>Have questions? Our team is here to help.</p>
            <div>{[{ icon: <Zap size={20} />, title: 'Fast Response', desc: 'Reply within 24h' }, { icon: <GraduationCap size={20} />, title: 'Expert Support', desc: 'Industry pros' }, { icon: <Globe size={20} />, title: 'Global Community', desc: '25+ countries' }].map((item, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}><div style={{ width: '40px', height: '40px', background: 'rgba(59,130,246,0.1)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div><div><h4 style={{ color: 'white' }}>{item.title}</h4><p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{item.desc}</p></div></div>))}</div>
          </div>
          <div style={{ background: 'rgba(20,30,55,0.4)', backdropFilter: 'blur(12px)', borderRadius: '1.5rem', padding: '2rem', border: '1px solid rgba(59,130,246,0.15)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>Send a Message</h3>
            <form onSubmit={handleNewsletterSubmit}>
              <input type="text" placeholder="Full Name" value={newsletterName} onChange={e => setNewsletterName(e.target.value)} required style={{ width: '100%', padding: '0.8rem', margin: '1rem 0', background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.75rem', color: 'white' }} />
              <input type="email" placeholder="Email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} required style={{ width: '100%', padding: '0.8rem', marginBottom: '0.5rem', background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.75rem', color: 'white' }} />
              {emailError && <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>{emailError}</div>}
              <textarea placeholder="Message" value={newsletterMessage} onChange={e => setNewsletterMessage(e.target.value)} rows="4" required style={{ width: '100%', padding: '0.8rem', marginBottom: '0.5rem', background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.75rem', color: 'white' }} />
              {messageError && <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>{messageError}</div>}
              {newsletterConfirm && <div style={{ marginBottom: '1rem', padding: '0.5rem', background: 'rgba(16,185,129,0.1)', borderRadius: '0.5rem', color: '#10b981' }}>{newsletterConfirm}</div>}
              <button type="submit" disabled={contactLoading} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer' }}>{contactLoading ? 'Sending...' : 'Send →'}</button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0a0a0f', borderTop: '1px solid rgba(59,130,246,0.15)', padding: '4rem 2rem 2rem' }}>
        <div className="footer-grid" style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
          <div><img src="/logo.png" alt="GROW" style={{ height: '50px', marginBottom: '1.5rem' }} /><p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>Empowering learners worldwide.</p><div className="footer-social" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><FaFacebook size={20} /></a><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><FaTwitter size={20} /></a><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><FaInstagram size={20} /></a><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><FaLinkedin size={20} /></a></div></div>
          <div><h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Quick Links</h4><ul style={{ listStyle: 'none', padding: 0 }}><li><Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Home</Link></li><li><Link to="/courses" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Courses</Link></li><li><Link to="/programs" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Programs</Link></li><li><Link to="/mentors" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Mentors</Link></li><li><Link to="/pricing" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Pricing</Link></li></ul></div>
          <div><h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Support</h4><ul style={{ listStyle: 'none', padding: 0 }}><li><Link to="/help" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Help</Link></li><li><Link to="/privacy" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Privacy</Link></li><li><Link to="/terms" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Terms</Link></li></ul></div>
          <div><h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Stay Updated</h4><div style={{ display: 'flex', gap: '0.5rem' }}><input type="email" placeholder="Email" style={{ flex: 1, padding: '0.7rem', background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.75rem', color: 'white' }} /><button style={{ padding: '0.7rem 1.2rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer' }}>Subscribe</button></div></div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(59,130,246,0.1)', color: '#94a3b8', fontSize: '0.75rem' }}>© 2025 GROW. All rights reserved.</div>
      </footer>

      {/* CHATBOT */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
        <div onClick={() => setShowChat(!showChat)} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 20px rgba(59,130,246,0.5)', transition: 'transform 0.2s' }}>
          <Sparkles size={28} color="white" />
        </div>
        {showChat && (
          <div className="chat-popup" style={{ position: 'absolute', bottom: '80px', right: '0', width: 'clamp(280px, 90vw, 360px)', height: '500px', background: 'rgba(20,30,55,0.65)', backdropFilter: 'blur(12px)', borderRadius: '1.5rem', boxShadow: '0 25px 40px -12px rgba(0,0,0,0.3)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(59,130,246,0.2)', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(59,130,246,0.2)' }}>
              <Sparkles size={18} color="#60a5fa" /><span style={{ color: 'white', fontSize: '0.9rem' }}>GROW Assistant</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', background: msg.role === 'user' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.08)', borderRadius: msg.role === 'user' ? '1.2rem 0.2rem 1.2rem 1.2rem' : '0.2rem 1.2rem 1.2rem 1.2rem', padding: '0.6rem 1rem', color: '#e2e8f0', fontSize: '0.85rem' }}>{msg.content}</div>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '0.5rem', padding: '0.8rem 1rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(59,130,246,0.2)' }}>
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask me anything..." style={{ flex: 1, padding: '0.6rem 0.8rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: '2rem', color: 'white', fontSize: '0.85rem', outline: 'none' }} />
              <button type="submit" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', borderRadius: '2rem', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Send size={16} color="white" /></button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;