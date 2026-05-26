// frontend/src/pages/student/ProjectDetails.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Layout, KanbanSquare, Users, 
  Code2, GitBranch, Info, CalendarDays, ExternalLink 
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../api/axios";
import toast from "react-hot-toast";

import KanbanBoard from "./KanbanBoard";
import MyTeam from "./MyTeam";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState("overview");

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      setProject(res.data.project);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load project details");
      navigate("/student/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060A12] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return <div className="min-h-screen bg-[#060A12] flex items-center justify-center text-slate-400">Project not found.</div>;
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: <Info size={16} /> },
    { id: "kanban", label: "Kanban Tasks", icon: <KanbanSquare size={16} /> },
    { id: "team", label: "Team", icon: <Users size={16} /> },
  ];

  return (
    <DashboardLayout title="Project Details" subtitle="Manage your complete project workspace" accent="#6366f1" portalLabel="Student Hub">
      <div className="space-y-8 text-slate-300">
        <div>
          <button onClick={() => navigate("/student/dashboard")} className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 text-xs font-bold uppercase tracking-wider transition-all">
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              {project.category || "General Project"}
            </div>
            <h1 className="text-4xl font-black text-white mt-6 leading-tight">{project.title}</h1>
            <p className="text-slate-400 mt-5 max-w-3xl leading-relaxed">{project.description || "No description available."}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Linked Subject</div>
            {project.subject ? (
              <div>
                <div className="text-indigo-400 font-bold text-lg">{project.subject?.name}</div>
                <div className="text-slate-500 text-sm mt-1">{project.subject?.code}</div>
              </div>
            ) : (
              <button onClick={() => navigate("/student/enroll-subject")} className="text-indigo-300 text-sm font-semibold hover:text-indigo-200 transition">
                Enroll Subject +
              </button>
            )}
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Project Status</div>
            <div className="inline-flex px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-bold uppercase">
              {project.status || "Active"}
            </div>
            <div className="text-slate-500 text-sm mt-5 flex items-center gap-2">
              <CalendarDays size={14} /> {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Git Repository</div>
            <div className="flex items-center gap-2 bg-[#060A12] border border-white/10 rounded-2xl px-4 py-3">
              <GitBranch size={16} className="text-slate-600" />
              <input type="text" readOnly value={project.gitRepo || "No repo linked"} className="w-full bg-transparent text-slate-400 text-sm outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2"><Code2 size={20} className="text-indigo-400" /> Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {project.techStack?.length > 0 ? (
              project.techStack.map((tech, i) => (
                <span key={i} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-4 py-2 rounded-xl text-sm font-medium">
                  {tech}
                </span>
              ))
            ) : (
              <span className="text-slate-500 text-sm">No technologies added.</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 border-b border-white/10 pb-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} className={`flex items-center gap-2 pb-4 text-sm font-bold uppercase tracking-wider transition-all ${activeSubTab === tab.id ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}>
              {tab.icon} {tab.label}
              {activeSubTab === tab.id && <div className="absolute -bottom-[2px] h-[2px] w-20 bg-indigo-500 rounded-full" />}
            </button>
          ))}
        </div>

        <div>
          {activeSubTab === "overview" && (
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-5">Project Overview</h2>
              <p className="text-slate-400 leading-relaxed">{project.description || "No overview available."}</p>
            </div>
          )}
          {activeSubTab === "kanban" && <KanbanBoard projectId={id} />}
          {activeSubTab === "team" && <MyTeam projectId={id} projectData={project} onUpdate={fetchProjectDetails} />}
        </div>
      </div>
    </DashboardLayout>
  );
}