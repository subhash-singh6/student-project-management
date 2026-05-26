import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../constants/context/AuthContext";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiUser } from "react-icons/fi";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Please enter both email and password!");
    if (!rememberMe) return toast.error("Please confirm Remember Me to continue.");

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      const routes = { student: "/student/dashboard", teacher: "/teacher/dashboard", admin: "/admin/dashboard" };
      navigate(routes[user.role] || "/");
    } catch (err) {
      toast.error(err.response?.status === 401 ? "Invalid email or password" : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060A12] flex items-center justify-center p-6 text-slate-200">
      <div className="w-full max-w-4xl bg-[#0B0F19] border border-white/10 rounded-2xl grid lg:grid-cols-2 overflow-hidden shadow-2xl">
        
        {/* LEFT SIDE - Brand Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-[#060A12] border-r border-white/5">
          <div>
            <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center mb-8">
              <FiShield className="text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">SPMS Platform</h1>
            <p className="text-slate-400">Secure, modern, and collaborative project management for academic excellence.</p>
          </div>
          <div className="text-sm text-slate-500 italic">
            Simplifying academic workflows since 2026.
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Sign In</h2>
            <p className="text-slate-400 mt-1">Access your dashboard to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-[#060A12] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500/50 transition text-white"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-slate-500" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-[#060A12] border border-white/10 rounded-lg py-2.5 pl-10 pr-10 outline-none focus:border-indigo-500/50 transition text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-indigo-400"
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-white">
                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="accent-indigo-600" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-indigo-400 hover:underline">Forgot?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : <>Login <FiArrowRight /></>}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account? <Link to="/register" className="text-indigo-400 font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}