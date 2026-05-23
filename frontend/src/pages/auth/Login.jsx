import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error("Please enter both email and password!");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 🎉`);
      if (user.role === "student") navigate("/student/dashboard");
      else if (user.role === "mentor") navigate("/mentor/dashboard");
      else if (user.role === "teacher") navigate("/teacher/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Invalid email or password");
      } else if (err.response?.status === 400) {
        toast.error(err.response.data?.message || "Invalid input");
      } else if (err.request) {
        toast.error("Unable to connect to server");
      } else {
        toast.error("Something went wrong. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-[#f8fafc] font-sans flex items-center justify-center px-4 relative overflow-hidden selection:bg-amber-500/25 selection:text-[#f8fafc]">
      
      {/* ── Global Custom Animations Injection ──────────────── */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseGlow { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:0.8; transform:scale(1.06); } }
        
        .fade-up-1 { animation: fadeUp 0.5s ease both; }
        .fade-up-2 { animation: fadeUp 0.5s ease 0.10s both; }
        .fade-up-3 { animation: fadeUp 0.5s ease 0.15s both; }
        .fade-up-4 { animation: fadeUp 0.5s ease 0.20s both; }
        .animate-pulse-glow { animation: pulseGlow 8s ease-in-out infinite; }
        .animate-pulse-glow-delayed { animation: pulseGlow 10s ease-in-out infinite 2s; }
      `}</style>

      {/* ── Ambient Background Blobs ───────────────────────── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-amber-500/5 to-transparent blur-[70px] animate-pulse-glow" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-500/5 to-transparent blur-[80px] animate-pulse-glow-delayed" />
      </div>

      {/* ── Main Login Card ────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-md bg-white/[0.03] border border-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/40">
        
        <div className="fade-up-1 mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-2xl shadow-lg shadow-amber-500/20">
            🎓
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#f8fafc]">Welcome Back</h1>
          <p className="mt-2 text-sm text-[#64748b]">
            SPMS — Student Project Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Field */}
          <div className="fade-up-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#64748b]">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#f8fafc] placeholder-[#334155] focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] transition-all duration-200"
            />
          </div>

          {/* Password Field */}
          <div className="fade-up-3 relative">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#64748b]">
              Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Enter your account password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-[#f8fafc] placeholder-[#334155] focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 bottom-3 text-base text-[#64748b] hover:text-[#cbd5e1] transition-colors focus:outline-none"
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Submit Action */}
          <div className="fade-up-4 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-br from-[#f59e0b] to-[#f97316] rounded-xl shadow-lg shadow-amber-500/25 hover:scale-[1.01] hover:shadow-amber-500/40 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          </div>
        </form>

        {/* Form Footer Link */}
        <div className="mt-8 text-center text-sm text-[#64748b]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#fbbf24] hover:text-[#f59e0b] transition-colors no-underline ml-1"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}