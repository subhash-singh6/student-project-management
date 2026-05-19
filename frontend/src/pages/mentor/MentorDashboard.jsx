// frontend/src/pages/mentor/MentorDashboard.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

export default function MentorDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ students: 0, projects: 0, notifications: 0 })
  const [notifications, setNotifications] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    fetchData()
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchData = async () => {
    try {
      const [mentorRes, notifRes] = await Promise.all([
        API.get('/mentor/students'),
        API.get('/notifications'),
      ])
      const studentList = mentorRes.data.students || []
      setStudents(studentList.slice(0, 4))
      setStats({
        students: studentList.length,
        projects: user?.assignedProjects?.length || 0,
        notifications: notifRes.data.unreadCount || 0,
      })
      setNotifications(notifRes.data.notifications?.slice(0, 3) || [])
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

  const navItems = [
    { icon: '👨‍🎓', label: 'My Students',      sub: 'View assigned',       path: '/mentor/students', color: '#6366f1', glow: 'rgba(99,102,241,0.3)' },
    { icon: '📅',   label: 'Schedule Meeting', sub: 'Plan a session',      path: '/mentor/meetings', color: '#22d3ee', glow: 'rgba(34,211,238,0.3)' },
    { icon: '💬',   label: 'Give Feedback',    sub: 'Review projects',     path: '/mentor/students', color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
    { icon: '📊',   label: 'Progress',         sub: 'Track performance',   path: '/mentor/students', color: '#a78bfa', glow: 'rgba(167,139,250,0.3)' },
  ]

  if (loading) return (
    <div style={{ minHeight:'100vh',background:'#070b14',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:48,height:48,border:'3px solid rgba(34,211,238,0.2)',borderTop:'3px solid #22d3ee',borderRadius:'50%',animation:'spin 1s linear infinite' }} />
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
      `}</style>

      {/* BG blobs */}
      <div style={{ position:'fixed',top:-300,right:-300,width:700,height:700,background:'radial-gradient(circle,rgba(34,211,238,0.06) 0%,transparent 70%)',borderRadius:'50%',pointerEvents:'none',zIndex:0 }} />
      <div style={{ position:'fixed',bottom:-200,left:-200,width:500,height:500,background:'radial-gradient(circle,rgba(99,102,241,0.05) 0%,transparent 70%)',borderRadius:'50%',pointerEvents:'none',zIndex:0 }} />

      <div style={{ maxWidth:1100,margin:'0 auto',padding:'32px 24px',position:'relative',zIndex:1 }}>

        {/* NAVBAR */}
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:40,animation:'fadeUp 0.5s ease' }}>
          <div style={{ display:'flex',alignItems:'center',gap:14 }}>
            <div style={{ width:46,height:46,background:'linear-gradient(135deg,#22d3ee,#6366f1)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,boxShadow:'0 0 24px rgba(34,211,238,0.4)' }}>🧑‍💼</div>
            <div>
              <div style={{ color:'#f1f5f9',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:18,letterSpacing:'-0.5px' }}>SPMS</div>
              <div style={{ color:'#475569',fontSize:11,letterSpacing:1,textTransform:'uppercase' }}>Mentor Portal</div>
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
        <div style={{ background:'linear-gradient(135deg,rgba(34,211,238,0.1) 0%,rgba(99,102,241,0.07) 100%)',border:'1px solid rgba(34,211,238,0.2)',borderRadius:24,padding:'32px 36px',marginBottom:24,animation:'fadeUp 0.5s ease 0.1s both',position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',top:-60,right:-60,width:250,height:250,background:'radial-gradient(circle,rgba(34,211,238,0.12) 0%,transparent 70%)',borderRadius:'50%' }} />
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:20,position:'relative' }}>
            <div>
              <div style={{ color:'#22d3ee',fontSize:13,fontWeight:600,marginBottom:8,letterSpacing:2,textTransform:'uppercase' }}>{greeting()} 👋</div>
              <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:36,fontWeight:700,color:'#f1f5f9',margin:0,letterSpacing:'-1.5px',lineHeight:1 }}>{user?.name}</h1>
              <div style={{ display:'flex',gap:8,marginTop:12,flexWrap:'wrap' }}>
                {user?.organization&&<span style={{ background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',color:'#94a3b8',padding:'4px 12px',borderRadius:20,fontSize:12 }}>🏢 {user.organization}</span>}
                {user?.expertise?.slice(0,3).map(e=>(
                  <span key={e} style={{ background:'rgba(34,211,238,0.08)',border:'1px solid rgba(34,211,238,0.15)',color:'#22d3ee',padding:'4px 12px',borderRadius:20,fontSize:12 }}>⚡ {e}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ color:'#475569',fontSize:12,marginBottom:8 }}>{time.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</div>
              <div style={{ background:'rgba(34,211,238,0.12)',border:'1px solid rgba(34,211,238,0.25)',color:'#22d3ee',padding:'8px 18px',borderRadius:20,fontSize:13,fontWeight:600 }}>
                🧑‍💼 Active Mentor
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:24,animation:'fadeUp 0.5s ease 0.2s both' }}>
          {[
            { label:'Assigned Students', value:stats.students,      icon:'👨‍🎓', color:'#6366f1', bg:'rgba(99,102,241,0.1)',  border:'rgba(99,102,241,0.2)' },
            { label:'Active Projects',   value:stats.projects,      icon:'📋',   color:'#22d3ee', bg:'rgba(34,211,238,0.1)',  border:'rgba(34,211,238,0.2)' },
            { label:'Unread Notifs',     value:stats.notifications, icon:'🔔',   color:'#f59e0b', bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.2)' },
          ].map(s=>(
            <div key={s.label} className="stat-card" style={{ background:s.bg,border:`1px solid ${s.border}`,borderRadius:18,padding:'22px 18px',transition:'transform 0.2s',cursor:'default' }}>
              <div style={{ fontSize:24,marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontSize:28,fontWeight:600,color:s.color,fontFamily:'Syne,sans-serif',lineHeight:1 }}>{s.value}</div>
              <div style={{ color:'#475569',fontSize:12,marginTop:6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div style={{ display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:20,animation:'fadeUp 0.5s ease 0.3s both' }}>

          {/* Nav Cards */}
          <div>
            <div style={{ color:'#334155',fontSize:11,fontWeight:600,letterSpacing:2,textTransform:'uppercase',marginBottom:14 }}>Quick Actions</div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
              {navItems.map(item=>(
                <div key={item.label} className="nav-card" onClick={()=>navigate(item.path)} style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:'22px 18px',cursor:'pointer',transition:'all 0.25s',position:'relative',overflow:'hidden' }}>
                  <div style={{ position:'absolute',top:-30,right:-30,width:100,height:100,background:`radial-gradient(circle,${item.glow} 0%,transparent 70%)`,borderRadius:'50%' }} />
                  <div style={{ fontSize:28,marginBottom:14 }}>{item.icon}</div>
                  <div style={{ color:'#f1f5f9',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:15,marginBottom:4 }}>{item.label}</div>
                  <div style={{ color:'#475569',fontSize:12 }}>{item.sub}</div>
                  <div style={{ marginTop:16,color:item.color,fontSize:12,fontWeight:700,display:'flex',alignItems:'center',gap:4 }}>Go <span>→</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Students + Notifications */}
          <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
            {/* Assigned Students */}
            <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:20 }}>
              <div style={{ color:'#334155',fontSize:11,fontWeight:600,letterSpacing:2,textTransform:'uppercase',marginBottom:14 }}>Assigned Students</div>
              {students.length===0?(
                <p style={{ color:'#334155',fontSize:13,textAlign:'center',padding:'20px 0',animation:'float 3s ease infinite' }}>No students assigned yet</p>
              ):(
                <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                  {students.map(s=>(
                    <div key={s._id} style={{ display:'flex',alignItems:'center',gap:10,padding:'8px 10px',background:'rgba(255,255,255,0.02)',borderRadius:10 }}>
                      <div style={{ width:32,height:32,background:'linear-gradient(135deg,#6366f1,#22d3ee)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:13,flexShrink:0 }}>{s.name?.charAt(0).toUpperCase()}</div>
                      <div>
                        <div style={{ color:'#e2e8f0',fontSize:13,fontWeight:600 }}>{s.name}</div>
                        <div style={{ color:'#475569',fontSize:11 }}>{s.branch} • Sem {s.semester}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:20,flex:1 }}>
              <div style={{ color:'#334155',fontSize:11,fontWeight:600,letterSpacing:2,textTransform:'uppercase',marginBottom:14 }}>Recent Activity</div>
              {notifications.length===0?(
                <p style={{ color:'#334155',fontSize:13,textAlign:'center',padding:'16px 0' }}>No notifications</p>
              ):(
                notifications.map((n,i)=>(
                  <div key={n._id} style={{ padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',animation:`fadeUp 0.4s ease ${i*0.08}s both` }}>
                    <div style={{ color:'#e2e8f0',fontSize:12,fontWeight:600 }}>{n.title}</div>
                    <div style={{ color:'#475569',fontSize:11,marginTop:3 }}>{n.message?.slice(0,55)}...</div>
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