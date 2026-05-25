// frontend/src/pages/admin/AdminPanel.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../constants/context/AuthContext'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'

export default function AdminPanel() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers]         = useState([])
  const [projects, setProjects]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    // Sirf teacher admin panel dekh sakta hai
    if (user?.role !== 'teacher') {
      toast.error('Access denied!')
      navigate('/')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await adminService.overview()
      setProjects(res.data.recentProjects || [])
      setUsers(res.data.users || [])
    } catch {
      toast.error('Data load nahi hua!')
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    totalProjects:  projects.length,
    pending:        projects.filter(p => p.status === 'pending').length,
    approved:       projects.filter(p => p.status === 'approved').length,
    completed:      projects.filter(p => p.status === 'completed').length,
    rejected:       projects.filter(p => p.status === 'rejected').length,
    graded:         projects.filter(p => p.grade).length,
  }

  // Unique students from projects
  const studentMap = {}
  projects.forEach(p => {
    const id = p.createdBy?._id
    if (id && !studentMap[id]) {
      studentMap[id] = {
        ...p.createdBy,
        projectCount: 0,
        completedCount: 0,
        avgGrade: [],
      }
    }
    if (id) {
      studentMap[id].projectCount++
      if (p.status === 'completed') studentMap[id].completedCount++
      if (p.grade) studentMap[id].avgGrade.push(p.grade)
    }
  })
  const students = Object.values(studentMap)

  const filteredProjects = projects.filter(p => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.createdBy?.name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = roleFilter === 'all' || p.status === roleFilter
    return matchSearch && matchStatus
  })

  const STATUS_MAP = {
    pending:       { color:'#f59e0b', bg:'rgba(245,158,11,0.12)',  label:'Pending' },
    approved:      { color:'#10b981', bg:'rgba(16,185,129,0.12)',  label:'Approved' },
    'in-progress': { color:'#818cf8', bg:'rgba(129,140,248,0.12)', label:'In Progress' },
    completed:     { color:'#22d3ee', bg:'rgba(34,211,238,0.12)',  label:'Completed' },
    rejected:      { color:'#ef4444', bg:'rgba(239,68,68,0.12)',   label:'Rejected' },
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
        .row:hover{background:rgba(255,255,255,0.03) !important;}
        .tab:hover{background:rgba(255,255,255,0.04) !important;}
      `}</style>

      <div style={{ maxWidth:1200,margin:'0 auto',padding:'32px 24px' }}>

        {/* Header */}
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32,animation:'fadeUp 0.4s ease' }}>
          <div>
            <button onClick={()=>navigate('/teacher/dashboard')} style={{ background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:13,marginBottom:8,display:'block',padding:0 }}>← Dashboard</button>
            <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:800,color:'#f1f5f9',margin:0 }}>⚙️ Admin Panel</h1>
            <p style={{ color:'#475569',fontSize:13,marginTop:4 }}>System management & overview</p>
          </div>
          <div style={{ display:'flex',gap:10,alignItems:'center' }}>
            <div style={{ background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'8px 16px',color:'#64748b',fontSize:12 }}>
              👤 {user?.name}
            </div>
            <button onClick={()=>{logout();navigate('/login')}} style={{ background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',color:'#ef4444',borderRadius:12,padding:'8px 16px',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:13 }}>Logout</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:12,marginBottom:28,animation:'fadeUp 0.4s ease 0.1s both' }}>
          {[
            { label:'Total',     value:stats.totalProjects, color:'#6366f1', bg:'rgba(99,102,241,0.1)',  icon:'📁' },
            { label:'Pending',   value:stats.pending,       color:'#f59e0b', bg:'rgba(245,158,11,0.1)', icon:'⏳' },
            { label:'Approved',  value:stats.approved,      color:'#10b981', bg:'rgba(16,185,129,0.1)', icon:'✅' },
            { label:'Completed', value:stats.completed,     color:'#22d3ee', bg:'rgba(34,211,238,0.1)', icon:'🏆' },
            { label:'Rejected',  value:stats.rejected,      color:'#ef4444', bg:'rgba(239,68,68,0.1)',  icon:'❌' },
            { label:'Graded',    value:stats.graded,        color:'#a78bfa', bg:'rgba(167,139,250,0.1)',icon:'⭐' },
          ].map(s=>(
            <div key={s.label} style={{ background:s.bg,border:`1px solid ${s.color}30`,borderRadius:14,padding:'16px 14px',textAlign:'center' }}>
              <div style={{ fontSize:20,marginBottom:6 }}>{s.icon}</div>
              <div style={{ fontSize:22,fontWeight:800,color:s.color,fontFamily:'Syne,sans-serif' }}>{s.value}</div>
              <div style={{ color:'#475569',fontSize:11,marginTop:3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex',gap:4,marginBottom:20,background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:14,padding:6,animation:'fadeUp 0.4s ease 0.15s both' }}>
          {[
            { key:'overview',  label:'📊 Overview' },
            { key:'projects',  label:'📁 All Projects' },
            { key:'students',  label:'🎓 Students' },
          ].map(tab=>(
            <button key={tab.key} className="tab" onClick={()=>setActiveTab(tab.key)} style={{ flex:1,background:activeTab===tab.key?'rgba(99,102,241,0.2)':'transparent',border:`1px solid ${activeTab===tab.key?'rgba(99,102,241,0.3)':'transparent'}`,borderRadius:10,padding:'10px',color:activeTab===tab.key?'#818cf8':'#64748b',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:13,transition:'all 0.2s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab==='overview' && (
          <div style={{ animation:'fadeUp 0.4s ease' }}>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:20 }}>

              {/* Recent Projects */}
              <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:24 }}>
                <h3 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:16,margin:'0 0 16px' }}>📁 Recent Projects</h3>
                {projects.slice(0,6).map(p=>{
                  const st = STATUS_MAP[p.status]||STATUS_MAP.pending
                  return (
                    <div key={p._id} className="row" style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',transition:'background 0.2s' }}>
                      <div>
                        <div style={{ color:'#e2e8f0',fontSize:13,fontWeight:600 }}>{p.title}</div>
                        <div style={{ color:'#475569',fontSize:11,marginTop:2 }}>{p.createdBy?.name}</div>
                      </div>
                      <span style={{ background:st.bg,color:st.color,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:600 }}>{st.label}</span>
                    </div>
                  )
                })}
              </div>

              {/* Student Summary */}
              <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:24 }}>
                <h3 style={{ fontFamily:'Syne,sans-serif',color:'#f1f5f9',fontSize:16,margin:'0 0 16px' }}>🎓 Student Summary</h3>
                {students.slice(0,6).map(s=>(
                  <div key={s._id} className="row" style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',transition:'background 0.2s' }}>
                    <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                      <div style={{ width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#22d3ee)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:12,fontWeight:700 }}>
                        {s.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ color:'#e2e8f0',fontSize:13,fontWeight:600 }}>{s.name}</div>
                        <div style={{ color:'#475569',fontSize:11 }}>{s.branch} • Sem {s.semester}</div>
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ color:'#6366f1',fontSize:13,fontWeight:600 }}>{s.projectCount} projects</div>
                      <div style={{ color:'#10b981',fontSize:11 }}>{s.completedCount} done</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab==='projects' && (
          <div style={{ animation:'fadeUp 0.4s ease' }}>
            {/* Search + Filter */}
            <div style={{ display:'flex',gap:10,marginBottom:16,flexWrap:'wrap' }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search projects..." style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'9px 14px',color:'#f1f5f9',fontSize:13,outline:'none',flex:1,minWidth:200 }} />
              <div style={{ display:'flex',gap:6 }}>
                {['all','pending','approved','completed','rejected'].map(f=>(
                  <button key={f} onClick={()=>setRoleFilter(f)} style={{ background:roleFilter===f?'rgba(99,102,241,0.2)':'rgba(255,255,255,0.03)',border:`1px solid ${roleFilter===f?'rgba(99,102,241,0.4)':'rgba(255,255,255,0.07)'}`,borderRadius:20,padding:'6px 14px',color:roleFilter===f?'#818cf8':'#64748b',cursor:'pointer',fontSize:12,fontWeight:roleFilter===f?600:400,textTransform:'capitalize',transition:'all 0.2s' }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,overflow:'hidden' }}>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 150px 100px 80px 80px',padding:'12px 20px',borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                {['Project','Student','Category','Status','Grade'].map(h=>(
                  <span key={h} style={{ color:'#334155',fontSize:11,fontWeight:600,letterSpacing:1 }}>{h}</span>
                ))}
              </div>
              {filteredProjects.length===0 ? (
                <div style={{ textAlign:'center',padding:'48px',color:'#334155' }}>No projects found</div>
              ) : filteredProjects.map(p=>{
                const st = STATUS_MAP[p.status]||STATUS_MAP.pending
                return (
                  <div key={p._id} className="row" style={{ display:'grid',gridTemplateColumns:'1fr 150px 100px 80px 80px',padding:'14px 20px',borderBottom:'1px solid rgba(255,255,255,0.03)',transition:'background 0.2s',alignItems:'center' }}>
                    <div>
                      <div style={{ color:'#e2e8f0',fontSize:13,fontWeight:600 }}>{p.title}</div>
                      <div style={{ color:'#475569',fontSize:11,marginTop:2 }}>{p.techStack?.slice(0,2).join(', ')}</div>
                    </div>
                    <div style={{ color:'#64748b',fontSize:12 }}>{p.createdBy?.name}</div>
                    <div style={{ color:'#64748b',fontSize:12 }}>{p.category}</div>
                    <span style={{ background:st.bg,color:st.color,padding:'3px 8px',borderRadius:20,fontSize:11,fontWeight:600,display:'inline-block' }}>{st.label}</span>
                    <span style={{ color:p.grade?'#10b981':'#334155',fontSize:13,fontWeight:700 }}>{p.grade||'—'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab==='students' && (
          <div style={{ animation:'fadeUp 0.4s ease' }}>
            <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,overflow:'hidden' }}>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 100px 100px 80px 80px',padding:'12px 20px',borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                {['Student','Branch','Projects','Completed','Top Grade'].map(h=>(
                  <span key={h} style={{ color:'#334155',fontSize:11,fontWeight:600,letterSpacing:1 }}>{h}</span>
                ))}
              </div>
              {students.length===0 ? (
                <div style={{ textAlign:'center',padding:'48px',color:'#334155' }}>Koi student nahi abhi</div>
              ) : students.map((s,i)=>(
                <div key={s._id||i} className="row" style={{ display:'grid',gridTemplateColumns:'1fr 100px 100px 80px 80px',padding:'14px 20px',borderBottom:'1px solid rgba(255,255,255,0.03)',transition:'background 0.2s',alignItems:'center' }}>
                  <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                    <div style={{ width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#22d3ee)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:13,flexShrink:0 }}>
                      {s.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color:'#e2e8f0',fontSize:13,fontWeight:600 }}>{s.name}</div>
                      <div style={{ color:'#475569',fontSize:11 }}>{s.email}</div>
                    </div>
                  </div>
                  <div style={{ color:'#64748b',fontSize:12 }}>{s.branch||'—'} {s.semester?`• Sem ${s.semester}`:''}</div>
                  <div style={{ color:'#6366f1',fontSize:13,fontWeight:600 }}>{s.projectCount}</div>
                  <div style={{ color:'#10b981',fontSize:13,fontWeight:600 }}>{s.completedCount}</div>
                  <div style={{ color:'#f59e0b',fontSize:13,fontWeight:700 }}>{s.avgGrade.length>0?s.avgGrade[0]:'—'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}