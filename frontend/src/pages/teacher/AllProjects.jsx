// frontend/src/pages/teacher/AllProjects.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

const STATUS_MAP = {
  pending:       { color:'#f59e0b', bg:'rgba(245,158,11,0.12)',  label:'⏳ Pending' },
  approved:      { color:'#10b981', bg:'rgba(16,185,129,0.12)',  label:'✅ Approved' },
  'in-progress': { color:'#818cf8', bg:'rgba(129,140,248,0.12)', label:'🔄 In Progress' },
  completed:     { color:'#22d3ee', bg:'rgba(34,211,238,0.12)',  label:'🏆 Completed' },
  rejected:      { color:'#ef4444', bg:'rgba(239,68,68,0.12)',   label:'❌ Rejected' },
}

export default function AllProjects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')
  const [approving, setApproving] = useState(null)
  const [remarks, setRemarks]     = useState('')

  useEffect(() => { fetchProjects() }, [])

  useEffect(() => {
    let list = projects
    if (filter !== 'all') list = list.filter(p => p.status === filter)
    if (search) list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.createdBy?.name?.toLowerCase().includes(search.toLowerCase()))
    setFiltered(list)
  }, [projects, filter, search])

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects')
      setProjects(res.data.projects || [])
    } catch {
      toast.error('Projects load nahi hue!')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (projectId, status) => {
    try {
      await API.put(`/projects/${projectId}/approve`, { status, remarks })
      toast.success(`Project ${status}! ✅`)
      setApproving(null)
      setRemarks('')
      fetchProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya!')
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
        .proj-card:hover{border-color:rgba(99,102,241,0.25) !important;}
        .filter-btn:hover{background:rgba(255,255,255,0.06) !important;}
      `}</style>

      <div style={{ maxWidth:1100,margin:'0 auto',padding:'32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:28,animation:'fadeUp 0.4s ease' }}>
          <button onClick={()=>navigate('/teacher/dashboard')} style={{ background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:13,marginBottom:8,display:'block',padding:0 }}>← Back to Dashboard</button>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12 }}>
            <div>
              <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:800,color:'#f1f5f9',margin:0,letterSpacing:'-1px' }}>📁 All Projects</h1>
              <p style={{ color:'#475569',fontSize:13,marginTop:4 }}>{filtered.length} of {projects.length} projects</p>
            </div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search projects or students..." className="custom-input" style={{ width:280 }} />
          </div>
        </div>

        {/* Filters */}
        <div style={{ display:'flex',gap:8,marginBottom:24,flexWrap:'wrap',animation:'fadeUp 0.4s ease 0.1s both' }}>
          {['all','pending','approved','in-progress','completed','rejected'].map(f=>(
            <button key={f} className="filter-btn" onClick={()=>setFilter(f)} style={{ background:filter===f?'rgba(99,102,241,0.2)':'rgba(255,255,255,0.03)',border:`1px solid ${filter===f?'rgba(99,102,241,0.4)':'rgba(255,255,255,0.07)'}`,borderRadius:20,padding:'6px 16px',color:filter===f?'#818cf8':'#64748b',cursor:'pointer',fontSize:13,fontWeight:filter===f?600:400,transition:'all 0.2s',textTransform:'capitalize' }}>
              {f==='all'?`All (${projects.length})`:f}
            </button>
          ))}
        </div>

        {/* Projects */}
        {filtered.length===0 ? (
          <div style={{ textAlign:'center',padding:'60px 0',color:'#475569' }}>
            <div style={{ fontSize:48,marginBottom:12,opacity:0.2 }}>📁</div>
            <p>Koi project nahi mila.</p>
          </div>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
            {filtered.map((p,i)=>{
              const st = STATUS_MAP[p.status]||STATUS_MAP.pending
              return (
                <div key={p._id} className="proj-card" style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:24,transition:'border 0.2s',animation:`fadeUp 0.4s ease ${i*0.05}s both` }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:6,flexWrap:'wrap' }}>
                        <h3 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:17,fontWeight:700,margin:0 }}>{p.title}</h3>
                        <span style={{ background:st.bg,color:st.color,padding:'3px 12px',borderRadius:20,fontSize:12,fontWeight:600 }}>{st.label}</span>
                      </div>
                      <p style={{ color:'#64748b',fontSize:13,margin:0,lineHeight:1.5 }}>{p.description?.slice(0,120)}{p.description?.length>120?'...':''}</p>
                    </div>
                    {p.status==='pending' && (
                      <div style={{ display:'flex',gap:8,marginLeft:16,flexShrink:0 }}>
                        <button onClick={()=>handleApprove(p._id,'approved')} style={{ background:'rgba(16,185,129,0.12)',border:'1px solid rgba(16,185,129,0.25)',borderRadius:10,padding:'7px 14px',color:'#10b981',cursor:'pointer',fontSize:12,fontWeight:600 }}>✅ Approve</button>
                        <button onClick={()=>setApproving(approving===p._id?null:p._id)} style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:10,padding:'7px 14px',color:'#ef4444',cursor:'pointer',fontSize:12,fontWeight:600 }}>❌ Reject</button>
                      </div>
                    )}
                  </div>

                  {/* Reject with remarks */}
                  {approving===p._id && (
                    <div style={{ background:'rgba(239,68,68,0.05)',border:'1px solid rgba(239,68,68,0.15)',borderRadius:12,padding:14,marginBottom:12 }}>
                      <input value={remarks} onChange={e=>setRemarks(e.target.value)} placeholder="Rejection reason likho..." className="custom-input" style={{ marginBottom:10 }} />
                      <button onClick={()=>handleApprove(p._id,'rejected')} style={{ background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:'8px 20px',color:'#ef4444',cursor:'pointer',fontWeight:600,fontSize:13 }}>Confirm Reject</button>
                    </div>
                  )}

                  <div style={{ display:'flex',gap:16,flexWrap:'wrap' }}>
                    <span style={{ color:'#475569',fontSize:12 }}>👤 {p.createdBy?.name||'Unknown'}</span>
                    {p.category && <span style={{ color:'#475569',fontSize:12 }}>📂 {p.category}</span>}
                    {p.deadline && <span style={{ color:'#475569',fontSize:12 }}>📅 {new Date(p.deadline).toLocaleDateString('en-IN')}</span>}
                    {p.techStack?.length>0 && <span style={{ color:'#475569',fontSize:12 }}>🔧 {p.techStack.join(', ')}</span>}
                    {p.grade && <span style={{ color:'#10b981',fontSize:12,fontWeight:700 }}>⭐ Grade: {p.grade}</span>}
                  </div>

                  {/* Progress */}
                  <div style={{ marginTop:14 }}>
                    <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                      <span style={{ color:'#334155',fontSize:11 }}>Progress</span>
                      <span style={{ color:'#475569',fontSize:11 }}>{p.progress}%</span>
                    </div>
                    <div style={{ background:'rgba(255,255,255,0.05)',borderRadius:99,height:4 }}>
                      <div style={{ background:'linear-gradient(135deg,#6366f1,#22d3ee)',borderRadius:99,height:'100%',width:`${p.progress}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}