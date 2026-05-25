// frontend/src/pages/teacher/TeacherDashboard.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '../../constants/context/AuthContext'
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
    pending:       { color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10',    label: 'Pending' },
    approved:      { color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', label: 'Approved' },
    'in-progress': { color: 'text-indigo-400', border: 'border-indigo-500/20', bg: 'bg-indigo-500/10',  label: 'In Progress' },
    completed:     { color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10',    label: 'Completed' },
    rejected:      { color: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/10',    label: 'Rejected' },
  }

  const navItems = [
    { icon: '📁', label: 'All Projects',    sub: 'Review & approve',  path: '/teacher/projects', color: 'text-amber-400', hoverGlow: 'hover:border-amber-400/40' },
    { icon: '⭐', label: 'Give Grades',     sub: 'Grade submissions', path: '/teacher/grades',   color: 'text-orange-400', hoverGlow: 'hover:border-orange-400/40' },
    { icon: '👥', label: 'All Teams',       sub: 'View active squads', path: '/teacher/projects', color: 'text-yellow-400', hoverGlow: 'hover:border-yellow-400/40' },
    { icon: '🧑‍💼', label: 'Assign Mentor',  sub: 'Manage coordinators',path: '/teacher/projects', color: 'text-red-400', hoverGlow: 'hover:border-red-400/40' },
  ]

  if (loading) return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center gap-5">
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div className="w-14 h-14 border-4 border-amber-500/20 border-t-amber-500 rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
      <p className="text-sm font-bold tracking-widest text-[#94a3b8] animate-pulse">Assembling Faculty Terminal...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f8fafc] font-sans relative overflow-hidden selection:bg-amber-500/20 selection:text-amber-400">
      
      {/* ── Dynamic Design Styles & Animations ────────────────── */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseGlow { 0%,100% { transform:scale(1); opacity:0.5; } 50% { transform:scale(1.08); opacity:0.8; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        
        .anim-fade-up { animation: fadeUp 0.6s ease both; }
        .anim-fade-up-1 { animation: fadeUp 0.6s ease 0.08s both; }
        .anim-fade-up-2 { animation: fadeUp 0.6s ease 0.16s both; }
        .anim-fade-up-3 { animation: fadeUp 0.6s ease 0.24s both; }
        .anim-float { animation: float 3.5s ease-in-out infinite; }
        .animation-pulse-glow { animation: pulseGlow 7s ease-in-out infinite; }
      `}</style>

      {/* ── Branded Background Blobs (Sunset Amber Aura) ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[50%] -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-600/5 to-transparent blur-[80px] animation-pulse-glow" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* ── NAVBAR ──────────────────────────────────────── */}
        <header className="anim-fade-up flex items-center justify-between gap-4 mb-10 pb-5 border-b border-white/[0.04]">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
              👨‍🏫
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white font-display">SPMS</div>
              <div className="text-[10px] font-black tracking-widest text-amber-400 uppercase">Teacher Board</div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <div className="bg-white/[0.02] border border-white/5 rounded-full px-5 py-2.5 text-xs font-semibold text-[#475569] tracking-wider">
              🕐 {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
            
            <div className="relative">
              <div className="w-10 h-10 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center text-base cursor-pointer hover:bg-white/[0.06] hover:border-white/10 transition-colors">
                🔔
              </div>
              {stats.notifications > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-[#070b14] rounded-full w-5 h-5 text-xs font-black flex items-center justify-center animate-bounce">
                  {stats.notifications}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => { logout(); navigate('/login'); toast.success('Logged out successfully!') }} 
              className="px-5 py-2.5 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 hover:border-rose-500/30 transition-all duration-200"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* ── PROFILE GREETING HUB ───────────────────────── */}
        <section className="anim-fade-up-1 bg-gradient-to-br from-amber-500/[0.08] to-transparent border border-amber-500/15 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
            <div className="text-center sm:text-left">
              <div className="text-xs font-extrabold text-amber-400 uppercase tracking-widest mb-1.5">{greeting()} Panel</div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tighter text-white mb-5">{user?.name}</h1>
              
              <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                {user?.department && <span className="bg-white/[0.04] border border-white/5 text-[#94a3b8] px-3 py-1 rounded-lg text-xs font-semibold">🏫 Dept: {user.department}</span>}
                {user?.employeeId && <span className="bg-white/[0.04] border border-white/5 text-[#94a3b8] px-3 py-1 rounded-lg text-xs font-semibold">🪪 ID: {user.employeeId}</span>}
                {user?.subjects?.slice(0, 2).map((s) => (
                  <span key={s} className="bg-amber-500/5 border border-amber-500/10 text-amber-400 px-3 py-1 rounded-lg text-xs font-semibold">📖 {s}</span>
                ))}
              </div>
            </div>
            
            <div className="text-right w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-5 sm:pt-0">
              <div className="text-sm text-[#475569] font-medium mb-2.5 tracking-wide">{time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
              {stats.pending > 0 ? (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-black bg-amber-500/15 border border-amber-500/20 text-amber-400 animate-pulse">
                  ⏳ {stats.pending} Pending Reviews
                </span>
              ) : (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-black bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                  ✅ System Fully Evaluated
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ── CORE COUNTERS GRID ──────────────────────────── */}
        <section className="anim-fade-up-2 grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Submissions', value: stats.total, icon: '📁', bg: 'bg-indigo-500/10 border-indigo-500/20', hover: 'hover:border-indigo-400 group', color: 'text-indigo-400' },
            { label: 'Awaiting Action', value: stats.pending, icon: '⏳', bg: 'bg-amber-500/10 border-amber-500/20', hover: 'hover:border-amber-400 group', color: 'text-amber-400' },
            { label: 'Approved Nodes', value: stats.approved, icon: '✅', bg: 'bg-emerald-500/10 border-emerald-500/20', hover: 'hover:border-emerald-400 group', color: 'text-emerald-400' },
            { label: 'Alert Signals', value: stats.notifications, icon: '🔔', bg: 'bg-cyan-500/10 border-cyan-500/20', hover: 'hover:border-cyan-400 group', color: 'text-cyan-400' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-2xl p-6 transition-all duration-200 ${s.hover}`}>
              <div className="text-2xl mb-4 opacity-90 group-hover:scale-105 transition-transform">{s.icon}</div>
              <div className={`text-3xl font-black text-white tracking-tighter transition-colors ${s.color}`}>{s.value}</div>
              <div className="text-[11px] text-[#475569] font-bold mt-1.5 tracking-wide uppercase">{s.label}</div>
            </div>
          ))}
        </section>

        {/* ── MAIN ACTIONS & SYNCED RECENT TABLE GRID ──────── */}
        <div className="anim-fade-up-3 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Submissions Table Stream */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-extrabold tracking-widest text-[#475569] uppercase">Recent Project Activity</h2>
              <button onClick={() => navigate('/teacher/projects')} className="text-xs font-extrabold text-amber-400 hover:text-amber-300 transition-colors bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/10">View Roster →</button>
            </div>
            
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
              {recentProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <div className="text-5xl opacity-20 anim-float">📂</div>
                  <p className="text-xs text-[#475569] font-bold">No projects uploaded to stream yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                        <th className="p-4 text-[10px] font-extrabold tracking-widest text-[#475569] uppercase">Project Module</th>
                        <th className="p-4 text-[10px] font-extrabold tracking-widest text-[#475569] uppercase">Uploader</th>
                        <th className="p-4 text-[10px] font-extrabold tracking-widest text-[#475569] uppercase text-right">Status State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                      {recentProjects.map((p) => {
                        const state = STATUS_MAP[p.status] || STATUS_MAP.pending
                        return (
                          <tr 
                            key={p._id} 
                            onClick={() => navigate('/teacher/projects')}
                            className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                          >
                            <td className="p-4">
                              <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors truncate max-w-[200px] sm:max-w-xs">{p.title}</div>
                              <div className="text-[10px] text-[#475569] font-semibold mt-0.5">{p.category}</div>
                            </td>
                            <td className="p-4 text-xs font-medium text-slate-400">
                              {p.createdBy?.name || 'Unknown'}
                            </td>
                            <td className="p-4 text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${state.bg} ${state.color} border ${state.border}`}>
                                {state.label}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Stack / Notifications */}
          <div className="flex flex-col gap-6">
            
            {/* Launch Actions */}
            <div>
              <h2 className="text-xs font-extrabold tracking-widest text-[#475569] uppercase mb-4">Operations Console</h2>
              <div className="grid grid-cols-2 gap-3.5">
                {navItems.map((item) => (
                  <div 
                    key={item.label} 
                    onClick={() => navigate(item.path)} 
                    className={`bg-white/[0.03] border border-white/5 ${item.hoverGlow} rounded-2xl p-5 cursor-pointer transition-all duration-300 group relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40`}
                  >
                    <div className="text-2xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <div className="text-xs font-extrabold text-[#f1f5f9] tracking-tight mb-0.5">{item.label}</div>
                    <div className="text-[10px] text-[#475569] font-semibold leading-tight">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications Activity Tracker */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex-1 backdrop-blur-md">
              <h2 className="text-xs font-extrabold tracking-widest text-[#475569] uppercase mb-4">Live Activity Streams</h2>
              {notifications.length === 0 ? (
                <p className="text-xs text-[#475569] text-center font-bold py-8">Streams are clean and quiet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {notifications.map((n, i) => (
                    <div 
                      key={n._id || i} 
                      className={`rounded-xl p-3.5 border transition-all ${
                        n.isRead ? 'bg-white/[0.01] border-white/5 opacity-60' : 'bg-amber-500/[0.03] border-amber-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                        <div className="text-xs font-bold text-slate-200 tracking-tight">{n.title}</div>
                      </div>
                      <div className="text-[10px] text-[#475569] font-semibold mt-1 leading-relaxed">
                        {n.message?.slice(0, 65)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ── FOOTER SYSTEM MARKER ───────────────────────── */}
        <footer className="mt-14 pt-6 border-t border-white/[0.03] text-center text-[10px] font-black font-mono tracking-widest text-[#24211a] uppercase">
          Faculty Node Stream: SPMS-V1.0 // Authorization Authenticated
        </footer>
      </div>
    </div>
  )
}