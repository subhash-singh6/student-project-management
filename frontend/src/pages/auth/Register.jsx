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
    <div className="auth-bg min-h-screen flex items-center justify-center px-4 py-10">
      <div className="glass-card relative z-10 w-full max-w-lg p-8">
        <div className="fade-in mb-6 pt-5 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-2xl">
            ✨
          </div>
          <h1 className="mb-6 text-[26px] font-semibold text-slate-100">
            Create Account
          </h1>
        </div>

        <div className="fade-in-2 mb-5 p-5">
          <label className="mb-3 block text-sm text-slate-400">
            Who are you?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`role-btn ${role === r.value ? "active" : ""}`}
              >
                <div className="mb-1 text-[22px]">{r.icon}</div>
                <div className="text-sm font-semibold">{r.label}</div>
                <div className="mt-1 text-[11px] opacity-70">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
          <div className="fade-in-2">
            <label className="mb-2 block text-sm text-slate-400">Full Name</label>
            <input
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              className="custom-input"
            />
          </div>

          <div className="fade-in-3">
            <label className="mb-2 block text-sm text-slate-400">Email</label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
              className="custom-input"
            />
          </div>

          <div className="fade-in-3">
            <label className="mb-2 block text-sm text-slate-400">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={handleChange}
              className="custom-input"
            />
          </div>

          <div className="h-px bg-white/10" />

          {role === "student" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Enrollment No.
                  </label>
                  <input
                    name="enrollmentNumber"
                    placeholder="2021CSE001"
                    value={form.enrollmentNumber}
                    onChange={handleChange}
                    className="custom-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
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
                    className="custom-input"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Branch
                </label>
                <select
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  className="custom-input"
                >
                  <option value="">Select Your Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                  <option value="IT">IT</option>
                </select>
              </div>
            </>
          )}

          {role === "mentor" && (
            <>
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Expertise <span className="opacity-60">(comma separated)</span>
                </label>
                <input
                  name="expertise"
                  placeholder="React, Node.js, MongoDB"
                  value={form.expertise}
                  onChange={handleChange}
                  className="custom-input"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Organization
                </label>
                <input
                  name="organization"
                  placeholder="Company or College name"
                  value={form.organization}
                  onChange={handleChange}
                  className="custom-input"
                />
              </div>
            </>
          )}

          {role === "teacher" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Employee ID
                  </label>
                  <input
                    name="employeeId"
                    placeholder="TCH2024001"
                    value={form.employeeId}
                    onChange={handleChange}
                    className="custom-input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Department
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="custom-input"
                  >
                    <option value="">Select</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="CE">CE</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Subjects <span className="opacity-60">(comma se alag karo)</span>
                </label>
                <input
                  name="subjects"
                  placeholder="DBMS, Web Development, OS"
                  value={form.subjects}
                  onChange={handleChange}
                  className="custom-input"
                />
              </div>
            </>
          )}

          <div className="mt-2">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </div>
        </form>

        <div className="mt-5 mb-5 text-center">
          <span className="text-sm text-slate-400">
            Already have an account?{" "}
          </span>
          <Link to="/login" className="text-sm font-semibold text-indigo-400 no-underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}