import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ROLES = [
  { value: 'student', label: 'Student',  icon: '🎓', desc: 'Join & submit projects' },
  { value: 'mentor',  label: 'Mentor',   icon: '🧑‍💼', desc: 'Guide students'        },
  { value: 'teacher', label: 'Teacher',  icon: '👨‍🏫', desc: 'Manage & approve'       },
]

const BRANCHES = ['CSE', 'ECE', 'ME', 'CE', 'IT']

export default function Register() {
  const { register, login } = useAuth()
  const navigate = useNavigate()
  const [role,    setRole]    = useState('student')
  const [loading, setLoading] = useState(false)
  const [form,    setForm]    = useState({
    name: '', email: '', password: '',
    enrollmentNumber: '', semester: '', branch: '',
    expertise: '', organization: '',
    employeeId: '', department: '', subjects: '',
  })

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password)
      return toast.error('Name, email aur password zaroori hai!')
    setLoading(true)
    try {
      let payload = { name: form.name, email: form.email, password: form.password, role }
      if (role === 'student') {
        if (!form.enrollmentNumber || !form.semester || !form.branch)
          return toast.error('Enrollment number, semester aur branch zaroori hai!')
        payload = { ...payload, enrollmentNumber: form.enrollmentNumber, semester: Number(form.semester), branch: form.branch }
      }
      if (role === 'mentor') {
        if (!form.expertise || !form.organization)
          return toast.error('Expertise aur organization zaroori hai!')
        payload = { ...payload, expertise: form.expertise.split(',').map(e => e.trim()), organization: form.organization }
      }
      if (role === 'teacher') {
        if (!form.employeeId || !form.department)
          return toast.error('Employee ID aur department zaroori hai!')
        payload = { ...payload, employeeId: form.employeeId, department: form.department, subjects: form.subjects.split(',').map(s => s.trim()) }
      }
      await register(payload)
      const user = await login(form.email, form.password)
      toast.success(`Welcome ${user.name}! Account ban gaya 🎉`)
      if (user.role === 'student') navigate('/student/dashboard')
      else if (user.role === 'mentor') navigate('/mentor/dashboard')
      else if (user.role === 'teacher') navigate('/teacher/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration fail ho gayi!')
    } finally {
      setLoading(false)
    }
  }

  /* Shared input/label classes */
  const Label = ({ children }) => (
    <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
      {children}
    </label>
  )

  return (
    <div className="min-h-screen bg-[#060A12] flex items-center justify-center px-4 py-12 relative overflow-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:0.9;transform:scale(1.05)} }
        .fade1{animation:fadeUp 0.5s ease both}
        .fade2{animation:fadeUp 0.5s ease 0.08s both}
        .fade3{animation:fadeUp 0.5s ease 0.16s both}
        .spms-input {
          width:100%; background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08); border-radius:12px;
          padding:11px 14px; color:#f1f5f9; font-size:14px;
          font-family:'DM Sans',sans-serif; outline:none;
          transition:border-color 0.2s,background 0.2s;
          box-sizing:border-box;
        }
        .spms-input:focus{border-color:rgba(245,158,11,0.5);background:rgba(245,158,11,0.04)}
        .spms-input::placeholder{color:#475569}
        .spms-input option{background:#0f172a}
      `}</style>

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{ position:'absolute', top:-200, right:-200, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,0.07),transparent 70%)', animation:'pulse 8s ease-in-out infinite' }} />
        <div style={{ position:'absolute', bottom:-150, left:-150, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.05),transparent 70%)', animation:'pulse 10s ease-in-out infinite 2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="rounded-3xl border border-white/8 bg-[#0d1421]/90 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">

          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />

          <div className="p-8">

            {/* Heading */}
            <div className="flex flex-col items-center text-center mb-7 fade1">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-2xl shadow-lg shadow-amber-500/30">
                ✨
              </div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily:'Syne,sans-serif' }}>
                Create Account
              </h1>
              <p className="mt-1 text-sm text-slate-500">SPMS mein join karo — free hai</p>
            </div>

            {/* Role selector */}
            <div className="mb-6 fade2">
              <Label>Who are you?</Label>
              <div className="grid grid-cols-3 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.value} type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex flex-col items-center gap-1 rounded-xl border py-3 px-2 text-center transition-all duration-200 ${
                      role === r.value
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                        : 'border-white/8 bg-white/3 text-slate-500 hover:border-white/15 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-2xl">{r.icon}</span>
                    <span className="text-xs font-bold" style={{ fontFamily:'Syne,sans-serif' }}>{r.label}</span>
                    <span className="text-[10px] opacity-70">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 fade3">

              {/* Common fields */}
              <div>
                <Label>Full Name</Label>
                <input name="name" placeholder="Apna naam likho" value={form.name} onChange={handleChange} className="spms-input" />
              </div>
              <div>
                <Label>Email</Label>
                <input type="email" name="email" placeholder="email@example.com" value={form.email} onChange={handleChange} className="spms-input" />
              </div>
              <div>
                <Label>Password</Label>
                <input type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} className="spms-input" />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-white/6" />
                <span className="text-[10px] uppercase tracking-widest text-slate-600">{role} details</span>
                <div className="flex-1 h-px bg-white/6" />
              </div>

              {/* Student fields */}
              {role === 'student' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Enrollment No.</Label>
                      <input name="enrollmentNumber" placeholder="2021CSE001" value={form.enrollmentNumber} onChange={handleChange} className="spms-input" />
                    </div>
                    <div>
                      <Label>Semester</Label>
                      <input type="number" name="semester" placeholder="6" min="1" max="8" value={form.semester} onChange={handleChange} className="spms-input" />
                    </div>
                  </div>
                  <div>
                    <Label>Branch</Label>
                    <select name="branch" value={form.branch} onChange={handleChange} className="spms-input">
                      <option value="">Select Branch</option>
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* Mentor fields */}
              {role === 'mentor' && (
                <>
                  <div>
                    <Label>Expertise <span className="normal-case text-slate-600">(comma separated)</span></Label>
                    <input name="expertise" placeholder="React, Node.js, MongoDB" value={form.expertise} onChange={handleChange} className="spms-input" />
                  </div>
                  <div>
                    <Label>Organization</Label>
                    <input name="organization" placeholder="College ya company ka naam" value={form.organization} onChange={handleChange} className="spms-input" />
                  </div>
                </>
              )}

              {/* Teacher fields */}
              {role === 'teacher' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Employee ID</Label>
                      <input name="employeeId" placeholder="TCH2024001" value={form.employeeId} onChange={handleChange} className="spms-input" />
                    </div>
                    <div>
                      <Label>Department</Label>
                      <select name="department" value={form.department} onChange={handleChange} className="spms-input">
                        <option value="">Select</option>
                        {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label>Subjects <span className="normal-case text-slate-600">(comma se alag karo)</span></Label>
                    <input name="subjects" placeholder="DBMS, Web Dev, OS" value={form.subjects} onChange={handleChange} className="spms-input" />
                  </div>
                </>
              )}

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/45 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ fontFamily:'Syne,sans-serif' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                    Creating account...
                  </span>
                ) : 'Create Account →'}
              </button>
            </form>

            {/* Login link */}
            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}