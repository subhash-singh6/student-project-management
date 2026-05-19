// frontend/src/pages/student/StudentDashboard.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { icon:'📁', label:'My Projects',    sub:'Create & manage',    path:'/student/projects',       color:'#f59e0b', glow:'rgba(245,158,11,0.25)'  },
  { icon:'👥', label:'My Team',        sub:'Collaborate',        path:'/student/team',           color:'#10b981', glow:'rgba(16,185,129,0.25)'  },
  { icon:'💬', label:'Team Chat',      sub:'Real-time messages', path:'/student/chat',           color:'#818cf8', glow:'rgba(129,140,248,0.25)' },
  { icon:'📋', label:'Kanban Board',   sub:'Task management',    path:'/student/kanban',         color:'#22d3ee', glow:'rgba(34,211,238,0.25)'  },
  { icon:'🎓', label:'Assign Teacher', sub:'Subject & mentor',   path:'/student/assign-teacher', color:'#f97316', glow:'rgba(249,115,22,0.25)'  },
  { icon:'📊', label:'Analytics',      sub:'Charts & insights',  path:'/analytics',              color:'#a78bfa', glow:'rgba(167,139,250,0.25)' },
  { icon:'🏆', label:'Leaderboard',    sub:'Rankings & badges',  path:'/leaderboard',            color:'#ec4899', glow:'rgba(236,72,153,0.25)'  },
]

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats,         setStats]         = useState({ projects:0, team:0, submissions:0, notifications:0 })
  const [notifications, setNotifications] = useState([])
  const [loading,       setLoading]       = useState(true)
  const [time,          setTime]          = useState(new Date())

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
      let teamExists = 0
      try { await API.get('/teams/my'); teamExists = 1 } catch {}
      setStats({
        projects:      projRes.data.count || 0,
        team:          teamExists,
        submissions:   0,
        notifications: notifRes.data.unreadCount || 0,
      })
      setNotifications(notifRes.data.notifications?.slice(0, 4) || [])
    } catch (e) { console.log(e.message) }
    finally { setLoading(false) }
  }

  const greeting = () => {
    const h = time.getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  if (loading) return (
    <div className="min-h-screen bg-[#060A12] flex flex-col items-center justify-center gap-4">
      <div className="h-11 w-11 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
      <p className="text-sm text-slate-500">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#060A12] overflow-x-hidden" style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .fade1{animation:fadeUp 0.5s ease both}
        .fade2{animation:fadeUp 0.5s ease 0.10s both}
        .fade3{animation:fadeUp 0.5s ease 0.18s both}
        .fade4{animation:fadeUp 0.5s ease 0.26s both}
        .nav-card { transition:transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease; }
        .nav-card:hover { transform:translateY(-5px); box-shadow:0 20px 48px rgba(0,0,0,0.5); }
        .stat-card { transition:transform 0.18s ease; }
        .stat-card:hover { transform:translateY(-3px); }
        .notif-item { transition:background 0.18s; }
        .notif-item:hover { background:rgba(255,255,255,0.04) !important; }
      `}</style>

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{ position:'absolute', top:-250, left:-250, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,0.06),transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:-200, right:-200, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.05),transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">

        {/* ── NAVBAR ── */}
        <div className="flex items-center justify-between mb-10 fade1">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-xl shadow-lg shadow-amber-500/30">
              🎓
            </div>
            <div>
              <div className="font-bold text-white text-lg tracking-wide" style={{ fontFamily:'Syne,sans-serif' }}>SPMS</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-600">Student Portal</div>
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/7 bg-white/3 px-3 py-2 text-xs text-slate-500">
              🕐 {time.toLocaleTimeString('en-IN',{ hour:'2-digit', minute:'2-digit' })}
            </div>
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/7 bg-white/3 text-base cursor-pointer hover:bg-white/6 transition-colors">🔔</div>
              {stats.notifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {stats.notifications}
                </span>
              )}
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); toast.success('Logged out!') }}
              className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-colors"
              style={{ fontFamily:'Syne,sans-serif' }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* ── HERO BANNER ── */}
        <div className="fade2 mb-6 rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/8 to-orange-500/4 p-7 relative overflow-hidden">
          <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,0.12),transparent 70%)', pointerEvents:'none' }} />
          <div className="flex flex-wrap items-center justify-between gap-5 relative">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 mb-2">
                {greeting()} 👋
              </div>
              <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily:'Syne,sans-serif', letterSpacing:'-1px' }}>
                {user?.name}
              </h1>
              <div className="flex flex-wrap gap-2">
                {user?.branch && (
                  <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-slate-400">
                    🏫 {user.branch}
                  </span>
                )}
                {user?.semester && (
                  <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-slate-400">
                    📚 Sem {user.semester}
                  </span>
                )}
                {user?.enrollmentNumber && (
                  <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-slate-400">
                    🪪 {user.enrollmentNumber}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-600 mb-2">
                {time.toLocaleDateString('en-IN',{ weekday:'long', day:'numeric', month:'long' })}
              </div>
              <div className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${
                stats.projects > 0
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
              }`}>
                {stats.projects > 0 ? '✅ Active Student' : '⏳ No Projects Yet'}
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="fade3 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label:'Projects',    value:stats.projects,             icon:'📁', color:'text-amber-400',   border:'border-amber-500/20',   bg:'bg-amber-500/8'   },
            { label:'Team',        value:stats.team ? 'Joined':'None',icon:'👥', color:'text-emerald-400', border:'border-emerald-500/20', bg:'bg-emerald-500/8' },
            { label:'Submissions', value:stats.submissions,          icon:'📤', color:'text-indigo-400',  border:'border-indigo-500/20',  bg:'bg-indigo-500/8'  },
            { label:'Unread',      value:stats.notifications,        icon:'🔔', color:'text-orange-400',  border:'border-orange-500/20',  bg:'bg-orange-500/8'  },
          ].map(s => (
            <div key={s.label} className={`stat-card rounded-2xl border ${s.border} ${s.bg} p-5 cursor-default`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className={`text-2xl font-bold ${s.color} mb-1`} style={{ fontFamily:'Syne,sans-serif' }}>{s.value}</div>
              <div className="text-xs text-slate-600 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── MAIN GRID ── */}
        <div className="fade4 grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Nav Cards — 3 cols */}
          <div className="lg:col-span-3">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-600 mb-4">Quick Actions</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {NAV_ITEMS.map((item, i) => (
                <div
                  key={item.label}
                  className="nav-card rounded-2xl border border-white/6 bg-[#0d1421] p-5 cursor-pointer relative overflow-hidden"
                  onClick={() => navigate(item.path)}
                  style={{ animationDelay:`${i*0.05}s` }}
                >
                  {/* Glow */}
                  <div style={{ position:'absolute', top:-24, right:-24, width:80, height:80, borderRadius:'50%', background:`radial-gradient(circle,${item.glow},transparent 70%)`, pointerEvents:'none' }} />
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <div className="font-bold text-sm text-white mb-1" style={{ fontFamily:'Syne,sans-serif' }}>{item.label}</div>
                  <div className="text-xs text-slate-600">{item.sub}</div>
                  <div className="mt-3 text-xs font-bold flex items-center gap-1" style={{ color:item.color }}>
                    Open <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications — 2 cols */}
          <div className="lg:col-span-2">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-600 mb-4">Recent Activity</div>
            <div className="rounded-2xl border border-white/6 bg-[#0d1421] p-5 min-h-[320px]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                  <div className="text-4xl opacity-20" style={{ animation:'float 3s ease infinite' }}>🔔</div>
                  <p className="text-sm text-slate-600 text-center leading-relaxed">
                    Koi activity nahi abhi.<br />Pehle project banao!
                  </p>
                  <button
                    onClick={() => navigate('/student/projects')}
                    className="mt-2 rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/15 transition-colors"
                    style={{ fontFamily:'Syne,sans-serif' }}
                  >
                    Create Project →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {notifications.map((n, i) => (
                    <div
                      key={n._id}
                      className="notif-item rounded-xl border border-white/4 p-3"
                      style={{ background: n.isRead ? 'rgba(255,255,255,0.02)' : 'rgba(245,158,11,0.05)', borderColor: n.isRead ? 'rgba(255,255,255,0.04)' : 'rgba(245,158,11,0.15)', animationDelay:`${i*0.07}s` }}
                    >
                      {!n.isRead && (
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 mb-1.5" style={{ animation:'pulse 2s infinite' }} />
                      )}
                      <div className="text-sm font-semibold text-slate-200">{n.title}</div>
                      <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {n.message?.slice(0, 70)}{n.message?.length > 70 ? '...' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-[11px] text-slate-800 tracking-widest uppercase">
          SPMS v3.0 — Student Project Management System
        </div>
      </div>
    </div>
  )
}