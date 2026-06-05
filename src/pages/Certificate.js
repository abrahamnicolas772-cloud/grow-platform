import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Award, Download, Printer, Home, Calendar, User, BookOpen, CheckCircle } from 'lucide-react';
import api from '../services/api';

function Certificate() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [certificateNumber, setCertificateNumber] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    loadCourse();
    generateCertificateData();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const response = await api.getCourse(courseId);
      setCourse(response.data);
    } catch (err) {
      console.error('Error loading course', err);
    } finally {
      setLoading(false);
    }
  };

  const generateCertificateData = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setCertificateNumber(`GROW-${year}-${courseId}-${random}`);
    
    setCompletionDate(date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const pageStyle = {
    minHeight: '100vh',
    padding: '2rem',
    background: '#0a0a0f',
    fontFamily: "'Inter', 'Georgia', serif",
  };

  const containerStyle = {
    maxWidth: '1000px',
    margin: '0 auto',
  };

  const certificateStyle = {
    background: 'white',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    position: 'relative',
  };

  const certificateBorderStyle = {
    border: '20px solid #0a2540',
    borderRadius: '0.5rem',
    background: 'white',
  };

  const certificateInnerStyle = {
    padding: '3rem',
    textAlign: 'center',
    position: 'relative',
  };

  // Logo GROW avec l'image du header
  const logoContainerStyle = {
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
  };

  const logoImageStyle = {
    height: '60px',
    width: 'auto',
  };

  const logoTextContainerStyle = {
    textAlign: 'left',
  };

  const logoTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#0a2540',
    letterSpacing: '1px',
  };

  const logoSloganStyle = {
    fontSize: '0.65rem',
    color: '#64748b',
    letterSpacing: '2px',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '300',
    letterSpacing: '4px',
    color: '#64748b',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
  };

  const mainTitleStyle = {
    fontSize: '3rem',
    fontWeight: '800',
    color: '#0a2540',
    marginBottom: '2rem',
    fontFamily: "'Georgia', serif",
  };

  const awardTextStyle = {
    fontSize: '1.2rem',
    color: '#475569',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  };

  const nameStyle = {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#0a2540',
    margin: '1.5rem 0',
    fontFamily: "'Georgia', serif",
    borderBottom: '2px solid #e2e8f0',
    display: 'inline-block',
    paddingBottom: '0.5rem',
  };

  const courseNameStyle = {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#1e3a5f',
    margin: '1rem 0',
  };

  const descriptionStyle = {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.6',
    maxWidth: '500px',
    margin: '1rem auto',
  };

  const signatureSectionStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: '3rem',
    paddingTop: '2rem',
    borderTop: '1px solid #e2e8f0',
  };

  const signatureBoxStyle = {
    textAlign: 'center',
  };

  const signatureLineStyle = {
    width: '200px',
    borderTop: '1px solid #0a2540',
    marginBottom: '0.5rem',
  };

  const signatureImageStyle = {
    fontFamily: "'Brush Script MT', 'cursive'",
    fontSize: '1.5rem',
    color: '#0a2540',
    marginBottom: '0.25rem',
  };

  const footerStyle = {
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e2e8f0',
    fontSize: '0.8rem',
    color: '#94a3b8',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  };

  const actionsStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem',
    flexWrap: 'wrap',
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.75rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    border: 'none',
  };

  const printButtonStyle = {
    ...buttonStyle,
    background: '#0a2540',
    color: 'white',
  };

  const backButtonStyle = {
    ...buttonStyle,
    background: '#64748b',
    color: 'white',
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: '3rem', color: 'white' }}>Loading certificate...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #certificate-content, #certificate-content * {
              visibility: visible;
            }
            #certificate-content {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              margin: 0;
              padding: 0;
            }
            .no-print {
              display: none !important;
            }
            button {
              display: none !important;
            }
          }
        `}
      </style>

      <div style={containerStyle}>
        {/* Certificate Content */}
        <div id="certificate-content">
          <div style={certificateStyle}>
            <div style={certificateBorderStyle}>
              <div style={certificateInnerStyle}>
                {/* Watermark Logo GROW */}
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)', 
                  opacity: 0.03, 
                  fontSize: '6rem', 
                  fontWeight: 'bold', 
                  color: '#0a2540', 
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}>
                  GROW
                </div>

                {/* Logo GROW (même image que le header) */}
                <div style={logoContainerStyle}>
                  <img 
                    src="/logo.png" 
                    alt="GROW Logo" 
                    style={logoImageStyle}
                  />
                  <div style={logoTextContainerStyle}>
                    <div style={logoTitleStyle}>GROW</div>
                    <div style={logoSloganStyle}>GROW REGULARLY, OVER WELLNESS</div>
                  </div>
                </div>

                {/* Title */}
                <div style={titleStyle}>Certificate of Completion</div>
                <div style={mainTitleStyle}>🎓</div>

                {/* Award text */}
                <div style={awardTextStyle}>This certificate is proudly presented to</div>

                {/* User Name */}
                <div style={nameStyle}>{user?.name || 'Student Name'}</div>

                {/* For completing */}
                <div style={{ color: '#475569', marginBottom: '0.5rem' }}>for successfully completing the course</div>

                {/* Course Name */}
                <div style={courseNameStyle}>"{course?.title || 'Course Title'}"</div>

                {/* Description */}
                <div style={descriptionStyle}>
                  With dedication and excellence, demonstrating mastery of the subject matter
                  and practical application of the skills learned throughout the program.
                </div>

                {/* Signature Section */}
                <div style={signatureSectionStyle}>
                  <div style={signatureBoxStyle}>
                    <div style={signatureImageStyle}>John Anderson</div>
                    <div style={signatureLineStyle} />
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Director of Education</div>
                  </div>
                  <div style={signatureBoxStyle}>
                    <img 
                      src="/logo.png" 
                      alt="GROW Seal" 
                      style={{ height: '50px', width: 'auto', opacity: 0.8 }}
                    />
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>GROW Official Seal</div>
                  </div>
                </div>

                {/* Footer with date and certificate number */}
                <div style={footerStyle}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} />
                      <span>Date: {completionDate}</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={14} />
                      <span>Certificate ID: {certificateNumber}</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={14} />
                      <span>Student ID: {user?.id || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Verification text */}
                <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#cbd5e1' }}>
                  Verify this certificate at: https://grow-platform.com/verify/{certificateNumber}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Hidden when printing */}
        <div style={actionsStyle} className="no-print">
          <button onClick={handlePrint} style={printButtonStyle}>
            <Printer size={18} /> Print Certificate
          </button>
          <button onClick={() => navigate('/dashboard')} style={backButtonStyle}>
            <Home size={18} /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Certificate;