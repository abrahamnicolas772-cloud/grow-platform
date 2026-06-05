import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function StudentAssignments() {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionData, setSubmissionData] = useState({ file_url: '', content: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAssignments();
    loadGrades();
  }, [courseId]);

  const loadAssignments = async () => {
    const res = await fetch(`http://localhost:5000/api/courses/${courseId}/modules`);
    const modules = await res.json();
    let allAssignments = [];
    for (const module of modules) {
      const assignRes = await fetch(`http://localhost:5000/api/admin/modules/${module.id}/assignments`);
      const assigns = await assignRes.json();
      allAssignments = [...allAssignments, ...assigns.map(a => ({ ...a, module_title: module.title }))];
    }
    setAssignments(allAssignments);
  };

  const loadGrades = async () => {
    const res = await fetch(`http://localhost:5000/api/courses/${courseId}/my-grades`, {
      credentials: 'include'
    });
    const data = await res.json();
    setGrades(data);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('http://localhost:5000/api/upload/assignment', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let fileUrl = submissionData.file_url;
    if (submissionData.file) {
      fileUrl = await uploadFile(submissionData.file);
    }
    await fetch(`http://localhost:5000/api/assignments/${selectedAssignment.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_url: fileUrl, content: submissionData.content }),
      credentials: 'include'
    });
    alert('Assignment submitted!');
    setSelectedAssignment(null);
    setSubmissionData({ file_url: '', content: '' });
    loadGrades();
    setUploading(false);
  };

  const styles = {
    page: { minHeight: '100vh', paddingTop: '80px', background: '#0a0a0f', fontFamily: "'Inter', sans-serif" },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    card: { background: 'rgba(20,30,55,0.5)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(59,130,246,0.15)', marginBottom: '1.5rem' },
    button: { padding: '0.6rem 1rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500' },
    input: { width: '100%', padding: '0.6rem 1rem', background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.5rem', color: 'white', fontSize: '0.9rem', marginBottom: '1rem' },
    textarea: { width: '100%', padding: '0.6rem 1rem', background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.5rem', color: 'white', fontSize: '0.9rem', marginBottom: '1rem', minHeight: '100px' },
    table: { width: '100%', borderCollapse: 'collapse', color: '#cbd5e1' },
    th: { padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' },
    td: { padding: '0.75rem', borderBottom: '1px solid rgba(59,130,246,0.1)' },
    badge: { display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.7rem', fontWeight: '500' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', background: 'linear-gradient(135deg, #ffffff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1.5rem' }}>📝 Assignments</h1>

        {/* Grades Summary */}
        <div style={styles.card}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>My Grades</h3>
          <table style={styles.table}>
            <thead><tr><th style={styles.th}>Module</th><th style={styles.th}>Assignment</th><th style={styles.th}>Status</th><th style={styles.th}>Score</th><th style={styles.th}>Feedback</th></tr></thead>
            <tbody>
              {grades.map((g, i) => (
                <tr key={i}>
                  <td style={styles.td}>{g.module_title}</td>
                  <td style={styles.td}>{g.assignment_title}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: g.submitted ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: g.submitted ? '#22c55e' : '#ef4444' }}>
                      {g.submitted ? 'Submitted' : 'Not Submitted'}
                    </span>
                  </td>
                  <td style={styles.td}>{g.score !== null ? `${g.score}/${g.max_score}` : '-'}</td>
                  <td style={styles.td}>{g.feedback || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Assignments List */}
        <div style={styles.card}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Pending Assignments</h3>
          {assignments.map(a => {
            const submitted = grades.find(g => g.assignment_title === a.title)?.submitted;
            return (
              <div key={a.id} style={{ borderBottom: '1px solid rgba(59,130,246,0.1)', padding: '1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h4 style={{ color: 'white', marginBottom: '0.25rem' }}>{a.title}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{a.description}</p>
                    <p style={{ color: '#64748b', fontSize: '0.7rem' }}>Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'No due date'} | Max score: {a.max_score}</p>
                  </div>
                  {!submitted ? (
                    <button style={styles.button} onClick={() => setSelectedAssignment(a)}>Submit Assignment</button>
                  ) : (
                    <span style={{ ...styles.badge, background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>✓ Submitted</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Modal */}
        {selectedAssignment && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedAssignment(null)}>
            <div style={{ background: '#0a0a0f', borderRadius: '1rem', padding: '2rem', border: '1px solid rgba(59,130,246,0.3)', maxWidth: '500px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Submit: {selectedAssignment.title}</h3>
              <form onSubmit={handleSubmit}>
                <input type="file" onChange={(e) => setSubmissionData({...submissionData, file: e.target.files[0]})} style={styles.input} />
                <textarea placeholder="Or write your answer here..." value={submissionData.content} onChange={(e) => setSubmissionData({...submissionData, content: e.target.value})} style={styles.textarea} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" style={styles.button} disabled={uploading}>{uploading ? 'Uploading...' : 'Submit'}</button>
                  <button type="button" onClick={() => setSelectedAssignment(null)} style={{ ...styles.button, background: '#ef4444' }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentAssignments;