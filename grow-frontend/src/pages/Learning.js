import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, BookOpen, Award, ChevronRight, ChevronLeft, Menu, X, Lock, Trophy, Circle, Play } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

function Learning() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCertificateScreen, setShowCertificateScreen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Charger les données du cours
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/courses/${courseId}`).then(r => r.json()),
      fetch(`${API_BASE}/courses/${courseId}/modules`).then(r => r.json())
    ]).then(([courseData, modulesData]) => {
      setCourse(courseData);
      setModules(modulesData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [courseId]);

  // Charger la progression depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`completed_lessons_${courseId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Vérifier que c'est un objet valide
        if (typeof parsed === 'object' && parsed !== null) {
          setCompletedLessons(parsed);
        }
      } catch(e) {
        console.error('Error parsing saved progress');
        setCompletedLessons({});
      }
    }
  }, [courseId]);

  // Sauvegarder la progression
  useEffect(() => {
    if (Object.keys(completedLessons).length > 0) {
      localStorage.setItem(`completed_lessons_${courseId}`, JSON.stringify(completedLessons));
    }
  }, [completedLessons, courseId]);

  // Liste plate des leçons
  const allLessons = [];
  modules.forEach(module => {
    if (module.lessons && module.lessons.length > 0) {
      module.lessons.forEach(lesson => {
        allLessons.push({ 
          ...lesson, 
          moduleTitle: module.title,
          moduleId: module.id
        });
      });
    }
  });

  const totalLessons = allLessons.length;
  // Compter UNIQUEMENT les leçons complétées (pas de doublons)
  const completedCount = Object.values(completedLessons).filter(v => v === true).length;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const isLastLesson = currentLessonIndex === totalLessons - 1;
  const currentLesson = allLessons[currentLessonIndex];
  const allCompleted = completedCount === totalLessons && totalLessons > 0;

  // Vérifier si une leçon est débloquée
  const isLessonUnlocked = (index) => {
    if (index === 0) return true;
    const previousLesson = allLessons[index - 1];
    if (!previousLesson) return true;
    return completedLessons[previousLesson.id] === true;
  };

  // Marquer une leçon comme terminée
  const markLessonComplete = (lessonId) => {
    if (!completedLessons[lessonId]) {
      setCompletedLessons(prev => ({ ...prev, [lessonId]: true }));
      return true;
    }
    return false;
  };

  // Passer à la leçon suivante
  const goToNextLesson = () => {
    if (!currentLesson) return;
    
    // Marquer la leçon actuelle comme terminée
    markLessonComplete(currentLesson.id);
    
    // Passer à la leçon suivante si disponible
    if (currentLessonIndex < totalLessons - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  // Retour à la leçon précédente
  const goToPrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  // Terminer le cours
  const finishCourse = () => {
    if (!currentLesson) return;
    markLessonComplete(currentLesson.id);
    setShowCertificateScreen(true);
  };

  // Aller à une leçon spécifique
  const goToLesson = (index) => {
    if (isLessonUnlocked(index)) {
      setCurrentLessonIndex(index);
    }
  };

  // Écran de certificat
  if (showCertificateScreen) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)', borderRadius: '32px', padding: '50px', maxWidth: '500px', width: '100%', textAlign: 'center', border: '1px solid rgba(16,185,129,0.3)' }}>
          <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Trophy size={48} color="white" />
          </div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '10px' }}>Félicitations !</h1>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Vous avez terminé avec succès</p>
          <p style={{ color: '#60a5fa', fontSize: '20px', fontWeight: 'bold', marginBottom: '30px' }}>{course?.title}</p>
          <button onClick={() => navigate(`/certificate/${courseId}`)} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '40px', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Award size={20} /> Voir mon certificat
          </button>
          <br />
          <Link to="/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>← Retour au tableau de bord</Link>
        </div>
      </div>
    );
  }

  if (loading || !currentLesson) {
    return <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>Chargement...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(59,130,246,0.2)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '8px', cursor: 'pointer' }}>
            {sidebarOpen ? <X size={18} color="#60a5fa" /> : <Menu size={18} color="#60a5fa" />}
          </button>
          <div>
            <Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}><ArrowLeft size={12} /> Dashboard</Link>
            <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginTop: '2px' }}>{course?.title}</h2>
          </div>
        </div>
        
        {/* Progression corrigée */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Progression</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#60a5fa' }}>{progress}%</div>
          </div>
          <div style={{ width: '200px' }}>
            <div style={{ height: '6px', background: 'rgba(30,41,59,0.8)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', borderRadius: '10px', transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '5px', textAlign: 'center' }}>
              {completedCount}/{totalLessons} leçons
            </div>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* Sidebar */}
        <div style={{ width: sidebarOpen ? '340px' : '0', transition: 'width 0.3s ease', overflow: 'hidden', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)', borderRight: '1px solid rgba(59,130,246,0.15)', height: 'calc(100vh - 70px)', overflowY: 'auto' }}>
          {sidebarOpen && (
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <BookOpen size={18} color="#60a5fa" />
                <h3 style={{ color: 'white', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Programme</h3>
              </div>
              
              {modules.map(module => (
                <div key={module.id} style={{ marginBottom: '24px' }}>
                  <div style={{ color: '#60a5fa', fontSize: '12px', fontWeight: '600', marginBottom: '12px', paddingLeft: '8px', borderLeft: '2px solid #3b82f6' }}>
                    {module.title}
                  </div>
                  {module.lessons && module.lessons.map((lesson, idx) => {
                    const globalIndex = allLessons.findIndex(l => l.id === lesson.id);
                    const unlocked = isLessonUnlocked(globalIndex);
                    const completed = completedLessons[lesson.id] === true;
                    const isActive = currentLesson?.id === lesson.id;
                    
                    return (
                      <div key={lesson.id} onClick={() => goToLesson(globalIndex)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', marginBottom: '4px', borderRadius: '10px', background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent', cursor: unlocked ? 'pointer' : 'default', opacity: unlocked ? 1 : 0.5 }}>
                        {completed ? <CheckCircle size={14} color="#10b981" /> : !unlocked ? <Lock size={12} color="#64748b" /> : <Circle size={12} color="#64748b" strokeWidth={2} />}
                        <span style={{ color: isActive ? '#60a5fa' : completed ? '#10b981' : '#cbd5e1', fontSize: '13px', flex: 1 }}>{lesson.title}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contenu */}
        <div style={{ flex: 1, padding: '40px 60px', overflowY: 'auto', height: 'calc(100vh - 70px)', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ background: 'rgba(59,130,246,0.15)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', color: '#60a5fa', display: 'inline-block' }}>
              {currentLesson.moduleTitle}
            </span>
          </div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>{currentLesson.title}</h1>
          <div style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '15px', background: 'rgba(15, 23, 42, 0.5)', padding: '32px', borderRadius: '20px', marginBottom: '32px', border: '1px solid rgba(59,130,246,0.1)' }} dangerouslySetInnerHTML={{ __html: currentLesson.content || 'Contenu à venir...' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <button onClick={goToPrevLesson} disabled={currentLessonIndex === 0} style={{ padding: '10px 20px', background: currentLessonIndex === 0 ? 'rgba(30,41,59,0.5)' : 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '40px', color: currentLessonIndex === 0 ? '#64748b' : 'white', cursor: currentLessonIndex === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '500' }}>
              <ChevronLeft size={16} /> Leçon précédente
            </button>
            
            {!isLastLesson && (
              <button onClick={goToNextLesson} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', borderRadius: '40px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' }}>
                Leçon suivante <ChevronRight size={16} />
              </button>
            )}

            {isLastLesson && (
              <button onClick={finishCourse} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '40px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' }}>
                <Trophy size={16} /> Terminer le cours
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Learning;
