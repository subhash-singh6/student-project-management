// frontend/src/pages/teacher/SubjectManagement.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "IT", "Other"]

const STATUS_MAP = {
  pending:  { color:'#f59e0b', bg:'rgba(245,158,11,0.12)', label:'⏳ Pending'  },
  approved: { color:'#10b981', bg:'rgba(16,185,129,0.12)', label:'✅ Approved' },
  rejected: { color:'#ef4444', bg:'rgba(239,68,68,0.12)',  label:'❌ Rejected' },
}

export default function SubjectManagement() {
  const navigate = useNavigate()

  const [subjects,        setSubjects]        = useState([])
  const [requests,        setRequests]        = useState([])
  const [mentors,         setMentors]         = useState([])
  const [loading,         setLoading]         = useState(true)
  const [submitting,      setSubmitting]      = useState(false)
  const [activeTab,       setActiveTab]       = useState('subjects')
  const [activeFilter,    setActiveFilter]    = useState('all')
  const [showForm,        setShowForm]        = useState(false)
  const [expandedSubject, setExpandedSubject] = useState(null)
  const [expandedReq,     setExpandedReq]     = useState(null)
  const [remarks,         setRemarks]         = useState('')
  const [editingSubject,  setEditingSubject]  = useState(null)

  const [form, setForm] = useState({
    name:'', code:'', department:'CSE',
    semester:'', description:'', credits:3, deadline:'',
  })

  useEffect(() => { fetchData() }, [])

  // ── Fetch all data ──────────────────────────────────────
  const fetchData = async () => {
    try {
      const [subRes, reqRes, mentorRes] = await Promise.all([
        API.get('/subjects/my'),
        API.get('/subjects/requests'),
        API.get('/mentor/all'),
      ])
      setSubjects(subRes.data.subjects   || [])
      setRequests(reqRes.data.requests   || [])
      setMentors(mentorRes.data.mentors  || [])
    } catch {
      toast.error('Data load nahi hua!')
    } finally {
      setLoading(false)
    }
  }

  // ── Create subject ──────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name || !form.code || !form.semester)
      return toast.error('Name, code aur semester zaroori hai!')
    setSubmitting(true)
    try {
      await API.post('/subjects', form)
      toast.success('Subject create ho gaya! 📚')
      setShowForm(false)
      resetForm()
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya!')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Update subject ──────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await API.put(`/subjects/${editingSubject}`, form)
      toast.success('Subject update ho gaya! ✅')
      setEditingSubject(null)
      setShowForm(false)
      resetForm()
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya!')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Delete subject ──────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm('Subject delete karna chahte ho?')) return
    try {
      await API.delete(`/subjects/${id}`)
      toast.success('Subject delete ho gaya.')
      fetchData()
    } catch {
      toast.error('Delete nahi hua!')
    }
  }

  // ── Approve / Reject request ────────────────────────────
  const handleRespond = async (reqId, status) => {
    setSubmitting(true)
    try {
      await API.put(`/subjects/requests/${reqId}/respond`, {
        status,
        teacherRemarks: remarks,
      })
      toast.success(status === 'approved' ? 'Request approve ho gayi! 🎉' : 'Request reject ho gayi.')
      setExpandedReq(null)
      setRemarks('')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya!')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Assign mentor ───────────────────────────────────────
  const handleAssignMentor = async (studentId, projectId, mentorId) => {
    if (!mentorId) return toast.error('Mentor select karo!')
    try {
      await API.post('/mentor/assign', { mentorId, studentId, projectId })
      toast.success('Mentor assign ho gaya! 🧑‍💼')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya!')
    }
  }

  const resetForm = () => {
    setForm({ name:'', code:'', department:'CSE', semester:'', description:'', credits:3, deadline:'' })
  }

  const startEdit = (s) => {
    setEditingSubject(s._id)
    setForm({
      name:        s.name,
      code:        s.code,
      department:  s.department,
      semester:    s.semester,
      description: s.description || '',
      credits:     s.credits,
      deadline:    s.deadline ? s.deadline.split('T')[0] : '',
    })
    setShowForm(true)
    window.scrollTo({ top:0, behavior:'smooth' })
  }

  // ── Computed values ─────────────────────────────────────
  const pendingCount     = requests.filter(r => r.status === 'pending').length
  const approvedCount    = requests.filter(r => r.status === 'approved').length
  const totalStudents    = subjects.reduce((a, s) => a + (s.enrolledStudents?.length || 0), 0)
  const filteredRequests = activeFilter === 'all'
    ? requests
    : requests.filter(r => r.status === activeFilter)

  // ── Loading screen ──────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#070b14', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
      <div style={{ width:40, height:40, border:'3px solid rgba(245,158,11,0.2)', borderTop:'3px solid #f59e0b', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
    </div>
  )

  // ── Main render ─────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:'#070b14', fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to { transform:rotate(360deg) } }
        .sub-card:hover { border-color:rgba(245,158,11,0.3) !important; transform:translateY(-2px); }
        .req-card:hover { border-color:rgba(99,102,241,0.2) !important; }
        .stu-row:hover  { background:rgba(255,255,255,0.03) !important; }
        input.ci, select.ci, textarea.ci {
          width:100%; box-sizing:border-box;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:10px; padding:10px 14px;
          color:#f1f5f9; font-size:14px; outline:none;
          font-family:'DM Sans',sans-serif;
          transition:border-color 0.2s;
        }
        input.ci:focus, select.ci:focus, textarea.ci:focus { border-color:rgba(245,158,11,0.4); }
        select.ci option { background:#0f172a; }
      `}</style>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 24px' }}>

        {/* ─────────────── HEADER ─────────────── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, animation:'fadeUp 0.4s ease' }}>
          <div>
            <button onClick={()=>navigate('/teacher/dashboard')} style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', fontSize:13, marginBottom:8, display:'block', padding:0 }}>
              ← Dashboard
            </button>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:28, fontWeight:800, color:'#f1f5f9', margin:0 }}>
              📚 Subject Management
            </h1>
            <p style={{ color:'#475569', fontSize:13, marginTop:4 }}>
              Subjects banao, requests manage karo, students dekho
            </p>
          </div>
          {activeTab === 'subjects' && (
            <button
              onClick={() => { setShowForm(!showForm); setEditingSubject(null); resetForm() }}
              style={{ background:'linear-gradient(135deg,#f59e0b,#f97316)', border:'none', borderRadius:12, padding:'10px 22px', color:'white', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14, boxShadow:'0 0 20px rgba(245,158,11,0.3)' }}
            >
              {showForm ? 'Cancel' : '+ New Subject'}
            </button>
          )}
        </div>

        {/* ─────────────── STATS ─────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24, animation:'fadeUp 0.4s ease 0.1s both' }}>
          {[
            { label:'Total Subjects',   value:subjects.length, icon:'📚', color:'#f59e0b', bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.2)'  },
            { label:'Pending Requests', value:pendingCount,    icon:'⏳', color:'#ef4444', bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.2)'   },
            { label:'Approved',         value:approvedCount,   icon:'✅', color:'#10b981', bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.2)'  },
            { label:'Total Students',   value:totalStudents,   icon:'🎓', color:'#6366f1', bg:'rgba(99,102,241,0.1)', border:'rgba(99,102,241,0.2)'  },
          ].map(s => (
            <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:16, padding:'18px 16px' }}>
              <div style={{ fontSize:22, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontSize:24, fontWeight:800, color:s.color, fontFamily:'Syne,sans-serif' }}>{s.value}</div>
              <div style={{ color:'#475569', fontSize:12, marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ─────────────── TABS ─────────────── */}
        <div style={{ display:'flex', gap:4, marginBottom:24, background:'rgba(15,23,42,0.9)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:6, animation:'fadeUp 0.4s ease 0.15s both' }}>
          {[
            { key:'subjects', label:'📚 My Subjects'       },
            { key:'requests', label:'📋 Project Requests', badge:pendingCount > 0, count:pendingCount },
            { key:'students', label:'🎓 Enrolled Students' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{ flex:1, position:'relative', background:activeTab===tab.key?'rgba(245,158,11,0.15)':'transparent', border:`1px solid ${activeTab===tab.key?'rgba(245,158,11,0.3)':'transparent'}`, borderRadius:10, padding:'10px', color:activeTab===tab.key?'#f59e0b':'#64748b', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:13, transition:'all 0.2s' }}
            >
              {tab.label}
              {tab.badge && (
                <span style={{ position:'absolute', top:4, right:8, background:'#ef4444', color:'white', borderRadius:'50%', width:16, height:16, fontSize:9, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ══════════════ SUBJECTS TAB ══════════════ */}
        {activeTab === 'subjects' && (
          <div style={{ animation:'fadeUp 0.4s ease' }}>

            {/* Create / Edit Form */}
            {showForm && (
              <div style={{ background:'rgba(15,23,42,0.95)', border:`1px solid ${editingSubject?'rgba(99,102,241,0.3)':'rgba(245,158,11,0.3)'}`, borderRadius:20, padding:28, marginBottom:24 }}>
                <h2 style={{ fontFamily:'Syne,sans-serif', color:'#f1f5f9', fontSize:18, margin:'0 0 20px' }}>
                  {editingSubject ? '✏️ Edit Subject' : '✨ Create New Subject'}
                </h2>
                <form onSubmit={editingSubject ? handleUpdate : handleCreate} style={{ display:'flex', flexDirection:'column', gap:14 }}>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    <div>
                      <label style={{ fontSize:12, color:'#475569', marginBottom:6, display:'block', textTransform:'uppercase', letterSpacing:1 }}>Subject Name *</label>
                      <input className="ci" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Web Development" />
                    </div>
                    <div>
                      <label style={{ fontSize:12, color:'#475569', marginBottom:6, display:'block', textTransform:'uppercase', letterSpacing:1 }}>Subject Code *</label>
                      <input className="ci" value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})} placeholder="e.g. CS301" disabled={!!editingSubject} />
                    </div>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:14 }}>
                    <div>
                      <label style={{ fontSize:12, color:'#475569', marginBottom:6, display:'block', textTransform:'uppercase', letterSpacing:1 }}>Department *</label>
                      <select className="ci" value={form.department} onChange={e=>setForm({...form,department:e.target.value})}>
                        {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:12, color:'#475569', marginBottom:6, display:'block', textTransform:'uppercase', letterSpacing:1 }}>Semester *</label>
                      <select className="ci" value={form.semester} onChange={e=>setForm({...form,semester:Number(e.target.value)})}>
                        <option value="">Select</option>
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:12, color:'#475569', marginBottom:6, display:'block', textTransform:'uppercase', letterSpacing:1 }}>Credits</label>
                      <select className="ci" value={form.credits} onChange={e=>setForm({...form,credits:Number(e.target.value)})}>
                        {[1,2,3,4,5].map(c => <option key={c} value={c}>{c} Credits</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:12, color:'#475569', marginBottom:6, display:'block', textTransform:'uppercase', letterSpacing:1 }}>Deadline</label>
                      <input type="date" className="ci" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize:12, color:'#475569', marginBottom:6, display:'block', textTransform:'uppercase', letterSpacing:1 }}>Description / Instructions</label>
                    <textarea className="ci" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Subject ya project instructions..." rows={3} style={{ resize:'vertical' }} />
                  </div>

                  <div style={{ display:'flex', gap:10 }}>
                    <button type="submit" disabled={submitting} style={{ flex:1, background:editingSubject?'linear-gradient(135deg,#6366f1,#818cf8)':'linear-gradient(135deg,#f59e0b,#f97316)', border:'none', borderRadius:10, padding:'13px', color:'white', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14 }}>
                      {submitting ? 'Saving...' : editingSubject ? 'Update Subject →' : 'Create Subject →'}
                    </button>
                    <button type="button" onClick={()=>{ setShowForm(false); setEditingSubject(null); resetForm() }} style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, color:'#94a3b8', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:600 }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Subjects List */}
            {subjects.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px', background:'rgba(15,23,42,0.9)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:24 }}>
                <div style={{ fontSize:48, opacity:0.2, marginBottom:12 }}>📚</div>
                <p style={{ color:'#475569', fontSize:15, marginBottom:8 }}>Koi subject nahi banaya abhi.</p>
                <p style={{ color:'#334155', fontSize:13 }}>Subject banao taaki students project assign kar sakein.</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {subjects.map((s, i) => (
                  <div key={s._id} className="sub-card" style={{ background:'rgba(15,23,42,0.9)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:18, padding:20, transition:'all 0.25s', animation:`fadeUp 0.4s ease ${i*0.06}s both` }}>

                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                      <div style={{ flex:1, cursor:'pointer' }} onClick={()=>setExpandedSubject(expandedSubject===s._id?null:s._id)}>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6, flexWrap:'wrap' }}>
                          <span style={{ fontFamily:'Syne,sans-serif', color:'#f1f5f9', fontSize:17, fontWeight:700 }}>{s.name}</span>
                          <span style={{ background:'rgba(245,158,11,0.12)', color:'#f59e0b', padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>{s.code}</span>
                        </div>
                        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                          <span style={{ color:'#64748b', fontSize:12 }}>🏫 {s.department}</span>
                          <span style={{ color:'#64748b', fontSize:12 }}>📚 Sem {s.semester}</span>
                          <span style={{ color:'#64748b', fontSize:12 }}>⭐ {s.credits} Credits</span>
                          <span style={{ color:'#6366f1', fontSize:12 }}>🎓 {s.enrolledStudents?.length||0} students</span>
                          {s.deadline && (
                            <span style={{ color:'#ef4444', fontSize:12 }}>
                              ⏰ {new Date(s.deadline).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:8, flexShrink:0, marginLeft:12 }}>
                        <button onClick={()=>startEdit(s)} style={{ background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:8, padding:'6px 12px', color:'#818cf8', cursor:'pointer', fontSize:12, fontWeight:600 }}>Edit</button>
                        <button onClick={()=>handleDelete(s._id)} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'6px 12px', color:'#ef4444', cursor:'pointer', fontSize:12, fontWeight:600 }}>Delete</button>
                      </div>
                    </div>

                    {s.description && (
                      <p style={{ color:'#64748b', fontSize:13, marginBottom:10, lineHeight:1.5 }}>{s.description}</p>
                    )}

                    <button
                      onClick={()=>setExpandedSubject(expandedSubject===s._id?null:s._id)}
                      style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', fontSize:12, padding:0, marginBottom: expandedSubject===s._id ? 12 : 0 }}
                    >
                      {expandedSubject === s._id ? '▲ Hide students' : `▼ Show ${s.enrolledStudents?.length||0} students`}
                    </button>

                    {expandedSubject === s._id && (
                      <div style={{ marginTop:12, borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:14 }}>
                        {(!s.enrolledStudents || s.enrolledStudents.length === 0) ? (
                          <p style={{ color:'#334155', fontSize:13, textAlign:'center', padding:'20px 0' }}>Koi student enroll nahi hua abhi.</p>
                        ) : (
                          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                            {s.enrolledStudents.map(stu => (
                              <div key={stu._id || stu} className="stu-row" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', borderRadius:10, background:'rgba(255,255,255,0.02)', transition:'background 0.2s' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                  <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#818cf8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'white' }}>
                                    {(stu.name || stu.email || 'S')[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <div style={{ color:'#f1f5f9', fontSize:13, fontWeight:500 }}>{stu.name || 'Student'}</div>
                                    <div style={{ color:'#475569', fontSize:11 }}>{stu.email}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ REQUESTS TAB ══════════════ */}
        {activeTab === 'requests' && (
          <div style={{ animation:'fadeUp 0.4s ease' }}>

            {/* Filter bar */}
            <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
              {[
                { key:'all',      label:`All (${requests.length})` },
                { key:'pending',  label:`⏳ Pending (${pendingCount})` },
                { key:'approved', label:`✅ Approved (${approvedCount})` },
                { key:'rejected', label:`❌ Rejected (${requests.filter(r=>r.status==='rejected').length})` },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={()=>setActiveFilter(f.key)}
                  style={{ background: activeFilter===f.key ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)', border:`1px solid ${activeFilter===f.key ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius:20, padding:'6px 16px', color: activeFilter===f.key ? '#f59e0b' : '#64748b', cursor:'pointer', fontSize:13, fontWeight:600, transition:'all 0.2s' }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredRequests.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px', background:'rgba(15,23,42,0.9)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:24 }}>
                <div style={{ fontSize:48, opacity:0.2, marginBottom:12 }}>📋</div>
                <p style={{ color:'#475569', fontSize:15 }}>Koi request nahi mili.</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {filteredRequests.map((req, i) => {
                  const st = STATUS_MAP[req.status] || STATUS_MAP.pending
                  return (
                    <div key={req._id} className="req-card" style={{ background:'rgba(15,23,42,0.9)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:18, padding:20, transition:'all 0.25s', animation:`fadeUp 0.4s ease ${i*0.06}s both` }}>

                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', cursor:'pointer' }} onClick={()=>setExpandedReq(expandedReq===req._id?null:req._id)}>
                        <div style={{ flex:1 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6, flexWrap:'wrap' }}>
                            <span style={{ fontFamily:'Syne,sans-serif', color:'#f1f5f9', fontSize:16, fontWeight:700 }}>
                              {req.projectTitle || req.project?.title || 'Project Request'}
                            </span>
                            <span style={{ background:st.bg, color:st.color, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>{st.label}</span>
                          </div>
                          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                            <span style={{ color:'#64748b', fontSize:12 }}>👤 {req.student?.name || req.studentName || 'Student'}</span>
                            <span style={{ color:'#64748b', fontSize:12 }}>📚 {req.subject?.name || req.subjectName || '—'}</span>
                            <span style={{ color:'#64748b', fontSize:12 }}>🕒 {new Date(req.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                          </div>
                        </div>
                        <span style={{ color:'#475569', fontSize:16, marginLeft:12 }}>{expandedReq===req._id ? '▲' : '▼'}</span>
                      </div>

                      {expandedReq === req._id && (
                        <div style={{ marginTop:16, borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:16 }}>

                          {(req.projectDescription || req.project?.description) && (
                            <div style={{ marginBottom:14 }}>
                              <div style={{ fontSize:11, color:'#475569', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>Project Description</div>
                              <p style={{ color:'#94a3b8', fontSize:13, lineHeight:1.6, margin:0, background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 14px' }}>
                                {req.projectDescription || req.project?.description}
                              </p>
                            </div>
                          )}

                          {req.techStack && (
                            <div style={{ marginBottom:14 }}>
                              <div style={{ fontSize:11, color:'#475569', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>Tech Stack</div>
                              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                                {req.techStack.split(',').map(t => (
                                  <span key={t} style={{ background:'rgba(99,102,241,0.12)', color:'#818cf8', padding:'3px 10px', borderRadius:20, fontSize:12 }}>{t.trim()}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {req.status === 'pending' && (
                            <>
                              <div style={{ marginBottom:14 }}>
                                <label style={{ fontSize:11, color:'#475569', textTransform:'uppercase', letterSpacing:1, marginBottom:6, display:'block' }}>Remarks (optional)</label>
                                <textarea
                                  className="ci"
                                  value={remarks}
                                  onChange={e=>setRemarks(e.target.value)}
                                  placeholder="Student ko kuch message dena ho to..."
                                  rows={2}
                                  style={{ resize:'vertical' }}
                                />
                              </div>
                              <div style={{ display:'flex', gap:10 }}>
                                <button disabled={submitting} onClick={()=>handleRespond(req._id,'approved')} style={{ flex:1, background:'linear-gradient(135deg,#10b981,#059669)', border:'none', borderRadius:10, padding:'11px', color:'white', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:13 }}>
                                  {submitting ? 'Processing...' : '✅ Approve'}
                                </button>
                                <button disabled={submitting} onClick={()=>handleRespond(req._id,'rejected')} style={{ flex:1, background:'linear-gradient(135deg,#ef4444,#dc2626)', border:'none', borderRadius:10, padding:'11px', color:'white', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:13 }}>
                                  {submitting ? 'Processing...' : '❌ Reject'}
                                </button>
                              </div>
                            </>
                          )}

                          {req.status !== 'pending' && req.teacherRemarks && (
                            <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 14px' }}>
                              <div style={{ fontSize:11, color:'#475569', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>Your Remarks</div>
                              <p style={{ color:'#94a3b8', fontSize:13, margin:0 }}>{req.teacherRemarks}</p>
                            </div>
                          )}

                          {req.status === 'approved' && (
                            <div style={{ marginTop:14, background:'rgba(99,102,241,0.07)', border:'1px solid rgba(99,102,241,0.15)', borderRadius:12, padding:'14px 16px' }}>
                              <div style={{ fontSize:12, color:'#818cf8', marginBottom:10, fontWeight:600 }}>🧑‍💼 Assign Mentor</div>
                              <MentorAssign
                                mentors={mentors}
                                studentId={req.student?._id || req.student}
                                projectId={req.project?._id || req.project}
                                currentMentor={req.mentor}
                                onAssign={handleAssignMentor}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ STUDENTS TAB ══════════════ */}
        {activeTab === 'students' && (
          <div style={{ animation:'fadeUp 0.4s ease' }}>
            {subjects.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px', background:'rgba(15,23,42,0.9)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:24 }}>
                <div style={{ fontSize:48, opacity:0.2, marginBottom:12 }}>🎓</div>
                <p style={{ color:'#475569', fontSize:15 }}>Koi subject nahi hai abhi.</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                {subjects.map((s, i) => (
                  s.enrolledStudents?.length > 0 && (
                    <div key={s._id} style={{ background:'rgba(15,23,42,0.9)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:18, padding:20, animation:`fadeUp 0.4s ease ${i*0.06}s both` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                        <span style={{ fontFamily:'Syne,sans-serif', color:'#f1f5f9', fontSize:16, fontWeight:700 }}>{s.name}</span>
                        <span style={{ background:'rgba(245,158,11,0.12)', color:'#f59e0b', padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>{s.code}</span>
                        <span style={{ color:'#6366f1', fontSize:12, marginLeft:'auto' }}>🎓 {s.enrolledStudents.length} students</span>
                      </div>

                      <div style={{ overflowX:'auto' }}>
                        <table style={{ width:'100%', borderCollapse:'collapse' }}>
                          <thead>
                            <tr>
                              {['Student','Email','Enrollment No.','Semester','Action'].map(h => (
                                <th key={h} style={{ textAlign:'left', fontSize:11, color:'#475569', textTransform:'uppercase', letterSpacing:1, padding:'8px 12px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {s.enrolledStudents.map(stu => (
                              <tr key={stu._id || stu} className="stu-row" style={{ transition:'background 0.2s' }}>
                                <td style={{ padding:'10px 12px' }}>
                                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                    <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#818cf8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'white', flexShrink:0 }}>
                                      {(stu.name || 'S')[0].toUpperCase()}
                                    </div>
                                    <span style={{ color:'#f1f5f9', fontSize:13 }}>{stu.name || '—'}</span>
                                  </div>
                                </td>
                                <td style={{ padding:'10px 12px', color:'#64748b', fontSize:12 }}>{stu.email || '—'}</td>
                                <td style={{ padding:'10px 12px', color:'#64748b', fontSize:12 }}>{stu.enrollmentNo || '—'}</td>
                                <td style={{ padding:'10px 12px', color:'#64748b', fontSize:12 }}>{stu.semester ? `Sem ${stu.semester}` : '—'}</td>
                                <td style={{ padding:'10px 12px' }}>
                                  <button
                                    onClick={()=>navigate(`/teacher/student/${stu._id}`)}
                                    style={{ background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:8, padding:'5px 12px', color:'#818cf8', cursor:'pointer', fontSize:12, fontWeight:600 }}
                                  >
                                    View →
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                ))}

                {subjects.every(s => !s.enrolledStudents?.length) && (
                  <div style={{ textAlign:'center', padding:'60px', background:'rgba(15,23,42,0.9)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:24 }}>
                    <div style={{ fontSize:48, opacity:0.2, marginBottom:12 }}>🎓</div>
                    <p style={{ color:'#475569', fontSize:15 }}>Abhi tak koi student enroll nahi hua.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

// ── Helper: Mentor Assign dropdown ─────────────────────────
function MentorAssign({ mentors, studentId, projectId, currentMentor, onAssign }) {
  const [selectedMentor, setSelectedMentor] = useState(currentMentor?._id || currentMentor || '')
  const [assigning, setAssigning] = useState(false)

  const handleAssign = async () => {
    setAssigning(true)
    await onAssign(studentId, projectId, selectedMentor)
    setAssigning(false)
  }

  return (
    <div style={{ display:'flex', gap:10, alignItems:'center' }}>
      <select
        value={selectedMentor}
        onChange={e=>setSelectedMentor(e.target.value)}
        style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:8, padding:'8px 12px', color:'#f1f5f9', fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif' }}
      >
        <option value="">— Select Mentor —</option>
        {mentors.map(m => (
          <option key={m._id} value={m._id}>
            {m.name}{m.specialization ? ` (${m.specialization})` : ''}
          </option>
        ))}
      </select>
      <button
        disabled={assigning || !selectedMentor}
        onClick={handleAssign}
        style={{ background:'linear-gradient(135deg,#6366f1,#818cf8)', border:'none', borderRadius:8, padding:'8px 16px', color:'white', cursor: !selectedMentor ? 'not-allowed' : 'pointer', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:13, opacity: !selectedMentor ? 0.5 : 1 }}
      >
        {assigning ? '...' : currentMentor ? 'Reassign' : 'Assign'}
      </button>
    </div>
  )
}