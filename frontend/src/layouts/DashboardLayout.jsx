import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../constants/context/AuthContext";
import { getNavForRole } from "../constants/navigation";
import toast from "react-hot-toast";

export default function DashboardLayout({
  children,
  title,
  subtitle,
  portalLabel = "SPMS Portal",
  accent = "#6366f1",
}) {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = getNavForRole(user?.role);

  const handleLogout = () => {
    logout();

    navigate("/login");

    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-slate-100 flex overflow-hidden relative">
      {/* Ambient Background */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[220px] -left-[220px] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-amber-500/5 to-transparent blur-[120px]" />

        <div className="absolute bottom-[-250px] right-[-250px] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/5 to-transparent blur-[120px]" />
      </div>

      {/* Mobile Overlay */}

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 shrink-0
          border-r border-white/10
          bg-[#0B1220]/95
          backdrop-blur-xl
          z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}

        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${accent}, #22d3ee)`,
              }}
            >
              🎓
            </div>

            <div>
              <div className="font-black text-lg tracking-tight text-white">
                SPMS
              </div>

              <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mt-1">
                {portalLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300

                ${
                  isActive
                    ? `
                      bg-gradient-to-r
                      from-indigo-500/20
                      to-cyan-500/10
                      border border-indigo-500/20
                      text-indigo-300
                      shadow-lg shadow-indigo-500/10
                    `
                    : `
                      text-slate-400
                      hover:bg-white/[0.05]
                      hover:text-slate-100
                      hover:translate-x-1
                    `
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Card */}

        <div className="p-4 border-t border-white/10">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              {/* Avatar */}

              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-black text-black shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, #22d3ee)`,
                  }}
                >
                  {user?.name?.slice(0, 1)?.toUpperCase()}
                </div>

                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0B1220]" />
              </div>

              {/* User Info */}

              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate">
                  {user?.name}
                </div>

                <div className="text-xs text-slate-500 capitalize mt-1">
                  {user?.role}
                </div>
              </div>
            </div>

            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full
                py-2.5
                rounded-xl
                text-sm
                font-bold
                text-red-400
                border border-red-500/20
                bg-red-500/10
                hover:bg-red-500/20
                transition-all
              "
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN SECTION */}

      <div className="relative z-10 flex-1 flex flex-col min-w-0 md:ml-72">
        {/* TOPBAR */}

        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060A12]/70 backdrop-blur-xl px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          {/* Left */}

          <div className="flex items-center gap-4">
            {/* Mobile Menu */}

            <button
              className="md:hidden p-2 rounded-xl border border-white/10 hover:bg-white/[0.05] transition-all"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>

            {/* Title */}

            <div>
              <h1
                className="text-2xl md:text-3xl font-black tracking-tight text-white"
                style={{
                  fontFamily: "Syne, sans-serif",
                }}
              >
                {title}
              </h1>

              {subtitle && (
                <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right */}

          <div className="flex items-center gap-3">
            {/* Search */}

            <div className="hidden lg:flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 min-w-[220px]">
              <span className="text-slate-500">🔍</span>

              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm w-full placeholder:text-slate-500"
              />
            </div>

            {/* Notifications */}

            <button
              className="
                w-12 h-12
                rounded-2xl
                bg-white/[0.04]
                border border-white/10
                flex items-center justify-center
                hover:bg-white/[0.08]
                transition-all
              "
            >
              🔔
            </button>

            {/* Profile */}

            <div className="hidden sm:flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl px-3 py-2">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-black"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, #22d3ee)`,
                  }}
                >
                  {user?.name?.slice(0, 1)?.toUpperCase()}
                </div>

                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#060A12]" />
              </div>

              <div>
                <div className="text-sm font-semibold text-white">
                  {user?.name}
                </div>

                <div className="text-xs text-slate-500 capitalize">
                  {user?.role}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
