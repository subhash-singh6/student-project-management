import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  FiFolder,
  FiUsers,
  FiAward,
  FiBarChart2,
  FiBell,
  FiLock,
} from 'react-icons/fi'

const FEATURES = [
  { icon: <FiFolder />, title: 'Project Workflow', desc: 'Create, manage, review, and submit projects with a structured academic workflow.' },
  { icon: <FiUsers />, title: 'Team Collaboration', desc: 'Collaborate with teammates using tasks, communication, and shared project tracking.' },
  { icon: <FiAward />, title: 'Mentor Guidance', desc: 'Mentors can monitor progress, review submissions, and provide feedback in real time.' },
  { icon: <FiBarChart2 />, title: 'Performance Analytics', desc: 'Track submissions, progress, engagement, and overall team performance.' },
  { icon: <FiBell />, title: 'Real-time Updates', desc: 'Receive instant notifications for deadlines, reviews, approvals, and submissions.' },
  { icon: <FiLock />, title: 'Role Based Access', desc: 'Separate dashboards and permissions for Students, Mentors, and Teachers.' },
]

const TECH_STACK = ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'Chart.js']

const STATS = [
  { value: '3+', label: 'User Roles' },
  { value: '15+', label: 'Core Features' },
  { value: 'Real-time', label: 'Communication' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Register & Set Role', desc: 'Sign up as a Student, Mentor, or Teacher. Each role gets a dedicated dashboard.' },
  { step: '02', title: 'Create or Join Project', desc: 'Students propose projects under subjects; teachers approve and assign mentors.' },
  { step: '03', title: 'Collaborate & Track', desc: 'Use tasks, notes, and progress tools. Mentors review and give feedback in real time.' },
  { step: '04', title: 'Submit & Get Graded', desc: 'Final submission goes through a structured review and approval pipeline.' },
]

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#060A12] font-sans text-[#f8fafc] selection:bg-amber-500/25 selection:text-[#f8fafc]">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="animate-pulse-glow absolute -left-[180px] -top-[180px] h-[560px] w-[560px] rounded-full bg-gradient-to-br from-amber-500/5 to-transparent blur-[80px]" />
        <div className="animate-pulse-glow-delayed absolute -right-[200px] -bottom-[200px] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-indigo-500/5 to-transparent blur-[80px]" />
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? 'border-white/5 bg-[#060A12]/92 py-4 backdrop-blur-xl'
            : 'border-transparent bg-transparent py-6'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-xl shadow-lg shadow-amber-500/30 transition-transform group-hover:scale-105">
              <FiAward className="text-white" />
            </div>
            <div>
              <div className="font-display text-lg font-bold tracking-wider text-[#f8fafc]">SPMS</div>
              <div className="text-[10px] uppercase tracking-widest text-[#64748b]">Project Management</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-[#cbd5e1] transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-[#f8fafc]"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#f97316] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-amber-500/40"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-24 text-center sm:px-8 lg:px-10">
          <h1 className="font-display fade-up-2 mb-6 text-4xl font-bold leading-[1.08] tracking-tight text-[#f8fafc] sm:text-6xl lg:text-7xl">
            Track, Collaborate &<br />
            <span className="shimmer-text">Complete Projects Smarter</span>
          </h1>

          <p className="fade-up-3 mx-auto mb-10 max-w-2xl text-base leading-relaxed text-[#64748b] sm:text-lg lg:text-xl">
            Built for colleges and final-year teams to simplify project tracking, mentor reviews,
            submissions, and collaboration — all in one platform.
          </p>

          <div className="fade-up-4 mb-20 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#f97316] px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-amber-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-amber-500/45"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/5 bg-white/5 px-8 py-3.5 text-base font-semibold text-[#64748b] transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-[#f8fafc]"
            >
              I Already Have an Account
            </Link>
          </div>

          <div className="fade-up-5 mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-md">
                <div className="font-display mb-1.5 text-3xl font-bold text-[#f59e0b] sm:text-4xl">{s.value}</div>
                <div className="text-xs tracking-wider text-[#64748b]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] to-indigo-500/[0.04] p-10 text-center sm:p-14">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/5 blur-xl" />

            <div className="mb-5 inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/8 px-4 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#fbbf24]">The Problem We Solve</span>
            </div>

            <h2 className="font-display mb-5 text-2xl font-bold text-[#f8fafc] sm:text-4xl">
              Why This Project Exists
            </h2>

            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#64748b] sm:text-base lg:text-lg">
              Managing academic projects through WhatsApp groups, spreadsheets, and repeated submissions
              creates confusion for students and mentors alike.
              <br /><br />
              <span className="font-medium text-[#cbd5e1]">SPMS centralizes</span> communication, submissions, reviews, progress tracking,
              and collaboration into one streamlined platform.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="mb-14 text-center">
            <div className="mb-5 inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/8 px-4 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#fbbf24]">Platform Features</span>
            </div>
            <h2 className="font-display mb-4 text-3xl font-bold text-[#f8fafc] sm:text-5xl">
              Designed Around Real Academic Workflow
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#64748b] sm:text-base">
              A practical platform focused on collaboration, submissions, tracking, and mentor management.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group flex flex-col items-start rounded-2xl border border-white/5 bg-white/[0.03] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/20 hover:bg-white/[0.055]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/8 text-2xl text-[#f59e0b] transition-colors duration-200 group-hover:bg-amber-500/15">
                  {f.icon}
                </div>
                <h3 className="font-display mb-3 text-xl font-semibold text-[#f8fafc]">{f.title}</h3>
                <p className="flex-grow text-sm leading-relaxed text-[#64748b]">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="mb-14 text-center">
            <div className="mb-5 inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/8 px-4 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#fbbf24]">How It Works</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-[#f8fafc] sm:text-5xl">
              From Signup to Submission
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-colors duration-200 hover:border-amber-500/25"
              >
                <div className="pointer-events-none absolute -right-2 -top-3 select-none text-7xl font-extrabold text-white/[0.02] transition-colors duration-200 group-hover:text-amber-500/5">
                  {step.step}
                </div>
                <div className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/25 bg-amber-500/12 text-xs font-bold text-[#f59e0b]">
                  {step.step}
                </div>
                <h3 className="font-display mb-2 text-lg font-semibold text-[#f8fafc]">{step.title}</h3>
                <p className="text-xs leading-relaxed text-[#64748b]">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-24">
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-10 text-center sm:p-12">
            <div className="mb-5 inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/8 px-4 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#fbbf24]">Tech Stack</span>
            </div>
            <h2 className="font-display mb-4 text-2xl font-bold text-[#f8fafc] sm:text-4xl">
              Built Using Modern Technologies
            </h2>
            <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-[#64748b] sm:text-base">
              Scalable, industry-standard tools for performance, security, and real-time communication.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {TECH_STACK.map((tech) => (
                <div
                  key={tech}
                  className="cursor-default rounded-full border border-white/5 bg-white/5 px-5 py-2 text-sm font-semibold text-[#94a3b8] transition-all duration-200 hover:border-amber-500/40 hover:bg-amber-500/15 hover:text-[#fbbf24]"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-28">
          <div className="animate-border-glow relative overflow-hidden rounded-3xl border border-amber-500/22 bg-gradient-to-br from-amber-500/[0.10] to-orange-500/[0.07] px-6 py-16 text-center shadow-2xl shadow-amber-500/5 sm:px-12">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[200px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/12 blur-3xl" />

            <h2 className="font-display relative z-10 mb-4 text-3xl font-bold leading-tight text-[#f8fafc] sm:text-5xl">
              Start Managing Projects<br />Without the Chaos
            </h2>
            <p className="relative z-10 mb-10 mx-auto max-w-md text-sm text-[#64748b] sm:text-base">
              Built for Students. Helpful for Mentors. Easy for Colleges.
            </p>
            <div className="relative z-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#f97316] px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-amber-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-amber-500/45"
              >
                Sign Up Free — It's Free
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/5 bg-white/5 px-8 py-3.5 text-base font-semibold text-[#64748b] transition-all duration-200 hover:bg-white/10 hover:text-[#f8fafc]"
              >
                Login Instead
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-[#04070d]/95 px-6 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-sm shadow-md">
              <FiAward className="text-white" />
            </div>
            <span className="font-display text-sm font-bold text-[#475569]">SPMS</span>
          </div>
          <p className="text-xs text-[#334155]">
            &copy; {new Date().getFullYear()} Student Project Management System. All rights reserved.
          </p>
          <div className="flex gap-4">
            {['Students', 'Mentors', 'Teachers'].map((role) => (
              <span key={role} className="cursor-default text-xs text-[#334155]">{role}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}