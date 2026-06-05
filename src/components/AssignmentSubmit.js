import { useState } from 'react';
import { Upload, FileCode, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

const AssignmentSubmit = ({ moduleId, courseId, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [codeText, setCodeText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && (selected.name.endsWith('.js') || selected.name.endsWith('.py') || selected.name.endsWith('.html'))) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setCodeText(reader.result);
      reader.readAsText(selected);
    } else {
      alert('Please upload a .js, .py, or .html file');
      setFile(null);
      setCodeText('');
    }
  };

  const handleSubmit = async () => {
    if (!file && !codeText.trim()) {
      alert('Please provide code either by uploading a file or typing in the editor.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('module_id', moduleId);
      formData.append('course_id', courseId);
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('code', codeText);
      }
      const response = await api.submitAssignment(formData);
      setSubmitted(true);
      setFeedback(response.data.message || '✅ Assignment submitted successfully!');
      if (onSuccess) onSuccess(moduleId);
    } catch (err) {
      setFeedback('❌ Error submitting assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(20,30,55,0.6)',
      backdropFilter: 'blur(12px)',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginTop: '1.5rem',
      border: '1px solid rgba(59,130,246,0.3)',
    }}>
      <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <FileCode size={20} color="#60a5fa" /> Assignment Submission
      </h3>
      <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Upload your code file (JavaScript, Python, or HTML) or paste your code below.
      </p>

      {!submitted ? (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Upload file (.js, .py, .html)</label>
            <input type="file" accept=".js,.py,.html" onChange={handleFileChange} style={{ color: 'white' }} />
            {file && <div style={{ color: '#22c55e', fontSize: '0.75rem', marginTop: '0.3rem' }}>Selected: {file.name}</div>}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Or paste your code</label>
            <textarea
              value={codeText}
              onChange={e => setCodeText(e.target.value)}
              rows="6"
              placeholder="// Write your code here..."
              style={{
                width: '100%',
                background: '#0a0c10',
                border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: '0.5rem',
                color: '#e2e8f0',
                fontFamily: 'monospace',
                padding: '0.5rem',
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              border: 'none',
              color: 'white',
              padding: '0.6rem 1.2rem',
              borderRadius: '2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Upload size={16} /> {submitting ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </>
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', marginBottom: '0.5rem' }}>
            <CheckCircle size={20} /> Submitted successfully!
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmit;