// frontend/src/pages/student/MyProjects.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import { submissionService } from '../../services/submissionService'
import toast from 'react-hot-toast'

const STATUS_MAP = {
  pending:       { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  label: '⏳ Pending' },
  approved:      { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  label: '✅ Approved' },
  'in-progress': { color: '#818cf8', bg: 'rgba(129,140,248,0.12)', label: '🔄 In Progress' },
  completed:     { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)',  label: '🏆 Completed' },
  rejected:      { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: '❌ Rejected' },
}

export default function MyProjects() {
  const navigate = useNavigate()
  const [projects, setProjects]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [submitFile, setSubmitFile] = useState(null)
  const [submitTitle, setSubmitTitle] = useState('')
  const [submitDesc, setSubmitDesc]   = useState('')

  const [form, setForm] = useState({
    title: '', description: '', category: 'Web Development',
    techStack: '', deadline: '',
  })

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects')
      setProjects(res.data.projects || [])
    } catch (err) {
      toast.error('Failed to load projects!')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description) return toast.error('Title and description are required!')
    setSubmitting(true)
    try {
      await API.post('/projects', {
        ...form,
        techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
      })
      toast.success('Project created successfully! 🎉')
      setShowForm(false)
      setForm({ title: '', description: '', category: 'Web Development', techStack: '', deadline: '' })
      fetchProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya!')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      await API.delete(`/projects/${id}`)
      toast.success('Project delete ho gaya.')
      fetchProjects()
    } catch (err) {
      toast.error('Delete nahi hua!')
    }
  }

  const handleSubmission = async (e) => {
    e.preventDefault()
    if (!submitTitle) return toast.error('Title zaroori hai!')
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', submitTitle)
      formData.append('description', submitDesc)
      formData.append('project', selectedProject._id)
      if (submitFile) formData.append('file', submitFile)

      await submissionService.create(formData)
      toast.success('Submission ho gayi! 🎉')
      setShowSubmitForm(false)
      setSubmitTitle('')
      setSubmitDesc('')
      setSubmitFile(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed!')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight:'100vh',background:'#070b14',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:40,height:40,border:'3px solid rgba(99,102,241,0.2)',borderTop:'3px solid #6366f1',borderRadius:'50%',animation:'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ minHeight:'100vh',background:'#070b14',fontFamily:"'DM Sans',sans-serif",overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .proj-card:hover{border-color:rgba(99,102,241,0.3) !important;transform:translateY(-2px);}
        .btn-del:hover{background:rgba(239,68,68,0.2) !important;}
        .btn-sub:hover{background:rgba(16,185,129,0.2) !important;}
      `}</style>

      <div style={{ maxWidth:1000,margin:'0 auto',padding:'32px 24px' }}>

        {/* Header */}
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32,animation:'fadeUp 0.4s ease' }}>
          <div>
            <button onClick={()=>navigate('/student/dashboard')} style={{ background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:13,marginBottom:8,display:'block',padding:0 }}>← Back to Dashboard</button>
            <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:700,color:'#f1f5f9',margin:0,letterSpacing:'-1px' }}>📁 My Projects</h1>
            <p style={{ color:'#475569',fontSize:13,marginTop:4 }}>{projects.length} project{projects.length!==1?'s':''} total</p>
          </div>
          <button onClick={()=>setShowForm(!showForm)} style={{ background:'linear-gradient(135deg,#6366f1,#818cf8)',border:'none',borderRadius:12,padding:'10px 22px',color:'white',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:14,boxShadow:'0 0 20px rgba(99,102,241,0.4)',transition:'all 0.2s' }}>
            + New Project
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div style={{ background:'rgba(15,23,42,0.95)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:20,padding:28,marginBottom:24,animation:'fadeUp 0.3s ease' }}>
            <h2 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',marginBottom:20,fontSize:18,margin:'0 0 20px' }}>✨ Create New Project</h2>
            <form onSubmit={handleCreate} style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <div>
                <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Project Title *</label>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Library Management System" className="custom-input" />
              </div>
              <div>
                <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Description *</label>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Project ke baare mein detail mein likho..." className="custom-input" rows={3} style={{ resize:'vertical' }} />
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
                <div>
                  <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Category</label>
                  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="custom-input">
                    <option>Web Development</option>
                    <option>Mobile App</option>
                    <option>ML/AI</option>
                    <option>IoT</option>
                    <option>Cybersecurity</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Deadline</label>
                  <input type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} className="custom-input" />
                </div>
              </div>
              <div>
                <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Tech Stack (comma separated)</label>
                <input value={form.techStack} onChange={e=>setForm({...form,techStack:e.target.value})} placeholder="React, Node.js, MongoDB" className="custom-input" />
              </div>
              <div style={{ display:'flex',gap:10,marginTop:4 }}>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ flex:1 }}>
                  {submitting ? 'Creating...' : 'Create Project →'}
                </button>
                <button type="button" onClick={()=>setShowForm(false)} style={{ flex:1,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#94a3b8',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:14 }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Submission Form */}
        {showSubmitForm && selectedProject && (
          <div style={{ background:'rgba(15,23,42,0.95)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:20,padding:28,marginBottom:24,animation:'fadeUp 0.3s ease' }}>
            <h2 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:18,margin:'0 0 6px' }}>📤 Submit Work</h2>
            <p style={{ color:'#475569',fontSize:13,margin:'0 0 20px' }}>For: {selectedProject.title}</p>
            <form onSubmit={handleSubmission} style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <div>
                <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Submission Title *</label>
                <input value={submitTitle} onChange={e=>setSubmitTitle(e.target.value)} placeholder="e.g. Final Report v2" className="custom-input" />
              </div>
              <div>
                <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Description</label>
                <textarea value={submitDesc} onChange={e=>setSubmitDesc(e.target.value)} placeholder="Kya submit kar rahe ho?" className="custom-input" rows={2} style={{ resize:'vertical' }} />
              </div>
              <div>
                <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>File Upload (optional)</label>
                <input type="file" onChange={e=>setSubmitFile(e.target.files[0])} style={{ background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'10px 14px',color:'#94a3b8',width:'100%',cursor:'pointer' }} />
                {submitFile && <p style={{ color:'#10b981',fontSize:12,marginTop:6 }}>✅ {submitFile.name} selected</p>}
              </div>
              <div style={{ display:'flex',gap:10 }}>
                <button type="submit" disabled={submitting} style={{ flex:1,background:'linear-gradient(135deg,#10b981,#059669)',border:'none',borderRadius:10,padding:'12px',color:'white',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14 }}>
                  {submitting ? 'Submitting...' : 'Submit Work →'}
                </button>
                <button type="button" onClick={()=>setShowSubmitForm(false)} style={{ flex:1,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#94a3b8',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600 }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        {projects.length===0 ? (
          <div style={{ textAlign:'center',padding:'80px 0',animation:'fadeUp 0.4s ease' }}>
            <div style={{ fontSize:56,marginBottom:16,opacity:0.3 }}>📁</div>
            <p style={{ color:'#475569',fontSize:16,marginBottom:8 }}>No projects yet.</p>
            <p style={{ color:'#334155',fontSize:13 }}>Click "New Project" above to get started!</p>
          </div>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
            {projects.map((p,i)=>{
              const st = STATUS_MAP[p.status]||STATUS_MAP.pending
              return (
                <div key={p._id} className="proj-card" style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:24,transition:'all 0.25s',animation:`fadeUp 0.4s ease ${i*0.08}s both` }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:6 }}>
                        <h3 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:18,fontWeight:700,margin:0 }}>{p.title}</h3>
                        <span style={{ background:st.bg,color:st.color,padding:'3px 12px',borderRadius:20,fontSize:12,fontWeight:600,flexShrink:0 }}>{st.label}</span>
                      </div>
                      <p style={{ color:'#64748b',fontSize:13,margin:0,lineHeight:1.5 }}>{p.description}</p>
                    </div>
                    <div style={{ display:'flex',gap:8,marginLeft:16,flexShrink:0 }}>
                      <button onClick={()=>{setSelectedProject(p);setShowSubmitForm(true);setShowForm(false)}} className="btn-sub" style={{ background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:10,padding:'7px 14px',color:'#10b981',cursor:'pointer',fontSize:12,fontWeight:600,transition:'all 0.2s' }}>📤 Submit</button>
                      <button onClick={()=>handleDelete(p._id)} className="btn-del" style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:10,padding:'7px 14px',color:'#ef4444',cursor:'pointer',fontSize:12,fontWeight:600,transition:'all 0.2s' }}>🗑️ Delete</button>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  {p.techStack?.length>0 && (
                    <div style={{ display:'flex',gap:6,flexWrap:'wrap',marginBottom:14 }}>
                      {p.techStack.map(t=>(
                        <span key={t} style={{ background:'rgba(99,102,241,0.1)',color:'#818cf8',padding:'3px 10px',borderRadius:20,fontSize:12 }}>{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div>
                    <div style={{ display:'flex',justifyContent:'space-between',marginBottom:6 }}>
                      <span style={{ color:'#475569',fontSize:12 }}>Progress</span>
                      <span style={{ color:'#818cf8',fontSize:12,fontWeight:600 }}>{p.progress}%</span>
                    </div>
                    <div style={{ background:'rgba(255,255,255,0.06)',borderRadius:99,height:6 }}>
                      <div style={{ background:'linear-gradient(135deg,#6366f1,#22d3ee)',borderRadius:99,height:'100%',width:`${p.progress}%`,transition:'width 0.5s ease' }} />
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div style={{ display:'flex',gap:16,marginTop:14,flexWrap:'wrap' }}>
                    {p.category && <span style={{ color:'#475569',fontSize:12 }}>📂 {p.category}</span>}
                    {p.deadline && <span style={{ color:'#475569',fontSize:12 }}>📅 Deadline: {new Date(p.deadline).toLocaleDateString('en-IN')}</span>}
                    {p.mentor && <span style={{ color:'#22d3ee',fontSize:12 }}>🧑‍💼 Mentor: {p.mentor.name}</span>}
                    {p.grade && <span style={{ color:'#10b981',fontSize:12,fontWeight:700 }}>⭐ Grade: {p.grade}</span>}
                  </div>

                  {/* Grade Remarks */}
                  {p.gradeRemarks && (
                    <div style={{ marginTop:12,background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.15)',borderRadius:10,padding:'10px 14px' }}>
                      <span style={{ color:'#10b981',fontSize:13 }}>💬 {p.gradeRemarks}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}