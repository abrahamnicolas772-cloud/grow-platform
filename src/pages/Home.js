import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users, Star, TrendingUp, Zap, GraduationCap, Globe, Building, MessageCircle, Send, Sparkles
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
  const [enrolling, setEnrolling] = useState(null);
  const [newsletterName, setNewsletterName] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

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

  const courses = [
    {
      id: 1,
      title: 'UI/UX Design',
      modules: 11,
      rating: 4.8,
      students: 189,
      price: 15,
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
      description: 'Master user-centered design principles and create stunning interfaces.'
    },
    {
      id: 2,
      title: 'Full Stack Development',
      modules: 15,
      rating: 4.9,
      students: 245,
      price: 15,
      image: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg',
      description: 'Master frontend and backend technologies.'
    },
    {
      id: 3,
      title: 'Digital Marketing',
      modules: 12,
      rating: 4.7,
      students: 178,
      price: 15,
      image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
      description: 'SEO, social media, and analytics.'
    }
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const testimonials = [
    {
      name: 'Jean-Paul M.',
      title: 'UI/UX Student',
      text: 'The UI/UX course helped me land my first design internship!',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Fatima D.',
      title: 'Full Stack Developer',
      text: 'Complete training, real projects. I learned more in 3 months than in 2 years.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
      name: 'Mamadou S.',
      title: 'Marketing Specialist',
      text: 'The digital marketing course helped me launch my own agency.',
      rating: 4,
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    }
  ];

  const [statsValues, setStatsValues] = useState({
    total_students: 300,
    satisfaction_rate: 98,
    average_rating: 4.9
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setTimeout(() => {
          setStatsValues({ total_students: 300, satisfaction_rate: 98, average_rating: 4.9 });
          setStatsLoading(false);
        }, 500);
      } catch (error) {
        console.error(error);
        setStatsLoading(false);
      }
    };
    fetchStats();
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
    const matched = faq.find(item =>
      item.keywords.some(keyword => lowerMsg.includes(keyword))
    );
    const reply = matched?.answer || "I don't have an answer yet. Please contact support@growplatform.com!";
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    }, 300);
    setChatInput('');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setEmailError('');
    setMessageError('');
    let isValid = true;
    if (!validateEmail(newsletterEmail)) {
      setEmailError('Invalid email address');
      isValid = false;
    }
    if (!newsletterMessage.trim()) {
      setMessageError('Message cannot be empty');
      isValid = false;
    }
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

  const handleEnroll = async (courseId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please log in first.');
      navigate('/login');
      return;
    }
    setEnrolling(courseId);
    try {
      const response = await api.enrollCourse(user.id, courseId, 'card');
      alert(`✅ ${response.data.message}`);
    } catch (error) {
      alert(error.response?.data?.error || 'Error');
    } finally {
      setEnrolling(null);
    }
  };

  // Styles
  const heroStyle = {
    minHeight: '70vh',
    background: 'linear-gradient(135deg, #02122E 0%, #051B4D 50%, #0A2A73 100%)',
    position: 'relative',
    overflow: 'hidden',
    paddingTop: '20px',
  };

  const heroContentStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'stretch',
  };

  const leftStyle = { color: 'white' };
  const headlineStyle = {
    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '1.5rem',
    letterSpacing: '-0.02em',
  };
  const accentStyle = { color: '#3b82f6', display: 'inline-block' };
  const subheadlineStyle = {
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '2rem',
    lineHeight: '1.6',
    maxWidth: '500px',
  };
  const ctaContainerStyle = { display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' };
  const primaryCtaStyle = {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white',
    border: 'none',
    padding: '0.9rem 2rem',
    borderRadius: '2.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(59,130,246,0.3)',
  };
  const secondaryCtaStyle = {
    background: 'transparent',
    color: 'white',
    border: '1.5px solid rgba(255,255,255,0.3)',
    padding: '0.9rem 2rem',
    borderRadius: '2.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  };
  const featuresStyle = { display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' };
  const featureCardStyle = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    padding: '1rem 1.5rem',
    borderRadius: '1rem',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s',
  };
  const rightStyle = { position: 'relative', display: 'flex', flexDirection: 'column' };
  const buttonPrimary = {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '2rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ background: '#0a0a0f', color: 'white', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          @keyframes fadeScale {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .chat-popup {
            animation: fadeScale 0.2s ease-out;
          }
          .stat-card:hover .stat-icon {
            transform: scale(1.05);
          }
          .social-icon:hover {
            transform: translateY(-3px);
            color: #60a5fa !important;
          }
          @media (max-width: 768px) {
            .hero-grid {
              grid-template-columns: 1fr !important;
              text-align: center;
              gap: 2rem !important;
            }
            .hero-image {
              max-height: 300px !important;
            }
            .courses-grid {
              grid-template-columns: 1fr !important;
            }
            .testimonials-grid {
              grid-template-columns: 1fr !important;
            }
            .stats-grid {
              grid-template-columns: 1fr !important;
            }
            .contact-grid {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }
            .footer-grid {
              grid-template-columns: 1fr !important;
              text-align: center;
            }
            .footer-social {
              justify-content: center;
            }
            .stat-card {
              padding: 1.5rem !important;
            }
            .stat-number {
              font-size: 2rem !important;
            }
          }
          @media (max-width: 1024px) and (min-width: 769px) {
            .courses-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
        `}
      </style>

      {/* ========== HERO SECTION ========== */}
      <section style={heroStyle}>
        <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', animation: 'float 12s ease-in-out infinite reverse' }} />
        <div className="hero-grid" style={heroContentStyle}>
          <div style={leftStyle}>
            <h1 style={headlineStyle}>
              Learn.{' '}
              <span style={accentStyle}>
                Grow.
                <svg style={{ position: 'absolute', bottom: '-5px', left: 0, width: '100%', height: '8px' }} viewBox="0 0 200 8">
                  <path d="M0,5 Q100,0 200,5" stroke="#3b82f6" fill="none" strokeWidth="2" opacity="0.5" />
                </svg>
              </span>{' '}
              Succeed.
            </h1>
            <p style={subheadlineStyle}>Access premium expert-led courses and build skills that shape your future.</p>
            <div style={ctaContainerStyle}>
              <button style={primaryCtaStyle} onClick={handleScrollToCourses}>Start Learning →</button>
              <button style={secondaryCtaStyle} onClick={() => navigate('/programs')}>View Programs</button>
            </div>
            <div style={featuresStyle}>
              {[
                { label: 'Expert Courses', desc: '400+ lessons' },
                { label: 'Certifications', desc: 'Recognized' },
                { label: 'Flexible Learning', desc: 'Anytime, anywhere' }
              ].map((f, i) => (
                <div key={i} style={featureCardStyle}>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{f.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={rightStyle}>
            {/* Code mockup */}
            <div style={{
              flex: 1,
              background: '#0a0c10',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              border: '1px solid rgba(59,130,246,0.4)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{
                background: '#1a1e2a',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderBottom: '1px solid rgba(59,130,246,0.2)',
              }}>
                <span style={{ width: '12px', height: '12px', background: '#ff5f56', borderRadius: '50%' }}></span>
                <span style={{ width: '12px', height: '12px', background: '#ffbd2e', borderRadius: '50%' }}></span>
                <span style={{ width: '12px', height: '12px', background: '#27c93f', borderRadius: '50%' }}></span>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem', marginLeft: '0.5rem' }}>index.html</span>
              </div>
              <div style={{
                flex: 1,
                padding: '1.2rem',
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                lineHeight: '1.5',
                color: '#e2e8f0',
                overflowY: 'auto',
                background: '#0a0c10',
              }}>
                <div style={{ color: '#ff7b72' }}>{'<html>'}</div>
                <div style={{ marginLeft: '1rem' }}>
                  <div style={{ color: '#ff7b72' }}>{'<head>'}</div>
                  <div style={{ marginLeft: '1rem' }}>
                    <div><span style={{ color: '#d2a8ff' }}>&lt;title&gt;</span><span style={{ color: '#e2e8f0' }}>GROW Platform</span><span style={{ color: '#d2a8ff' }}>&lt;/title&gt;</span></div>
                    <div><span style={{ color: '#d2a8ff' }}>&lt;meta</span> <span style={{ color: '#79c0ff' }}>charset=</span><span style={{ color: '#a5d6ff' }}>"UTF-8"</span><span style={{ color: '#d2a8ff' }}>&gt;</span></div>
                  </div>
                  <div style={{ color: '#ff7b72' }}>{'</head>'}</div>
                  <div style={{ color: '#ff7b72' }}>{'<body>'}</div>
                  <div style={{ marginLeft: '1rem' }}>
                    <div><span style={{ color: '#d2a8ff' }}>&lt;div</span> <span style={{ color: '#79c0ff' }}>class=</span><span style={{ color: '#a5d6ff' }}>"course-card"</span><span style={{ color: '#d2a8ff' }}>&gt;</span></div>
                    <div style={{ marginLeft: '1rem' }}>
                      <div><span style={{ color: '#d2a8ff' }}>&lt;h2&gt;</span><span style={{ color: '#e2e8f0' }}>Full Stack Development</span><span style={{ color: '#d2a8ff' }}>&lt;/h2&gt;</span></div>
                      <div><span style={{ color: '#d2a8ff' }}>&lt;p&gt;</span><span style={{ color: '#e2e8f0' }}>Learn React, Node.js, MongoDB</span><span style={{ color: '#d2a8ff' }}>&lt;/p&gt;</span></div>
                      <div><span style={{ color: '#79c0ff' }}>const</span> <span style={{ color: '#d2a8ff' }}>modules</span> = [<span style={{ color: '#a5d6ff' }}>'HTML/CSS'</span>, <span style={{ color: '#a5d6ff' }}>'JavaScript'</span>, <span style={{ color: '#a5d6ff' }}>'React'</span>];</div>
                      <div><span style={{ color: '#79c0ff' }}>function</span> <span style={{ color: '#d2a8ff' }}>startCourse</span>() &#123;</div>
                      <div style={{ marginLeft: '1rem', color: '#79c0ff' }}>console.<span style={{ color: '#d2a8ff' }}>log</span>(<span style={{ color: '#a5d6ff' }}>"Learning GROW..."</span>);</div>
                      <div style={{ marginLeft: '1rem', color: '#79c0ff' }}><span style={{ color: '#ff7b72' }}>return</span> <span style={{ color: '#d2a8ff' }}>new</span> <span style={{ color: '#d2a8ff' }}>Promise</span>(<span style={{ color: '#79c0ff' }}>resolve</span> => &#123;</div>
                      <div style={{ marginLeft: '2rem', color: '#79c0ff' }}>setTimeout(() => resolve(<span style={{ color: '#a5d6ff' }}>'Certificate Ready'</span>), 3000);</div>
                      <div style={{ marginLeft: '1rem', color: '#79c0ff' }}>&#125;);</div>
                      <div>&#125;</div>
                    </div>
                    <div><span style={{ color: '#d2a8ff' }}>&lt;/div&gt;</span></div>
                    <div style={{ marginTop: '0.5rem', color: '#6b7280' }}>// Built with React + Flask</div>
                  </div>
                  <div style={{ color: '#ff7b72' }}>{'</body>'}</div>
                </div>
                <div style={{ color: '#ff7b72' }}>{'</html>'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TRUST SECTION ========== */}
      <section style={{
        padding: '3rem 2rem',
        background: '#0f172a',
        borderTop: '1px solid rgba(59,130,246,0.1)',
        borderBottom: '1px solid rgba(59,130,246,0.1)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>Trusted by innovative teams worldwide</p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '3rem',
          }}>
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/google.svg" alt="Google" width="40" height="40" style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoft.svg" alt="Microsoft" width="40" height="40" style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" alt="GitHub" width="40" height="40" style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/stripe.svg" alt="Stripe" width="40" height="40" style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/figma.svg" alt="Figma" width="40" height="40" style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
          </div>
        </div>
      </section>

      {/* ========== ABOUT US SECTION ========== */}
<section style={{
  padding: '80px 20px',
  background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1b3e 100%)',
}}>
  <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
    <div>
      <span style={{ display: 'inline-block', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', background: 'linear-gradient(135deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>Our Story</span>
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '700', marginBottom: '1.5rem' }}>About <span style={{ color: '#60a5fa' }}>GROW</span></h2>
      <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1.5rem' }}>
        GROW (Grow Regularly, Over Wellness) is an e-learning platform dedicated to developers, designers, and digital marketers. We offer structured, written courses with hands-on quizzes and certifications.
      </p>
      <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1.5rem' }}>
        Our mission is to make high-quality tech education accessible to everyone, with a focus on practical skills and real-world projects.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button style={primaryCtaStyle} onClick={() => navigate('/courses')}>Explore Courses →</button>
      </div>
    </div>
    <div style={{
      background: '#0f172a',
      borderRadius: '1.5rem',
      overflow: 'hidden',
      boxShadow: '0 20px 30px -12px rgba(0,0,0,0.3)',
    }}>
      <img 
        src="https://i.postimg.cc/tTskRqTc/photo-2026-05-26-10-31-47.jpg" 
        alt="About GROW Platform"
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
  </div>
</section>

      {/* ========== POPULAR COURSES AVEC DESIGN SCHÉMATIQUE ========== */}
<section id="courses-section" style={{
  padding: '80px 20px',
  position: 'relative',
  background: 'linear-gradient(180deg, #0a1628 0%, #0d1b3e 50%, #0a1628 100%)',
  overflow: 'hidden',
}}>
  {/* Décoration de fond */}
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)',
  }} />
  
  <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '200px',
    background: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(99,102,241,0.03) 50px, rgba(99,102,241,0.03) 100px)',
    pointerEvents: 'none',
  }} />

  <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 2 }}>
    <span style={{
      display: 'inline-block',
      fontSize: '0.8rem',
      letterSpacing: '3px',
      textTransform: 'uppercase',
      background: 'linear-gradient(135deg, #60a5fa, #06b6d4)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '1rem',
    }}>Elite Collection</span>
    <h2 style={{
      fontSize: 'clamp(2rem,4vw,3.2rem)',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #ffffff, #93c5fd, #60a5fa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '1rem',
      letterSpacing: '-0.02em',
    }}>Popular Courses</h2>
    <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>Master in-demand skills with our expert-led courses</p>
  </div>

  <div className="courses-grid" style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    maxWidth: '1280px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  }}>
    {filteredCourses.map((course, idx) => (
      <div
        key={course.id}
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(20, 30, 55, 0.8), rgba(15, 25, 45, 0.9))',
          backdropFilter: 'blur(12px)',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          border: '1px solid rgba(99,102,241,0.2)',
          transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
          cursor: 'pointer',
        }}
        onClick={() => navigate(`/courses/${course.id}`)}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-12px)';
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
          e.currentTarget.style.boxShadow = '0 30px 40px -20px rgba(99,102,241,0.3), 0 0 0 1px rgba(99,102,241,0.2) inset';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Badge Premium avec design schématique */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          color: 'white',
          padding: '0.3rem 0.8rem',
          borderRadius: '2rem',
          fontSize: '0.7rem',
          fontWeight: '600',
          zIndex: 2,
          backdropFilter: 'blur(4px)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15 8.5L22 9.5L17 14.5L18.5 21.5L12 18L5.5 21.5L7 14.5L2 9.5L9 8.5L12 2Z" fill="white" stroke="white" strokeWidth="1.5"/>
          </svg>
          <span>Premium</span>
        </div>

        {/* Image du cours avec overlay schématique */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={course.image}
            alt={course.title}
            style={{
              width: '100%',
              height: '220px',
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
          {/* Overlay schématique (diagramme) */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'linear-gradient(to top, rgba(10,22,40,0.9), transparent)',
          }} />
          
          {/* Petit diagramme schématique en bas à gauche */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '15px',
            display: 'flex',
            gap: '4px',
            alignItems: 'flex-end',
            opacity: 0.7,
          }}>
            {[25, 45, 60, 40, 75, 55].map((height, i) => (
              <div key={i} style={{
                width: '4px',
                height: `${height / 3}px`,
                background: '#60a5fa',
                borderRadius: '2px',
              }} />
            ))}
          </div>
        </div>

        {/* Contenu de la carte */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              margin: 0,
              background: 'linear-gradient(135deg, #fff, #cbd5e1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>{course.title}</h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'rgba(99,102,241,0.15)',
              padding: '0.25rem 0.6rem',
              borderRadius: '2rem',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15 8.5L22 9.5L17 14.5L18.5 21.5L12 18L5.5 21.5L7 14.5L2 9.5L9 8.5L12 2Z" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5"/>
              </svg>
              <span style={{ color: '#e2e8f0', fontSize: '0.8rem', fontWeight: '600' }}>{course.rating}</span>
            </div>
          </div>
          
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.5' }}>{course.description}</p>
          
          {/* Métriques avec petits schémas */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="#60a5fa" strokeWidth="1.5"/>
                <path d="M8 2V6M16 2V6M4 10H20" stroke="#60a5fa" strokeWidth="1.5"/>
              </svg>
              <span>{course.modules} modules</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="#60a5fa" strokeWidth="1.5"/>
                <path d="M5 20V19C5 15.6863 7.68629 13 11 13H13C16.3137 13 19 15.6863 19 19V20" stroke="#60a5fa" strokeWidth="1.5"/>
              </svg>
              <span>{course.students} students</span>
            </div>
          </div>
          
          {/* Barre de progression schématique */}
          <div style={{
            marginTop: '0.5rem',
            marginBottom: '0.5rem',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.6rem',
              color: '#64748b',
              marginBottom: '0.25rem',
            }}>
              <span>Completion rate</span>
              <span>87%</span>
            </div>
            <div style={{
              width: '100%',
              height: '3px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: '87%',
                height: '100%',
                background: 'linear-gradient(90deg, #60a5fa, #06b6d4)',
                borderRadius: '2px',
              }} />
            </div>
          </div>
          
          {/* Prix et bouton */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(99,102,241,0.15)',
          }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Starting at</span>
              <div>
                <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#60a5fa' }}>${course.price}</span>
                <span style={{ fontSize: '0.6rem', color: '#64748b' }}> USD</span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleEnroll(course.id); }}
              disabled={enrolling === course.id}
              style={{
                background: enrolling === course.id ? '#475569' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                border: 'none',
                color: 'white',
                padding: '0.6rem 1.2rem',
                borderRadius: '2rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
              onMouseEnter={e => {
                if (enrolling !== course.id) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 15px rgba(59,130,246,0.4)';
                }
              }}
              onMouseLeave={e => {
                if (enrolling !== course.id) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {enrolling === course.id ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                    <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Enrolling...
                </>
              ) : (
                <>
                  Enroll Now
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Effet de brillance sur la bordure */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)',
          opacity: 0.5,
        }} />
      </div>
    ))}
  </div>
  
  {filteredCourses.length === 0 && (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
      No courses found matching your search.
    </div>
  )}
</section>

      {/* ========== TESTIMONIALS WITH TRUSTPILOT ========== */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, #0f172a 0%, #0a0a0f 100%)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ display: 'inline-block', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', background: 'linear-gradient(135deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Success Stories</span>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: '700', background: 'linear-gradient(135deg, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>What Our Students Say</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', alignItems: 'center' }}>
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/trustpilot.svg" alt="Trustpilot" width="20" height="20" style={{ filter: 'brightness(0) invert(1)' }} />
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Verified on Trustpilot</span>
            <span style={{ color: '#fbbf24' }}>★★★★★</span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>4.8/5</span>
          </div>
        </div>
        <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1280px', margin: '0 auto' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: 'rgba(20,30,55,0.5)', backdropFilter: 'blur(12px)', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid rgba(59,130,246,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <img src={t.avatar} alt={t.name} style={{ width: '55px', height: '55px', borderRadius: '50%', border: '2px solid #3b82f6' }} />
                <div><h4 style={{ fontWeight: '700' }}>{t.name}</h4><p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.title}</p></div>
              </div>
              <p style={{ color: '#e2e8f0', fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: '#fbbf24' }}>{"★".repeat(t.rating)}</span>
                <span style={{ fontSize: '0.7rem', color: '#10b981' }}>✓ Trustpilot Verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== STATISTICS SECTION ========== */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1b3e 50%, #0a0a0f 100%)' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ display: 'inline-block', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', background: 'linear-gradient(135deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Platform Impact</span>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: '700', background: 'linear-gradient(135deg, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GROW by the Numbers</h2>
        </div>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {statsLoading ? (
            Array(3).fill().map((_, i) => <div key={i} style={{ background: 'rgba(20,30,55,0.5)', borderRadius: '1.5rem', padding: '2rem', textAlign: 'center' }}><div style={{ width: '60px', height: '60px', background: '#334155', borderRadius: '1rem', margin: '0 auto 1rem' }}></div></div>)
          ) : (
            stats.map((stat, idx) => (
              <div key={idx} style={{ background: 'rgba(20,30,55,0.5)', backdropFilter: 'blur(12px)', borderRadius: '1.5rem', padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.1))', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#60a5fa' }}>{stat.value}</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>{stat.label}</div>
              </div>
            ))
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(59,130,246,0.05)', padding: '0.5rem 1.2rem', borderRadius: '2rem' }}>
            <Building size={16} color="#cbd5e1" />
            <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>Google</span> • <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>Microsoft</span> • <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>Digicel</span>
          </div>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1b3e 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '-5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ display: 'inline-block', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', background: 'linear-gradient(135deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>Knowledge Base</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '700', background: 'linear-gradient(135deg, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
            <p style={{ color: '#cbd5e1', maxWidth: '600px', margin: '0 auto' }}>Find quick answers to common questions about GROW platform.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faq.map((item, index) => {
              const question = item.keywords[0].charAt(0).toUpperCase() + item.keywords[0].slice(1);
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} style={{ background: 'rgba(20,30,55,0.4)', backdropFilter: 'blur(8px)', borderRadius: '1rem', border: '1px solid rgba(59,130,246,0.2)', overflow: 'hidden' }}>
                  <button onClick={() => setOpenFaqIndex(isOpen ? null : index)} style={{ width: '100%', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', fontWeight: '500', cursor: 'pointer', textAlign: 'left' }}>
                    <span>{question}</span>
                    <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: '1.2rem' }}>▼</span>
                  </button>
                  {isOpen && <div style={{ padding: '0 1.5rem 1.2rem 1.5rem', color: '#cbd5e1', borderTop: '1px solid rgba(59,130,246,0.15)', lineHeight: '1.6', fontSize: '0.9rem' }}>{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== CONTACT FORM ========== */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1b3e 100%)' }}>
        <div className="contact-grid" style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
          <div>
            <span style={{ display: 'inline-block', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', background: 'linear-gradient(135deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get in Touch</span>
            <h2 style={{ fontSize: 'clamp(2rem,3vw,2.5rem)', fontWeight: '700', background: 'linear-gradient(135deg, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>Let’s Talk</h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '2rem' }}>Have questions? Our team is here to help.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[{ icon: <Zap size={20} strokeWidth={1.5} color="#60a5fa" />, title: 'Fast Response', desc: 'Reply within 24h' }, { icon: <GraduationCap size={20} strokeWidth={1.5} color="#60a5fa" />, title: 'Expert Support', desc: 'Industry pros' }, { icon: <Globe size={20} strokeWidth={1.5} color="#60a5fa" />, title: 'Global Community', desc: '25+ countries' }].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><div style={{ width: '40px', height: '40px', background: 'rgba(59,130,246,0.1)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div><div><h4 style={{ color: 'white', fontWeight: '600' }}>{item.title}</h4><p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{item.desc}</p></div></div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(20,30,55,0.4)', backdropFilter: 'blur(12px)', borderRadius: '1.5rem', padding: '2rem', border: '1px solid rgba(59,130,246,0.15)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>Send a Message</h3>
            <form onSubmit={handleNewsletterSubmit}>
              <input type="text" placeholder="Full Name" value={newsletterName} onChange={e => setNewsletterName(e.target.value)} required style={{ width: '100%', padding: '0.8rem', margin: '1rem 0', background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.75rem', color: 'white' }} />
              <input type="email" placeholder="Email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} required style={{ width: '100%', padding: '0.8rem', marginBottom: '0.5rem', background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.75rem', color: 'white' }} />
              {emailError && <div style={{ color: '#ef4444', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{emailError}</div>}
              <textarea placeholder="Message" value={newsletterMessage} onChange={e => setNewsletterMessage(e.target.value)} rows="4" required style={{ width: '100%', padding: '0.8rem', marginBottom: '0.5rem', background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.75rem', color: 'white' }} />
              {messageError && <div style={{ color: '#ef4444', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{messageError}</div>}
              {newsletterConfirm && <div style={{ marginBottom: '1rem', padding: '0.5rem', background: 'rgba(16,185,129,0.1)', borderRadius: '0.5rem', color: '#10b981' }}>{newsletterConfirm}</div>}
              <button type="submit" disabled={contactLoading} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer' }}>{contactLoading ? 'Sending...' : 'Send →'}</button>
            </form>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{ background: '#0a0a0f', borderTop: '1px solid rgba(59,130,246,0.15)', padding: '4rem 2rem 2rem', marginTop: '4rem' }}>
        <div className="footer-grid" style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
          <div>
            <img src="/logo.png" alt="GROW" style={{ height: '50px', marginBottom: '1.5rem' }} />
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Empowering learners worldwide.</p>
            <div className="footer-social" style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" style={{ width: '36px', height: '36px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none' }}><FaFacebook size={20} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" style={{ width: '36px', height: '36px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none' }}><FaTwitter size={20} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" style={{ width: '36px', height: '36px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none' }}><FaInstagram size={20} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" style={{ width: '36px', height: '36px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none' }}><FaLinkedin size={20} /></a>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Home</Link></li>
              <li><Link to="/courses" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Courses</Link></li>
              <li><Link to="/programs" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Programs</Link></li>
              <li><Link to="/mentors" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Mentors</Link></li>
              <li><Link to="/pricing" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link to="/help" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Help</Link></li>
              <li><Link to="/privacy" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Privacy</Link></li>
              <li><Link to="/terms" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Stay Updated</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="email" placeholder="Email" style={{ flex: 1, padding: '0.7rem', background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.75rem', color: 'white' }} />
              <button style={{ padding: '0.7rem 1.2rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer' }}>Subscribe</button>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(59,130,246,0.1)', color: '#94a3b8', fontSize: '0.75rem' }}>© 2025 GROW. All rights reserved.</div>
      </footer>

      {/* ========== CHATBOT ========== */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
        <div onClick={() => setShowChat(!showChat)} style={{
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(59,130,246,0.5)',
          transition: 'transform 0.2s',
        }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <Sparkles size={28} color="white" />
        </div>
        {showChat && (
          <div className="chat-popup" style={{
            position: 'absolute',
            bottom: '80px',
            right: '0',
            width: '360px',
            height: '500px',
            background: 'rgba(20, 30, 55, 0.65)',
            backdropFilter: 'blur(12px)',
            borderRadius: '1.5rem',
            boxShadow: '0 25px 40px -12px rgba(0,0,0,0.3), 0 0 0 1px rgba(59,130,246,0.2)',
            border: '1px solid rgba(59,130,246,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            <div style={{
              background: 'rgba(59,130,246,0.2)',
              backdropFilter: 'blur(8px)',
              padding: '0.8rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              borderBottom: '1px solid rgba(59,130,246,0.2)',
            }}>
              <Sparkles size={18} color="#60a5fa" />
              <span style={{ fontWeight: '500', color: 'white', fontSize: '0.9rem' }}>GROW Water Assistant</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: 'rgba(16,185,129,0.3)', padding: '0.2rem 0.6rem', borderRadius: '1rem', color: '#a7f3d0' }}>● Online</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: msg.role === 'user' ? '1.2rem 0.2rem 1.2rem 1.2rem' : '0.2rem 1.2rem 1.2rem 1.2rem',
                  padding: '0.6rem 1rem',
                  color: '#e2e8f0',
                  fontSize: '0.85rem',
                  border: msg.role === 'assistant' ? '1px solid rgba(59,130,246,0.3)' : 'none',
                }}>
                  {msg.content}
                </div>
              ))}
            </div>
            <div style={{ padding: '0.5rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid rgba(59,130,246,0.1)', background: 'rgba(0,0,0,0.2)' }}>
              {["Price", "Certificate", "Sign up", "Support"].map((s, i) => (
                <button key={i} onClick={() => setChatInput(s)} style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '2rem', padding: '0.25rem 0.75rem', fontSize: '0.7rem', color: '#94a3b8', cursor: 'pointer' }}>{s}</button>
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