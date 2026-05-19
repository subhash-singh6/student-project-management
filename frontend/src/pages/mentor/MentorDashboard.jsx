// frontend/src/pages/mentor/MentorDashboard.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { icon:'👨‍🎓', label:'My Students',    sub:'View assigned',     path:'/mentor/students', color:'#f59e0b', glow:'rgba(245,158,11,0.25)'  },
  { icon:'💬',   label:'Give Feedback',  sub:'Review projects',   path:'/mentor/students', color:'#10b981', glow:'rgba(16,185,129,0.25)'  },
  { icon:'📊',   label:'Progress',       sub:'Track performance', path:'/mentor/students', color:'#818cf8', glow:'rgba(129,140,248,0.25)' },
  { icon:'📅',   label:'Meetings',       sub:'Plan sessions',     path:'/mentor/meetings', color:'#22d3ee', glow:'rgba(34,211,238,0.25)'  },
]

export default function MentorDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats,         setStats]         = useState({ students:0, projects:0, notifications:0 })
  const [notifications, setNotifications] = useState([])
  const [students,      setStudents]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [time,          setTime]          = useState(new Date())
  const [menuOpen,      setMenuOpen]      = useState(false)

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
      setStudents(studentList.slice(0, 5))
      setStats({
        students:      studentList.length,
        projects:      user?.assignedProjects?.length || 0,
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
        .nav-card{transition:transform 0.22s ease,box-shadow 0.22s ease}
        .nav-card:hover{transform:translateY(-4px);box-shadow:0 20px 48px rgba(0,0,0,0.5)}
        .stat-card{transition:transform 0.18s ease}
        .stat-card:hover{transform:translateY(-3px)}
        .stu-row{transition:background 0.15s}
        .stu-row:hover{background:rgba(255,255,255,0.04) !important}
        .mobile-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:40;backdrop-filter:blur(4px)}
        .mobile-drawer{position:fixed;top:0;right:0;bottom:0;width:80%;max-width:300px;background:#0d1421;border-left:1px solid rgba(255,255,255,0.08);z-index:50;padding:24px;overflow-y:auto}
      `}</style>

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{ position:'absolute', top:-250, left:-250, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,0.06),transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:-200, right:-200, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.05),transparent 70%)' }} />
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
          <div className="mobile-drawer">
            <div className="flex items-center justify-between mb-8">
              <div className="font-bold text-white text-lg" style={{ fontFamily:'Syne,sans-serif' }}>Menu</div>
              <button onClick={() => setMenuOpen(false)} className="text-slate-500 hover:text-white text-xl">✕</button>
            </div>
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.label}
                  onClick={() => { navigate(item.path); setMenuOpen(false) }}
                  className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/3 p-4 text-left hover:bg-white/6 transition-colors"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-white text-sm">{item.label}</div>
                    <div className="text-xs text-slate-600">{item.sub}</div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => { logout(); navigate('/login'); toast.success('Logged out!') }}
                className="mt-4 flex items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-left"
              >
                <span className="text-xl">🚪</span>
                <span className="font-semibold text-red-400 text-sm">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── NAVBAR ── */}
        <div className="flex items-center justify-between mb-8 fade1">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-xl shadow-lg shadow-amber-500/30 flex-shrink-0">
              🧑‍💼
            </div>
            <div>
              <div className="font-bold text-white text-lg tracking-wide" style={{ fontFamily:'Syne,sans-serif' }}>SPMS</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-600">Mentor Portal</div>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-xl border border-white/7 bg-white/3 px-3 py-2 text-xs text-slate-500">
              🕐 {time.toLocaleTimeString('en-IN',{ hour:'2-digit', minute:'2-digit' })}
            </div>
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/7 bg-white/3 text-base cursor-pointer hover:bg-white/6 transition-colors">🔔</div>
              {stats.notifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">{stats.notifications}</span>
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

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            {stats.notifications > 0 && (
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/7 bg-white/3 text-sm">🔔</div>
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">{stats.notifications}</span>
              </div>
            )}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/7 bg-white/3 text-slate-400"
            >☰</button>
          </div>
        </div>

        {/* ── HERO BANNER ── */}
        <div className="fade2 mb-6 rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/8 to-orange-500/4 p-5 sm:p-7 relative overflow-hidden">
          <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,0.12),transparent 70%)', pointerEvents:'none' }} />
          <div className="flex flex-wrap items-start justify-between gap-4 relative">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 mb-2">{greeting()} 👋</div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={{ fontFamily:'Syne,sans-serif', letterSpacing:'-1px' }}>
                {user?.name}
              </h1>
              <div className="flex flex-wrap gap-2">
                {user?.organization && (
                  <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-slate-400">🏢 {user.organization}</span>
                )}
                {user?.expertise?.slice(0, 3).map(e => (
                  <span key={e} className="rounded-full border border-amber-500/20 bg-amber-500/8 px-3 py-1 text-xs text-amber-400">⚡ {e}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-600 mb-2 hidden sm:block">
                {time.toLocaleDateString('en-IN',{ weekday:'long', day:'numeric', month:'long' })}
              </div>
              <div className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400">
                🧑‍💼 Active Mentor
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="fade3 grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          {[
            { label:'Students',      value:stats.students,      icon:'👨‍🎓', color:'text-amber-400',   border:'border-amber-500/20',   bg:'bg-amber-500/8'   },
            { label:'Projects',      value:stats.projects,      icon:'📋',   color:'text-emerald-400', border:'border-emerald-500/20', bg:'bg-emerald-500/8' },
            { label:'Notifications', value:stats.notifications, icon:'🔔',   color:'text-indigo-400',  border:'border-indigo-500/20',  bg:'bg-indigo-500/8'  },
          ].map(s => (
            <div key={s.label} className={`stat-card rounded-2xl border ${s.border} ${s.bg} p-4 sm:p-5 cursor-default`}>
              <div className="text-xl sm:text-2xl mb-2">{s.icon}</div>
              <div className={`text-2xl sm:text-3xl font-bold ${s.color} mb-1`} style={{ fontFamily:'Syne,sans-serif' }}>{s.value}</div>
              <div className="text-[10px] sm:text-xs text-slate-600 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="fade3 mb-8">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-600 mb-4">Quick Actions</div>
          {/* Mobile: horizontal scroll */}
          <div className="flex gap-3 overflow-x-auto pb-2 sm:hidden" style={{ scrollbarWidth:'none' }}>
            {NAV_ITEMS.map(item => (
              <div
                key={item.label}
                onClick={() => navigate(item.path)}
                className="flex-shrink-0 w-36 rounded-2xl border border-white/6 bg-[#0d1421] p-4 cursor-pointer relative overflow-hidden"
              >
                <div style={{ position:'absolute', top:-20, right:-20, width:64, height:64, borderRadius:'50%', background:`radial-gradient(circle,${item.glow},transparent 70%)`, pointerEvents:'none' }} />
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-bold text-xs text-white mb-0.5" style={{ fontFamily:'Syne,sans-serif' }}>{item.label}</div>
                <div className="text-[10px] text-slate-600">{item.sub}</div>
              </div>
            ))}
          </div>
          {/* Desktop: grid */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-3">
            {NAV_ITEMS.map(item => (
              <div
                key={item.label}
                className="nav-card rounded-2xl border border-white/6 bg-[#0d1421] p-5 cursor-pointer relative overflow-hidden"
                onClick={() => navigate(item.path)}
              >
                <div style={{ position:'absolute', top:-24, right:-24, width:80, height:80, borderRadius:'50%', background:`radial-gradient(circle,${item.glow},transparent 70%)`, pointerEvents:'none' }} />
                <div className="text-2xl mb-3">{item.icon}</div>
                <div className="font-bold text-sm text-white mb-1" style={{ fontFamily:'Syne,sans-serif' }}>{item.label}</div>
                <div className="text-xs text-slate-600">{item.sub}</div>
                <div className="mt-3 text-xs font-bold flex items-center gap-1" style={{ color:item.color }}>Open →</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="fade4 grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Assigned Students — 3 cols */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-600">Assigned Students</div>
              <button onClick={() => navigate('/mentor/students')} className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                View All →
              </button>
            </div>
            <div className="rounded-2xl border border-white/6 bg-[#0d1421] overflow-hidden">
              {students.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="text-4xl opacity-20" style={{ animation:'float 3s ease infinite' }}>👨‍🎓</div>
                  <p className="text-sm text-slate-600">Koi student assign nahi hua abhi</p>
                </div>
              ) : (
                <div className="divide-y divide-white/4">
                  {students.map((s, i) => (
                    <div
                      key={s._id}
                      className="stu-row flex items-center justify-between px-5 py-4 cursor-pointer"
                      onClick={() => navigate('/mentor/students')}
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-sm font-bold text-white shadow-md shadow-amber-500/20">
                          {s.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-slate-200">{s.name}</div>
                          <div className="text-xs text-slate-600 mt-0.5">
                            {s.branch && `${s.branch}`}{s.semester && ` · Sem ${s.semester}`}
                          </div>
                        </div>
                      </div>
                      {/* Enrollment badge */}
                      {s.enrollmentNumber && (
                        <span className="hidden sm:block rounded-full border border-white/8 bg-white/4 px-2.5 py-0.5 text-[10px] text-slate-500">
                          {s.enrollmentNumber}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notifications — 2 cols */}
          <div className="lg:col-span-2">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-600 mb-4">Recent Activity</div>
            <div className="rounded-2xl border border-white/6 bg-[#0d1421] p-5">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="text-3xl opacity-20" style={{ animation:'float 3s ease infinite' }}>🔔</div>
                  <p className="text-sm text-slate-600 text-center">Koi notification nahi</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {notifications.map((n, i) => (
                    <div
                      key={n._id}
                      className="rounded-xl p-3"
                      style={{ background: n.isRead ? 'rgba(255,255,255,0.02)' : 'rgba(245,158,11,0.05)', border:`1px solid ${n.isRead ? 'rgba(255,255,255,0.04)' : 'rgba(245,158,11,0.15)'}` }}
                    >
                      {!n.isRead && <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 mb-1.5" style={{ animation:'pulse 2s infinite' }} />}
                      <div className="text-sm font-semibold text-slate-200">{n.title}</div>
                      <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message?.slice(0, 65)}{n.message?.length > 65 ? '...' : ''}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-[11px] text-slate-800 tracking-widest uppercase">
          SPMS v3.0 — Student Project Management System
        </div>
      </div>
    </div>
  )
}