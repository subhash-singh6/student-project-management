import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getNavForRole } from '../constants/navigation'
import toast from 'react-hot-toast'

export default function DashboardLayout({
  children,
  title,
  subtitle,
  portalLabel = 'SPMS Portal',
  accent = '#6366f1',
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const navItems = getNavForRole(user?.role)

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex">
      <aside className="w-64 shrink-0 border-r border-white/10 bg-[#0a0f1c] flex flex-col hidden md:flex">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${accent}, #22d3ee)` }}
            >
              🎓
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight">SPMS</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">{portalLabel}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-slate-500 mb-1">Signed in as</div>
          <div className="text-sm font-semibold text-slate-200 truncate">{user?.name}</div>
          <div className="text-xs text-slate-500 capitalize mb-3">{user?.role}</div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 rounded-lg text-sm font-semibold text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070b14]/90 backdrop-blur-md px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100" style={{ fontFamily: 'Syne, sans-serif' }}>
              {title}
            </h1>
            {subtitle && <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 md:hidden overflow-x-auto max-w-full pb-1">
            {navItems.slice(0, 4).map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs border ${
                  location.pathname === item.path
                    ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300'
                    : 'border-white/10 text-slate-400'
                }`}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
