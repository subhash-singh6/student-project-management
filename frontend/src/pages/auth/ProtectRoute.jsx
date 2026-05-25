import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../constants/context/AuthContext";
import toast from "react-hot-toast";

const roles = [
  { value: "student", label: "Student", icon: "🎓" },
  { value: "teacher", label: "Teacher", icon: "👨‍🏫" },
  { value: "admin", label: "Admin", icon: "⚙️" },
];

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", enrollmentNumber: "", semester: "", branch: "", employeeId: "", department: "", subjects: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let payload = { name: form.name, email: form.email, password: form.password, role };

      if (role === "student") {
        payload = { ...payload, enrollmentNumber: form.enrollmentNumber, semester: Number(form.semester), branch: form.branch };
      } else if (role === "teacher") {
        payload = { ...payload, employeeId: form.employeeId, department: form.department, subjects: form.subjects.split(",") };
      }

      await register(payload);
      const user = await login(form.email, form.password);
      toast.success(`Account created successfully!`);
      
      if (user.role === "student") navigate("/student/dashboard");
      else if (user.role === "teacher") navigate("/teacher/dashboard");
      else navigate("/admin/dashboard");
      
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-[#f8fafc] p-8">
      <div className="max-w-lg mx-auto bg-white/[0.03] border border-white/5 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
        <div className="flex gap-2 mb-6">
          {roles.map((r) => (
            <button key={r.value} onClick={() => setRole(r.value)} className={`flex-1 p-3 rounded-xl border ${role === r.value ? 'bg-amber-500/20 border-amber-500' : 'border-white/10'}`}>
              {r.icon} {r.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2" />
          <input name="email" placeholder="Email" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2" />
          
          {role === 'student' && (
            <>
              <input name="enrollmentNumber" placeholder="Enrollment No" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2" />
              <input name="semester" type="number" placeholder="Semester" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2" />
              <input name="branch" placeholder="Branch" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2" />
            </>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 bg-amber-500 rounded-xl font-bold mt-4">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}