import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../constants/context/AuthContext";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiBriefcase, FiHash, FiLayers, FiList } from "react-icons/fi";

// Sirf Student aur Teacher roles rakhe hain
const roles = [
  { value: "student", label: "Student", icon: <FiUser /> },
  { value: "teacher", label: "Teacher", icon: <FiBriefcase /> },
];

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    enrollmentNumber: "", semester: "", branch: "",
    employeeId: "", department: "", subjects: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let payload = { name: form.name, email: form.email, password: form.password, role };
      if (role === "student") payload = { ...payload, enrollmentNumber: form.enrollmentNumber, semester: Number(form.semester), branch: form.branch };
      else if (role === "teacher") payload = { ...payload, employeeId: form.employeeId, department: form.department, subjects: form.subjects.split(",") };
      
      await register(payload);
      const user = await login(form.email, form.password);
      toast.success("Account created successfully!");
      const routes = { student: "/student/dashboard", teacher: "/teacher/dashboard" };
      navigate(routes[user.role] || "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060A12] flex items-center justify-center p-6 text-slate-200">
      <div className="w-full max-w-5xl bg-[#0B0F19] border border-white/10 rounded-2xl grid lg:grid-cols-2 overflow-hidden shadow-2xl">
        
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-[#060A12] border-r border-white/5">
          <h1 className="text-4xl font-bold text-white mb-6">Join SPMS Platform</h1>
          <p className="text-slate-400 mb-8">Secure, modern, and collaborative project management for academic excellence.</p>
          <div className="space-y-4 text-sm text-slate-500">
            <p>✓ Fast Authentication</p>
            <p>✓ Smart Team Collaboration</p>
            <p>✓ Real-time Progress Tracking</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 md:p-10 overflow-y-auto max-h-screen">
          <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
          
          {/* Updated Roles Grid (2 items instead of 3) */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {roles.map((r) => (
              <button key={r.value} onClick={() => setRole(r.value)}
                className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition ${role === r.value ? "bg-indigo-600/20 border-indigo-500 text-white" : "bg-[#060A12] border-white/10 text-slate-400 hover:border-white/20"}`}>
                <span className="text-lg">{r.icon}</span>
                <span className="text-xs font-semibold">{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiUser className="absolute left-3 top-3.5 text-slate-500" />
              <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full bg-[#060A12] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500/50 text-white" />
            </div>
            
            <div className="relative">
              <FiMail className="absolute left-3 top-3.5 text-slate-500" />
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full bg-[#060A12] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500/50 text-white" />
            </div>

            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 text-slate-500" />
              <input name="password" type={showPass ? "text" : "password"} placeholder="Password" value={form.password} onChange={handleChange} className="w-full bg-[#060A12] border border-white/10 rounded-lg py-2.5 pl-10 pr-10 outline-none focus:border-indigo-500/50 text-white" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-slate-500 hover:text-indigo-400">
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {role === "student" && (
              <div className="space-y-4">
                <div className="relative"><FiHash className="absolute left-3 top-3.5 text-slate-500" /><input name="enrollmentNumber" placeholder="Enrollment No" value={form.enrollmentNumber} onChange={handleChange} className="w-full bg-[#060A12] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500/50 text-white" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <select name="semester" value={form.semester} onChange={handleChange} className="w-full bg-[#060A12] border border-white/10 rounded-lg py-2.5 px-3 outline-none text-slate-400 focus:border-indigo-500/50">
                    <option value="">Semester</option>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select name="branch" value={form.branch} onChange={handleChange} className="w-full bg-[#060A12] border border-white/10 rounded-lg py-2.5 px-3 outline-none text-slate-400 focus:border-indigo-500/50">
                    <option value="">Branch</option>
                    {["CSE", "IT", "ECE", "ME", "CE", "EE"].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            )}

            {role === "teacher" && (
              <div className="space-y-4">
                <div className="relative"><FiHash className="absolute left-3 top-3.5 text-slate-500" /><input name="employeeId" placeholder="Employee ID" value={form.employeeId} onChange={handleChange} className="w-full bg-[#060A12] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500/50 text-white" /></div>
                <div className="relative"><FiLayers className="absolute left-3 top-3.5 text-slate-500" /><input name="department" placeholder="Department" value={form.department} onChange={handleChange} className="w-full bg-[#060A12] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500/50 text-white" /></div>
                <div className="relative"><FiList className="absolute left-3 top-3.5 text-slate-500" /><input name="subjects" placeholder="Subjects (comma separated)" value={form.subjects} onChange={handleChange} className="w-full bg-[#060A12] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500/50 text-white" /></div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-4">
              {loading ? "Creating..." : <>Register Account <FiArrowRight /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-indigo-400 font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}