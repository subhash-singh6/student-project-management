import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const roles = [
  { value: "student", label: "Student", icon: "🎓", desc: "For learners" },
  { value: "mentor", label: "Mentor", icon: "🧑‍💼", desc: "For guides" },
  { value: "teacher", label: "Teacher", icon: "👨‍🏫", desc: "For faculty" },
];

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    enrollmentNumber: "",
    semester: "",
    branch: "",
    expertise: "",
    organization: "",
    employeeId: "",
    department: "",
    subjects: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return toast.error("Name, email and password are required!");

    setLoading(true);
    try {
      let payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      };

      if (role === "student") {
        if (!form.enrollmentNumber || !form.semester || !form.branch)
          return toast.error("Enrollment number, semester and branch are required!");
        payload = {
          ...payload,
          enrollmentNumber: form.enrollmentNumber,
          semester: Number(form.semester),
          branch: form.branch,
        };
      }

      if (role === "mentor") {
        if (!form.expertise || !form.organization)
          return toast.error("Expertise and organization are required!");
        payload = {
          ...payload,
          expertise: form.expertise.split(",").map((e) => e.trim()),
          organization: form.organization,
        };
      }

      if (role === "teacher") {
        if (!form.employeeId || !form.department)
          return toast.error("Employee ID and department are required!");
        payload = {
          ...payload,
          employeeId: form.employeeId,
          department: form.department,
          subjects: form.subjects.split(",").map((s) => s.trim()),
        };
      }

      await register(payload);
      const user = await login(form.email, form.password);
      toast.success(`Welcome ${user.name}! Account created successfully 🎉`);
      if (user.role === "student") navigate("/student/dashboard");
      else if (user.role === "mentor") navigate("/mentor/dashboard");
      else if (user.role === "teacher") navigate("/teacher/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-[#f8fafc] font-sans flex items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-amber-500/25 selection:text-[#f8fafc]">
      
      {/* ── Global Custom Animations Injection ──────────────── */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseGlow { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:0.8; transform:scale(1.06); } }
        
        .fade-up-1 { animation: fadeUp 0.5s ease both; }
        .fade-up-2 { animation: fadeUp 0.5s ease 0.08s both; }
        .fade-up-3 { animation: fadeUp 0.5s ease 0.14s both; }
        .fade-up-4 { animation: fadeUp 0.5s ease 0.20s both; }
        .animate-pulse-glow { animation: pulseGlow 8s ease-in-out infinite; }
        .animate-pulse-glow-delayed { animation: pulseGlow 10s ease-in-out infinite 2s; }
      `}</style>

      {/* ── Ambient Background Blobs ───────────────────────── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[5%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-500/5 to-transparent blur-[80px] animate-pulse-glow" />
        <div className="absolute -bottom-[5%] -right-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-indigo-500/5 to-transparent blur-[90px] animate-pulse-glow-delayed" />
      </div>

      {/* ── Main Register Card ───────────────────────────────── */}
      <div className="relative z-10 w-full max-w-lg bg-white/[0.03] border border-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40">
        
        <div className="fade-up-1 mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-2xl shadow-lg shadow-amber-500/20">
            ✨
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#f8fafc]">Create Account</h1>
          <p className="mt-1.5 text-sm text-[#64748b]">Get started with Student Project Management System</p>
        </div>

        {/* Role Picker */}
        <div className="fade-up-2 mb-5 bg-white/[0.01] border border-white/5 rounded-2xl p-4">
          <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-[#64748b]">
            Who are you?
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all duration-200 outline-none ${
                  role === r.value
                    ? "bg-amber-500/10 border-amber-500/40 text-[#fbbf24] shadow-md shadow-amber-500/5 scale-[1.02]"
                    : "bg-white/5 border-white/10 text-[#64748b] hover:bg-white/10 hover:border-white/20 hover:text-[#cbd5e1]"
                }`}
              >
                <div className="mb-1 text-2xl">{r.icon}</div>
                <div className="text-xs font-bold">{r.label}</div>
                <div className="mt-0.5 text-[10px] opacity-60 font-medium tracking-wide">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="fade-up-3">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#64748b]">Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#f8fafc] placeholder-[#334155] focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] transition-all duration-200"
            />
          </div>

          <div className="fade-up-3">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#64748b]">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#f8fafc] placeholder-[#334155] focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] transition-all duration-200"
            />
          </div>

          <div className="fade-up-3">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#64748b]">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#f8fafc] placeholder-[#334155] focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] transition-all duration-200"
            />
          </div>

          <div className="h-px bg-white/10 my-1" />

          {/* Conditional Role Fields */}
          {role === "student" && (
            <div className="fade-up-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                    Enrollment No.
                  </label>
                  <input
                    name="enrollmentNumber"
                    type="text"
                    placeholder="2021CSE001"
                    value={form.enrollmentNumber}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#f8fafc] placeholder-[#334155] focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                    Semester
                  </label>
                  <input
                    type="number"
                    name="semester"
                    placeholder="6"
                    min="1"
                    max="8"
                    value={form.semester}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#f8fafc] placeholder-[#334155] focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  Branch
                </label>
                <select
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  className="w-full bg-[#0d131f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#f8fafc] focus:outline-none focus:border-amber-500/40 transition-all duration-200"
                >
                  <option value="" className="bg-[#060A12]">Select Your Branch</option>
                  <option value="CSE" className="bg-[#060A12]">CSE</option>
                  <option value="ECE" className="bg-[#060A12]">ECE</option>
                  <option value="ME" className="bg-[#060A12]">ME</option>
                  <option value="CE" className="bg-[#060A12]">CE</option>
                  <option value="IT" className="bg-[#060A12]">IT</option>
                </select>
              </div>
            </div>
          )}

          {role === "mentor" && (
            <div className="fade-up-4 flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  Expertise <span className="text-[10px] normal-case opacity-60">(comma separated)</span>
                </label>
                <input
                  name="expertise"
                  type="text"
                  placeholder="React, Node.js, MongoDB"
                  value={form.expertise}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#f8fafc] placeholder-[#334155] focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] transition-all duration-200"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  Organization
                </label>
                <input
                  name="organization"
                  type="text"
                  placeholder="Company or College name"
                  value={form.organization}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#f8fafc] placeholder-[#334155] focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] transition-all duration-200"
                />
              </div>
            </div>
          )}

          {role === "teacher" && (
            <div className="fade-up-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                    Employee ID
                  </label>
                  <input
                    name="employeeId"
                    type="text"
                    placeholder="TCH2024001"
                    value={form.employeeId}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#f8fafc] placeholder-[#334155] focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                    Department
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full bg-[#0d131f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#f8fafc] focus:outline-none focus:border-amber-500/40 transition-all duration-200"
                  >
                    <option value="" className="bg-[#060A12]">Select</option>
                    <option value="CSE" className="bg-[#060A12]">CSE</option>
                    <option value="ECE" className="bg-[#060A12]">ECE</option>
                    <option value="ME" className="bg-[#060A12]">ME</option>
                    <option value="CE" className="bg-[#060A12]">CE</option>
                    <option value="IT" className="bg-[#060A12]">IT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  Subjects <span className="text-[10px] normal-case opacity-60">(comma separated)</span>
                </label>
                <input
                  name="subjects"
                  type="text"
                  placeholder="DBMS, Web Development, OS"
                  value={form.subjects}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#f8fafc] placeholder-[#334155] focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] transition-all duration-200"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="fade-up-4 mt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-br from-[#f59e0b] to-[#f97316] rounded-xl shadow-lg shadow-amber-500/25 hover:scale-[1.01] hover:shadow-amber-500/40 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-sm text-[#64748b]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#fbbf24] hover:text-[#f59e0b] transition-colors no-underline ml-1"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}