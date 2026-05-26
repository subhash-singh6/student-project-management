import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";

export default function CreateProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Web Development",
    githubRepo: "",
    liveDemo: "",
    techStack: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return toast.error("Please fill all required fields.");

    setLoading(true);
    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(",").map((t) => t.trim()).filter(Boolean),
      };
      await API.post("/projects", payload);
      toast.success("Project created successfully!");
      navigate("/student/enroll-subject");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = "text", placeholder, as: Component = "input", ...props }) => (
    <div>
      <label className="text-sm text-slate-400 mb-2 block">{label}</label>
      <Component
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-[#111827] border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500/50 transition-all"
        {...props}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="flex items-start gap-4 mb-8">
          <button onClick={() => navigate("/student/dashboard")} className="mt-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">←</button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">🚀 Create Project</h1>
            <p className="text-slate-500 text-sm mt-1">Build and manage your academic project.</p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="bg-[#0b1324] border border-white/5 rounded-3xl p-8 space-y-6">
          <InputField label="Project Title" name="title" placeholder="Enter project title" />
          
          <InputField label="Description" name="description" as="textarea" rows={5} placeholder="Describe your project" />

          <div>
            <label className="text-sm text-slate-400 mb-2 block">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#111827] border border-white/10 rounded-2xl px-4 py-3 outline-none">
              {["Web Development", "Mobile App", "ML/AI", "IoT", "Cybersecurity", "Other"].map(cat => <option key={cat}>{cat}</option>)}
            </select>
          </div>

          <InputField label="Tech Stack" name="techStack" placeholder="React, Node.js, MongoDB" />
          <InputField label="GitHub Repository" name="githubRepo" placeholder="https://github.com/..." />
          <InputField label="Live Demo Link" name="liveDemo" placeholder="https://yourproject.com" />

          <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 font-semibold hover:opacity-90 disabled:opacity-50 transition-all">
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}