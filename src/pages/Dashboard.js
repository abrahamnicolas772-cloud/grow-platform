import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, CheckCircle, Clock, Users, Target, Flame, Award,
  TrendingUp, Calendar, ArrowRight, Sparkles, PlayCircle
} from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    completedCourses: 0,
    averageProgress: 0,
    totalLessonsCompleted: 0,
    totalLessons: 0,
    streakDays: 0,
    totalHours: 0,
    certificatesEarned: 0,
  });

  const getStoredProgress = (courseId, userId) => {
    const lessonsKey = `completed_lessons_${courseId}_${userId}`;
    const savedLessons = localStorage.getItem(lessonsKey);
    return savedLessons ? Object.keys(JSON.parse(savedLessons)).length : 0;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) { setLoading(false); return; }
    setUser(userData);

    try {
      const enrollmentsRes = await api.getUserEnrollments(userData.id);
      const enrollmentsData = enrollmentsRes.data;

      const enrichedEnrollments = [];
      let totalProgressSum = 0;
      let totalCompletedLessonsAll = 0;
      let totalAllLessonsAll = 0;
      let completedCount = 0;

      for (const enrollment of enrollmentsData) {
        // L'API renvoie 'id' comme course_id
        const courseId = enrollment.id;
        const completedLessons = getStoredProgress(courseId, userData.id);
        
        let totalLessons = 0;
        try {
          const courseDetail = await api.getCourse(courseId);
          if (courseDetail.data.modules) {
            for (const module of courseDetail.data.modules) {
              try {
                const lessonsRes = await api.getModuleLessons(module.id);
                totalLessons += lessonsRes.data.length;
              } catch (err) {}
            }
          }
        } catch (err) {}

        const progress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
        const isCompleted = progress === 100;

        enrichedEnrollments.push({
          id: enrollment.enrollment_id || enrollment.id,
          course_id: courseId,
          course_title: enrollment.course_title || enrollment.title,
          course_image: enrollment.image_url,
          progress,
          completed_lessons: completedLessons,
          total_lessons: totalLessons,
          isCompleted
        });

        totalProgressSum += progress;
        totalCompletedLessonsAll += completedLessons;
        totalAllLessonsAll += totalLessons;
        if (isCompleted) completedCount++;
      }

      setEnrollments(enrichedEnrollments);
      setStats({
        totalEnrolled: enrollmentsData.length,
        completedCourses: completedCount,
        averageProgress: enrollmentsData.length > 0 ? Math.round(totalProgressSum / enrollmentsData.length) : 0,
        totalLessonsCompleted: totalCompletedLessonsAll,
        totalLessons: totalAllLessonsAll,
        streakDays: 0,
        totalHours: Math.round(totalAllLessonsAll * 0.5),
        certificatesEarned: completedCount,
      });
    } catch (err) {
      console.error('Error loading dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#22c55e';
    if (progress >= 50) return '#f59e0b';
    return '#3b82f6';
  };

  const pageStyle = {
    position: 'relative', minHeight: '100vh', paddingTop: '70px',
    fontFamily: "'Inter', 'Montserrat', sans-serif",
    backgroundImage: 'url("https://i.postimg.cc/3wxVp0ny/photo-2026-05-26-11-00-53.jpg")',
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
  };
  const darkOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)', zIndex: 0, pointerEvents: 'none' };
  const containerStyle = { maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem', position: 'relative', zIndex: 1 };
  const layoutStyle = { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' };
  const mainStyle = { flex: 1 };
  const cardStyle = { background: 'rgba(20,30,55,0.6)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(59,130,246,0.2)', marginBottom: '1rem' };
  const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.8rem', marginBottom: '1rem' };
  const statCard = { background: 'rgba(20,30,55,0.4)', borderRadius: '0.8rem', padding: '0.8rem', textAlign: 'center', border: '1px solid rgba(59,130,246,0.15)' };
  const progressBarStyle = { width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden', margin: '0.3rem 0' };
  const progressFillStyle = (pct) => ({ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, #3b82f6, ${getProgressColor(pct)})`, borderRadius: '3px', transition: 'width 0.5s' });
  const buttonStyle = { padding: '0.3rem 0.8rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', borderRadius: '1.5rem', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.8rem' };

  if (loading) {
    return <div style={pageStyle}><div style={darkOverlay} /><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative', zIndex: 1 }}><div className="loading-spinner"></div></div></div>;
  }

  return (
    <div style={pageStyle}>
      <div style={darkOverlay} />
      <div style={containerStyle}>
        <div style={layoutStyle}>
          <Sidebar />
          <div style={mainStyle}>
            <div style={{ marginBottom: '1rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Welcome back{user?.name ? `, ${user.name}` : ''}!
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Track your learning progress</p>
            </div>

            <div style={statsGrid}>
              <div style={statCard}><BookOpen size={24} color="#60a5fa" /><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa' }}>{stats.totalEnrolled}</div><div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Enrolled</div></div>
              <div style={statCard}><CheckCircle size={24} color="#22c55e" /><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>{stats.completedCourses}</div><div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Completed</div></div>
              <div style={statCard}><TrendingUp size={24} color="#f59e0b" /><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.averageProgress}%</div><div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Avg Progress</div></div>
              <div style={statCard}><Award size={24} color="#8b5cf6" /><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>{stats.totalLessonsCompleted}/{stats.totalLessons}</div><div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Lessons</div></div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><BookOpen size={18} /> My Courses</h2>
              {enrollments.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '0.8rem' }}>No courses enrolled yet. <Link to="/courses" style={{ color: '#60a5fa' }}>Browse courses</Link></p>
              ) : (
                <div style={gridStyle}>
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} style={{ background: 'rgba(59,130,246,0.08)', borderRadius: '0.6rem', padding: '0.6rem' }}>
                      <div style={{ fontWeight: '500', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'white' }}>{enrollment.course_title}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Progress: {enrollment.progress}%</span>
                        <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{enrollment.completed_lessons}/{enrollment.total_lessons} lessons</span>
                      </div>
                      <div style={progressBarStyle}><div style={progressFillStyle(enrollment.progress)}></div></div>
                      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <Link to={`/learning/${enrollment.course_id}`} style={buttonStyle}>
                          {enrollment.isCompleted ? 'View' : 'Continue'} <ArrowRight size={12} />
                        </Link>
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
  );
}

export default Dashboard;
