import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  FiUsers,
  FiFolder,
  FiActivity,
  FiShield,
  FiGrid,
  FiTrendingUp,
  FiSettings,
  FiFileText,
  FiToggleLeft,
} from "react-icons/fi";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    activeUsers: 0,
    pendingProjects: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [usersRes, projectsRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/projects"),
      ]);

      const usersData = usersRes.data.users || [];
      const projectsData = projectsRes.data.projects || [];

      setUsers(usersData);
      setProjects(projectsData);

      const activeUsers = usersData.filter((u) => u.isActive).length;
      const pendingProjects = projectsData.filter((p) => p.status === "pending").length;

      setStats({
        totalUsers: usersData.length,
        totalProjects: projectsData.length,
        activeUsers,
        pendingProjects,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await API.put(`/admin/users/${id}/toggle`);
      toast.success("User status updated");
      fetchDashboard();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const quickActions = [
    { title: "Users", icon: <FiUsers />, path: "/admin/users" },
    { title: "Projects", icon: <FiFolder />, path: "/admin/projects" },
    { title: "Analytics", icon: <FiTrendingUp />, path: "/analytics" },
    { title: "Logs", icon: <FiShield />, path: "/admin/logs" },
  ];

  const statCards = [
    { icon: <FiUsers />, title: "Users", value: stats.totalUsers },
    { icon: <FiFolder />, title: "Projects", value: stats.totalProjects },
    { icon: <FiActivity />, title: "Active", value: stats.activeUsers },
    { icon: <FiGrid />, title: "Pending", value: stats.pendingProjects },
  ];

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="System governance and control center"
      accent="#6366f1"
      portalLabel="Admin Core"
    >
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
                Admin Control Panel
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              System Governance Dashboard
            </h1>

            <p className="mt-5 max-w-2xl leading-relaxed text-slate-400">
              Monitor platform activity, manage users, control projects and maintain overall system health.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-indigo-500/20 hover:bg-white/[0.04]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-2xl text-indigo-300">
                {card.icon}
              </div>

              <div className="text-4xl font-bold text-indigo-400">
                {loading ? "--" : card.value}
              </div>

              <div className="mt-3 text-sm text-slate-400">
                {card.title}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  User Governance
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Manage all platform users
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/users")}
                className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300 transition-all hover:bg-indigo-500/20"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[850px] w-full">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-500">
                    <th className="px-6 py-5 text-left">User</th>
                    <th className="px-6 py-5 text-left">Role</th>
                    <th className="px-6 py-5 text-left">Status</th>
                    <th className="px-6 py-5 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.slice(0, 8).map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-white/5 hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-5">
                        <div className="font-semibold text-white">
                          {user.name}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          {user.email}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase text-slate-300">
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            user.isActive
                              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : "border border-red-500/20 bg-red-500/10 text-red-400"
                          }`}
                        >
                          {user.isActive ? "ACTIVE" : "BLOCKED"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <button
                          onClick={() => toggleStatus(user._id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-300 transition-all hover:bg-indigo-500/20"
                        >
                          <FiToggleLeft />
                          Toggle Access
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-5 text-xl font-bold text-white">
                Quick Actions
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    onClick={() => navigate(action.path)}
                    className="rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-5 text-sm font-semibold text-white transition-all duration-300 hover:border-indigo-500/20 hover:bg-white/[0.05]"
                  >
                    <div className="mb-3 text-3xl text-indigo-300">
                      {action.icon}
                    </div>
                    {action.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-5 text-xl font-bold text-white">
                Recent Projects
              </h2>

              <div className="space-y-4">
                {projects.slice(0, 4).map((project) => (
                  <div
                    key={project._id}
                    className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                  >
                    <div className="text-sm font-semibold text-white">
                      {project.title}
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Status: {project.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}