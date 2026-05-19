// frontend/src/pages/mentor/AssignedStudents.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

export default function AssignedStudents() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(true)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [stuRes, projRes] = await Promise.all([
        API.get('/mentor/students'),
        API.get('/projects'),
      ])
      setStudents(stuRes.data.students || [])
      setProjects(projRes.data.projects || [])
    } catch (err) {
      toast.error('Data load nahi hua!')
    } finally {
      setLoading(false)
    }
  }

  const handleFeedback = async (e) => {
    e.preventDefault()
    if (!feedback || !selectedProject) return toast.error('Feedback aur project select karo!')
    setSubmitting(true)
    try {
      await API.post('/mentor/feedback', { projectId: selectedProject, feedback })
      toast.success('Feedback de diya! 🎉')
      setShowFeedback(false)
      setFeedback('')
      setSelectedProject('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya!')
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
    <div style={{ minHeight:'100vh',background:'#070b14',fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .stu-card:hover{border-color:rgba(99,102,241,0.3) !important;transform:translateY(-2px);}
      `}</style>

      <div style={{ maxWidth:900,margin:'0 auto',padding:'32px 24px' }}>

        <div style={{ marginBottom:32,animation:'fadeUp 0.4s ease' }}>
          <button onClick={()=>navigate('/mentor/dashboard')} style={{ background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:13,marginBottom:8,display:'block',padding:0 }}>← Back to Dashboard</button>
          <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:800,color:'#f1f5f9',margin:0,letterSpacing:'-1px' }}>👨‍🎓 Assigned Students</h1>
          <p style={{ color:'#475569',fontSize:13,marginTop:4 }}>{students.length} student{students.length!==1?'s':''} assigned</p>
        </div>

        {/* Feedback Form */}
        {showFeedback && selectedStudent && (
          <div style={{ background:'rgba(15,23,42,0.95)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:20,padding:28,marginBottom:24,animation:'fadeUp 0.3s ease' }}>
            <h2 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:18,margin:'0 0 6px' }}>💬 Give Feedback</h2>
            <p style={{ color:'#475569',fontSize:13,margin:'0 0 20px' }}>To: {selectedStudent.name}</p>
            <form onSubmit={handleFeedback} style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <div>
                <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Select Project *</label>
                <select value={selectedProject} onChange={e=>setSelectedProject(e.target.value)} className="custom-input">
                  <option value="">Project select karo</option>
                  {projects.map(p=>(
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Feedback *</label>
                <textarea value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Apna feedback yahan likho..." className="custom-input" rows={4} style={{ resize:'vertical' }} />
              </div>
              <div style={{ display:'flex',gap:10 }}>
                <button type="submit" disabled={submitting} style={{ flex:1,background:'linear-gradient(135deg,#6366f1,#818cf8)',border:'none',borderRadius:10,padding:'12px',color:'white',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14 }}>
                  {submitting?'Sending...':'Send Feedback →'}
                </button>
                <button type="button" onClick={()=>setShowFeedback(false)} style={{ flex:1,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#94a3b8',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600 }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Students List */}
        {students.length===0 ? (
          <div style={{ textAlign:'center',padding:'80px 0',background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:24 }}>
            <div style={{ fontSize:56,marginBottom:16,opacity:0.3 }}>👨‍🎓</div>
            <p style={{ color:'#475569',fontSize:16 }}>Koi student assign nahi hua abhi.</p>
            <p style={{ color:'#334155',fontSize:13,marginTop:8 }}>Teacher aapko students assign karega.</p>
          </div>
        ) : (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16 }}>
            {students.map((s,i)=>(
              <div key={s._id} className="stu-card" style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:24,transition:'all 0.25s',animation:`fadeUp 0.4s ease ${i*0.08}s both` }}>
                <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:16 }}>
                  <div style={{ width:48,height:48,background:'linear-gradient(135deg,#6366f1,#22d3ee)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:800,fontSize:18,flexShrink:0 }}>
                    {s.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color:'#f1f5f9',fontSize:15,fontWeight:700,fontFamily:'Syne,sans-serif' }}>{s.name}</div>
                    <div style={{ color:'#475569',fontSize:12,marginTop:2 }}>{s.email}</div>
                  </div>
                </div>
                <div style={{ display:'flex',gap:8,marginBottom:16,flexWrap:'wrap' }}>
                  {s.branch && <span style={{ background:'rgba(255,255,255,0.05)',color:'#94a3b8',padding:'3px 10px',borderRadius:20,fontSize:12 }}>🏫 {s.branch}</span>}
                  {s.semester && <span style={{ background:'rgba(255,255,255,0.05)',color:'#94a3b8',padding:'3px 10px',borderRadius:20,fontSize:12 }}>📚 Sem {s.semester}</span>}
                </div>
                <div style={{ display:'flex',gap:8 }}>
                  <button onClick={()=>{setSelectedStudent(s);setShowFeedback(true)}} style={{ flex:1,background:'rgba(99,102,241,0.12)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:10,padding:'8px',color:'#818cf8',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:'Syne,sans-serif' }}>
                    💬 Feedback
                  </button>
                  <button onClick={()=>navigate('/mentor/meetings')} style={{ flex:1,background:'rgba(34,211,238,0.1)',border:'1px solid rgba(34,211,238,0.2)',borderRadius:10,padding:'8px',color:'#22d3ee',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:'Syne,sans-serif' }}>
                    📅 Meeting
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}