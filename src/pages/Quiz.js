import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Award, ArrowRight, Brain, Target } from 'lucide-react';
import api from '../services/api';

function Quiz() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadQuiz();
  }, [lessonId]);

  const loadQuiz = async () => {
    try {
      const response = await api.getQuiz(lessonId);
      setQuiz(response.data);
    } catch (err) {
      setError('Error loading quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) { alert('Select an answer'); return; }
    try {
      const response = await api.submitQuiz(user.id, lessonId, selectedAnswer);
      setResult(response.data);
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Error submitting');
    }
  };

  const handleNext = () => {
    if (quiz) navigate(`/courses/${quiz.course_id}`);
  };

  const pageStyle = {
    position: 'relative', minHeight: '100vh', paddingTop: '70px',
    fontFamily: "'Inter', 'Montserrat', sans-serif",
    backgroundImage: 'url("https://i.postimg.cc/3wxVp0ny/photo-2026-05-26-11-00-53.jpg")',
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
  };
  const darkOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)', zIndex: 0, pointerEvents: 'none' };
  const containerStyle = { maxWidth: '700px', margin: '0 auto', padding: '1rem 1.5rem', position: 'relative', zIndex: 1 };
  const cardStyle = { background: 'rgba(20,30,55,0.6)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1.2rem', border: '1px solid rgba(59,130,246,0.2)', marginBottom: '1rem' };
  const questionStyle = { fontSize: '1.1rem', marginBottom: '1rem', color: 'white', lineHeight: '1.5', fontWeight: '500' };
  const optionsStyle = { display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' };
  const optionStyle = (isSelected, isCorrect, isWrong) => ({
    padding: '0.7rem 1rem', borderRadius: '0.8rem', cursor: submitted ? 'default' : 'pointer',
    border: `2px solid ${isCorrect ? '#22c55e' : isWrong ? '#ef4444' : isSelected ? '#3b82f6' : 'rgba(59,130,246,0.2)'}`,
    background: isCorrect ? 'rgba(34,197,94,0.15)' : isWrong ? 'rgba(239,68,68,0.15)' : isSelected ? 'rgba(59,130,246,0.15)' : 'rgba(20,30,55,0.4)',
    color: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : isSelected ? '#60a5fa' : '#cbd5e1',
    transition: 'all 0.2s', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
  });
  const buttonStyle = { padding: '0.6rem 1.5rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', borderRadius: '0.8rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.3s' };
  const resultStyle = (correct) => ({ padding: '1rem', borderRadius: '0.8rem', marginBottom: '1rem', background: correct ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${correct ? '#22c55e' : '#ef4444'}`, textAlign: 'center' });
  const progressStyle = { padding: '0.8rem', background: 'rgba(59,130,246,0.1)', borderRadius: '0.8rem', textAlign: 'center', marginBottom: '1rem' };

  if (loading) {
    return <div style={pageStyle}><div style={darkOverlay} /><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative', zIndex: 1, color: 'white' }}>Loading quiz...</div></div>;
  }

  if (error) {
    return <div style={pageStyle}><div style={darkOverlay} /><div style={{ ...containerStyle, textAlign: 'center', color: '#ef4444' }}>{error}</div></div>;
  }

  if (!quiz) {
    return <div style={pageStyle}><div style={darkOverlay} /><div style={{ ...containerStyle, textAlign: 'center', color: '#94a3b8' }}>No quiz available for this lesson</div></div>;
  }

  const getOptionStyle = (option) => {
    if (!submitted) return optionStyle(selectedAnswer === option, false, false);
    const isCorrectOption = option === quiz.correct_answer;
    const isSelectedWrong = selectedAnswer === option && !result?.correct;
    return optionStyle(false, isCorrectOption, isSelectedWrong);
  };

  return (
    <div style={pageStyle}>
      <div style={darkOverlay} />
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Brain size={22} color="#60a5fa" />
            <h1 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'white' }}>Quiz</h1>
          </div>

          {!submitted ? (
            <>
              <div style={questionStyle}>{quiz.question}</div>
              <div style={optionsStyle}>
                {['A', 'B', 'C'].map(opt => (
                  <div key={opt} style={getOptionStyle(opt)} onClick={() => !submitted && setSelectedAnswer(opt)}>
                    <span style={{ fontWeight: '700', color: '#60a5fa', minWidth: '24px' }}>{opt}.</span>
                    {quiz[`option_${opt.toLowerCase()}`]}
                  </div>
                ))}
              </div>
              <button style={{ ...buttonStyle, opacity: !selectedAnswer ? 0.5 : 1 }} onClick={handleSubmit} disabled={!selectedAnswer}>
                <Target size={16} /> Validate
              </button>
            </>
          ) : (
            <>
              <div style={resultStyle(result?.correct)}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>
                  {result?.correct ? <CheckCircle size={40} color="#22c55e" style={{ display: 'inline' }} /> : <XCircle size={40} color="#ef4444" style={{ display: 'inline' }} />}
                </div>
                <h2 style={{ color: result?.correct ? '#22c55e' : '#ef4444', marginBottom: '0.3rem', fontSize: '1.1rem' }}>
                  {result?.correct ? 'Correct!' : 'Incorrect'}
                </h2>
                <p style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Score: {result?.score || 0} / 1</p>
              </div>

              <div style={progressStyle}>
                <h3 style={{ color: 'white', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Course Progress</h3>
                <p style={{ fontSize: '1.8rem', margin: '0.3rem 0', fontWeight: '700', color: '#60a5fa' }}>
                  {result?.course_progress || 0}%
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  Lessons completed: {result?.completed_lessons || 0} / {result?.total_lessons || 0}
                </p>
              </div>

              <button style={buttonStyle} onClick={handleNext}>
                <ArrowRight size={16} /> Back to course
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;