import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../constants/context/AuthContext";
import toast from "react-hot-toast";

const roles = [

  {
    value: "student",
    label: "Student",
    icon: "🎓",
    color: "from-blue-500 to-cyan-500",
  },

  {
    value: "teacher",
    label: "Teacher",
    icon: "👨‍🏫",
    color: "from-emerald-500 to-green-500",
  },

  {
    value: "admin",
    label: "Admin",
    icon: "⚙️",
    color: "from-amber-500 to-orange-500",
  },

];

export default function Register() {

  const { register, login } = useAuth();

  const navigate = useNavigate();

  const [role, setRole] = useState("student");

  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({

    name: "",
    email: "",
    password: "",

    enrollmentNumber: "",
    semester: "",
    branch: "",

    employeeId: "",
    department: "",
    subjects: "",

  });

  const selectedRole =
    roles.find((r) => r.value === role);

  const initials =

    form.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SP";

  const handleChange = (e) => {

    setForm({

      ...form,
      [e.target.name]: e.target.value,

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      let payload = {

        name: form.name,
        email: form.email,
        password: form.password,
        role,

      };

      if (role === "student") {

        payload = {

          ...payload,
          enrollmentNumber:
            form.enrollmentNumber,

          semester:
            Number(form.semester),

          branch: form.branch,

        };

      } else if (role === "teacher") {

        payload = {

          ...payload,
          employeeId: form.employeeId,

          department: form.department,

          subjects:
            form.subjects.split(","),

        };

      }

      await register(payload);

      const user = await login(
        form.email,
        form.password
      );

      toast.success(
        "Account created successfully 🚀"
      );

      if (user.role === "student") {

        navigate("/student/dashboard");

      } else if (user.role === "teacher") {

        navigate("/teacher/dashboard");

      } else {

        navigate("/admin/dashboard");

      }

    } catch (err) {

      toast.error(

        err.response?.data?.message ||
        "Registration failed!"

      );

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

        {/* Left Side */}

        <div className="hidden lg:flex flex-col justify-between p-12 border-r border-white/5">

          <div>

            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2">

              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />

              <span className="text-xs font-semibold tracking-widest uppercase text-amber-300">

                SPMS Platform

              </span>

            </div>

            <h1 className="text-5xl font-bold leading-tight mt-8">

              Create Your
              <br />

              Account ✨

            </h1>

            <p className="text-slate-400 mt-6 leading-relaxed max-w-md">

              Join the next-generation student project
              management ecosystem and collaborate smarter.

            </p>

          </div>

          {/* Dynamic Avatar */}

          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 backdrop-blur-md">

            <div className="flex items-center gap-5">

              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-br ${selectedRole.color} flex items-center justify-center text-3xl font-black shadow-2xl`}
              >

                {initials}

              </div>

              <div>

                <h3 className="text-2xl font-bold">

                  {form.name || "Your Identity"}

                </h3>

                <p className="text-sm text-slate-400 mt-1">

                  {selectedRole.label} Account

                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="p-6 sm:p-10 lg:p-14 overflow-y-auto max-h-screen">

          {/* Mobile Avatar */}

          <div className="flex lg:hidden justify-center mb-8">

            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${selectedRole.color} flex items-center justify-center text-3xl font-black shadow-2xl`}
            >

              {initials}

            </div>

          </div>

          {/* Heading */}

          <div className="mb-8">

            <h2 className="text-3xl md:text-4xl font-bold">

              Register Account

            </h2>

            <p className="text-slate-400 mt-3">

              Create your account and start collaborating.

            </p>

          </div>

          {/* Role Selector */}

          <div className="grid grid-cols-3 gap-3 mb-8">

            {roles.map((r) => (

              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`rounded-2xl p-4 border transition-all duration-300
                ${
                  role === r.value

                    ? "bg-white/[0.08] border-amber-500/30 scale-[1.02]"

                    : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
                }`}
              >

                <div className="text-2xl mb-2">
                  {r.icon}
                </div>

                <div className="text-sm font-semibold">
                  {r.label}
                </div>

              </button>

            ))}

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}

            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
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
              "
            />

            {/* Email */}

            <input
              name="email"
              type="email"
              placeholder="Email Address"
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
              "
            />

            {/* Password */}

            <div className="relative">

              <input
                name="password"
                type={
                  showPass
                    ? "text"
                    : "password"
                }
                placeholder="Password"
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
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPass(!showPass)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-white"
              >

                {showPass
                  ? "Hide"
                  : "Show"}

              </button>

            </div>

            {/* Student Fields */}

            {role === "student" && (

              <>

                <input
                  name="enrollmentNumber"
                  placeholder="Enrollment Number"
                  value={form.enrollmentNumber}
                  onChange={handleChange}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500/30"
                />

                <div className="grid md:grid-cols-2 gap-4">

                  <input
                    name="semester"
                    type="number"
                    placeholder="Semester"
                    value={form.semester}
                    onChange={handleChange}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500/30"
                  />

                  <input
                    name="branch"
                    placeholder="Branch"
                    value={form.branch}
                    onChange={handleChange}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500/30"
                  />

                </div>

              </>

            )}

            {/* Teacher Fields */}

            {role === "teacher" && (

              <>

                <input
                  name="employeeId"
                  placeholder="Employee ID"
                  value={form.employeeId}
                  onChange={handleChange}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500/30"
                />

                <input
                  name="department"
                  placeholder="Department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500/30"
                />

                <input
                  name="subjects"
                  placeholder="Subjects (comma separated)"
                  value={form.subjects}
                  onChange={handleChange}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500/30"
                />

              </>

            )}

            {/* Submit */}

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
                ? "Creating Account..."
                : "Create Account →"}

            </button>

            {/* Footer */}

            <p className="text-center text-sm text-slate-400 pt-2">

              Already have an account?
              {" "}

              <Link
                to="/login"
                className="text-amber-400 font-bold hover:text-amber-300"
              >

                Login

              </Link>

            </p>

          </form>

        </div>

      </div>

    </div>

  );

}