import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form,     setForm]     = useState({ email: '', password: '' })
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Email aur password zaroori hai!')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}! 🎉`)
      if (user.role === 'student') navigate('/student/dashboard')
      else if (user.role === 'mentor') navigate('/mentor/dashboard')
      else if (user.role === 'teacher') navigate('/teacher/dashboard')
    } catch (err) {
      if (err.response?.status === 401) toast.error('Invalid email or password')
      else if (err.response?.status === 400) toast.error(err.response.data?.message || 'Invalid input')
      else if (err.request) toast.error('Server se connect nahi ho pa raha')
      else toast.error('Kuch galat ho gaya, dobara try karo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060A12] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Font + animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse    { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:0.9;transform:scale(1.05)} }
        @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .fade1 { animation: fadeUp 0.5s ease both; }
        .fade2 { animation: fadeUp 0.5s ease 0.08s both; }
        .fade3 { animation: fadeUp 0.5s ease 0.16s both; }
        .fade4 { animation: fadeUp 0.5s ease 0.24s both; }
        .fade5 { animation: fadeUp 0.5s ease 0.32s both; }
        .spms-input {
          width:100%; background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08); border-radius:12px;
          padding:12px 16px; color:#f1f5f9; font-size:14px;
          font-family:'DM Sans',sans-serif; outline:none;
          transition:border-color 0.2s, background 0.2s;
        }
        .spms-input:focus { border-color:rgba(245,158,11,0.5); background:rgba(245,158,11,0.04); }
        .spms-input::placeholder { color:#475569; }
        .spms-input option { background:#0f172a; }
      `}</style>

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{ position:'absolute', top:-200, left:-200, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,0.07), transparent 70%)', animation:'pulse 8s ease-in-out infinite' }} />
        <div style={{ position:'absolute', bottom:-150, right:-150, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.05), transparent 70%)', animation:'pulse 10s ease-in-out infinite 2s' }} />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/8 bg-[#0d1421]/90 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40">

          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />

          <div className="p-8">
            {/* Logo + heading */}
            <div className="flex flex-col items-center text-center mb-8 fade1">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-2xl shadow-lg shadow-amber-500/30">
                🎓
              </div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily:'Syne,sans-serif' }}>
                Welcome Back
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                SPMS — Student Project Management
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="fade2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email" name="email"
                  placeholder="Enter your email"
                  value={form.email} onChange={handleChange}
                  className="spms-input"
                />
              </div>

              {/* Password */}
              <div className="fade3">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password} onChange={handleChange}
                    className="spms-input pr-12"
                  />
                  <button
                    type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-lg"
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="fade4 mt-2">
                <button
                  type="submit" disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/45 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ fontFamily:'Syne,sans-serif' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                      Logging in...
                    </span>
                  ) : 'Login →'}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="fade5 flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/6" />
              <span className="text-xs text-slate-600">or</span>
              <div className="flex-1 h-px bg-white/6" />
            </div>

            {/* Register link */}
            <p className="fade5 text-center text-sm text-slate-500">
              Account nahi hai?{' '}
              <Link to="/register" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom label */}
        <p className="mt-6 text-center text-xs text-slate-700 fade5">
          Student · Mentor · Teacher — All roles supported
        </p>
      </div>
    </div>
  )
}