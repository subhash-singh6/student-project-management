import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

/* ─────────────────────────── DATA ─────────────────────────── */
const FEATURES = [
  { icon: '📁', title: 'Project Workflow',      desc: 'Create, manage, review, and submit projects with a structured academic workflow.'              },
  { icon: '👥', title: 'Team Collaboration',    desc: 'Collaborate with teammates using tasks, communication, and shared project tracking.'           },
  { icon: '🎓', title: 'Mentor Guidance',       desc: 'Mentors can monitor progress, review submissions, and provide feedback in real time.'          },
  { icon: '📊', title: 'Performance Analytics', desc: 'Track submissions, progress, engagement, and overall team performance.'                        },
  { icon: '🔔', title: 'Real-time Updates',     desc: 'Receive instant notifications for deadlines, reviews, approvals, and submissions.'             },
  { icon: '🔐', title: 'Role Based Access',     desc: 'Separate dashboards and permissions for Students, Mentors, and Teachers.'                      },
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

/* ─────────────────────────── TOKENS ───────────────────────── */
const C = {
  bg:           '#060A12',
  surface:      'rgba(255,255,255,0.03)',
  surfaceHover: 'rgba(255,255,255,0.06)',
  border:       'rgba(255,255,255,0.07)',
  borderAccent: 'rgba(245,158,11,0.30)',
  amber:        '#f59e0b',
  amberDim:     'rgba(245,158,11,0.12)',
  amberGlow:    'rgba(245,158,11,0.18)',
  white:        '#f8fafc',
  muted:        '#64748b',
  dim:          '#334155',
  fontDisplay:  "'Syne', sans-serif",
  fontBody:     "'DM Sans', sans-serif",
}

/* ─────────────────────────── SHARED STYLES ────────────────── */
const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  color: '#fff', border: 'none', borderRadius: 12,
  padding: '14px 32px', fontSize: 15, fontWeight: 700,
  cursor: 'pointer', textDecoration: 'none',
  fontFamily: C.fontBody,
  boxShadow: '0 0 32px rgba(245,158,11,0.25)',
  transition: 'transform 0.18s, box-shadow 0.18s',
}
const btnSecondary = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  background: 'rgba(255,255,255,0.04)',
  color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12,
  padding: '14px 32px', fontSize: 15, fontWeight: 600,
  cursor: 'pointer', textDecoration: 'none',
  fontFamily: C.fontBody,
  transition: 'background 0.18s, border-color 0.18s',
}

/* ─────────────────────────── COMPONENT ────────────────────── */
export default function Landing() {
  const [scrolled,       setScrolled]       = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [hoveredBtn,     setHoveredBtn]     = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.white, fontFamily: C.fontBody, overflowX: 'hidden' }}>

      {/* ── Global CSS ─────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(245,158,11,0.25); color: #f8fafc; }

        @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes pulse    { 0%,100% { opacity:0.5; transform:scale(1);    } 50% { opacity:0.8; transform:scale(1.06); } }
        @keyframes shimmer  { 0% { background-position:200% center; } 100% { background-position:-200% center; } }
        @keyframes borderGlow { 0%,100% { border-color:rgba(245,158,11,0.2); } 50% { border-color:rgba(245,158,11,0.5); } }
        @keyframes rotateSlow { to { transform: rotate(360deg); } }

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

        .feature-card { transition: transform 0.22s ease, border-color 0.22s ease, background 0.22s ease; }
        .feature-card:hover { transform: translateY(-4px); }

        .tech-badge { transition: background 0.18s, border-color 0.18s, color 0.18s; }
        .tech-badge:hover { background: rgba(245,158,11,0.15) !important; border-color: rgba(245,158,11,0.4) !important; color: #fbbf24 !important; }

        .step-card { transition: border-color 0.22s; }
        .step-card:hover { border-color: rgba(245,158,11,0.35) !important; }

        a { text-decoration: none; }
        input, button { font-family: inherit; }
      `}</style>

      {/* ── Ambient background blobs ───────────────────────── */}
      <div aria-hidden style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-180, left:-180, width:560, height:560, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)', animation:'pulse 8s ease-in-out infinite' }} />
        <div style={{ position:'absolute', bottom:-200, right:-200, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', animation:'pulse 10s ease-in-out infinite 2s' }} />
        <div style={{ position:'absolute', top:'40%', left:'60%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)', animation:'pulse 12s ease-in-out infinite 4s' }} />
      </div>

      {/* ══════════════════════════════════════════════════════
                            HEADER
      ══════════════════════════════════════════════════════ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(6,10,18,0.92)' : 'transparent',
        borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
            <div style={{ width:42, height:42, borderRadius:12, background:'linear-gradient(135deg,#f59e0b,#f97316)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, boxShadow:'0 0 20px rgba(245,158,11,0.3)', flexShrink:0 }}>
              🎓
            </div>
            <div>
              <div style={{ fontFamily:C.fontDisplay, fontWeight:700, fontSize:18, color:C.white, letterSpacing:1 }}>SPMS</div>
              <div style={{ fontSize:10, color:C.muted, letterSpacing:'0.2em', textTransform:'uppercase' }}>Project Management</div>
            </div>
          </Link>

          {/* Nav buttons */}
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <Link
              to="/login"
              style={{ ...btnSecondary, padding:'10px 22px', fontSize:14 }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)' }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{ ...btnPrimary, padding:'10px 22px', fontSize:14 }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 0 40px rgba(245,158,11,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 0 32px rgba(245,158,11,0.25)' }}
            >
              Get Started →
            </Link>
          </div>
        </div>
      </header>

      <main style={{ position:'relative', zIndex:1 }}>

        {/* ══════════════════════════════════════════════════
                            HERO
        ══════════════════════════════════════════════════ */}
        <section style={{ maxWidth:1200, margin:'0 auto', padding:'96px 28px 80px', textAlign:'center' }}>

          {/* Badge */}
          <div className="fade-up-1" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:100, padding:'8px 20px', marginBottom:32 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#f59e0b', display:'inline-block', boxShadow:'0 0 8px #f59e0b' }} />
            <span style={{ fontSize:12, fontWeight:600, color:'#fbbf24', letterSpacing:'0.15em', textTransform:'uppercase' }}>Final Year Project Platform</span>
          </div>

          {/* Headline */}
          <h1 className="fade-up-2" style={{ fontFamily:C.fontDisplay, fontWeight:600, fontSize:'clamp(36px, 6vw, 76px)', lineHeight:1.08, color:C.white, marginBottom:24 }}>
            Track, Collaborate &<br />
            <span className="shimmer-text">Complete Projects Smarter</span>
          </h1>

          {/* Sub */}
          <p className="fade-up-3" style={{ fontSize:'clamp(15px,2vw,19px)', color:C.muted, maxWidth:620, margin:'0 auto 44px', lineHeight:1.7 }}>
            Built for colleges and final-year teams to simplify project tracking, mentor reviews,
            submissions, and collaboration — all in one platform.
          </p>

          {/* CTA buttons */}
          <div className="fade-up-4" style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:80 }}>
            <Link
              to="/register"
              style={btnPrimary}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 0 48px rgba(245,158,11,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 0 32px rgba(245,158,11,0.25)' }}
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              style={btnSecondary}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)' }}
            >
              I Already Have an Account
            </Link>
          </div>

          {/* Stats */}
          <div className="fade-up-5" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, maxWidth:680, margin:'0 auto' }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:'28px 16px', backdropFilter:'blur(12px)' }}>
                <div style={{ fontFamily:C.fontDisplay, fontWeight:600, fontSize:'clamp(26px,4vw,36px)', color:'#f59e0b', marginBottom:6 }}>{s.value}</div>
                <div style={{ fontSize:13, color:C.muted, letterSpacing:'0.04em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
                         WHY THIS EXISTS
        ══════════════════════════════════════════════════ */}
        <section style={{ maxWidth:1000, margin:'0 auto', padding:'0 28px 96px' }}>
          <div style={{ background:'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(99,102,241,0.04) 100%)', border:`1px solid rgba(245,158,11,0.15)`, borderRadius:28, padding:'56px 48px', textAlign:'center', position:'relative', overflow:'hidden' }}>
            {/* decorative corner */}
            <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)', pointerEvents:'none' }} />
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:100, padding:'6px 16px', marginBottom:20 }}>
              <span style={{ fontSize:12, color:'#fbbf24', fontWeight:600, letterSpacing:'0.15em', textTransform:'uppercase' }}>The Problem We Solve</span>
            </div>
            <h2 style={{ fontFamily:C.fontDisplay, fontWeight:700, fontSize:'clamp(24px,4vw,40px)', color:C.white, marginBottom:20 }}>
              Why This Project Exists
            </h2>
            <p style={{ color:C.muted, fontSize:'clamp(14px,2vw,17px)', lineHeight:1.8, maxWidth:640, margin:'0 auto' }}>
              Managing academic projects through WhatsApp groups, spreadsheets, and repeated submissions
              creates confusion for students and mentors alike.
              <br /><br />
              <span style={{ color:'#cbd5e1' }}>SPMS centralizes</span> communication, submissions, reviews, progress tracking,
              and collaboration into one streamlined platform.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
                           FEATURES
        ══════════════════════════════════════════════════ */}
        <section style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px 96px' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:100, padding:'6px 16px', marginBottom:20 }}>
              <span style={{ fontSize:12, color:'#fbbf24', fontWeight:600, letterSpacing:'0.15em', textTransform:'uppercase' }}>Platform Features</span>
            </div>
            <h2 style={{ fontFamily:C.fontDisplay, fontWeight:700, fontSize:'clamp(26px,4vw,48px)', color:C.white, marginBottom:16 }}>
              Designed Around Real Academic Workflow
            </h2>
            <p style={{ color:C.muted, fontSize:'clamp(14px,2vw,17px)', maxWidth:560, margin:'0 auto', lineHeight:1.7 }}>
              A practical platform focused on collaboration, submissions, tracking, and mentor management.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:20 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="feature-card"
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  background: hoveredFeature === i ? 'rgba(255,255,255,0.055)' : C.surface,
                  border: `1px solid ${hoveredFeature === i ? 'rgba(245,158,11,0.28)' : C.border}`,
                  borderRadius: 22,
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}
              >
                <div style={{ width:52, height:52, borderRadius:14, background: hoveredFeature === i ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, marginBottom:20, transition:'background 0.22s' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily:C.fontDisplay, fontWeight:600, fontSize:20, color:C.white, marginBottom:12 }}>{f.title}</h3>
                <p style={{ color:C.muted, fontSize:14, lineHeight:1.75, flex:1 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
                          HOW IT WORKS
        ══════════════════════════════════════════════════ */}
        <section style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px 96px' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:100, padding:'6px 16px', marginBottom:20 }}>
              <span style={{ fontSize:12, color:'#fbbf24', fontWeight:600, letterSpacing:'0.15em', textTransform:'uppercase' }}>How It Works</span>
            </div>
            <h2 style={{ fontFamily:C.fontDisplay, fontWeight:700, fontSize:'clamp(26px,4vw,48px)', color:C.white }}>
              From Signup to Submission
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:18 }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.step}
                className="step-card"
                style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:22, padding:'32px 24px', position:'relative', overflow:'hidden' }}
              >
                {/* Step number watermark */}
                <div style={{ position:'absolute', top:-10, right:12, fontFamily:C.fontDisplay, fontWeight:700, fontSize:72, color:'rgba(245,158,11,0.05)', lineHeight:1, pointerEvents:'none', userSelect:'none' }}>
                  {step.step}
                </div>
                <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:36, height:36, borderRadius:10, background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.25)', fontFamily:C.fontDisplay, fontWeight:600, fontSize:13, color:'#f59e0b', marginBottom:18 }}>
                  {step.step}
                </div>
                <h3 style={{ fontFamily:C.fontDisplay, fontWeight:600, fontSize:17, color:C.white, marginBottom:10 }}>{step.title}</h3>
                <p style={{ color:C.muted, fontSize:13, lineHeight:1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
                           TECH STACK
        ══════════════════════════════════════════════════ */}
        <section style={{ maxWidth:900, margin:'0 auto', padding:'0 28px 96px' }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:28, padding:'52px 40px', textAlign:'center' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:100, padding:'6px 16px', marginBottom:20 }}>
              <span style={{ fontSize:12, color:'#fbbf24', fontWeight:600, letterSpacing:'0.15em', textTransform:'uppercase' }}>Tech Stack</span>
            </div>
            <h2 style={{ fontFamily:C.fontDisplay, fontWeight:700, fontSize:'clamp(22px,4vw,38px)', color:C.white, marginBottom:14 }}>
              Built Using Modern Technologies
            </h2>
            <p style={{ color:C.muted, fontSize:15, maxWidth:500, margin:'0 auto 36px', lineHeight:1.7 }}>
              Scalable, industry-standard tools for performance, security, and real-time communication.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:10 }}>
              {TECH_STACK.map(tech => (
                <div
                  key={tech}
                  className="tech-badge"
                  style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${C.border}`, borderRadius:100, padding:'10px 22px', fontSize:14, fontWeight:600, color:'#94a3b8', letterSpacing:'0.02em' }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
                              CTA
        ══════════════════════════════════════════════════ */}
        <section style={{ maxWidth:860, margin:'0 auto', padding:'0 28px 120px' }}>
          <div style={{ position:'relative', background:'linear-gradient(135deg, rgba(245,158,11,0.10) 0%, rgba(249,115,22,0.07) 100%)', border:'1px solid rgba(245,158,11,0.22)', borderRadius:32, padding:'72px 40px', textAlign:'center', overflow:'hidden', animation:'borderGlow 4s ease-in-out infinite' }}>
            {/* glow behind */}
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:400, height:200, background:'radial-gradient(ellipse, rgba(245,158,11,0.12), transparent 70%)', pointerEvents:'none' }} />

            <h2 style={{ fontFamily:C.fontDisplay, fontWeight:700, fontSize:'clamp(26px,4vw,52px)', color:C.white, lineHeight:1.12, marginBottom:18, position:'relative' }}>
              Start Managing Projects<br />Without the Chaos
            </h2>
            <p style={{ color:C.muted, fontSize:'clamp(14px,2vw,17px)', marginBottom:40, lineHeight:1.7, position:'relative' }}>
              Built for Students. Helpful for Mentors. Easy for Colleges.
            </p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', position:'relative' }}>
              <Link
                to="/register"
                style={{ ...btnPrimary, fontSize:16, padding:'15px 38px' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 0 56px rgba(245,158,11,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 0 32px rgba(245,158,11,0.25)' }}
              >
                Sign Up Free — It's Free
              </Link>
              <Link
                to="/login"
                style={{ ...btnSecondary, fontSize:16, padding:'15px 38px' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)' }}
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
      <footer style={{ borderTop:`1px solid ${C.border}`, background:'rgba(4,7,13,0.95)', padding:'32px 28px', textAlign:'center' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#f59e0b,#f97316)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🎓</div>
            <span style={{ fontFamily:C.fontDisplay, fontWeight:700, fontSize:15, color:'#475569' }}>SPMS</span>
          </div>
          <p style={{ fontSize:13, color:C.dim }}>
            © {new Date().getFullYear()} Student Project Management System. All rights reserved.
          </p>
          <div style={{ display:'flex', gap:20 }}>
            {['Students','Mentors','Teachers'].map(r => (
              <span key={r} style={{ fontSize:12, color:C.dim }}>{r}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}