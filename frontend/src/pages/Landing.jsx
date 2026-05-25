import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

/* ─────────────────────────── DATA ─────────────────────────── */
const FEATURES = [
  { icon: '📁', title: 'Project Workflow',       desc: 'Create, manage, review, and submit projects with a structured academic workflow.'              },
  { icon: '👥', title: 'Team Collaboration',    desc: 'Collaborate with teammates using tasks, communication, and shared project tracking.'           },
  { icon: '🎓', title: 'Mentor Guidance',        desc: 'Mentors can monitor progress, review submissions, and provide feedback in real time.'          },
  { icon: '📊', title: 'Performance Analytics', desc: 'Track submissions, progress, engagement, and overall team performance.'                        },
  { icon: '🔔', title: 'Real-time Updates',     desc: 'Receive instant notifications for deadlines, reviews, approvals, and submissions.'             },
  { icon: '🔐', title: 'Role Based Access',      desc: 'Separate dashboards and permissions for Students, Mentors, and Teachers.'                      },
]

const TECH_STACK = ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'Chart.js']

const STATS = [
  { value: '3+',        label: 'User Roles'      },
  { value: '15+',       label: 'Core Features'   },
  { value: 'Real-time', label: 'Communication'   },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Register & Set Role',    desc: 'Sign up as a Student, Mentor, or Teacher. Each role gets a dedicated dashboard.'   },
  { step: '02', title: 'Create or Join Project', desc: 'Students propose projects under subjects; teachers approve and assign mentors.'      },
  { step: '03', title: 'Collaborate & Track',    desc: 'Use tasks, notes, and progress tools. Mentors review and give feedback in real time.'},
  { step: '04', title: 'Submit & Get Graded',    desc: 'Final submission goes through a structured review and approval pipeline.'           },
]

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#060A12] text-[#f8fafc] font-sans overflow-x-hidden selection:bg-amber-500/25 selection:text-[#f8fafc]">
      
      {/* ── Global Custom Animations Injection ──────────────── */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseGlow { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:0.8; transform:scale(1.06); } }
        @keyframes shimmer { 0% { background-position:200% center; } 100% { background-position:-200% center; } }
        @keyframes borderGlow { 0%,100% { border-color:rgba(245,158,11,0.2); } 50% { border-color:rgba(245,158,11,0.5); } }
        
        .fade-up-1 { animation: fadeUp 0.6s ease both; }
        .fade-up-2 { animation: fadeUp 0.6s ease 0.10s both; }
        .fade-up-3 { animation: fadeUp 0.6s ease 0.20s both; }
        .fade-up-4 { animation: fadeUp 0.6s ease 0.30s both; }
        .fade-up-5 { animation: fadeUp 0.6s ease 0.40s both; }

        .shimmer-text {
          background: linear-gradient(90deg, #f59e0b 0%, #fde68a 30%, #f97316 60%, #f59e0b 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulseGlow 8s ease-in-out infinite;
        }
        .animate-pulse-glow-delayed {
          animation: pulseGlow 10s ease-in-out infinite 2s;
        }
        .animate-border-glow {
          animation: borderGlow 4s ease-in-out infinite;
        }
      `}</style>

      {/* ── Ambient Background Blobs ───────────────────────── */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[180px] -left-[180px] w-[560px] h-[560px] rounded-full bg-radial gradient bg-gradient-to-br from-amber-500/5 to-transparent blur-[80px] animate-pulse-glow" />
        <div className="absolute -bottom-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/5 to-transparent blur-[80px] animate-pulse-glow-delayed" />
      </div>

      {/* ══════════════════════════════════════════════════════
                            HEADER (Neeche Shift Kiya)
         ══════════════════════════════════════════════════ */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#060A12]/92 border-b border-white/5 backdrop-blur-xl py-4' : 'bg-transparent border-b border-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#f97316] flex items-center justify-center text-xl shadow-lg shadow-amber-500/30 transition-transform group-hover:scale-105">
              🎓
            </div>
            <div>
              <div className="font-display font-bold text-lg text-[#f8fafc] tracking-wider">SPMS</div>
              <div className="text-[10px] text-[#64748b] tracking-widest uppercase">Project Management</div>
            </div>
          </Link>

          {/* Nav buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-[#cbd5e1] bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 hover:text-[#f8fafc] transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-br from-[#f59e0b] to-[#f97316] rounded-xl shadow-lg shadow-amber-500/25 hover:scale-[1.02] hover:shadow-amber-500/40 transition-all duration-200"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">

        {/* ══════════════════════════════════════════════════
                              HERO
           ══════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-24 pb-20 text-center">
          
          {/* Badge */}
          {/* <div className="fade-up-1 inline-flex items-center gap-2 bg-amber-500/5 border border-amber-500/20 rounded-full px-5 py-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] inline-block shadow-[0_0_8px_#f59e0b]" />
            <span className="text-xs font-semibold text-[#fbbf24] tracking-widest uppercase">Final Year Project Platform</span>
          </div> */}

          {/* Headline */}
          <h1 className="fade-up-2 font-display font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-[#f8fafc] mb-6">
            Track, Collaborate &<br />
            <span className="shimmer-text">Complete Projects Smarter</span>
          </h1>

          {/* Sub */}
          <p className="fade-up-3 text-base sm:text-lg lg:text-xl text-[#64748b] max-w-2xl mx-auto mb-10 leading-relaxed">
            Built for colleges and final-year teams to simplify project tracking, mentor reviews,
            submissions, and collaboration — all in one platform.
          </p>

          {/* CTA buttons */}
          <div className="fade-up-4 flex flex-wrap gap-4 justify-center mb-20">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-gradient-to-br from-[#f59e0b] to-[#f97316] rounded-xl shadow-xl shadow-amber-500/25 hover:-translate-y-0.5 hover:shadow-amber-500/45 transition-all duration-200"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-[#64748b] bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/20 hover:text-[#f8fafc] transition-all duration-200"
            >
              I Already Have an Account
            </Link>
          </div>

          {/* Stats */}
          <div className="fade-up-5 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 backdrop-blur-md">
                <div className="font-display font-bold text-3xl sm:text-4xl text-[#f59e0b] mb-1.5">{s.value}</div>
                <div className="text-xs text-[#64748b] tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
                         WHY THIS EXISTS
           ══════════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="bg-gradient-to-br from-amber-500/[0.06] to-indigo-500/[0.04] border border-amber-500/15 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />
            
            <div className="inline-flex items-center bg-amber-500/08 border border-amber-500/20 rounded-full px-4 py-1.5 mb-5">
              <span className="text-xs text-[#fbbf24] font-semibold tracking-widest uppercase">The Problem We Solve</span>
            </div>
            
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-[#f8fafc] mb-5">
              Why This Project Exists
            </h2>
            
            <p className="text-[#64748b] text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto">
              Managing academic projects through WhatsApp groups, spreadsheets, and repeated submissions
              creates confusion for students and mentors alike.
              <br /><br />
              <span className="text-[#cbd5e1] font-medium">SPMS centralizes</span> communication, submissions, reviews, progress tracking,
              and collaboration into one streamlined platform.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
                            FEATURES
           ══════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="text-center mb-14">
            <div className="inline-flex items-center bg-amber-500/08 border border-amber-500/20 rounded-full px-4 py-1.5 mb-5">
              <span className="text-xs text-[#fbbf24] font-semibold tracking-widest uppercase">Platform Features</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#f8fafc] mb-4">
              Designed Around Real Academic Workflow
            </h2>
            <p className="text-[#64748b] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              A practical platform focused on collaboration, submissions, tracking, and mentor management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group bg-white/[0.03] border border-white/5 rounded-2xl p-8 flex flex-col items-start hover:-translate-y-1 hover:bg-white/[0.055] hover:border-amber-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/08 flex items-center justify-center text-2xl mb-5 group-hover:bg-amber-500/15 transition-colors duration-200">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-xl text-[#f8fafc] mb-3">{f.title}</h3>
                <p className="text-[#64748b] text-sm leading-relaxed flex-grow">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
                          HOW IT WORKS
           ══════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="text-center mb-14">
            <div className="inline-flex items-center bg-amber-500/08 border border-amber-500/20 rounded-full px-4 py-1.5 mb-5">
              <span className="text-xs text-[#fbbf24] font-semibold tracking-widest uppercase">How It Works</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#f8fafc]">
              From Signup to Submission
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="group bg-white/[0.03] border border-white/5 rounded-2xl p-6 relative overflow-hidden hover:border-amber-500/25 transition-colors duration-200"
              >
                <div className="absolute -top-3 -right-2 font-display font-extrabold text-7xl text-white/[0.02] select-none pointer-events-none group-hover:text-amber-500/5 transition-colors duration-200">
                  {step.step}
                </div>
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500/12 border border-amber-500/25 font-display font-bold text-xs text-[#f59e0b] mb-5">
                  {step.step}
                </div>
                <h3 className="font-display font-semibold text-lg text-[#f8fafc] mb-2">{step.title}</h3>
                <p className="text-[#64748b] text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
                           TECH STACK
           ══════════════════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-10 sm:p-12 text-center">
            <div className="inline-flex items-center bg-amber-500/08 border border-amber-500/20 rounded-full px-4 py-1.5 mb-5">
              <span className="text-xs text-[#fbbf24] font-semibold tracking-widest uppercase">Tech Stack</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-[#f8fafc] mb-4">
              Built Using Modern Technologies
            </h2>
            <p className="text-[#64748b] text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
              Scalable, industry-standard tools for performance, security, and real-time communication.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {TECH_STACK.map((tech) => (
                <div
                  key={tech}
                  className="bg-white/5 border border-white/5 rounded-full px-5 py-2 text-sm font-semibold text-[#94a3b8] hover:bg-amber-500/15 hover:border-amber-500/40 hover:text-[#fbbf24] transition-all duration-200 cursor-default"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
                              FINAL CTA
           ══════════════════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto px-6 pb-28">
          <div className="relative bg-gradient-to-br from-amber-500/[0.10] to-orange-500/[0.07] border border-amber-500/22 rounded-3xl py-16 px-6 sm:px-12 text-center overflow-hidden shadow-2xl shadow-amber-500/5 animate-border-glow">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-amber-500/12 rounded-full blur-3xl pointer-events-none" />

            <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#f8fafc] leading-tight mb-4 relative z-10">
              Start Managing Projects<br />Without the Chaos
            </h2>
            <p className="text-[#64748b] text-sm sm:text-base mb-10 relative z-10 max-w-md mx-auto">
              Built for Students. Helpful for Mentors. Easy for Colleges.
            </p>
            <div className="flex flex-wrap gap-4 justify-center relative z-10">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-gradient-to-br from-[#f59e0b] to-[#f97316] rounded-xl shadow-xl shadow-amber-500/25 hover:-translate-y-0.5 hover:shadow-amber-500/45 transition-all duration-200"
              >
                Sign Up Free — It's Free
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-[#64748b] bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:text-[#f8fafc] transition-all duration-200"
              >
                Login Instead
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ══════════════════════════════════════════════════
                            FOOTER
         ══════════════════════════════════════════════════ */}
      <footer className="border-t border-white/5 bg-[#04070d]/95 py-8 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#f97316] flex items-center justify-center text-sm shadow-md">🎓</div>
            <span className="font-display font-bold text-sm text-[#475569]">SPMS</span>
          </div>
          <p className="text-xs text-[#334155]">
            &copy; {new Date().getFullYear()} Student Project Management System. All rights reserved.
          </p>
          <div className="flex gap-4">
            {['Students', 'Mentors', 'Teachers'].map((role) => (
              <span key={role} className="text-xs text-[#334155] cursor-default">{role}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}