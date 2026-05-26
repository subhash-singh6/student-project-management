import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../constants/context/AuthContext";
import { getNavForRole } from "../constants/navigation";
import NotificationDropdown from "../components/NotificationDropdown";
import { notificationService } from "../services/notificationService";
import toast from "react-hot-toast";
import { FiMenu, FiShield, FiBell } from "react-icons/fi";

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
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navItems = getNavForRole(user?.role);

  useEffect(() => {
    fetchUnread();
  }, []);

  const fetchUnread = async () => {
    try {
      const data = await notificationService.getAll();
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-slate-100 flex overflow-hidden relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[220px] -left-[220px] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-indigo-500/5 to-transparent blur-[120px]" />
        <div className="absolute bottom-[-250px] right-[-250px] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/5 to-transparent blur-[120px]" />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 shrink-0 border-r border-slate-700 bg-[#0B1220]/95 backdrop-blur-xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${accent}, #818cf8)`,
              }}
            >
              <FiShield />
            </div>
            <div>
              <div className="font-black text-lg tracking-tight text-white">SPMS</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mt-1">
                {portalLabel}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-500/15 border border-indigo-500/20 text-indigo-300"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100 hover:translate-x-1"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="relative z-10 flex-1 flex flex-col min-w-0 md:ml-72">
        <header className="sticky top-0 z-30 border-b border-slate-700 bg-[#060A12]/70 backdrop-blur-xl px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-xl border border-slate-700 hover:bg-white/[0.05] transition-all"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiMenu size={20} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
                {title}
              </h1>
              {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative w-12 h-12 rounded-2xl bg-white/[0.04] border border-slate-700 flex items-center justify-center hover:bg-white/[0.08] transition-all"
              >
                <FiBell />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown open={notificationOpen} setOpen={setNotificationOpen} />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}