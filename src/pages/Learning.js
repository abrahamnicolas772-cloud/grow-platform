import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ChevronDown, ChevronUp, CheckCircle, BookOpen,
  Lock, Menu, X, ArrowRight, ArrowLeftCircle, Award, Sparkles,
  Brain, Target, XCircle
} from 'lucide-react';

const API_BASE = 'https://grow-platform.onrender.com/api';

function Learning() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [completedLessons, setCompletedLessons] = useState({});
  const [completedQuizzes, setCompletedQuizzes] = useState({}); // moduleId -> bool
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // États pour le modal de quiz
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [currentModuleQuiz, setCurrentModuleQuiz] = useState(null);
  const [quizState, setQuizState] = useState({
    question: '', options: { A: '', B: '', C: '' }, correctAnswer: '',
    selected: '', submitted: false, result: null
  });

  // Persistance
  useEffect(() => {
    const savedCompleted = localStorage.getItem(`completed_lessons_${courseId}`);
    if (savedCompleted) setCompletedLessons(JSON.parse(savedCompleted));
    const savedQuizzes = localStorage.getItem(`completed_quizzes_${courseId}`);
    if (savedQuizzes) setCompletedQuizzes(JSON.parse(savedQuizzes));
  }, [courseId]);

  useEffect(() => {
    localStorage.setItem(`completed_lessons_${courseId}`, JSON.stringify(completedLessons));
    localStorage.setItem(`completed_quizzes_${courseId}`, JSON.stringify(completedQuizzes));
  }, [completedLessons, completedQuizzes, courseId]);

  // Chargement des données
  useEffect(() => {
    setLoading(true);
    const fetchModules = async () => {
      const res = await fetch(`${API_BASE}/courses/${courseId}/modules`);
      if (!res.ok) throw new Error('Erreur réseau');
      return res.json();
    };

    Promise.all([
      fetch(`${API_BASE}/courses/${courseId}`).then(r => r.json()),
      fetchModules()
    ])
    .then(([courseData, modulesData]) => {
      setCourse(courseData);
      const mods = Array.isArray(modulesData) ? modulesData : [];
      setModules(mods);
      if (mods.length > 0) {
        setExpandedModules({ [mods[0].id]: true });
        const allLessons = getAllLessons(mods);
        const firstIncomplete = allLessons.find(l => !completedLessons[l.id]);
        setSelectedLesson(firstIncomplete || allLessons[0]);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError('Impossible de charger le cours.');
      setLoading(false);
    });
  }, [courseId]);

  const getAllLessons = (mods) => {
    return mods.flatMap(m => (m.lessons || []).map(l => ({ ...l, moduleId: m.id, moduleTitle: m.title })));
  };

  const allLessons = useMemo(() => getAllLessons(modules), [modules]);

  const isUnlocked = (lessonId) => {
    const idx = allLessons.findIndex(l => l.id === lessonId);
    if (idx === -1) return false;
    if (idx === 0) return true;
    for (let i = 0; i < idx; i++) {
      if (!completedLessons[allLessons[i].id]) return false;
    }
    return true;
  };

  const toggleModule = (id) => setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));

  const markComplete = (lessonId) => {
    if (!completedLessons[lessonId]) {
      setCompletedLessons(prev => ({ ...prev, [lessonId]: true }));
    }
  };

  const nextLesson = () => {
    if (!selectedLesson) return;
    markComplete(selectedLesson.id);
    const idx = allLessons.findIndex(l => l.id === selectedLesson.id);
    if (idx < allLessons.length - 1) {
      const next = allLessons[idx + 1];
      setExpandedModules(prev => ({ ...prev, [next.moduleId]: true }));
      setSelectedLesson(next);
    }
  };

  const prevLesson = () => {
    if (!selectedLesson) return;
    const idx = allLessons.findIndex(l => l.id === selectedLesson.id);
    if (idx > 0) {
      const prev = allLessons[idx - 1];
      setExpandedModules(prev => ({ ...prev, [prev.moduleId]: true }));
      setSelectedLesson(prev);
    }
  };

  // Progression du module (leçons seulement)
  const moduleProgress = (module) => {
    const lessons = module.lessons || [];
    const done = lessons.filter(l => completedLessons[l.id]).length;
    return lessons.length ? (done / lessons.length) * 100 : 0;
  };

  const areAllLessonsDone = (module) => {
    const lessons = module.lessons || [];
    return lessons.length > 0 && lessons.every(l => completedLessons[l.id]);
  };

  const isModuleCompleted = (module) => {
    return areAllLessonsDone(module) && completedQuizzes[module.id] === true;
  };

  // ---------- Gestion du quiz ----------
  const openModuleQuiz = async (module) => {
    // 🔁 ICI : remplacer par un vrai appel API
    // Exemple : const res = await fetch(`${API_BASE}/modules/${module.id}/quiz`);
    // const data = await res.json();
    // Puis setQuizState avec data.question, data.option_a, etc.
    const mockQuiz = {
      question: `Question pour le module : ${module.title}`,
      option_a: "Bonne réponse",
      option_b: "Mauvaise réponse",
      option_c: "Mauvaise réponse",
      correct_answer: "A"
    };
    setCurrentModuleQuiz(module);
    setQuizState({
      question: mockQuiz.question,
      options: { A: mockQuiz.option_a, B: mockQuiz.option_b, C: mockQuiz.option_c },
      correctAnswer: mockQuiz.correct_answer,
      selected: '',
      submitted: false,
      result: null
    });
    setQuizModalOpen(true);
  };

  const handleQuizSelect = (opt) => {
    if (!quizState.submitted) setQuizState(prev => ({ ...prev, selected: opt }));
  };

  const handleQuizSubmit = async () => {
    if (!quizState.selected) return;
    const isCorrect = (quizState.selected === quizState.correctAnswer);
    setQuizState(prev => ({
      ...prev,
      submitted: true,
      result: { correct: isCorrect, score: isCorrect ? 1 : 0 }
    }));
    if (isCorrect) {
      setCompletedQuizzes(prev => ({ ...prev, [currentModuleQuiz.id]: true }));
      // 🔁 ICI : envoyer la réussite au backend si besoin
      // await fetch(`${API_BASE}/modules/${currentModuleQuiz.id}/complete`, { method: 'POST', ... });
    }
  };

  const closeQuizModal = () => {
    setQuizModalOpen(false);
    setCurrentModuleQuiz(null);
  };

  // Global
  const totalLessons = allLessons.length;
  const completedCount = Object.keys(completedLessons).length;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Styles
  const pageStyle = {
    position: 'relative', minHeight: '100vh', paddingTop: '60px',
    fontFamily: 'Inter, sans-serif',
    backgroundImage: 'url("https://i.postimg.cc/3wxVp0ny/photo-2026-05-26-11-00-53.jpg")',
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
  };
  const overlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)', zIndex: 0, pointerEvents: 'none' };
  const container = { maxWidth: '1400px', margin: '0 auto', padding: '1rem', position: 'relative', zIndex: 1 };
  const topBar = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' };
  const titleStyle = { fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
  const progressContainer = { flex: '1 1 200px', minWidth: '200px' };
  const progressBarOuter = { width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' };
  const progressFill = { width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', transition: 'width 0.5s' };
  const layout = { display: 'flex', gap: '1rem', minHeight: 'calc(100vh - 200px)' };
  const sidebarStyle = {
    width: sidebarOpen ? '300px' : '0', transition: 'width 0.3s', overflow: 'hidden',
    background: 'rgba(20,30,55,0.6)', backdropFilter: 'blur(12px)', borderRadius: '0.8rem',
    border: '1px solid rgba(59,130,246,0.2)', flexShrink: 0
  };
  const mainContent = {
    flex: 1, background: 'rgba(20,30,55,0.4)', backdropFilter: 'blur(12px)',
    borderRadius: '0.8rem', border: '1px solid rgba(59,130,246,0.2)',
    overflow: 'hidden', display: 'flex', flexDirection: 'column'
  };
  const moduleHeaderStyle = { padding: '0.6rem 0.8rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30,41,59,0.5)', borderRadius: '0.4rem', marginBottom: '0.3rem' };
  const lessonItem = (isActive, isCompleted, isLocked) => ({
    padding: '0.4rem 0.8rem', cursor: isLocked ? 'not-allowed' : 'pointer',
    color: isActive ? '#60a5fa' : isCompleted ? '#22c55e' : isLocked ? '#64748b' : '#cbd5e1',
    background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
    borderRadius: '0.3rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
    marginBottom: '2px', opacity: isLocked ? 0.6 : 1
  });
  const navButtons = { padding: '1rem', borderTop: '1px solid rgba(59,130,246,0.1)', display: 'flex', justifyContent: 'space-between' };
  const btnStyle = { padding: '0.5rem 1.2rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '500', fontSize: '0.85rem' };
  const certBanner = { background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' };
  const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const modalContent = { background: 'rgba(20,30,55,0.95)', backdropFilter: 'blur(16px)', borderRadius: '1.5rem', width: '90%', maxWidth: '600px', padding: '1.5rem', border: '1px solid rgba(59,130,246,0.3)', color: '#cbd5e1' };

  if (loading) return <div style={pageStyle}><div style={overlay} /><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative', zIndex: 1, color: 'white' }}>Chargement…</div></div>;
  if (error) return <div style={pageStyle}><div style={overlay} /><div style={{ ...container, textAlign: 'center', color: '#ef4444' }}>{error}<br /><Link to="/dashboard" style={{ color: '#60a5fa' }}>← Dashboard</Link></div></div>;

  return (
    <div style={pageStyle}>
      <style>{`
        .lesson-content img {
          max-width: 100%;
          border-radius: 12px;
          margin: 1rem 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .lesson-content p {
          margin-bottom: 1.2rem;
          text-align: justify;
          line-height: 1.7;
        }
        .lesson-content h1, .lesson-content h2, .lesson-content h3 {
          color: white;
          margin-top: 1.5rem;
        }
        .lesson-content ul, .lesson-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .lesson-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          font-style: italic;
          color: #94a3b8;
        }
      `}</style>
      <div style={overlay} />
      <div style={container}>
        {/* Top bar */}
        <div style={topBar}>
          <div>
            <h1 style={titleStyle}>{course?.title || 'Cours'}</h1>
            <Link to="/dashboard" style={{ color: '#60a5fa', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem' }}><ArrowLeft size={14} /> Dashboard</Link>
          </div>
          <div style={progressContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
              <span>{completedCount}/{totalLessons} leçons</span>
              <span style={{ color: '#60a5fa', fontWeight: '600' }}>{progress}%</span>
            </div>
            <div style={progressBarOuter}><div style={progressFill} /></div>
          </div>
        </div>

        {/* Certificat */}
        {progress === 100 && (
          <div style={certBanner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Award size={24} color="#10b981" />
              <div>
                <h3 style={{ color: 'white', margin: 0 }}>Félicitations !</h3>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>Vous avez terminé toutes les leçons</p>
              </div>
            </div>
            <button onClick={() => navigate(`/certificate/${courseId}`)} style={{ ...btnStyle, background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Sparkles size={16} /> Obtenir le certificat
            </button>
          </div>
        )}

        {/* Layout principal */}
        <div style={layout}>
          {/* Sidebar */}
          <div style={sidebarStyle}>
            {sidebarOpen && (
              <div style={{ padding: '0.8rem', width: '300px', maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                <h3 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.8rem' }}>📋 Programme</h3>
                {modules.map(m => {
                  const allLessonsDone = areAllLessonsDone(m);
                  const moduleDone = isModuleCompleted(m);
                  return (
                    <div key={m.id} style={{ marginBottom: '0.5rem' }}>
                      <div style={moduleHeaderStyle} onClick={() => toggleModule(m.id)}>
                        <span style={{ color: 'white', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {moduleDone ? <CheckCircle size={14} color="#22c55e" /> : <BookOpen size={14} />}
                          {m.title}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '50px', height: '4px', background: '#1e293b', borderRadius: '2px' }}>
                            <div style={{ width: `${moduleProgress(m)}%`, height: '100%', background: '#3b82f6', borderRadius: '2px' }} />
                          </div>
                          {expandedModules[m.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                      </div>
                      {expandedModules[m.id] && (m.lessons || []).map(l => {
                        const unlocked = isUnlocked(l.id);
                        return (
                          <div key={l.id}
                            style={lessonItem(selectedLesson?.id === l.id, completedLessons[l.id], !unlocked)}
                            onClick={() => unlocked && setSelectedLesson(l)}
                            title={!unlocked ? 'Leçon verrouillée – terminez les précédentes d\'abord' : ''}
                          >
                            {!unlocked ? <Lock size={12} /> : completedLessons[l.id] ? <CheckCircle size={12} color="#22c55e" /> : <BookOpen size={12} />}
                            <span style={{ flex: 1 }}>{l.title}</span>
                            <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{l.duration || 0} min</span>
                          </div>
                        );
                      })}
                      {/* Bouton Quiz */}
                      {allLessonsDone && !moduleDone && (
                        <button
                          onClick={() => openModuleQuiz(m)}
                          style={{
                            marginTop: '8px', marginBottom: '4px',
                            padding: '6px 12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            border: 'none', borderRadius: '20px', color: 'white', fontSize: '0.7rem',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                            width: '100%', justifyContent: 'center'
                          }}
                        >
                          <Brain size={12} /> Quiz du module
                        </button>
                      )}
                      {moduleDone && (
                        <div style={{ marginTop: '6px', marginBottom: '6px', fontSize: '0.7rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                          <CheckCircle size={12} /> Module validé
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Toggle sidebar */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ position: 'fixed', bottom: '1rem', left: '1rem', zIndex: 100, background: '#3b82f6', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: 'white', cursor: 'pointer' }}>
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          {/* Contenu de la leçon */}
          <div style={mainContent}>
            {selectedLesson ? (
              <>
                <div style={{ padding: '1rem 1.5rem', background: 'rgba(30,41,59,0.5)', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                  <h2 style={{ color: 'white', fontSize: '1.2rem', fontWeight: '600' }}>{selectedLesson.title}</h2>
                </div>
                <div className="lesson-content" style={{ padding: '1.5rem 2rem', flex: 1, overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: selectedLesson.content || 'Aucun contenu.' }} />
                <div style={navButtons}>
                  <button onClick={prevLesson} style={{ ...btnStyle, background: 'rgba(59,130,246,0.2)' }}><ArrowLeftCircle size={16} /> Précédent</button>
                  <button onClick={nextLesson} style={btnStyle}><ArrowRight size={16} /> Suivant</button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#94a3b8' }}>
                <p>Sélectionnez une leçon dans le programme</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Quiz */}
      {quizModalOpen && currentModuleQuiz && (
        <div style={modalOverlay} onClick={closeQuizModal}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Brain size={20} color="#f59e0b" /> Quiz : {currentModuleQuiz.title}
              </h3>
              <button onClick={closeQuizModal} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><XCircle size={20} /></button>
            </div>
            {!quizState.submitted ? (
              <>
                <div style={{ fontSize: '1rem', marginBottom: '1.5rem', fontWeight: '500', color: 'white' }}>{quizState.question}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {['A', 'B', 'C'].map(opt => (
                    <div key={opt}
                      onClick={() => handleQuizSelect(opt)}
                      style={{
                        padding: '0.6rem 1rem', borderRadius: '0.8rem', cursor: 'pointer',
                        border: `2px solid ${quizState.selected === opt ? '#3b82f6' : 'rgba(59,130,246,0.2)'}`,
                        background: quizState.selected === opt ? 'rgba(59,130,246,0.2)' : 'rgba(20,30,55,0.6)',
                        color: quizState.selected === opt ? '#60a5fa' : '#cbd5e1'
                      }}
                    >
                      <strong>{opt}.</strong> {quizState.options[opt]}
                    </div>
                  ))}
                </div>
                <button onClick={handleQuizSubmit} style={{ ...btnStyle, width: '100%', justifyContent: 'center' }} disabled={!quizState.selected}>
                  <Target size={16} /> Valider
                </button>
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  {quizState.result.correct ? (
                    <CheckCircle size={48} color="#22c55e" style={{ marginBottom: '0.5rem' }} />
                  ) : (
                    <XCircle size={48} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
                  )}
                  <h3 style={{ color: quizState.result.correct ? '#22c55e' : '#ef4444' }}>
                    {quizState.result.correct ? 'Correct !' : 'Mauvaise réponse'}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Score: {quizState.result.score} / 1</p>
                </div>
                <button onClick={closeQuizModal} style={{ ...btnStyle, width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <Award size={16} /> Continuer
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Learning;