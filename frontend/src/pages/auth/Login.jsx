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
    <div className="auth-bg min-h-screen flex items-center justify-center px-4">
      <div className="glass-card relative z-10 w-full max-w-md p-8">
        <div className="fade-in mb-8 pt-5 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-2xl">
            🎓
          </div>
          <h1 className="text-3xl font-bold text-slate-100">Welcome Back</h1>
          <p className="mt-2 mb-4 text-sm text-slate-400">
            SPMS — Student Project Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
          <div className="fade-in-2">
            <label className="mb-2 block text-sm text-slate-400">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="custom-input"
            />
          </div>

          <div className="fade-in-3 relative">
            <label className="mb-2 block text-sm text-slate-400">
              Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="password"
              value={form.password}
              onChange={handleChange}
              className="custom-input pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-9 text-base text-slate-400"
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="fade-in-4 mt-2">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login →"}
            </button>
          </div>
        </form>

        <div className="mt-6 mb-5 text-center">
          <span className="text-sm text-slate-400">
            Don't have an account?{" "}
          </span>
          <Link
            to="/register"
            className="text-sm font-semibold text-indigo-400 no-underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}