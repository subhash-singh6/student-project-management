// frontend/src/pages/student/AssignTeacher.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

export default function AssignTeacher() {
  const navigate = useNavigate()

  const [subjects, setSubjects]   = useState([])
  const [projects, setProjects]   = useState([])
  const [mentors, setMentors]     = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('assign')

  const [filters, setFilters] = useState({ department: '', semester: '' })
  const [form, setForm] = useState({
    projectId: '', subjectId: '', mentorId: '', message: '',
  })

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    fetchSubjects()
  }, [filters])

  const fetchData = async () => {
    try {
      const [projRes, mentorRes, reqRes] = await Promise.all([
        API.get('/projects'),
        API.get('/mentor/all'),
        API.get('/subjects/my-requests'),
      ])
      setProjects(projRes.data.projects?.filter(p => !p.teacher) || [])
      setMentors(mentorRes.data.mentors || [])
      setMyRequests(reqRes.data.requests || [])
    } catch {
      toast.error('Data load nahi hua!')
    } finally {
      setLoading(false)
    }
  }

  const fetchSubjects = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.department) params.append('department', filters.department)
      if (filters.semester)   params.append('semester', filters.semester)
      const res = await API.get(`/subjects?${params.toString()}`)
      setSubjects(res.data.subjects || [])
    } catch {}
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.projectId || !form.subjectId)
      return toast.error('Project aur Subject select karo!')
    setSubmitting(true)
    try {
      await API.post('/subjects/request', form)
      toast.success('Request bhej di! Teacher approve karenge. 🎉')
      setForm({ projectId:'', subjectId:'', mentorId:'', message:'' })
      fetchData()
      setActiveTab('requests')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya!')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedSubject = subjects.find(s => s._id === form.subjectId)

  const STATUS_MAP = {
    pending:  { color:'#f59e0b', bg:'rgba(245,158,11,0.12)', label:'⏳ Pending',  icon:'⏳' },
    approved: { color:'#10b981', bg:'rgba(16,185,129,0.12)', label:'✅ Approved', icon:'✅' },
    rejected: { color:'#ef4444', bg:'rgba(239,68,68,0.12)',  label:'❌ Rejected', icon:'❌' },
  }

  if (loading) return (
    <div style={{ minHeight:'100vh',background:'#070b14',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:40,height:40,border:'3px solid rgba(99,102,241,0.2)',borderTop:'3px solid #6366f1',borderRadius:'50%',animation:'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ minHeight:'100vh',background:'#070b14',fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .sub-item:hover{border-color:rgba(99,102,241,0.4) !important;background:rgba(99,102,241,0.08) !important;}
        .sub-item.selected{border-color:#6366f1 !important;background:rgba(99,102,241,0.12) !important;}
      `}</style>

      <div style={{ maxWidth:900,margin:'0 auto',padding:'32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:28,animation:'fadeUp 0.4s ease' }}>
          <button onClick={()=>navigate('/student/dashboard')} style={{ background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:13,marginBottom:8,display:'block',padding:0 }}>← Dashboard</button>
          <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:800,color:'#f1f5f9',margin:0 }}>🎓 Assign Teacher</h1>
          <p style={{ color:'#475569',fontSize:13,marginTop:4 }}>Project ke liye teacher aur subject select karo</p>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex',gap:4,marginBottom:24,background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:14,padding:6,animation:'fadeUp 0.4s ease 0.1s both' }}>
          {[
            { key:'assign',   label:'📋 New Request' },
            { key:'requests', label:`📊 My Requests (${myRequests.length})` },
          ].map(tab=>(
            <button key={tab.key} onClick={()=>setActiveTab(tab.key)} style={{ flex:1,background:activeTab===tab.key?'rgba(99,102,241,0.2)':'transparent',border:`1px solid ${activeTab===tab.key?'rgba(99,102,241,0.3)':'transparent'}`,borderRadius:10,padding:'10px',color:activeTab===tab.key?'#818cf8':'#64748b',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:13,transition:'all 0.2s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── ASSIGN TAB ── */}
        {activeTab==='assign' && (
          <div style={{ animation:'fadeUp 0.4s ease' }}>

            {projects.length === 0 ? (
              <div style={{ textAlign:'center',padding:'60px',background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:24 }}>
                <div style={{ fontSize:48,opacity:0.2,marginBottom:12 }}>📁</div>
                <p style={{ color:'#475569',fontSize:15 }}>Pehle project banao!</p>
                <button onClick={()=>navigate('/student/projects')} style={{ marginTop:16,background:'linear-gradient(135deg,#6366f1,#818cf8)',border:'none',borderRadius:10,padding:'10px 24px',color:'white',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600 }}>Create Project →</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:20 }}>

                {/* Step 1 — Project Select */}
                <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:18,padding:20 }}>
                  <div style={{ color:'#6366f1',fontSize:12,fontWeight:600,letterSpacing:2,textTransform:'uppercase',marginBottom:12 }}>Step 1 — Select Project</div>
                  <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                    {projects.map(p=>(
                      <div key={p._id} onClick={()=>setForm({...form,projectId:p._id})} style={{ background:form.projectId===p._id?'rgba(99,102,241,0.12)':'rgba(255,255,255,0.03)',border:`1px solid ${form.projectId===p._id?'#6366f1':'rgba(255,255,255,0.07)'}`,borderRadius:12,padding:'14px 16px',cursor:'pointer',transition:'all 0.2s' }}>
                        <div style={{ color:'#f1f5f9',fontSize:14,fontWeight:600 }}>{p.title}</div>
                        <div style={{ color:'#64748b',fontSize:12,marginTop:3 }}>{p.category} • {p.techStack?.slice(0,3).join(', ')}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 2 — Subject + Teacher Select */}
                <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:18,padding:20 }}>
                  <div style={{ color:'#f59e0b',fontSize:12,fontWeight:600,letterSpacing:2,textTransform:'uppercase',marginBottom:14 }}>Step 2 — Select Subject & Teacher</div>

                  {/* Filters */}
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16 }}>
                    <div>
                      <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block' }}>Filter by Department</label>
                      <select value={filters.department} onChange={e=>setFilters({...filters,department:e.target.value})} className="custom-input">
                        <option value="">All Departments</option>
                        {['CSE','ECE','ME','CE','IT'].map(d=><option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block' }}>Filter by Semester</label>
                      <select value={filters.semester} onChange={e=>setFilters({...filters,semester:e.target.value})} className="custom-input">
                        <option value="">All Semesters</option>
                        {[1,2,3,4,5,6,7,8].map(s=><option key={s} value={s}>Semester {s}</option>)}
                      </select>
                    </div>
                  </div>

                  {subjects.length===0 ? (
                    <div style={{ textAlign:'center',padding:'24px',color:'#334155',fontSize:13 }}>
                      Koi subject available nahi is filter mein.
                    </div>
                  ) : (
                    <div style={{ display:'flex',flexDirection:'column',gap:8,maxHeight:320,overflowY:'auto' }}>
                      {subjects.map(s=>(
                        <div key={s._id} className={`sub-item ${form.subjectId===s._id?'selected':''}`} onClick={()=>setForm({...form,subjectId:s._id})} style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:'14px 16px',cursor:'pointer',transition:'all 0.2s' }}>
                          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
                            <div>
                              <div style={{ color:'#f1f5f9',fontSize:14,fontWeight:600 }}>{s.name}</div>
                              <div style={{ color:'#f59e0b',fontSize:12,fontWeight:600,marginTop:2 }}>{s.code}</div>
                              <div style={{ color:'#64748b',fontSize:12,marginTop:4 }}>👨‍🏫 {s.teacher?.name} • {s.department} • Sem {s.semester}</div>
                            </div>
                            <div style={{ textAlign:'right' }}>
                              <span style={{ background:'rgba(34,211,238,0.1)',color:'#22d3ee',padding:'3px 10px',borderRadius:20,fontSize:11 }}>⭐ {s.credits} cr</span>
                              <div style={{ color:'#475569',fontSize:11,marginTop:4 }}>{s.enrolledStudents?.length||0} enrolled</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Subject Info */}
                {selectedSubject && (
                  <div style={{ background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:14,padding:16 }}>
                    <div style={{ color:'#f59e0b',fontSize:12,fontWeight:600,marginBottom:8 }}>✅ Selected:</div>
                    <div style={{ color:'#f1f5f9',fontSize:14,fontWeight:600 }}>{selectedSubject.name} — {selectedSubject.code}</div>
                    <div style={{ color:'#94a3b8',fontSize:13,marginTop:4 }}>Teacher: {selectedSubject.teacher?.name} | {selectedSubject.department} | Sem {selectedSubject.semester}</div>
                  </div>
                )}

                {/* Step 3 — Mentor (Optional) */}
                <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:18,padding:20 }}>
                  <div style={{ color:'#22d3ee',fontSize:12,fontWeight:600,letterSpacing:2,textTransform:'uppercase',marginBottom:12 }}>Step 3 — Select Mentor (Optional)</div>
                  <select value={form.mentorId} onChange={e=>setForm({...form,mentorId:e.target.value})} className="custom-input">
                    <option value="">No mentor chahiye</option>
                    {mentors.map(m=>(
                      <option key={m._id} value={m._id}>{m.name} — {m.organization} ({m.expertise?.slice(0,2).join(', ')})</option>
                    ))}
                  </select>
                </div>

                {/* Step 4 — Message */}
                <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:18,padding:20 }}>
                  <div style={{ color:'#10b981',fontSize:12,fontWeight:600,letterSpacing:2,textTransform:'uppercase',marginBottom:12 }}>Step 4 — Message to Teacher (Optional)</div>
                  <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Teacher ko koi baat batana chahte ho? e.g. Project idea, special requirements..." className="custom-input" rows={3} style={{ resize:'vertical' }} />
                </div>

                <button type="submit" disabled={submitting||!form.projectId||!form.subjectId} className="btn-primary" style={{ opacity:(!form.projectId||!form.subjectId)?0.5:1 }}>
                  {submitting ? 'Sending Request...' : 'Send Request to Teacher →'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── REQUESTS TAB ── */}
        {activeTab==='requests' && (
          <div style={{ animation:'fadeUp 0.4s ease' }}>
            {myRequests.length===0 ? (
              <div style={{ textAlign:'center',padding:'60px',background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:24 }}>
                <div style={{ fontSize:48,opacity:0.2,marginBottom:12 }}>📋</div>
                <p style={{ color:'#475569',fontSize:15 }}>Koi request nahi bheji abhi.</p>
              </div>
            ) : (
              <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
                {myRequests.map((r,i)=>{
                  const st = STATUS_MAP[r.status]||STATUS_MAP.pending
                  return (
                    <div key={r._id} style={{ background:'rgba(15,23,42,0.9)',border:`1px solid ${r.status==='approved'?'rgba(16,185,129,0.2)':r.status==='rejected'?'rgba(239,68,68,0.15)':'rgba(255,255,255,0.06)'}`,borderRadius:18,padding:20,animation:`fadeUp 0.4s ease ${i*0.06}s both` }}>
                      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14 }}>
                        <h3 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:16,fontWeight:700,margin:0 }}>{r.project?.title}</h3>
                        <span style={{ background:st.bg,color:st.color,padding:'4px 14px',borderRadius:20,fontSize:12,fontWeight:600 }}>{st.label}</span>
                      </div>

                      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10 }}>
                        <div style={{ background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.12)',borderRadius:10,padding:'10px 12px' }}>
                          <div style={{ color:'#475569',fontSize:11,marginBottom:3 }}>SUBJECT</div>
                          <div style={{ color:'#f59e0b',fontSize:13,fontWeight:700 }}>{r.subject?.code}</div>
                          <div style={{ color:'#94a3b8',fontSize:12 }}>{r.subject?.name}</div>
                        </div>
                        <div style={{ background:'rgba(99,102,241,0.06)',border:'1px solid rgba(99,102,241,0.12)',borderRadius:10,padding:'10px 12px' }}>
                          <div style={{ color:'#475569',fontSize:11,marginBottom:3 }}>TEACHER</div>
                          <div style={{ color:'#818cf8',fontSize:13,fontWeight:600 }}>{r.teacher?.name}</div>
                          <div style={{ color:'#64748b',fontSize:12 }}>{r.teacher?.department}</div>
                        </div>
                      </div>

                      {r.teacherRemarks && (
                        <div style={{ background:r.status==='approved'?'rgba(16,185,129,0.06)':'rgba(239,68,68,0.06)',border:`1px solid ${r.status==='approved'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)'}`,borderRadius:10,padding:'8px 14px' }}>
                          <span style={{ color:r.status==='approved'?'#10b981':'#ef4444',fontSize:12 }}>
                            💬 Teacher: "{r.teacherRemarks}"
                          </span>
                        </div>
                      )}

                      <div style={{ marginTop:10,color:'#334155',fontSize:11 }}>
                        {new Date(r.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}