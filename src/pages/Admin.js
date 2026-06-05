import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const S = {
  page: { minHeight: '100vh', paddingTop: '70px', fontFamily: 'Inter, sans-serif', backgroundImage: 'url("https://i.postimg.cc/3wxVp0ny/photo-2026-05-26-11-00-53.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)', zIndex: 0 },
  container: { maxWidth: '1300px', margin: '0 auto', padding: '1rem 2rem', position: 'relative', zIndex: 1 },
  card: { background: 'rgba(20,30,55,0.6)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1.2rem', border: '1px solid rgba(59,130,246,0.2)', marginBottom: '1rem' },
  input: { width: '100%', padding: '0.5rem', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.5rem', color: 'white', fontSize: '0.85rem', outline: 'none', marginBottom: '0.5rem' },
  textarea: { width: '100%', padding: '0.5rem', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.5rem', color: 'white', fontSize: '0.85rem', outline: 'none', marginBottom: '0.5rem', minHeight: '80px', resize: 'vertical' },
  select: { width: '100%', padding: '0.5rem', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.5rem', color: 'white', fontSize: '0.85rem', outline: 'none', marginBottom: '0.5rem', cursor: 'pointer' },
  btn: { padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' },
  btnGreen: { padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' },
  btnRed: { padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' },
  btnSm: { padding: '0.25rem 0.5rem', fontSize: '0.7rem', borderRadius: '0.3rem', border: 'none', cursor: 'pointer', color: 'white', fontWeight: '600' },
  tabs: { display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' },
  tab: (active) => ({ padding: '0.5rem 1rem', background: active ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(30,41,59,0.5)', borderRadius: '0.5rem', color: active ? 'white' : '#94a3b8', cursor: 'pointer', border: 'none', fontSize: '0.85rem' }),
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.8rem' },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.8rem', marginBottom: '1rem' },
  statCard: { background: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem', padding: '0.6rem', textAlign: 'center' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modalContent: { background: '#1e293b', borderRadius: '1rem', padding: '1.5rem', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', color: '#cbd5e1', fontSize: '0.8rem' },
  th: { padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', fontSize: '0.75rem' },
  td: { padding: '0.5rem', borderBottom: '1px solid rgba(59,130,246,0.1)', fontSize: '0.8rem' },
  badge: (color) => ({ display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '0.3rem', fontSize: '0.65rem', fontWeight: '600', background: `rgba(${color},0.2)`, color: `rgb(${color})` }),
};

function Admin() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [gradeModal, setGradeModal] = useState(null);
  const [gradeData, setGradeData] = useState({ score: '', feedback: '' });

  const [cf, setCf] = useState({ title: '', description: '', image_url: '', price: 29, level: 'Beginner', duration: '8 weeks', category: 'web' });
  const [mf, setMf] = useState({ title: '', course_id: '' });
  const [lf, setLf] = useState({ title: '', content: '', video_url: '', duration: 15, module_id: '' });
  const [qf, setQf] = useState({ question: '', option_a: '', option_b: '', option_c: '', correct_answer: 'A', course_id: '', lesson_id: '' });
  const [af, setAf] = useState({ title: '', description: '', due_date: '', max_score: 100, module_id: '' });

  useEffect(() => { const u = JSON.parse(localStorage.getItem('user') || '{}'); if (u.email === 'admin@grow.com') { setAuth(true); loadAll(); } else navigate('/login'); }, []);

  const api = async (url, method = 'GET', body = null) => {
    const opts = { method, headers: body instanceof FormData ? {} : { 'Content-Type': 'application/json' }, credentials: 'include' };
    if (body && !(body instanceof FormData)) opts.body = JSON.stringify(body);
    if (body instanceof FormData) opts.body = body;
    const r = await fetch(url, opts);
    return r.json();
  };

  const loadAll = () => { loadC(); loadM(); loadL(); loadQ(); loadA(); };
  const loadC = () => api('/api/courses').then(setCourses);
  const loadM = () => api('/api/admin/modules').then(setModules);
  const loadL = () => api('/api/admin/lessons').then(setLessons);
  const loadQ = () => api('/api/admin/quizzes').then(setQuizzes);
  const loadA = () => api('/api/admin/assignments').then(setAssignments);
  const loadSubmissions = (assignmentId) => api(`/api/admin/assignments/${assignmentId}/submissions`).then(setSubmissions);

  const uploadImage = async (file) => {
    const fd = new FormData(); fd.append('file', file);
    const data = await api('/api/admin/upload-image', 'POST', fd);
    return data.url ? `http://localhost:5000${data.url}` : '';
  };

  const tabs = [
    { id: 'courses', label: '📚 Courses' },
    { id: 'modules', label: '📁 Modules' },
    { id: 'lessons', label: '📖 Lessons' },
    { id: 'quizzes', label: '❓ Quizzes' },
    { id: 'assignments', label: '📝 Assignments' },
  ];

  if (!auth) return (
    <div style={S.page}><div style={S.overlay} />
      <div style={{ ...S.container, maxWidth: '400px', marginTop: '10rem' }}>
        <div style={S.card}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Admin Login</h2>
          <form onSubmit={async e => { e.preventDefault(); const d = await api('/api/login', 'POST', { email, password }); if (d.user?.email === 'admin@grow.com') { localStorage.setItem('user', JSON.stringify(d.user)); setAuth(true); loadAll(); } else alert('Admin only'); }}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={S.input} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={S.input} required />
            <button type="submit" style={{ ...S.btn, width: '100%' }}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div style={S.page}><div style={S.overlay} />
      <div style={S.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', background: 'linear-gradient(135deg, #fff, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin Panel</h1>
          <button onClick={() => { localStorage.removeItem('user'); setAuth(false); }} style={S.btnRed}>Logout</button>
        </div>
        <div style={S.statGrid}>
          {[{ v: courses.length, c: '#60a5fa', l: 'Courses' }, { v: modules.length, c: '#8b5cf6', l: 'Modules' }, { v: lessons.length, c: '#10b981', l: 'Lessons' }, { v: quizzes.length, c: '#f59e0b', l: 'Quizzes' }, { v: assignments.length, c: '#ec4899', l: 'Assignments' }].map(s => <div key={s.l} style={S.statCard}><div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: s.c }}>{s.v}</div><div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{s.l}</div></div>)}
        </div>
        <div style={S.tabs}>{tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={S.tab(tab === t.id)}>{t.label}</button>)}</div>

        {/* COURSES */}
        {tab === 'courses' && <>
          <div style={S.card}><h3 style={{ color: 'white', marginBottom: '0.8rem' }}>Create Course</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <input placeholder="Title *" value={cf.title} onChange={e => setCf({ ...cf, title: e.target.value })} style={S.input} />
              <input placeholder="Image URL or upload" value={cf.image_url} onChange={e => setCf({ ...cf, image_url: e.target.value })} style={S.input} />
              <input type="file" accept="image/*" onChange={async e => { if (e.target.files[0]) { const url = await uploadImage(e.target.files[0]); setCf({ ...cf, image_url: url }); } }} style={S.input} />
              <input type="number" placeholder="Price (USD)" value={cf.price} onChange={e => setCf({ ...cf, price: parseInt(e.target.value) })} style={S.input} />
              <select value={cf.level} onChange={e => setCf({ ...cf, level: e.target.value })} style={S.select}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
              <input placeholder="Duration (e.g., 8 weeks)" value={cf.duration} onChange={e => setCf({ ...cf, duration: e.target.value })} style={S.input} />
              <select value={cf.category} onChange={e => setCf({ ...cf, category: e.target.value })} style={S.select}><option value="web">Web Development</option><option value="data">Data Science</option><option value="design">UI/UX Design</option><option value="mobile">Mobile</option></select>
            </div>
            <textarea placeholder="Description" value={cf.description} onChange={e => setCf({ ...cf, description: e.target.value })} style={S.textarea} />
            <button onClick={async () => { await api('/api/admin/courses', 'POST', cf); setCf({ title: '', description: '', image_url: '', price: 29, level: 'Beginner', duration: '8 weeks', category: 'web' }); loadC(); }} style={S.btn}>Create Course</button>
          </div>
          <div style={S.grid}>{courses.map(c => <div key={c.id} style={S.card}>
            {c.image_url && <img src={c.image_url} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '0.5rem' }} />}
            <h4 style={{ color: 'white' }}>{c.title}</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{c.modules_count} modules • ${c.price || 29} • {c.level || 'All'}</p>
            <button onClick={async () => { if (window.confirm('Delete?')) { await api(`/api/admin/courses/${c.id}`, 'DELETE'); loadC(); } }} style={{ ...S.btnRed, padding: '0.25rem 0.5rem', fontSize: '0.7rem', marginTop: '0.3rem' }}>Delete</button>
          </div>)}</div>
        </>}

        {/* MODULES */}
        {tab === 'modules' && <>
          <div style={S.card}><h3 style={{ color: 'white', marginBottom: '0.8rem' }}>Add Module</h3>
            <select value={mf.course_id} onChange={e => setMf({ ...mf, course_id: e.target.value })} style={S.select}><option value="">Select Course</option>{courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select>
            <input placeholder="Module Title" value={mf.title} onChange={e => setMf({ ...mf, title: e.target.value })} style={S.input} />
            <button onClick={async () => { await api(`/api/admin/courses/${mf.course_id}/modules`, 'POST', { title: mf.title }); setMf({ title: '', course_id: '' }); loadM(); }} style={S.btn}>Add Module</button>
          </div>
          <div style={S.grid}>{modules.map(m => { const c = courses.find(co => co.id === m.course_id); return <div key={m.id} style={S.card}><h4 style={{ color: 'white' }}>{m.title}</h4><p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Course: {c?.title}</p><button onClick={async () => { if (window.confirm('Delete?')) { await api(`/api/admin/modules/${m.id}`, 'DELETE'); loadM(); } }} style={{ ...S.btnRed, padding: '0.25rem 0.5rem', fontSize: '0.7rem', marginTop: '0.3rem' }}>Delete</button></div>; })}</div>
        </>}

        {/* LESSONS */}
        {tab === 'lessons' && <>
          <div style={S.card}><h3 style={{ color: 'white', marginBottom: '0.8rem' }}>Add Lesson</h3>
            <select value={lf.module_id} onChange={e => setLf({ ...lf, module_id: e.target.value })} style={S.select}><option value="">Select Module</option>{modules.map(m => { const c = courses.find(co => co.id === m.course_id); return <option key={m.id} value={m.id}>{c?.title} - {m.title}</option>; })}</select>
            <input placeholder="Title" value={lf.title} onChange={e => setLf({ ...lf, title: e.target.value })} style={S.input} />
            <textarea placeholder="Content" value={lf.content} onChange={e => setLf({ ...lf, content: e.target.value })} style={S.textarea} />
            <input placeholder="Video URL" value={lf.video_url} onChange={e => setLf({ ...lf, video_url: e.target.value })} style={S.input} />
            <input type="number" placeholder="Duration (min)" value={lf.duration} onChange={e => setLf({ ...lf, duration: parseInt(e.target.value) || 15 })} style={S.input} />
            <button onClick={async () => { await api(`/api/admin/modules/${lf.module_id}/lessons`, 'POST', lf); setLf({ title: '', content: '', video_url: '', duration: 15, module_id: '' }); loadL(); }} style={S.btn}>Add Lesson</button>
          </div>
          <div style={S.grid}>{lessons.map(l => { const m = modules.find(mo => mo.id === l.module_id); const c = courses.find(co => co.id === m?.course_id); return <div key={l.id} style={S.card}><h4 style={{ color: 'white' }}>{l.title}</h4><p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{c?.title} → {m?.title}</p><button onClick={async () => { if (window.confirm('Delete?')) { await api(`/api/admin/lessons/${l.id}`, 'DELETE'); loadL(); } }} style={{ ...S.btnRed, padding: '0.25rem 0.5rem', fontSize: '0.7rem', marginTop: '0.3rem' }}>Delete</button></div>; })}</div>
        </>}

        {/* QUIZZES */}
        {tab === 'quizzes' && <>
          <div style={S.card}><h3 style={{ color: 'white', marginBottom: '0.8rem' }}>Add Quiz</h3>
            <select value={qf.course_id} onChange={e => setQf({ ...qf, course_id: e.target.value })} style={S.select}><option value="">Select Course</option>{courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select>
            <select value={qf.lesson_id} onChange={e => setQf({ ...qf, lesson_id: e.target.value })} style={S.select}><option value="">Select Lesson</option>{lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}</select>
            <textarea placeholder="Question" value={qf.question} onChange={e => setQf({ ...qf, question: e.target.value })} style={S.textarea} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <input placeholder="Option A" value={qf.option_a} onChange={e => setQf({ ...qf, option_a: e.target.value })} style={S.input} />
              <input placeholder="Option B" value={qf.option_b} onChange={e => setQf({ ...qf, option_b: e.target.value })} style={S.input} />
              <input placeholder="Option C" value={qf.option_c} onChange={e => setQf({ ...qf, option_c: e.target.value })} style={S.input} />
              <select value={qf.correct_answer} onChange={e => setQf({ ...qf, correct_answer: e.target.value })} style={S.select}><option value="A">Answer: A</option><option value="B">Answer: B</option><option value="C">Answer: C</option></select>
            </div>
            <button onClick={async () => { await api(`/api/admin/lessons/${qf.lesson_id}/quiz`, 'POST', qf); setQf({ question: '', option_a: '', option_b: '', option_c: '', correct_answer: 'A', course_id: '', lesson_id: '' }); loadQ(); }} style={S.btn}>Add Quiz</button>
          </div>
          <div style={S.grid}>{quizzes.map(q => { const l = lessons.find(lo => lo.id === q.lesson_id); return <div key={q.id} style={S.card}><h4 style={{ color: 'white' }}>{(q.question || '').substring(0, 50)}...</h4><p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Lesson: {l?.title}</p><button onClick={async () => { if (window.confirm('Delete?')) { await api(`/api/admin/quizzes/${q.id}`, 'DELETE'); loadQ(); } }} style={{ ...S.btnRed, padding: '0.25rem 0.5rem', fontSize: '0.7rem', marginTop: '0.3rem' }}>Delete</button></div>; })}</div>
        </>}

        {/* ASSIGNMENTS */}
        {tab === 'assignments' && <>
          <div style={S.card}><h3 style={{ color: 'white', marginBottom: '0.8rem' }}>Create Assignment</h3>
            <select value={af.module_id} onChange={e => setAf({ ...af, module_id: e.target.value })} style={S.select}><option value="">Select Module</option>{modules.map(m => { const c = courses.find(co => co.id === m.course_id); return <option key={m.id} value={m.id}>{c?.title} - {m.title}</option>; })}</select>
            <input placeholder="Title" value={af.title} onChange={e => setAf({ ...af, title: e.target.value })} style={S.input} />
            <textarea placeholder="Description" value={af.description} onChange={e => setAf({ ...af, description: e.target.value })} style={S.textarea} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <input type="datetime-local" value={af.due_date} onChange={e => setAf({ ...af, due_date: e.target.value })} style={S.input} />
              <input type="number" placeholder="Max Score" value={af.max_score} onChange={e => setAf({ ...af, max_score: parseInt(e.target.value) })} style={S.input} />
            </div>
            <button onClick={async () => { await api(`/api/admin/modules/${af.module_id}/assignments`, 'POST', af); setAf({ title: '', description: '', due_date: '', max_score: 100, module_id: '' }); loadA(); }} style={S.btn}>Create Assignment</button>
          </div>
          <div style={S.grid}>
            {assignments.map(a => {
              const m = modules.find(mo => mo.id === a.module_id);
              const c = courses.find(co => co.id === m?.course_id);
              return <div key={a.id} style={S.card}>
                <h4 style={{ color: 'white' }}>{a.title}</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{c?.title} → {m?.title}</p>
                <p style={{ color: '#64748b', fontSize: '0.7rem' }}>Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'N/A'} • Max: {a.max_score}</p>
                <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem' }}>
                  <button onClick={async () => { setSelectedAssignment(a); await loadSubmissions(a.id); }} style={{ ...S.btnGreen, padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>Submissions ({a.submissions_count || 0})</button>
                  <button onClick={async () => { if (window.confirm('Delete?')) { await api(`/api/admin/assignments/${a.id}`, 'DELETE'); loadA(); } }} style={{ ...S.btnRed, padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>Delete</button>
                </div>
              </div>;
            })}
          </div>
          {/* Submissions Modal */}
          {selectedAssignment && (
            <div style={S.modal} onClick={() => setSelectedAssignment(null)}>
              <div style={S.modalContent} onClick={e => e.stopPropagation()}>
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>Submissions: {selectedAssignment.title}</h3>
                {submissions.length === 0 ? <p style={{ color: '#94a3b8' }}>No submissions yet.</p> :
                  <table style={S.table}><thead><tr><th style={S.th}>Student</th><th style={S.th}>Date</th><th style={S.th}>Score</th><th style={S.th}>Action</th></tr></thead><tbody>
                    {submissions.map(s => <tr key={s.id}>
                      <td style={S.td}>{s.user_name}</td>
                      <td style={S.td}>{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : '-'}</td>
                      <td style={S.td}>{s.grade ? `${s.grade.score}/${selectedAssignment.max_score}` : <span style={S.badge('239,68,68')}>Pending</span>}</td>
                      <td style={S.td}><button onClick={() => { setGradeModal(s); setGradeData({ score: s.grade?.score || '', feedback: s.grade?.feedback || '' }); }} style={{ ...S.btn, padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}>{s.grade ? 'Edit' : 'Grade'}</button></td>
                    </tr>)}</tbody></table>
                }
                <button onClick={() => setSelectedAssignment(null)} style={{ ...S.btnRed, marginTop: '1rem' }}>Close</button>
              </div>
            </div>
          )}
          {/* Grade Modal */}
          {gradeModal && (
            <div style={S.modal} onClick={() => setGradeModal(null)}>
              <div style={S.modalContent} onClick={e => e.stopPropagation()}>
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>Grade: {gradeModal.user_name}</h3>
                <input type="number" placeholder={`Score (max: ${selectedAssignment?.max_score})`} value={gradeData.score} onChange={e => setGradeData({ ...gradeData, score: e.target.value })} style={S.input} />
                <textarea placeholder="Feedback" value={gradeData.feedback} onChange={e => setGradeData({ ...gradeData, feedback: e.target.value })} style={S.textarea} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={async () => { await api(`/api/admin/submissions/${gradeModal.id}/grade`, 'POST', { score: parseFloat(gradeData.score), feedback: gradeData.feedback }); setGradeModal(null); loadSubmissions(selectedAssignment.id); }} style={S.btnGreen}>Submit Grade</button>
                  <button onClick={() => setGradeModal(null)} style={S.btnRed}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </>}
      </div>
    </div>
  );
}

export default Admin;