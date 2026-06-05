import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, HelpCircle, Award, AlertCircle, Clock } from 'lucide-react';
import api from '../services/api';
import { useNotifications } from '../context/NotificationContext';

function ModuleQuiz() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const searchParams = new URLSearchParams(window.location.search);
  const courseId = searchParams.get('courseId');
  const moduleIndex = searchParams.get('moduleIndex');
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [moduleTitle, setModuleTitle] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Timer de 15 minutes par défaut
  const TOTAL_TIME = 15 * 60; // 15 minutes en secondes

  useEffect(() => {
    loadQuizQuestions();
  }, [moduleId]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !submitted) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !submitted) {
      handleAutoSubmit();
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, submitted]);

  const loadQuizQuestions = async () => {
    try {
      // Récupère le module pour avoir son titre
      const modulesRes = await api.getCourse(courseId);
      const module = modulesRes.data.modules?.find(m => m.id == moduleId);
      setModuleTitle(module?.title || `Module ${parseInt(moduleIndex) + 1}`);
      
      // Récupère les questions du module depuis ton API
      // const response = await api.getModuleQuiz(moduleId);
      // setQuestions(response.data);
      
      // Pour l'instant, des questions factices (à remplacer par tes vraies données)
      const dummyQuestions = [
        { 
          id: 1, 
          question: "What is the main purpose of React?", 
          options: ["To create backend servers", "To build user interfaces", "To manage databases", "To style web pages"], 
          correct: 1,
          explanation: "React is a JavaScript library for building user interfaces."
        },
        { 
          id: 2, 
          question: "What is JSX?", 
          options: ["JavaScript XML - syntax extension for React", "Java XML - for Android", "JSON extension", "None of the above"], 
          correct: 0,
          explanation: "JSX stands for JavaScript XML and it's a syntax extension for React."
        },
        { 
          id: 3, 
          question: "Which hook is used for side effects in React?", 
          options: ["useState", "useEffect", "useContext", "useReducer"], 
          correct: 1,
          explanation: "useEffect is used for handling side effects like data fetching."
        },
        { 
          id: 4, 
          question: "What does SPA stand for?", 
          options: ["Single Page Application", "Simple Page Application", "Secure Page Access", "Static Page Architecture"], 
          correct: 0,
          explanation: "SPA stands for Single Page Application."
        },
        { 
          id: 5, 
          question: "Which company created React?", 
          options: ["Google", "Microsoft", "Facebook", "Twitter"], 
          correct: 2,
          explanation: "React was created by Facebook (now Meta)."
        },
      ];
      setQuestions(dummyQuestions);
      setTimeLeft(TOTAL_TIME);
      setQuizStarted(true);
      setLoading(false);
    } catch (err) {
      console.error('Error loading quiz:', err);
      setLoading(false);
    }
  };

  const handleAutoSubmit = () => {
    if (submitted) return;
    
    // Calculer le score avec les réponses données
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correctCount++;
    });
    const finalScore = correctCount;
    setScore(finalScore);
    setSubmitted(true);
    setShowResults(true);
    
    const passed = finalScore >= questions.length * 0.7;
    
    // Sauvegarder que le quiz du module est complété
    const user = JSON.parse(localStorage.getItem('user'));
    if (courseId && user?.id) {
      const quizKey = `completed_quizzes_${courseId}_${user.id}`;
      const saved = localStorage.getItem(quizKey);
      const completed = saved ? JSON.parse(saved) : {};
      completed[moduleId] = true;
      localStorage.setItem(quizKey, JSON.stringify(completed));
      
      // Dispatch un événement pour mettre à jour l'affichage
      window.dispatchEvent(new Event('quizCompleted'));
      
      if (passed) {
        addNotification({
          title: 'Module Quiz Passed!',
          message: `Great job! You passed the quiz for "${moduleTitle}". Ready for the next module?`,
          type: 'success',
          link: `/learning/${courseId}`
        });
      } else {
        addNotification({
          title: 'Quiz Not Passed',
          message: `You scored ${finalScore}/${questions.length} on "${moduleTitle}". Review the module and try again.`,
          type: 'warning',
          link: `/learning/${courseId}`
        });
      }
    }
  };

  const handleAnswer = (answerIndex) => {
    setAnswers({ ...answers, [currentQuestion]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Vérifier si toutes les questions ont été répondues
    if (Object.keys(answers).length !== questions.length) {
      alert(`Please answer all questions before submitting. You have answered ${Object.keys(answers).length} out of ${questions.length}.`);
      return;
    }
    
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correctCount++;
    });
    setScore(correctCount);
    setSubmitted(true);
    setShowResults(true);
    
    // Sauvegarder que le quiz du module est complété
    const user = JSON.parse(localStorage.getItem('user'));
    if (courseId && user?.id) {
      const quizKey = `completed_quizzes_${courseId}_${user.id}`;
      const saved = localStorage.getItem(quizKey);
      const completed = saved ? JSON.parse(saved) : {};
      completed[moduleId] = true;
      localStorage.setItem(quizKey, JSON.stringify(completed));
      
      // Dispatch un événement pour mettre à jour l'affichage
      window.dispatchEvent(new Event('quizCompleted'));
      
      const passed = correctCount >= questions.length * 0.7;
      
      if (passed) {
        addNotification({
          title: 'Module Quiz Passed!',
          message: `Great job! You passed the quiz for "${moduleTitle}". Ready for the next module?`,
          type: 'success',
          link: `/learning/${courseId}`
        });
      } else {
        addNotification({
          title: 'Quiz Not Passed',
          message: `You scored ${correctCount}/${questions.length} on "${moduleTitle}". Review the module and try again.`,
          type: 'warning',
          link: `/learning/${courseId}`
        });
      }
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setSubmitted(false);
    setShowResults(false);
    setScore(0);
    setTimeLeft(TOTAL_TIME);
    setQuizStarted(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft < 60) return '#ef4444';
    if (timeLeft < 300) return '#f59e0b';
    return '#10b981';
  };

  const pageStyle = {
    minHeight: '100vh',
    paddingTop: '80px',
    background: '#0a0a0f',
    fontFamily: "'Inter', sans-serif",
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  };

  const cardStyle = {
    background: 'rgba(20, 30, 55, 0.5)',
    backdropFilter: 'blur(12px)',
    borderRadius: '1.5rem',
    padding: '2rem',
    border: '1px solid rgba(59,130,246,0.15)',
  };

  const titleStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #ffffff, #60a5fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem',
  };

  const timerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '2rem',
    marginBottom: '1rem',
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={cardStyle}>
            <p style={{ color: '#cbd5e1' }}>Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={cardStyle}>
            <AlertCircle size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
            <h2 style={titleStyle}>No Quiz Available</h2>
            <p style={{ color: '#cbd5e1', marginTop: '1rem' }}>This module doesn't have a quiz yet.</p>
            <button
              onClick={() => navigate(`/learning/${courseId}`)}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                border: 'none',
                borderRadius: '0.75rem',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const passed = score >= questions.length * 0.7;
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={cardStyle}>
            <div style={{ textAlign: 'center' }}>
              {passed ? (
                <Award size={64} color="#10b981" style={{ marginBottom: '1rem' }} />
              ) : (
                <HelpCircle size={64} color="#f59e0b" style={{ marginBottom: '1rem' }} />
              )}
              <h2 style={{ color: passed ? '#10b981' : '#f59e0b', textAlign: 'center', fontSize: '1.5rem' }}>
                {passed ? 'Congratulations!' : 'Keep Learning!'}
              </h2>
              <p style={{ textAlign: 'center', fontSize: '2.5rem', color: '#60a5fa', margin: '1rem 0' }}>
                {score} / {questions.length}
              </p>
              <p style={{ textAlign: 'center', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                Your score: {percentage}%
              </p>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#1e293b',
                borderRadius: '4px',
                overflow: 'hidden',
                margin: '1rem 0',
              }}>
                <div style={{
                  width: `${percentage}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${passed ? '#10b981' : '#f59e0b'}, ${passed ? '#059669' : '#ea580c'})`,
                }} />
              </div>
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {passed 
                  ? 'You passed the module quiz! You can now continue to the next module.' 
                  : `You need ${Math.ceil(questions.length * 0.7)} correct answers to pass (70%). You got ${score}. Review the module and try again.`}
              </p>
              
              {/* Show detailed results */}
              <details style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <summary style={{ color: '#60a5fa', cursor: 'pointer', marginBottom: '0.5rem' }}>View Detailed Results</summary>
                {questions.map((q, idx) => {
                  const isCorrect = answers[idx] === q.correct;
                  return (
                    <div key={idx} style={{
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                      background: isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      borderRadius: '0.5rem',
                      borderLeft: `3px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        {isCorrect ? <CheckCircle size={14} color="#10b981" /> : <XCircle size={14} color="#ef4444" />}
                        <span style={{ fontWeight: '600', color: 'white', fontSize: '0.85rem' }}>{q.question}</span>
                      </div>
                      <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: '1.5rem' }}>
                        Correct answer: {q.options[q.correct]}
                      </p>
                      <p style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '1.5rem', fontStyle: 'italic' }}>
                        {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </details>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                {!passed && (
                  <button
                    onClick={handleRetry}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                      border: 'none',
                      borderRadius: '0.75rem',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    Retry Quiz
                  </button>
                )}
                <button
                  onClick={() => navigate(`/learning/${courseId}`)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Back to Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={cardStyle}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={() => navigate(`/learning/${courseId}`)}
              style={{
                background: 'none',
                border: 'none',
                color: '#60a5fa',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <ArrowLeft size={16} /> Back to Course
            </button>
            <div style={timerStyle}>
              <Clock size={16} color={getTimeColor()} />
              <span style={{ color: getTimeColor(), fontWeight: '600' }}>{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          {/* Module title */}
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Module Quiz</span>
            <h2 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>{moduleTitle}</h2>
          </div>
          
          {/* Progress bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Question Progress</span>
              <span style={{ fontSize: '0.7rem', color: '#60a5fa' }}>{currentQuestion + 1}/{questions.length}</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }} />
            </div>
          </div>
          
          {/* Question */}
          <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>
            {currentQ.question}
          </h3>
          
          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = answers[currentQuestion] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    background: isSelected ? 'rgba(59,130,246,0.2)' : 'rgba(30,41,59,0.5)',
                    border: `1px solid ${isSelected ? 'rgba(59,130,246,0.5)' : 'rgba(59,130,246,0.15)'}`,
                    borderRadius: '0.75rem',
                    color: isSelected ? 'white' : '#cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(59,130,246,0.1)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(30,41,59,0.5)';
                    }
                  }}
                >
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isSelected ? '#3b82f6' : '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                </button>
              );
            })}
          </div>
          
          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              style={{
                padding: '0.6rem 1.2rem',
                background: 'rgba(59,130,246,0.2)',
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white',
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                opacity: currentQuestion === 0 ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              Previous
            </button>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {answeredCount}/{questions.length} answered
              </span>
            </div>
            
            {currentQuestion + 1 === questions.length ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
                style={{
                  padding: '0.6rem 1.5rem',
                  background: Object.keys(answers).length === questions.length 
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                    : 'rgba(34,197,94,0.3)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white',
                  cursor: Object.keys(answers).length === questions.length ? 'pointer' : 'not-allowed',
                  opacity: Object.keys(answers).length === questions.length ? 1 : 0.5,
                  fontWeight: '600',
                }}
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={answers[currentQuestion] === undefined}
                style={{
                  padding: '0.6rem 1.2rem',
                  background: answers[currentQuestion] !== undefined 
                    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                    : 'rgba(59,130,246,0.3)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white',
                  cursor: answers[currentQuestion] !== undefined ? 'pointer' : 'not-allowed',
                  opacity: answers[currentQuestion] !== undefined ? 1 : 0.5,
                  transition: 'all 0.2s',
                }}
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModuleQuiz;