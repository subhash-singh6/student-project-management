// frontend/src/pages/teacher/GiveGrades.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

const GRADES = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F']

const GRADE_COLORS = {
  'A+': { color:'#10b981', bg:'rgba(16,185,129,0.15)' },
  'A':  { color:'#10b981', bg:'rgba(16,185,129,0.12)' },
  'B+': { color:'#6366f1', bg:'rgba(99,102,241,0.15)' },
  'B':  { color:'#818cf8', bg:'rgba(129,140,248,0.12)' },
  'C':  { color:'#f59e0b', bg:'rgba(245,158,11,0.12)' },
  'D':  { color:'#f97316', bg:'rgba(249,115,22,0.12)' },
  'F':  { color:'#ef4444', bg:'rgba(239,68,68,0.12)' },
}

export default function GiveGrades() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [grading, setGrading]   = useState(null)
  const [selectedGrade, setSelectedGrade] = useState('')
  const [gradeRemarks, setGradeRemarks]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState('approved')

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects')
      setProjects(res.data.projects || [])
    } catch {
      toast.error('Failed to load projects!')
    } finally {
      setLoading(false)
    }
  }

  const handleGrade = async (projectId) => {
    if (!selectedGrade) return toast.error('Please select a grade!')
    setSubmitting(true)
    try {
      await API.put(`/projects/${projectId}/grade`, {
        grade: selectedGrade,
        gradeRemarks,
      })
      toast.success(`Grade ${selectedGrade} assigned successfully! ⭐`)
      setGrading(null)
      setSelectedGrade('')
      setGradeRemarks('')
      fetchProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred!')
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = filter === 'graded'
    ? projects.filter(p => p.grade)
    : projects.filter(p => p.status === 'approved' && !p.grade)

  if (loading) return (
    <div style={{ minHeight:'100vh',background:'#070b14',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:40,height:40,border:'3px solid rgba(245,158,11,0.2)',borderTop:'3px solid #f59e0b',borderRadius:'50%',animation:'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ minHeight:'100vh',background:'#070b14',fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .grade-btn:hover{transform:scale(1.08) !important;}
        .proj-card:hover{border-color:rgba(245,158,11,0.25) !important;}
      `}</style>

      <div style={{ maxWidth:1000,margin:'0 auto',padding:'32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:28,animation:'fadeUp 0.4s ease' }}>
          <button onClick={()=>navigate('/teacher/dashboard')} style={{ background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:13,marginBottom:8,display:'block',padding:0 }}>← Back to Dashboard</button>
          <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:800,color:'#f1f5f9',margin:0,letterSpacing:'-1px' }}>⭐ Assign Grades</h1>
          <p style={{ color:'#475569',fontSize:13,marginTop:4 }}>Evaluate and grade approved projects</p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display:'flex',gap:8,marginBottom:24,animation:'fadeUp 0.4s ease 0.1s both' }}>
          {[
            { key:'approved', label:`Pending (${projects.filter(p=>p.status==='approved'&&!p.grade).length})` },
            { key:'graded',   label:`Graded (${projects.filter(p=>p.grade).length})` },
          ].map(tab=>(
            <button key={tab.key} onClick={()=>setFilter(tab.key)} style={{ background:filter===tab.key?'rgba(245,158,11,0.15)':'rgba(255,255,255,0.03)',border:`1px solid ${filter===tab.key?'rgba(245,158,11,0.35)':'rgba(255,255,255,0.07)'}`,borderRadius:20,padding:'7px 18px',color:filter===tab.key?'#f59e0b':'#64748b',cursor:'pointer',fontSize:13,fontWeight:filter===tab.key?600:400,transition:'all 0.2s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects */}
        {filtered.length===0 ? (
          <div style={{ textAlign:'center',padding:'60px 0',background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:24 }}>
            <div style={{ fontSize:48,marginBottom:12,opacity:0.2 }}>⭐</div>
            <p style={{ color:'#475569',fontSize:15 }}>
              {filter==='approved' ? 'All projects have been graded!' : 'No projects graded yet.'}
            </p>
          </div>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
            {filtered.map((p,i)=>{
              const gc = p.grade ? GRADE_COLORS[p.grade]||GRADE_COLORS['C'] : null
              return (
                <div key={p._id} className="proj-card" style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:24,transition:'border 0.2s',animation:`fadeUp 0.4s ease ${i*0.06}s both` }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12 }}>
                    <div>
                      <h3 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:17,fontWeight:700,margin:'0 0 4px' }}>{p.title}</h3>
                      <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
                        <span style={{ color:'#64748b',fontSize:12 }}>👤 {p.createdBy?.name}</span>
                        {p.category && <span style={{ color:'#64748b',fontSize:12 }}>📂 {p.category}</span>}
                      </div>
                    </div>
                    <div style={{ display:'flex',gap:10,alignItems:'center' }}>
                      {p.grade && (
                        <div style={{ background:gc.bg,border:`1px solid ${gc.color}30`,borderRadius:14,padding:'6px 18px',textAlign:'center' }}>
                          <div style={{ color:gc.color,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:22 }}>{p.grade}</div>
                        </div>
                      )}
                      {!p.grade && (
                        <button onClick={()=>setGrading(grading===p._id?null:p._id)} style={{ background:'linear-gradient(135deg,#f59e0b,#f97316)',border:'none',borderRadius:10,padding:'8px 18px',color:'white',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13 }}>
                          ⭐ Grade Now
                        </button>
                      )}
                    </div>
                  </div>

                  {p.gradeRemarks && (
                    <div style={{ background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.12)',borderRadius:10,padding:'8px 14px',marginBottom:12 }}>
                      <span style={{ color:'#10b981',fontSize:12 }}>💬 {p.gradeRemarks}</span>
                    </div>
                  )}

                  {/* Grade Form */}
                  {grading===p._id && (
                    <div style={{ background:'rgba(245,158,11,0.05)',border:'1px solid rgba(245,158,11,0.15)',borderRadius:14,padding:18,marginTop:8 }}>
                      <p style={{ color:'#94a3b8',fontSize:13,marginBottom:14 }}>Grade select karo:</p>

                      {/* Grade Buttons */}
                      <div style={{ display:'flex',gap:8,flexWrap:'wrap',marginBottom:16 }}>
                        {GRADES.map(g=>{
                          const gc2 = GRADE_COLORS[g]
                          return (
                            <button key={g} className="grade-btn" onClick={()=>setSelectedGrade(g)} style={{ background:selectedGrade===g?gc2.bg:'rgba(255,255,255,0.04)',border:`2px solid ${selectedGrade===g?gc2.color:'rgba(255,255,255,0.08)'}`,borderRadius:12,padding:'10px 16px',color:selectedGrade===g?gc2.color:'#64748b',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:16,transition:'all 0.15s',minWidth:52 }}>
                              {g}
                            </button>
                          )
                        })}
                      </div>

                      <div style={{ marginBottom:14 }}>
                        <label style={{ fontSize:12,color:'#475569',marginBottom:6,display:'block',textTransform:'uppercase',letterSpacing:1 }}>Remarks (optional)</label>
                        <input value={gradeRemarks} onChange={e=>setGradeRemarks(e.target.value)} placeholder="Add a comment..." className="custom-input" />
                      </div>

                      <div style={{ display:'flex',gap:10 }}>
                        <button onClick={()=>handleGrade(p._id)} disabled={submitting||!selectedGrade} style={{ flex:1,background:'linear-gradient(135deg,#f59e0b,#f97316)',border:'none',borderRadius:10,padding:'11px',color:'white',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14 }}>
                          {submitting?'Saving...':'Submit Grade →'}
                        </button>
                        <button onClick={()=>{setGrading(null);setSelectedGrade('');setGradeRemarks('')}} style={{ background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'11px 18px',color:'#94a3b8',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600 }}>Cancel</button>
                      </div>
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