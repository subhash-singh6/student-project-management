import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { FiArrowLeft, FiBookOpen, FiCheckCircle, FiClock, FiFileText, FiUser } from "react-icons/fi";

export default function EnrollSubject() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("enroll");

  const [filters, setFilters] = useState({ department: "", semester: "" });
  const [form, setForm] = useState({
    projectId: "",
    subjectId: "",
    teacherId: "",
    message: "",
  });

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchSubjects();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [projRes, reqRes] = await Promise.all([
        API.get("/projects"),
        API.get("/subjects/my-requests"),
      ]);
      setProjects(projRes.data.projects?.filter((p) => !p.teacher) || []);
      setMyRequests(reqRes.data.requests || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load enrollment dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const params = new URLSearchParams(filters);
      const res = await API.get(`/subjects?${params.toString()}`);
      setSubjects(res.data.subjects || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch subjects.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.projectId || !form.subjectId || !form.teacherId) {
      return toast.error("Please select project and subject.");
    }

    setSubmitting(true);
    try {
      await API.post("/subjects/request", form);
      toast.success("Request submitted successfully!");
      setForm({ projectId: "", subjectId: "", teacherId: "", message: "" });
      fetchData();
      setActiveTab("requests");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSubject = subjects.find((s) => s._id === form.subjectId);

  if (loading)
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-400 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-start gap-4 mb-8">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="mt-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm transition text-white"
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white flex items-center gap-3">
              <FiBookOpen className="text-teal-400" /> Subject Enrollment Portal
            </h1>
            <p className="text-slate-500 text-sm mt-1">Submit your project under a subject.</p>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          {["enroll", "requests"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === tab ? "bg-teal-500 text-white" : "bg-white/5 border border-white/10 hover:bg-white/10"
              }`}
            >
              {tab === "enroll" ? "Submit Request" : `My Requests (${myRequests.length})`}
            </button>
          ))}
        </div>

        {activeTab === "enroll" ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#0b1324] border border-white/5 rounded-3xl p-6">
              <h2 className="text-xl font-semibold text-white mb-5">Select Project</h2>
              {projects.length === 0 ? (
                <p className="text-slate-500 text-sm">No projects available.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {projects.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => setForm({ ...form, projectId: p._id })}
                      className={`p-5 rounded-2xl border cursor-pointer transition ${
                        form.projectId === p._id ? "border-teal-500 bg-teal-500/10" : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <h3 className="font-semibold text-white">{p.title}</h3>
                      <p className="text-sm text-slate-400 mt-2">{p.category}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#0b1324] border border-white/5 rounded-3xl p-6">
              <h2 className="text-xl font-semibold text-white mb-5">Select Subject</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-5">
                <select onChange={(e) => setFilters({ ...filters, department: e.target.value })} className="bg-[#111827] border border-white/10 rounded-2xl px-4 py-3 outline-none text-white">
                  <option value="">All Departments</option>
                  {["CSE", "ECE", "IT", "ME", "CE"].map((d) => (<option key={d} value={d}>{d}</option>))}
                </select>
                <select onChange={(e) => setFilters({ ...filters, semester: e.target.value })} className="bg-[#111827] border border-white/10 rounded-2xl px-4 py-3 outline-none text-white">
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (<option key={s} value={s}>Semester {s}</option>))}
                </select>
              </div>
              <div className="space-y-4">
                {subjects.map((s) => (
                  <div
                    key={s._id}
                    onClick={() => setForm({ ...form, subjectId: s._id, teacherId: s.teachers?.[0]?._id || "" })}
                    className={`p-5 rounded-2xl border cursor-pointer transition ${
                      form.subjectId === s._id ? "border-amber-500 bg-amber-500/10" : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-white">{s.name}</h3>
                        <p className="text-amber-400 text-sm">{s.code}</p>
                        <p className="text-sm text-slate-400 mt-1 flex items-center gap-2"><FiUser /> {s.teachers?.[0]?.name || "N/A"}</p>
                      </div>
                      <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded">SEM {s.semester}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full py-4 rounded-2xl bg-teal-500 font-semibold text-white hover:bg-teal-600 transition disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit Subject Request"}
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            {myRequests.length === 0 ? (
              <p className="text-center text-slate-500">No requests submitted.</p>
            ) : (
              myRequests.map((r) => (
                <div key={r._id} className="bg-[#0b1324] border border-white/5 rounded-3xl p-6 flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-white">{r.project?.title}</h2>
                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-3">
                      <FiBookOpen size={14} /> {r.subject?.name} • <FiUser size={14} /> {r.teacher?.name}
                    </p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 ${r.status === "approved" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                    {r.status === "approved" ? <FiCheckCircle /> : <FiClock />}
                    {r.status.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}