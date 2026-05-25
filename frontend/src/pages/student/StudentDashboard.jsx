// frontend/src/pages/student/StudentDashboard.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../../constants/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ projects: 0, team: 0, submissions: 0, notifications: 0 })
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
      let teamExists = 0
      try { 
        await API.get('/teams/my')
        teamExists = 1 
      } catch {}

      setStats({
        projects: projRes.data.count || 0,
        team: teamExists,
        submissions: projRes.data.submissionsCount || 0, // Backend aggregated value
        notifications: notifRes.data.unreadCount || 0,
      })
      setNotifications(notifRes.data.notifications?.slice(0, 4) || [])
    } catch (e) {
      console.log('Dashboard pipeline synchronization error:', e.message)
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

  // Purely structured links mapping only implemented components
  const navItems = [
    { icon: '📁', label: 'My Projects',       sub: 'Create & manage project profiles', path: '/student/projects', color: 'text-teal-400' },
    { icon: '👥', label: 'My Team',           sub: 'Form groups with peers',          path: '/student/team',     color: 'text-emerald-400' },
    { icon: '📚', label: 'Enroll in Subject', sub: 'Link project to a course code',    path: '/student/enroll-subject', color: 'text-sky-400' },
    { icon: '📋', label: 'Kanban Tasks',      sub: 'Track progress milestones',       path: '/student/kanban',   color: 'text-blue-400' },
  ]

  if (loading) return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center gap-5">
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div className="w-14 h-14 border-4 border-teal-500/20 border-t-teal-400 rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
      <p className="text-sm font-semibold tracking-widest text-[#94a3b8] animate-pulse">Initializing Student Hub...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f8fafc] font-sans relative overflow-hidden selection:bg-teal-500/20 selection:text-teal-400">
      
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseGlow { 0%,100% { transform:scale(1); opacity:0.6; } 50% { transform:scale(1.1); opacity:1; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        
        .animation-fade-up { animation: fadeUp 0.6s ease both; }
        .animation-float { animation: float 4s ease-in-out infinite; }
        .animation-pulse-glow { animation: pulseGlow 8s ease-in-out infinite; }
      `}</style>

      {/* Ambient Visual Background */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-teal-500/10 to-transparent blur-[80px]" />
        <div className="absolute top-[40%] -right-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-500/5 to-transparent blur-[70px] animation-pulse-glow" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* TOP ACTION BAR / NAVBAR */}
        <header className="animation-fade-up flex items-center justify-between gap-4 mb-10 pb-5 border-b border-white/[0.04]">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-teal-500/20">
              🎓
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-white">SPMS</div>
              <div className="text-[10px] font-extrabold tracking-widest text-teal-400 uppercase">Student Hub</div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <div className="bg-white/[0.02] border border-white/5 rounded-full px-5 py-2.5 text-xs font-semibold text-slate-400 tracking-wider">
              🕐 {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
            
            <div className="relative">
              <div className="w-10 h-10 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center text-base cursor-pointer hover:bg-white/[0.06] hover:border-white/10 transition-colors">
                🔔
              </div>
              {stats.notifications > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-teal-500 text-[#070b14] rounded-full w-5 h-5 text-xs font-black flex items-center justify-center animate-bounce">
                  {stats.notifications}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => { logout(); navigate('/login'); toast.success('Logged out successfully!') }} 
              className="px-5 py-2.5 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 hover:border-rose-500/30 transition-all duration-200"
            >
              Terminate Session
            </button>
          </div>
        </header>

        {/* PROFILE GREETING HUB */}
        <section className="animation-fade-up bg-gradient-to-br from-teal-500/[0.08] to-transparent border border-teal-500/15 rounded-3xl p-8 mb-8 relative">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
            <div className="text-center sm:text-left">
              <div className="text-xs font-extrabold text-teal-400 uppercase tracking-widest mb-1.5">{greeting()} 👋</div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-white mb-5">{user?.name}</h1>
              
              <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                {user?.branch && <span className="bg-white/[0.04] border border-white/5 text-[#94a3b8] px-3 py-1 rounded-lg text-xs font-semibold">🏫 Branch: {user.branch}</span>}
                {user?.semester && <span className="bg-white/[0.04] border border-white/5 text-[#94a3b8] px-3 py-1 rounded-lg text-xs font-semibold">📚 Semester {user.semester}</span>}
                {user?.enrollmentNumber && <span className="bg-white/[0.04] border border-white/5 text-[#94a3b8] px-3 py-1 rounded-lg text-xs font-semibold">🪪 ID: {user.enrollmentNumber}</span>}
              </div>
            </div>
            
            <div className="text-right w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-5 sm:pt-0">
              <div className="text-sm text-slate-500 font-medium mb-2.5 tracking-wide">{time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-black ${stats.projects > 0 ? 'bg-teal-500/15 border border-teal-500/20 text-teal-400' : 'bg-amber-500/15 border border-amber-500/20 text-amber-400'}`}>
                {stats.projects > 0 ? '● Active Academic Track' : '○ Pending Project Build'}
              </span>
            </div>
          </div>
        </section>

        {/* CORE STATISTICS TRACKER */}
        <section className="animation-fade-up grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Active Projects', value: stats.projects, icon: '📁', bg: 'bg-teal-500/10 border-teal-500/20', color: 'text-teal-400' },
            { label: 'Workspace Team', value: stats.team ? 'Group Sync\'d' : 'Independent', icon: '👥', bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-400' },
            { label: 'Artifact Submissions', value: stats.submissions, icon: '📤', bg: 'bg-cyan-500/10 border-cyan-500/20', color: 'text-cyan-400' },
            { label: 'Unread Alerts', value: stats.notifications, icon: '🔔', bg: 'bg-amber-500/10 border-amber-500/20', color: 'text-amber-400' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-2xl p-6 group transition-all duration-200`}>
              <div className="text-2xl mb-4 opacity-90 group-hover:scale-105 transition-transform">{s.icon}</div>
              <div className={`text-3xl font-black text-white tracking-tighter ${s.color}`}>{s.value}</div>
              <div className="text-[11px] text-slate-500 font-bold mt-1.5 tracking-wide uppercase">{s.label}</div>
            </div>
          ))}
        </section>

        {/* DASHBOARD ACTIONS & WORKSPACE ACTIVITIES */}
        <div className="animation-fade-up grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Action Grid Panel */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-extrabold tracking-widest text-slate-500 uppercase mb-4">Workspace Launchpad</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {navItems.map((item) => (
                <div 
                  key={item.label} 
                  onClick={() => navigate(item.path)} 
                  className="bg-white/[0.03] border border-white/5 hover:border-teal-500/30 rounded-2xl p-6 cursor-pointer transition-all duration-300 group relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{item.icon}</div>
                    <div className="text-[11px] text-teal-400 font-extrabold opacity-0 group-hover:opacity-100 transition-opacity">Launch ↗</div>
                  </div>
                  <h3 className={`text-base font-bold text-[#f1f5f9] mt-5 mb-0.5 tracking-tight group-hover:${item.color} transition-colors`}>{item.label}</h3>
                  <p className="text-[11px] text-slate-500 font-semibold">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activities Panel */}
          <div>
            <h2 className="text-xs font-extrabold tracking-widest text-slate-500 uppercase mb-4">System Notifications</h2>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 min-h-[280px]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-4xl opacity-30 animation-float mb-4">📭</div>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed max-w-sm">
                    No active notifications found.<br />Your pipeline is clear for progress.
                  </p>
                  <button 
                    onClick={() => navigate('/student/projects')} 
                    className="mt-5 px-5 py-2.5 text-xs font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded-xl hover:bg-teal-500/20 transition-colors"
                  >
                    Build First Project
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {notifications.map((n, i) => (
                    <div 
                      key={n._id || i} 
                      className={`rounded-xl p-4 border transition-all ${
                        n.isRead ? 'bg-white/[0.01] border-white/5 opacity-70' : 'bg-teal-500/[0.04] border-teal-500/10'
                      }`}
                    >
                      {!n.isRead && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400 mb-1.5 animate-pulse" />
                      )}
                      <h4 className="text-xs font-bold text-[#f1f5f9] tracking-tight">{n.title}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
                        {n.message?.slice(0, 80)}{n.message?.length > 80 ? '...' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* FOOTER SYSTEM MARKER */}
        <footer className="mt-14 pt-6 border-t border-white/[0.03] text-center text-[10px] font-black font-mono tracking-widest text-[#1c253b] uppercase">
          System Secure // Core Secured Hub v1.0
        </footer>
      </div>
    </div>
  )
}