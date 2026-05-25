// frontend/src/pages/mentor/MentorDashboard.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../../constants/context/AuthContext'
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
    { icon: '👨‍🎓', label: 'My Students',       sub: 'Access trainee rosters',    path: '/mentor/students', color: 'text-indigo-400' },
    { icon: '📅',   label: 'Sync & Meet',      sub: 'Schedule evaluation session',path: '/mentor/meetings', color: 'text-purple-400' },
    { icon: '💬',   label: 'Give Feedback',    sub: 'Evaluate project blueprints',path: '/mentor/students', color: 'text-violet-400' },
    { icon: '📊',   label: 'Track Progress',   sub: 'Monitor team performance',   path: '/mentor/students', color: 'text-fuchsia-400' },
  ]

  if (loading) return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center gap-5">
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
      <p className="text-sm font-semibold tracking-widest text-[#94a3b8] animate-pulse">Initializing Mentor Hub...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f1f5f9] font-sans relative overflow-hidden selection:bg-indigo-500/20 selection:text-indigo-400">
      
      {/* ── Dynamic Design Styles Injection ────────────────── */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseGlow { 0%,100% { transform:scale(1); opacity:0.6; } 50% { transform:scale(1.1); opacity:1; } }
        @keyframes subtleFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        
        .anim-fade-up { animation: fadeUp 0.6s ease both; }
        .anim-fade-up-1 { animation: fadeUp 0.6s ease 0.08s both; }
        .anim-fade-up-2 { animation: fadeUp 0.6s ease 0.16s both; }
        .anim-float { animation: subtleFloat 3s ease-in-out infinite; }
        .animation-pulse-glow { animation: pulseGlow 8s ease-in-out infinite; }
      `}</style>

      {/* ── High-Authority Background Visuals (INDIGO Tech) ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-[100px]" />
        <div className="absolute top-[40%] -left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500/5 to-transparent blur-[80px] animation-pulse-glow" />
        <div className="absolute bottom-[0%] right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-indigo-500/5 to-transparent blur-[70px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">

        {/* ── TOP ACTION BAR / NAVBAR ─────────────────────── */}
        <header className="anim-fade-up flex items-center justify-between gap-4 mb-10 pb-5 border-b border-white/[0.03]">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
              🧑‍💼
            </div>
            <div>
              <div className="text-xl font-black tracking-tighter text-white font-display">SPMS</div>
              <div className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">MENTOR COUNCIL</div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <div className="bg-white/[0.02] border border-white/5 rounded-full px-5 py-2.5 text-xs font-semibold text-slate-500 tracking-wider">
              🕐 {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
            
            <div className="relative">
              <div className="w-10 h-10 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center text-base cursor-pointer hover:bg-white/[0.06] hover:border-white/10 transition-colors">
                🔔
              </div>
              {stats.notifications > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white rounded-full w-5 h-5 text-xs font-black flex items-center justify-center animate-bounce">
                  {stats.notifications}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => { logout(); navigate('/login'); toast.success('Session Terminated!') }} 
              className="px-5 py-2.5 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 hover:border-rose-500/30 transition-all duration-200"
            >
              Terminate Session
            </button>
          </div>
        </header>

        {/* ── GREETING HERO ──────────────────────────────── */}
        <section className="anim-fade-up-1 bg-gradient-to-br from-indigo-500/[0.10] to-transparent border border-indigo-500/20 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
            <div className="text-center sm:text-left">
              <div className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-2">{greeting()} — Evaluation Hub</div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-white mb-5">{user?.name}</h1>
              
              <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                {user?.organization && <span className="bg-white/[0.04] border border-white/5 text-slate-400 px-3 py-1 rounded-lg text-xs font-semibold">🏢 Inst: {user.organization}</span>}
                {user?.expertise?.slice(0, 3).map((e) => (
                  <span key={e} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-lg text-xs font-semibold">⚡ {e}</span>
                ))}
              </div>
            </div>
            
            <div className="text-right w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-5 sm:pt-0">
              <div className="text-sm text-slate-600 font-medium mb-3 tracking-wide">{time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-black bg-indigo-500/15 border border-indigo-500/20 text-indigo-400`}>
                🧑‍💼 ACTIVE Authority
              </span>
            </div>
          </div>
        </section>

        {/* ── CORE STATISTICS GRIDS ───────────────────────── */}
        <section className="anim-fade-up-2 grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            { label: 'Assigned Trainees', value: stats.students, icon: '👨‍🎓', bg: 'bg-indigo-500/10 border-indigo-500/20', hover: 'hover:border-indigo-400 group', color: 'text-indigo-400' },
            { label: 'Monitored Blueprints', value: stats.projects, icon: '📋', bg: 'bg-purple-500/10 border-purple-500/20', hover: 'hover:border-purple-400 group', color: 'text-purple-400' },
            { label: 'Unread Alerts', value: stats.notifications, icon: '🔔', bg: 'bg-amber-500/10 border-amber-500/20', hover: 'hover:border-amber-400 group', color: 'text-amber-400' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-2xl p-6 transition-all duration-200 ${s.hover}`}>
              <div className={`text-2xl mb-4 opacity-90 group-hover:scale-105 transition-transform`}>{s.icon}</div>
              <div className={`text-3xl font-black text-white tracking-tighter transition-colors ${s.color}`}>{s.value}</div>
              <div className="text-[11px] text-slate-500 font-bold mt-1.5 tracking-wide uppercase">{s.label}</div>
            </div>
          ))}
        </section>

        {/* ── MAIN GRID CONTROL ───────────────────────────── */}
        <div className="anim-fade-up-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Faculty Command Center */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-extrabold tracking-widest text-slate-600 uppercase mb-4">Command Center</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {navItems.map((item) => (
                <div 
                  key={item.label} 
                  onClick={() => navigate(item.path)} 
                  className="bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 rounded-2xl p-6 cursor-pointer transition-all duration-300 group relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{item.icon}</div>
                    <div className="text-[11px] text-indigo-400 font-extrabold opacity-0 group-hover:opacity-100 transition-opacity">Access ↗</div>
                  </div>
                  <h3 className={`text-base font-bold text-[#f1f5f9] mt-5 mb-0.5 tracking-tight group-hover:${item.color} transition-colors`}>{item.label}</h3>
                  <p className="text-[11px] text-slate-600 font-semibold">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sync Profiles & Logs */}
          <div className="flex flex-col gap-6">
            
            {/* Student Rosters */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
              <h2 className="text-xs font-extrabold tracking-widest text-slate-600 uppercase mb-5 relative z-10">Trainee Roster</h2>
              {students.length === 0 ? (
                <div className="text-center py-10 relative z-10">
                  <p className="text-xs text-slate-600 font-semibold anim-float">No trainees assigned to Node.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 relative z-10">
                  {students.map((s) => (
                    <div key={s._id} className="flex items-center gap-3.5 p-3.5 bg-white/[0.01] border border-white/5 rounded-xl hover:border-indigo-500/10 transition-colors">
                      <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md">
                        {s.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-slate-200 truncate group-hover:text-white">{s.name}</div>
                        <div className="text-[10px] text-slate-600 font-medium truncate mt-0.5">{s.branch} • Sem {s.semester}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Micro Alerts */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex-1">
              <h2 className="text-xs font-extrabold tracking-widest text-slate-600 uppercase mb-4">Activity Audit</h2>
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-600 text-center py-5 font-semibold">Nodes are quiet.</p>
              ) : (
                <div className="flex flex-col gap-2 border-l border-white/5 pl-3">
                  {notifications.map((n, i) => (
                    <div key={n._id || i} className={`py-1.5 anim-fade-up-2`}>
                      <div className="text-xs font-bold text-slate-200 tracking-tight">{n.title}</div>
                      <div className="text-[10px] text-slate-600 font-medium mt-0.5 truncate">{n.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── FOOTER SYSTEM MARKER ───────────────────────── */}
        <footer className="mt-14 pt-6 border-t border-white/[0.03] text-center text-[10px] font-black font-mono tracking-widest text-[#1c213b] uppercase">
          Authorization Clear Node: SPMS-V1.0 // Secured HUB
        </footer>
      </div>
    </div>
  )
}