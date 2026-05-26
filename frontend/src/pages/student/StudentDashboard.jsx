import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { FiFolder, FiClock, FiUsers, FiCheckCircle, FiLogOut, FiArrowRight, FiLayout, FiMessageSquare, FiBookOpen } from "react-icons/fi";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProjects: 0, completedProjects: 0, pendingProjects: 0, totalTeams: 0 });

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get("/projects");
      const data = res.data.projects || [];
      setProjects(data);
      setStats({
        totalProjects: data.length,
        completedProjects: data.filter((p) => p.status === "completed").length,
        pendingProjects: data.filter((p) => p.status !== "completed").length,
        totalTeams: new Set(data.filter((p) => p.team?._id).map((p) => p.team._id)).size,
      });
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <DashboardLayout title="Student Dashboard" portalLabel="Student Hub" accent="#6366f1">
      <div className="space-y-6">
        
        {/* HEADER WITH LOGOUT */}
        <div className="flex justify-between items-center bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Student Workspace</h1>
            <p className="text-slate-400 text-sm">Manage your academic journey effectively</p>
          </div>
          {/* <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition text-sm font-medium"
          >
            <FiLogOut /> Logout
          </button> */}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { title: "Projects", value: stats.totalProjects, icon: <FiFolder /> },
            { title: "Pending", value: stats.pendingProjects, icon: <FiClock /> },
            { title: "Teams", value: stats.totalTeams, icon: <FiUsers /> },
            { title: "Completed", value: stats.completedProjects, icon: <FiCheckCircle /> },
          ].map((card, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition">
              <div className="text-indigo-400 text-xl mb-3">{card.icon}</div>
              <div className="text-3xl font-bold text-white">{loading ? "--" : card.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{card.title}</div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* PROJECTS */}
          <div className="xl:col-span-2 bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-bold text-white">Active Projects</h2>
              <button onClick={() => navigate("/student/projects")} className="text-xs text-indigo-400 font-semibold hover:underline">View All</button>
            </div>
            <div className="divide-y divide-white/5">
              {projects.slice(0, 5).map((p) => (
                <div key={p._id} onClick={() => navigate(`/student/project/${p._id}`)} className="flex items-center justify-between p-4 hover:bg-white/[0.03] cursor-pointer group">
                  <span className="text-sm text-slate-300 font-medium">{p.title}</span>
                  <FiArrowRight className="text-slate-600 group-hover:text-indigo-400" />
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Projects", icon: <FiFolder />, path: "/student/projects" },
                { name: "Kanban", icon: <FiLayout />, path: "/student/kanban" },
                { name: "Team", icon: <FiUsers />, path: "/student/team" },
                { name: "Subjects", icon: <FiBookOpen />, path: "/student/enroll-subject" },
              ].map((a, i) => (
                <button key={i} onClick={() => navigate(a.path)} className="flex flex-col items-center justify-center p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:border-indigo-500/30 transition text-slate-300 text-xs font-semibold gap-2">
                  <div className="text-lg text-indigo-400">{a.icon}</div>
                  {a.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}