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
      <div className="glass-card w-full max-w-md p-8 relative z-10 ">
        {/* Logo */}
        <div
          className="text-center mb-8 fade-in "
          style={{ paddingTop: "20px" }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: "linear-gradient(135deg,#6366f1,#22d3ee)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 24,
            }}
          >
            🎓
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9" }}>
            Welcome Back
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontSize: 14,
              marginTop: 6,
              marginBottom: 15,
            }}
          >
            SPMS — Student Project Management System
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: "20px",
          }}
        >
          {/* Email */}
          <div className="fade-in-2">
            <label
              style={{
                fontSize: 13,
                color: "#94a3b8",
                marginBottom: 6,
                display: "block",
              }}
            >
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

          {/* Password */}
          <div className="fade-in-3" style={{ position: "relative" }}>
            <label
              style={{
                fontSize: 13,
                color: "#94a3b8",
                marginBottom: 6,
                display: "block",
              }}
            >
              Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="password"
              value={form.password}
              onChange={handleChange}
              className="custom-input"
              style={{ paddingRight: 48 }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute",
                right: 14,
                top: 38,
                background: "none",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Submit */}
          <div className="fade-in-4" style={{ marginTop: 8 }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login →"}
            </button>
          </div>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, marginBottom: 20 }}>
          <span style={{ color: "#94a3b8", fontSize: 14 }}>
            Don't have an account?{" "}
          </span>
          <Link
            to="/register"
            style={{
              color: "#818cf8",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}