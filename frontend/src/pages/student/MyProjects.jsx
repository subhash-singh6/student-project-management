// frontend/src/pages/student/MyProjects.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { submissionService } from "../../services/submissionService";
import toast from "react-hot-toast";

const STATUS_MAP = {
  pending: {
    theme: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    label: "⏳ Pending",
  },
  approved: {
    theme: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    label: "✅ Approved",
  },
  "in-progress": {
    theme: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    label: "🔄 In Progress",
  },
  completed: {
    theme: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    label: "🏆 Completed",
  },
  rejected: {
    theme: "text-red-400 bg-red-500/10 border-red-500/20",
    label: "❌ Rejected",
  },
};

export default function MyProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitFile, setSubmitFile] = useState(null);
  const [submitTitle, setSubmitTitle] = useState("");
  const [submitDesc, setSubmitDesc] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Web Development",
    techStack: "",
    deadline: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data.projects || []);
    } catch (err) {
      toast.error("Failed to load project parameters!");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description)
      return toast.error("Title and description metrics are required!");
    setSubmitting(true);
    try {
      await API.post("/projects", {
        ...form,
        techStack: form.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      toast.success("Project pipeline initialized! 🎉");
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        category: "Web Development",
        techStack: "",
        deadline: "",
      });
      fetchProjects();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to register configuration.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to terminate this project pipeline?"))
      return;
    try {
      await API.delete(`/projects/${id}`);
      toast.success("Project pipeline deleted successfully.");
      fetchProjects();
    } catch (err) {
      toast.error("Termination execution failed.");
    }
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    if (!submitTitle) return toast.error("Submission title token required!");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", submitTitle);
      formData.append("description", submitDesc);
      formData.append("project", selectedProject._id);
      if (submitFile) formData.append("file", submitFile);

      await submissionService.create(formData);
      toast.success("Data package payload submitted! 🎉");
      setShowSubmitForm(false);
      setSubmitTitle("");
      setSubmitDesc("");
      setSubmitFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Payload delivery failed!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center gap-5 font-sans">
        <div className="w-14 h-14 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase animate-pulse">
          Syncing Project Frameworks...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#070b14] font-sans text-slate-100 relative overflow-x-hidden">
      {/* Ambient Radial Background Auras */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-500/5 to-transparent blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-cyan-500/5 to-transparent blur-[90px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-6 py-10 relative z-10">
        {/* Top Control Header Panel */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-10 animate-fadeUp">
          <div>
            <button
              onClick={() => navigate("/student/dashboard")}
              className="bg-white/[0.02] border border-white/5 hover:border-white/10 text-slate-400 hover:text-white text-xs font-semibold mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all active:scale-95"
            >
              ← Back to Terminal
            </button>
            <h1 className="text-3xl font-black text-white tracking-tight">
              📁 Managed Projects
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase mt-1.5 tracking-wider">
              {projects.length} Total Deployment Stack
              {projects.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setShowSubmitForm(false);
            }}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 font-bold text-sm text-white px-6 py-3 rounded-xl hover:opacity-95 transition-transform active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            {showForm ? "Close Engine" : "+ New Framework"}
          </button>
        </div>

        {/* Project Setup Form (Expandable Panel) */}
        {showForm && (
          <div className="bg-[#0b1324]/90 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6 sm:p-8 mb-8 animate-fadeUp shadow-2xl shadow-black/40">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              ✨ Initialize Project Cluster
            </h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-wider">
                  Project Title Token *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Distributed Database Engine"
                  className="w-full bg-white/[0.02] border border-white/5 focus:border-indigo-500/30 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 font-medium outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-wider">
                  Functional Overview *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Elaborate on operational features and parameters..."
                  rows={3}
                  className="w-full bg-white/[0.02] border border-white/5 focus:border-indigo-500/30 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 font-medium outline-none transition-all resize-none"
                />
              </div>
              <div className="grid grid-template grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-wider">
                    Domain Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full bg-[#070b14] border border-white/5 focus:border-indigo-500/30 rounded-xl px-3 py-3 text-sm text-slate-200 outline-none transition-all cursor-pointer"
                  >
                    <option style={{ background: "#070b14" }}>
                      Web Development
                    </option>
                    <option style={{ background: "#070b14" }}>
                      Mobile App
                    </option>
                    <option style={{ background: "#070b14" }}>ML/AI</option>
                    <option style={{ background: "#070b14" }}>IoT</option>
                    <option style={{ background: "#070b14" }}>
                      Cybersecurity
                    </option>
                    <option style={{ background: "#070b14" }}>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-wider">
                    Deadline Metric
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm({ ...form, deadline: e.target.value })
                    }
                    className="w-full bg-white/[0.02] border border-white/5 focus:border-indigo-500/30 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-wider">
                  Tech Stack Tokens (comma separated)
                </label>
                <input
                  value={form.techStack}
                  onChange={(e) =>
                    setForm({ ...form, techStack: e.target.value })
                  }
                  placeholder="React, Node.js, MongoDB"
                  className="w-full bg-white/[0.02] border border-white/5 focus:border-indigo-500/30 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 font-medium outline-none transition-all"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 font-bold text-sm text-white py-3.5 rounded-xl hover:opacity-95 transition-all shadow-md shadow-indigo-400/10"
                >
                  {submitting
                    ? "Constructing Pipeline..."
                    : "Deploy Framework Stack →"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-white/[0.02] border border-white/5 font-bold text-sm text-slate-400 py-3.5 rounded-xl hover:bg-white/[0.04] transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payload Package Submission Sub-Form */}
        {showSubmitForm && selectedProject && (
          <div className="bg-[#0b1324]/90 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 sm:p-8 mb-8 animate-fadeUp shadow-2xl shadow-black/40">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              📤 Deploy Operational Submission
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase mb-5 tracking-wider">
              Pipeline: {selectedProject.title}
            </p>
            <form onSubmit={handleSubmission} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-wider">
                  Submission Header Title *
                </label>
                <input
                  value={submitTitle}
                  onChange={(e) => setSubmitTitle(e.target.value)}
                  placeholder="e.g. Production Release Candidate v1.0"
                  className="w-full bg-white/[0.02] border border-white/5 focus:border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 font-medium outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-wider">
                  Patch Notes / Description
                </label>
                <textarea
                  value={submitDesc}
                  onChange={(e) => setSubmitDesc(e.target.value)}
                  placeholder="Provide patch logs or implementation details..."
                  rows={2}
                  className="w-full bg-white/[0.02] border border-white/5 focus:border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 font-medium outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-wider">
                  Binary Payload File Attachment (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setSubmitFile(e.target.files[0])}
                  className="w-full bg-white/[0.02] border border-white/5 focus:border-emerald-500/20 rounded-xl px-4 py-3 text-sm text-slate-400 outline-none cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-white/5 file:text-slate-300 hover:file:bg-white/10"
                />
                {submitFile && (
                  <p className="text-emerald-400 text-xs font-bold mt-2 flex items-center gap-1.5">
                    <span>✅</span> Stack ready: {submitFile.name}
                  </p>
                )}
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-sm text-[#070b14] py-3.5 rounded-xl hover:opacity-95 transition-all shadow-md shadow-emerald-400/10"
                >
                  {submitting ? "Shipping Payload..." : "Push Submission Log →"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="flex-1 bg-white/[0.02] border border-white/5 font-bold text-sm text-slate-400 py-3.5 rounded-xl hover:bg-white/[0.04] transition-all"
                >
                  Abort
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Core Frame Frameworks List Rendering */}
        {projects.length === 0 ? (
          <div className="text-center py-24 px-6 bg-[#0b1324]/40 backdrop-blur-md border border-white/[0.04] rounded-3xl animate-fadeUp shadow-xl shadow-black/20">
            <div className="text-6xl opacity-15 mb-4 animate-pulse">📁</div>
            <h3 className="text-base font-bold text-slate-400">
              No Projects Linked to Profile
            </h3>
            <p className="text-slate-600 text-xs font-semibold max-w-xs mx-auto mt-2 leading-relaxed">
              Initialize a project matrix setup workflow by mapping a framework
              via the console launcher.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {projects.map((p, i) => {
              const st = STATUS_MAP[p.status] || STATUS_MAP.pending;
              return (
                // ✅ CORRECTED CODE (Aisa kar do):
                <div
                  key={p._id}
                  style={{ animationDelay: `${i * 0.06}s` }}
                  className="bg-[#0b1324]/50 backdrop-blur-md border border-white/[0.04] hover:border-indigo-500/20 rounded-2xl p-6 transition-all duration-300 shadow-lg shadow-black/10 hover:-translate-y-0.5 group animate-fadeUp"
                >
                  {/* Top Block: Title, State Tags & Controls */}
                  <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        {/* 👇 CLICK ROUTING APPLIED HERE TO TITLE TAG */}
                        <h3
                          onClick={() => navigate(`/student/project/${p._id}`)}
                          className="font-bold text-white text-lg tracking-tight group-hover:text-indigo-400 cursor-pointer hover:underline transition-colors"
                        >
                          {p.title}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 border rounded-full text-[10px] font-extrabold uppercase tracking-wide flex-shrink-0 ${st.theme}`}
                        >
                          {st.label}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-2xl">
                        {p.description}
                      </p>
                    </div>

                    {/* Console Controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setSelectedProject(p);
                          setShowSubmitForm(true);
                          setShowForm(false);
                        }}
                        className="bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/20 text-emerald-400 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <span>📤</span> Push Release
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <span>🗑️</span> Drop
                      </button>
                    </div>
                  </div>

                  {/* Middleware Tech Stack Assembly Badges */}
                  {p.techStack?.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-5">
                      {p.techStack.map((t) => (
                        <span
                          key={t}
                          className="bg-indigo-500/5 border border-indigo-500/10 text-indigo-400/90 text-[11px] font-bold px-2.5 py-0.5 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Operational Completion Velocity Bar */}
                  <div className="border-t border-white/[0.03] pt-4 mb-4">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                      <span className="text-slate-500 uppercase tracking-wider text-[10px] font-extrabold">
                        Pipeline Velocity
                      </span>
                      <span className="text-indigo-400 font-mono">
                        {p.progress}%
                      </span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-full h-2 overflow-hidden p-[1px]">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500 ease-out shadow-md shadow-indigo-500/20"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Lower Infrastructure Meta Fields */}
                  <div className="flex gap-x-5 gap-y-2 mt-4 flex-wrap text-xs font-semibold text-slate-500 border-t border-white/[0.03] pt-4">
                    {p.category && (
                      <span className="flex items-center gap-1.5">
                        📂 <span className="text-slate-400">{p.category}</span>
                      </span>
                    )}
                    {p.deadline && (
                      <span className="flex items-center gap-1.5">
                        📅{" "}
                        <span className="text-slate-400">
                          Target:{" "}
                          {new Date(p.deadline).toLocaleDateString("en-IN")}
                        </span>
                      </span>
                    )}
                    {p.mentor && (
                      <span className="flex items-center gap-1.5 border-l border-white/5 pl-4">
                        🧑‍💼{" "}
                        <span className="text-cyan-400">
                          Supervisor: {p.mentor.name}
                        </span>
                      </span>
                    )}
                    {p.grade && (
                      <span className="flex items-center gap-1.5 sm:ml-auto bg-emerald-500/5 px-2.5 py-0.5 rounded border border-emerald-500/10 text-emerald-400 font-black">
                        ⭐ Mark: {p.grade}
                      </span>
                    )}
                  </div>

                  {/* Evaluator Review Artifacts */}
                  {p.gradeRemarks && (
                    <div className="mt-4 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-xl p-3.5">
                      <p className="text-xs text-slate-400 font-medium leading-relaxed flex items-start gap-2">
                        <span className="text-emerald-400 text-sm leading-none">
                          💬
                        </span>
                        <span>
                          <strong className="text-emerald-400/90 font-bold uppercase text-[10px] tracking-wider block mb-0.5">
                            Supervisor Log:
                          </strong>
                          {p.gradeRemarks}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
