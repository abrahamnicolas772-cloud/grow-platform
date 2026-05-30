import { useState, useEffect } from 'react';

function AdminAssignments() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ 
    title: '', 
    description: '', 
    due_date: '', 
    max_score: 100,
    instructions: '',
    allowed_files: '.pdf,.doc,.docx,.zip'
  });
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ score: '', feedback: '' });
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('assignments');
  const [stats, setStats] = useState({
    total_submissions: 0,
    graded_count: 0,
    pending_count: 0,
    avg_score: 0
  });
  const [showStats, setShowStats] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all, graded, pending
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedAssignment) {
      calculateStats();
    }
  }, [submissions]);

  const loadCourses = async () => {
    const res = await fetch('http://localhost:5000/api/courses');
    const data = await res.json();
    setCourses(data);
  };

  const loadModules = async (courseId) => {
    const res = await fetch(`http://localhost:5000/api/courses/${courseId}/modules`);
    const data = await res.json();
    setModules(data);
  };

  const loadAssignments = async (moduleId) => {
    const res = await fetch(`http://localhost:5000/api/admin/modules/${moduleId}/assignments`, {
      credentials: 'include'
    });
    const data = await res.json();
    setAssignments(data);
  };

  const loadSubmissions = async (assignmentId) => {
    const res = await fetch(`http://localhost:5000/api/admin/assignments/${assignmentId}/submissions`, {
      credentials: 'include'
    });
    const data = await res.json();
    setSubmissions(data);
  };

  const calculateStats = () => {
    const total = submissions.length;
    const graded = submissions.filter(s => s.grade).length;
    const pending = total - graded;
    const scores = submissions.filter(s => s.grade).map(s => s.grade.score);
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    setStats({
      total_submissions: total,
      graded_count: graded,
      pending_count: pending,
      avg_score: Math.round(avg * 10) / 10
    });
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/admin/modules/${selectedModule.id}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssignment),
        credentials: 'include'
      });
      alert('✅ Assignment created successfully!');
      setNewAssignment({ 
        title: '', description: '', due_date: '', max_score: 100,
        instructions: '', allowed_files: '.pdf,.doc,.docx,.zip'
      });
      loadAssignments(selectedModule.id);
    } catch (error) {
      alert('❌ Error creating assignment');
    }
    setLoading(false);
  };

  const updateAssignment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/admin/assignments/${editingAssignment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAssignment),
        credentials: 'include'
      });
      alert('✅ Assignment updated!');
      setEditingAssignment(null);
      loadAssignments(selectedModule.id);
    } catch (error) {
      alert('❌ Error updating assignment');
    }
    setLoading(false);
  };

  const deleteAssignment = async (assignmentId) => {
    if (window.confirm('Delete this assignment? All submissions will be deleted.')) {
      await fetch(`http://localhost:5000/api/admin/assignments/${assignmentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      alert('Assignment deleted');
      loadAssignments(selectedModule.id);
    }
  };

  const submitGrade = async (submissionId) => {
    await fetch(`http://localhost:5000/api/admin/submissions/${submissionId}/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        score: parseFloat(gradeData.score), 
        feedback: gradeData.feedback,
        max_score: selectedAssignment?.max_score 
      }),
      credentials: 'include'
    });
    alert('✅ Grade submitted!');
    setSelectedSubmission(null);
    setGradeData({ score: '', feedback: '' });
    loadSubmissions(selectedAssignment.id);
  };

  const bulkGrade = async () => {
    const ungraded = submissions.filter(s => !s.grade);
    if (ungraded.length === 0) {
      alert('All submissions already graded!');
      return;
    }
    // Ouvrir un modal pour noter en masse
    const defaultScore = prompt(`Enter default score for ${ungraded.length} ungraded submissions (max: ${selectedAssignment?.max_score})`, "0");
    if (defaultScore !== null) {
      for (const sub of ungraded) {
        await fetch(`http://localhost:5000/api/admin/submissions/${sub.id}/grade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score: parseFloat(defaultScore), feedback: 'Bulk grading' }),
          credentials: 'include'
        });
      }
      alert(`✅ Graded ${ungraded.length} submissions!`);
      loadSubmissions(selectedAssignment.id);
    }
  };

  const exportGrades = () => {
    let csv = "Student,Submitted At,Score,Feedback,Status\n";
    submissions.forEach(s => {
      csv += `"${s.user_name}",${s.submitted_at || '-'},${s.grade?.score || '-'},"${s.grade?.feedback || '-'}",${s.grade ? 'Graded' : 'Pending'}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grades_${selectedAssignment?.title}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFilteredSubmissions = () => {
    let filtered = [...submissions];
    if (filterStatus === 'graded') {
      filtered = filtered.filter(s => s.grade);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(s => !s.grade);
    }
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const styles = {
    page: { minHeight: '100vh', paddingTop: '80px', background: '#0a0a0f', fontFamily: "'Inter', sans-serif" },
    container: { maxWidth: '1400px', margin: '0 auto', padding: '2rem' },
    card: { background: 'rgba(20,30,55,0.5)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(59,130,246,0.15)', marginBottom: '1.5rem' },
    input: { width: '100%', padding: '0.6rem 1rem', background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.5rem', color: 'white', fontSize: '0.9rem', marginBottom: '1rem' },
    textarea: { width: '100%', padding: '0.6rem 1rem', background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.5rem', color: 'white', fontSize: '0.9rem', marginBottom: '1rem', minHeight: '100px' },
    button: { padding: '0.6rem 1rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500' },
    deleteButton: { padding: '0.6rem 1rem', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500' },
    successButton: { padding: '0.6rem 1rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500' },
    select: { width: '100%', padding: '0.6rem 1rem', background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.5rem', color: 'white', fontSize: '0.9rem', marginBottom: '1rem', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', color: '#cbd5e1' },
    th: { padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' },
    td: { padding: '0.75rem', borderBottom: '1px solid rgba(59,130,246,0.1)' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modal: { background: '#0a0a0f', borderRadius: '1rem', padding: '2rem', border: '1px solid rgba(59,130,246,0.3)', maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' },
    statCard: { background: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem', padding: '0.8rem', textAlign: 'center' },
    filterBar: { display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', background: 'linear-gradient(135deg, #ffffff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1.5rem' }}>📝 Assignments & Grades</h1>

        {/* Course & Module Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <select style={styles.select} onChange={(e) => {
            const course = courses.find(c => c.id == e.target.value);
            setSelectedCourse(course);
            if (course) loadModules(course.id);
          }}>
            <option value="">Select Course</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>

          <select style={styles.select} onChange={(e) => {
            const module = modules.find(m => m.id == e.target.value);
            setSelectedModule(module);
            if (module) loadAssignments(module.id);
          }} disabled={!selectedCourse}>
            <option value="">Select Module</option>
            {modules.map(m => <option key={m.id} value={m.id}>{m.title} {m.is_locked ? '🔒' : '🔓'}</option>)}
          </select>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button style={activeView === 'assignments' ? styles.button : { ...styles.button, background: '#334155' }} onClick={() => { setActiveView('assignments'); setEditingAssignment(null); }}>📋 Manage Assignments</button>
          <button style={activeView === 'submissions' ? styles.button : { ...styles.button, background: '#334155' }} onClick={() => setActiveView('submissions')} disabled={!selectedAssignment}>📊 View Submissions</button>
          {activeView === 'submissions' && selectedAssignment && (
            <button style={styles.successButton} onClick={exportGrades}>📥 Export CSV</button>
          )}
        </div>

        {/* ========== CREATE / EDIT ASSIGNMENT ========== */}
        {(activeView === 'assignments' && selectedModule) && (
          <div style={styles.card}>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>
              {editingAssignment ? '✏️ Edit Assignment' : '➕ Create New Assignment'}
            </h3>
            <form onSubmit={editingAssignment ? updateAssignment : createAssignment}>
              <input type="text" placeholder="Assignment Title" value={editingAssignment ? editingAssignment.title : newAssignment.title} onChange={(e) => {
                if (editingAssignment) setEditingAssignment({...editingAssignment, title: e.target.value});
                else setNewAssignment({...newAssignment, title: e.target.value});
              }} style={styles.input} required />
              
              <textarea placeholder="Description / Instructions" value={editingAssignment ? editingAssignment.description : newAssignment.description} onChange={(e) => {
                if (editingAssignment) setEditingAssignment({...editingAssignment, description: e.target.value});
                else setNewAssignment({...newAssignment, description: e.target.value});
              }} style={styles.textarea} />
              
              <textarea placeholder="Detailed Instructions (for students)" value={editingAssignment ? editingAssignment.instructions : newAssignment.instructions} onChange={(e) => {
                if (editingAssignment) setEditingAssignment({...editingAssignment, instructions: e.target.value});
                else setNewAssignment({...newAssignment, instructions: e.target.value});
              }} style={styles.textarea} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="datetime-local" placeholder="Due Date" value={editingAssignment ? editingAssignment.due_date : newAssignment.due_date} onChange={(e) => {
                  if (editingAssignment) setEditingAssignment({...editingAssignment, due_date: e.target.value});
                  else setNewAssignment({...newAssignment, due_date: e.target.value});
                }} style={styles.input} />
                
                <input type="number" placeholder="Max Score" value={editingAssignment ? editingAssignment.max_score : newAssignment.max_score} onChange={(e) => {
                  if (editingAssignment) setEditingAssignment({...editingAssignment, max_score: parseInt(e.target.value)});
                  else setNewAssignment({...newAssignment, max_score: parseInt(e.target.value)});
                }} style={styles.input} />
              </div>
              
              <input type="text" placeholder="Allowed file types (e.g., .pdf,.doc,.zip)" value={editingAssignment ? editingAssignment.allowed_files : newAssignment.allowed_files} onChange={(e) => {
                if (editingAssignment) setEditingAssignment({...editingAssignment, allowed_files: e.target.value});
                else setNewAssignment({...newAssignment, allowed_files: e.target.value});
              }} style={styles.input} />
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" style={styles.button} disabled={loading}>
                  {loading ? 'Saving...' : (editingAssignment ? 'Update Assignment' : 'Create Assignment')}
                </button>
                {editingAssignment && (
                  <button type="button" style={styles.deleteButton} onClick={() => setEditingAssignment(null)}>Cancel Edit</button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ========== ASSIGNMENTS LIST ========== */}
        {activeView === 'assignments' && assignments.length > 0 && (
          <div style={styles.card}>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>📋 Existing Assignments</h3>
            <table style={styles.table}>
              <thead>
                <tr><th style={styles.th}>Title</th><th style={styles.th}>Due Date</th><th style={styles.th}>Max Score</th><th style={styles.th}>Submissions</th><th style={styles.th}>Graded</th><th style={styles.th}>Actions</th></tr></thead>
              <tbody>
                {assignments.map(a => (
                  <tr key={a.id}>
                    <td style={styles.td}>{a.title}</td>
                    <td style={styles.td}>{a.due_date ? new Date(a.due_date).toLocaleDateString() : 'No due date'}</td>
                    <td style={styles.td}>{a.max_score}</td>
                    <td style={styles.td}>{a.submissions_count}</td>
                    <td style={styles.td}>{a.graded_count}/{a.submissions_count}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button style={{ ...styles.button, padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => { setSelectedAssignment(a); loadSubmissions(a.id); setActiveView('submissions'); }}>View</button>
                        <button style={{ ...styles.button, padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: '#f59e0b' }} onClick={() => setEditingAssignment(a)}>Edit</button>
                        <button style={{ ...styles.deleteButton, padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => deleteAssignment(a.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ========== SUBMISSIONS VIEW ========== */}
        {activeView === 'submissions' && selectedAssignment && (
          <div style={styles.card}>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>📊 Submissions: {selectedAssignment.title}</h3>
            
            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa' }}>{stats.total_submissions}</div><div>Total</div></div>
              <div style={styles.statCard}><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>{stats.graded_count}</div><div>Graded</div></div>
              <div style={styles.statCard}><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.pending_count}</div><div>Pending</div></div>
              <div style={styles.statCard}><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>{stats.avg_score}</div><div>Avg Score</div></div>
            </div>

            {/* Filter Bar */}
            <div style={styles.filterBar}>
              <input type="text" placeholder="Search student..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...styles.input, marginBottom: 0, width: '200px' }} />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...styles.select, marginBottom: 0, width: '150px' }}>
                <option value="all">All</option>
                <option value="graded">Graded</option>
                <option value="pending">Pending</option>
              </select>
              <button style={styles.successButton} onClick={bulkGrade}>⚡ Bulk Grade</button>
              <button style={{ ...styles.button, background: '#8b5cf6' }} onClick={exportGrades}>📥 Export CSV</button>
              <button style={{ ...styles.button }} onClick={() => setActiveView('assignments')}>← Back</button>
            </div>

            {/* Submissions Table */}
            <table style={styles.table}>
              <thead>
                <tr><th style={styles.th}>Student</th><th style={styles.th}>Submitted</th><th style={styles.th}>File</th><th style={styles.th}>Score</th><th style={styles.th}>Feedback</th><th style={styles.th}>Action</th></tr></thead>
              <tbody>
                {getFilteredSubmissions().map(s => (
                  <tr key={s.id}>
                    <td style={styles.td}>{s.user_name}</td>
                    <td style={styles.td}>{s.submitted_at ? new Date(s.submitted_at).toLocaleString() : '-'}</td>
                    <td style={styles.td}>{s.file_url && <a href={`http://localhost:5000${s.file_url}`} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>📎 Download</a>}</td>
                    <td style={styles.td}>
                      {s.grade ? `${s.grade.score}/${selectedAssignment.max_score}` : '-'}
                    </td>
                    <td style={styles.td}>{s.grade?.feedback?.substring(0, 50) || '-'}</td>
                    <td style={styles.td}>
                      <button style={{ ...styles.button, padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => { 
                        setSelectedSubmission(s); 
                        setGradeData({ score: s.grade?.score || '', feedback: s.grade?.feedback || '' }); 
                      }}>
                        {s.grade ? 'Edit Grade' : 'Grade'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {getFilteredSubmissions().length === 0 && (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No submissions found</p>
            )}
          </div>
        )}

        {/* No Assignments Message */}
        {activeView === 'assignments' && selectedModule && assignments.length === 0 && (
          <div style={styles.card}>
            <p style={{ textAlign: 'center', color: '#64748b' }}>No assignments yet. Create one above! 📝</p>
          </div>
        )}

        {/* Grade Modal */}
        {selectedSubmission && (
          <div style={styles.modalOverlay} onClick={() => setSelectedSubmission(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>✏️ Grade Submission</h3>
              <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Student: <strong style={{ color: 'white' }}>{selectedSubmission.user_name}</strong></p>
              <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Assignment: {selectedAssignment?.title}</p>
              
              <label style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block' }}>Score (max: {selectedAssignment?.max_score})</label>
              <input type="number" placeholder="Score" value={gradeData.score} onChange={(e) => setGradeData({...gradeData, score: e.target.value})} style={styles.input} />
              
              <label style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block' }}>Feedback</label>
              <textarea placeholder="Write feedback for the student..." value={gradeData.feedback} onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})} style={styles.textarea} />
              
              {selectedSubmission.content && (
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                  <p style={{ color: '#94a3b8', fontSize: '0.7rem', marginBottom: '0.25rem' }}>Student's answer:</p>
                  <p style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>{selectedSubmission.content}</p>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => submitGrade(selectedSubmission.id)} style={styles.successButton}>✓ Submit Grade</button>
                <button onClick={() => setSelectedSubmission(null)} style={styles.deleteButton}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAssignments;