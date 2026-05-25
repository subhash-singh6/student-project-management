import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../constants/context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {

  const { login } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [showPass, setShowPass] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const handleChange = (e) => {

    setForm({

      ...form,
      [e.target.name]: e.target.value,

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.email || !form.password) {

      return toast.error(
        "Please enter both email and password!"
      );

    }

    if (!rememberMe) {

      return toast.error(
        "Please confirm Remember Me to continue."
      );

    }

    setLoading(true);

    try {

      const user = await login(
        form.email,
        form.password
      );

      toast.success(
        `Welcome back, ${user.name}! 🚀`
      );

      if (user.role === "student") {

        navigate("/student/dashboard");

      } else if (user.role === "teacher") {

        navigate("/teacher/dashboard");

      } else if (user.role === "admin") {

        navigate("/admin/dashboard");

      } else {

        navigate("/");

      }

    } catch (err) {

      if (err.response?.status === 401) {

        toast.error(
          "Invalid email or password"
        );

      } else {

        toast.error(
          "Something went wrong. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#060A12] text-[#f8fafc] overflow-hidden relative flex items-center justify-center px-4 py-10">

      {/* Background Glow */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute -top-[180px] -left-[180px] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-[100px]" />

        <div className="absolute bottom-[-220px] right-[-220px] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-[120px]" />

      </div>

      {/* Main Container */}

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl">

        {/* LEFT SIDE */}

        <div className="hidden lg:flex flex-col justify-between p-12 border-r border-white/5 relative overflow-hidden">

          <div>

            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2">

              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />

              <span className="text-xs font-semibold tracking-widest uppercase text-amber-300">

                SPMS Platform

              </span>

            </div>

            <h1 className="text-5xl font-bold leading-tight mt-8">

              Welcome
              <br />

              Back 👋

            </h1>

            <p className="text-slate-400 mt-6 leading-relaxed max-w-md">

              Access your student project ecosystem,
              collaborate with teams, manage projects,
              and monitor academic progress in real-time.

            </p>

          </div>

          {/* Avatar Card */}

          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 backdrop-blur-md">

            <div className="flex items-center gap-5">

              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl font-bold shadow-2xl shadow-amber-500/20">

                SP

              </div>

              <div>

                <h3 className="text-xl font-bold">
                  Smart Project Management
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  Secure • Modern • Collaborative
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="p-6 sm:p-10 lg:p-14 flex items-center">

          <div className="w-full">

            {/* Mobile Logo */}

            <div className="flex lg:hidden justify-center mb-10">

              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl font-black shadow-2xl shadow-amber-500/20">

                SP

              </div>

            </div>

            {/* Heading */}

            <div className="mb-10">

              <h2 className="text-3xl md:text-4xl font-bold">

                Login To Continue

              </h2>

              <p className="text-slate-400 mt-3">

                Enter your credentials to access the platform.

              </p>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label className="text-sm text-slate-400 mb-2 block">

                  Email Address

                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-white/[0.04]
                    border border-white/10
                    rounded-2xl
                    px-5 py-4
                    outline-none
                    transition-all
                    focus:border-amber-500/30
                    focus:bg-white/[0.06]
                  "
                />

              </div>

              {/* Password */}

              <div>

                <label className="text-sm text-slate-400 mb-2 block">

                  Password

                </label>

                <div className="relative">

                  <input
                    type={
                      showPass
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="
                      w-full
                      bg-white/[0.04]
                      border border-white/10
                      rounded-2xl
                      px-5 py-4
                      pr-16
                      outline-none
                      transition-all
                      focus:border-amber-500/30
                      focus:bg-white/[0.06]
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPass(!showPass)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-white transition-all"
                  >

                    {showPass
                      ? "Hide"
                      : "Show"}

                  </button>

                </div>

              </div>

              {/* Remember + Forgot */}

              <div className="flex items-center justify-between text-sm">

                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() =>
                      setRememberMe(!rememberMe)
                    }
                    className="accent-amber-500"
                  />

                  Remember me

                </label>

                <Link
                  to="/forgot-password"
                  className="text-amber-400 hover:text-amber-300 transition-all"
                >

                  Forgot Password?

                </Link>

              </div>

              {/* Button */}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-amber-400
                  to-orange-500
                  text-black
                  font-black
                  text-lg
                  transition-all
                  hover:scale-[1.02]
                  hover:shadow-2xl
                  hover:shadow-amber-500/20
                  disabled:opacity-60
                "
              >

                {loading
                  ? "Authenticating..."
                  : "Login →"}

              </button>

            </form>

            {/* Footer */}

            <p className="mt-8 text-center text-sm text-slate-400">

              Don’t have an account?
              {" "}

              <Link
                to="/register"
                className="text-amber-400 font-bold hover:text-amber-300 transition-all"
              >

                Create Account

              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}