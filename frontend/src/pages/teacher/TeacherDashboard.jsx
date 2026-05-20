// frontend/src/pages/teacher/TeacherDashboard.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

export default function TeacherDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, notifications: 0 })
  const [recentProjects, setRecentProjects] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    fetchData()
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchData = async () => {
    try {
      const [projRes, notifRes] = await Promise.all([
        API.get('/projects'),
        API.get('/notifications'),
      ])
      const projects = projRes.data.projects || []
      setStats({
        total:         projects.length,
        pending:       projects.filter(p => p.status === 'pending').length,
        approved:      projects.filter(p => p.status === 'approved').length,
        notifications: notifRes.data.unreadCount || 0,
      })
      setRecentProjects(projects.slice(0, 5))
      setNotifications(notifRes.data.notifications?.slice(0, 4) || [])
    } catch (e) {
      console.log(e.message)
    } finally {
      setLoading(false)
    }
  }

  const greeting = () => {
    const h = time.getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const STATUS_MAP = {
    pending:      { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',   label: 'Pending' },
    approved:     { color: '#10b981', bg: 'rgba(16,185,129,0.12)',   label: 'Approved' },
    'in-progress':{ color: '#818cf8', bg: 'rgba(129,140,248,0.12)',  label: 'In Progress' },
    completed:    { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)',   label: 'Completed' },
    rejected:     { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',    label: 'Rejected' },
  }

  const navItems = [
    { icon: '📁', label: 'All Projects',    sub: 'Review & approve', path: '/teacher/projects', color: '#6366f1', glow: 'rgba(99,102,241,0.3)' },
    { icon: '⭐', label: 'Give Grades',     sub: 'Grade submissions', path: '/teacher/grades',   color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
    { icon: '👥', label: 'All Teams',       sub: 'View teams',       path: '/teacher/projects', color: '#22d3ee', glow: 'rgba(34,211,238,0.3)' },
    { icon: '🧑‍💼', label: 'Assign Mentor',  sub: 'Manage mentors',   path: '/teacher/projects', color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
  ]

  if (loading) return (
    <div style={{ minHeight:'100vh',background:'#070b14',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:48,height:48,border:'3px solid rgba(245,158,11,0.2)',borderTop:'3px solid #f59e0b',borderRadius:'50%',animation:'spin 1s linear infinite' }} />
      <p style={{ color:'#94a3b8',fontFamily:'sans-serif' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh',background:'#070b14',fontFamily:"'DM Sans',sans-serif",overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .nav-card:hover{transform:translateY(-6px) !important;box-shadow:0 20px 40px rgba(0,0,0,0.5) !important;}
        .stat-card:hover{transform:translateY(-3px) !important;}
        .logout-btn:hover{background:rgba(239,68,68,0.25) !important;}
        .proj-row:hover{background:rgba(255,255,255,0.04) !important;}
      `}</style>

      {/* BG blobs */}
      <div style={{ position:'fixed',top:-300,left:'50%',width:700,height:700,background:'radial-gradient(circle,rgba(245,158,11,0.05) 0%,transparent 70%)',borderRadius:'50%',pointerEvents:'none',zIndex:0 }} />
      <div style={{ position:'fixed',bottom:-200,left:-200,width:500,height:500,background:'radial-gradient(circle,rgba(99,102,241,0.05) 0%,transparent 70%)',borderRadius:'50%',pointerEvents:'none',zIndex:0 }} />

      <div style={{ maxWidth:1100,margin:'0 auto',padding:'32px 24px',position:'relative',zIndex:1 }}>

        {/* NAVBAR */}
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:40,animation:'fadeUp 0.5s ease' }}>
          <div style={{ display:'flex',alignItems:'center',gap:14 }}>
            <div style={{ width:46,height:46,background:'linear-gradient(135deg,#f59e0b,#ef4444)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,boxShadow:'0 0 24px rgba(245,158,11,0.4)' }}>👨‍🏫</div>
            <div>
              <div style={{ color:'#f1f5f9',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:18,letterSpacing:'-0.5px' }}>SPMS</div>
              <div style={{ color:'#475569',fontSize:11,letterSpacing:1,textTransform:'uppercase' }}>Teacher Portal</div>
            </div>
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'8px 14px',color:'#64748b',fontSize:12 }}>
              🕐 {time.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
            </div>
            <div style={{ position:'relative' }}>
              <div style={{ width:40,height:40,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,cursor:'pointer' }}>🔔</div>
              {stats.notifications>0&&<div style={{ position:'absolute',top:-4,right:-4,background:'#ef4444',color:'white',borderRadius:'50%',width:18,height:18,fontSize:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700 }}>{stats.notifications}</div>}
            </div>
            <button onClick={()=>{logout();navigate('/login');toast.success('Logged out!')}} className="logout-btn" style={{ background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',color:'#ef4444',borderRadius:12,padding:'8px 18px',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,transition:'all 0.2s' }}>Logout</button>
          </div>
        </div>

        {/* HERO */}
        <div style={{ background:'linear-gradient(135deg,rgba(245,158,11,0.1) 0%,rgba(239,68,68,0.06) 100%)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:24,padding:'32px 36px',marginBottom:24,animation:'fadeUp 0.5s ease 0.1s both',position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',top:-60,right:-60,width:250,height:250,background:'radial-gradient(circle,rgba(245,158,11,0.12) 0%,transparent 70%)',borderRadius:'50%' }} />
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:20,position:'relative' }}>
            <div>
              <div style={{ color:'#f59e0b',fontSize:13,fontWeight:600,marginBottom:8,letterSpacing:2,textTransform:'uppercase' }}>{greeting()} 👋</div>
              <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:36,fontWeight:600,color:'#f1f5f9',margin:0,letterSpacing:'-1.5px',lineHeight:1 }}>{user?.name}</h1>
              <div style={{ display:'flex',gap:8,marginTop:12,flexWrap:'wrap' }}>
                {user?.department&&<span style={{ background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',color:'#94a3b8',padding:'4px 12px',borderRadius:20,fontSize:12 }}>🏫 Dept: {user.department}</span>}
                {user?.employeeId&&<span style={{ background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',color:'#94a3b8',padding:'4px 12px',borderRadius:20,fontSize:12 }}>🪪 {user.employeeId}</span>}
                {user?.subjects?.slice(0,2).map(s=>(
                  <span key={s} style={{ background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.15)',color:'#f59e0b',padding:'4px 12px',borderRadius:20,fontSize:12 }}>📖 {s}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ color:'#475569',fontSize:12,marginBottom:8 }}>{time.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</div>
              {stats.pending>0?(
                <div style={{ background:'rgba(245,158,11,0.15)',border:'1px solid rgba(245,158,11,0.3)',color:'#f59e0b',padding:'8px 18px',borderRadius:20,fontSize:13,fontWeight:600,animation:'pulse 2s infinite' }}>
                  ⏳ {stats.pending} Pending Reviews
                </div>
              ):(
                <div style={{ background:'rgba(16,185,129,0.12)',border:'1px solid rgba(16,185,129,0.25)',color:'#10b981',padding:'8px 18px',borderRadius:20,fontSize:13,fontWeight:400 }}>
                  ✅ All Reviewed
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24,animation:'fadeUp 0.5s ease 0.2s both' }}>
          {[
            { label:'Total Projects', value:stats.total,         icon:'📁', color:'#6366f1', bg:'rgba(99,102,241,0.1)',  border:'rgba(99,102,241,0.2)' },
            { label:'Pending',        value:stats.pending,       icon:'⏳', color:'#f59e0b', bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.2)' },
            { label:'Approved',       value:stats.approved,      icon:'✅', color:'#10b981', bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.2)' },
            { label:'Unread Notifs',  value:stats.notifications, icon:'🔔', color:'#22d3ee', bg:'rgba(34,211,238,0.1)', border:'rgba(34,211,238,0.2)' },
          ].map(s=>(
            <div key={s.label} className="stat-card" style={{ background:s.bg,border:`1px solid ${s.border}`,borderRadius:18,padding:'22px 18px',transition:'transform 0.2s',cursor:'default' }}>
              <div style={{ fontSize:24,marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontSize:28,fontWeight:500,color:s.color,fontFamily:'Syne,sans-serif',lineHeight:1 }}>{s.value}</div>
              <div style={{ color:'#475569',fontSize:12,marginTop:6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div style={{ display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:20,animation:'fadeUp 0.5s ease 0.3s both' }}>

          {/* Recent Projects Table */}
          <div>
            <div style={{ color:'#334155',fontSize:11,fontWeight:600,letterSpacing:2,textTransform:'uppercase',marginBottom:14,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <span>Recent Projects</span>
              <span onClick={()=>navigate('/teacher/projects')} style={{ color:'#6366f1',cursor:'pointer',textTransform:'none',fontSize:12,fontWeight:600 }}>View All →</span>
            </div>
            <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,overflow:'hidden' }}>
              {recentProjects.length===0?(
                <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'48px 0',gap:12 }}>
                  <div style={{ fontSize:40,opacity:0.2,animation:'float 3s ease infinite' }}>📁</div>
                  <p style={{ color:'#334155',fontSize:13 }}>No projects submitted yet</p>
                </div>
              ):(
                <>
                  <div style={{ display:'grid',gridTemplateColumns:'1fr auto auto',gap:12,padding:'12px 20px',borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color:'#334155',fontSize:11,fontWeight:600,letterSpacing:1 }}>PROJECT</span>
                    <span style={{ color:'#334155',fontSize:11,fontWeight:600,letterSpacing:1 }}>STUDENT</span>
                    <span style={{ color:'#334155',fontSize:11,fontWeight:600,letterSpacing:1 }}>STATUS</span>
                  </div>
                  {recentProjects.map((p,i)=>{
                    const st = STATUS_MAP[p.status]||STATUS_MAP.pending
                    return (
                      <div key={p._id} className="proj-row" style={{ display:'grid',gridTemplateColumns:'1fr auto auto',gap:12,padding:'14px 20px',borderBottom:'1px solid rgba(255,255,255,0.03)',transition:'background 0.2s',cursor:'pointer',alignItems:'center' }} onClick={()=>navigate('/teacher/projects')}>
                        <div>
                          <div style={{ color:'#e2e8f0',fontSize:13,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:180 }}>{p.title}</div>
                          <div style={{ color:'#475569',fontSize:11,marginTop:2 }}>{p.category}</div>
                        </div>
                        <div style={{ color:'#64748b',fontSize:12,whiteSpace:'nowrap' }}>{p.createdBy?.name?.split(' ')[0]}</div>
                        <div style={{ background:st.bg,color:st.color,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:600,whiteSpace:'nowrap' }}>{st.label}</div>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
            {/* Quick Actions */}
            <div>
              <div style={{ color:'#334155',fontSize:11,fontWeight:600,letterSpacing:2,textTransform:'uppercase',marginBottom:14 }}>Quick Actions</div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
                {navItems.map(item=>(
                  <div key={item.label} className="nav-card" onClick={()=>navigate(item.path)} style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:16,padding:'16px 14px',cursor:'pointer',transition:'all 0.25s',position:'relative',overflow:'hidden' }}>
                    <div style={{ position:'absolute',top:-20,right:-20,width:70,height:70,background:`radial-gradient(circle,${item.glow} 0%,transparent 70%)`,borderRadius:'50%' }} />
                    <div style={{ fontSize:20,marginBottom:8 }}>{item.icon}</div>
                    <div style={{ color:'#f1f5f9',fontFamily:'Syne,sans-serif',fontWeight:400,fontSize:12,marginBottom:2 }}>{item.label}</div>
                    <div style={{ color:'#475569',fontSize:11 }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:20,flex:1 }}>
              <div style={{ color:'#334155',fontSize:11,fontWeight:600,letterSpacing:2,textTransform:'uppercase',marginBottom:14 }}>Recent Activity</div>
              {notifications.length===0?(
                <p style={{ color:'#334155',fontSize:13,textAlign:'center',padding:'16px 0' }}>No notifications</p>
              ):(
                notifications.map((n,i)=>(
                  <div key={n._id} style={{ padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',animation:`fadeUp 0.4s ease ${i*0.08}s both` }}>
                    {!n.isRead&&<div style={{ width:6,height:6,background:'#f59e0b',borderRadius:'50%',marginBottom:4,display:'inline-block',marginRight:6 }} />}
                    <div style={{ color:'#e2e8f0',fontSize:12,fontWeight:600,display:'inline' }}>{n.title}</div>
                    <div style={{ color:'#475569',fontSize:11,marginTop:3 }}>{n.message?.slice(0,60)}...</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop:32,textAlign:'center',color:'#1e293b',fontSize:11,letterSpacing:1,animation:'fadeUp 0.5s ease 0.4s both' }}>SPMS v1.0 — Student Project Management System</div>
      </div>
    </div>
  )
}