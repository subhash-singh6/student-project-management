// frontend/src/pages/Leaderboard.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import { statsService } from '../services/statsService'

const BADGES = [
  { id: 'first_project',  icon: '🚀', label: 'First Project',    desc: 'Pehla project submit kiya',      condition: (p) => p.length >= 1 },
  { id: 'approved',       icon: '✅', label: 'Approved!',         desc: 'Project approve hua',            condition: (p) => p.some(x=>x.status==='approved') },
  { id: 'completed',      icon: '🏆', label: 'Project Champion',  desc: 'Project complete kiya',          condition: (p) => p.some(x=>x.status==='completed') },
  { id: 'a_grade',        icon: '⭐', label: 'Star Student',       desc: 'A ya A+ grade mila',             condition: (p) => p.some(x=>x.grade==='A'||x.grade==='A+') },
  { id: 'five_projects',  icon: '🔥', label: 'Project Master',    desc: '5 projects submit kiye',         condition: (p) => p.length >= 5 },
  { id: 'team_player',    icon: '👥', label: 'Team Player',        desc: 'Team mein join kiya',            condition: (p,hasTeam) => hasTeam },
  { id: 'multi_tech',     icon: '💻', label: 'Tech Explorer',     desc: '3+ technologies use ki',         condition: (p) => { const techs = new Set(p.flatMap(x=>x.techStack||[])); return techs.size >= 3 } },
  { id: 'consistent',     icon: '📅', label: 'Consistent',        desc: '3 projects submit kiye',         condition: (p) => p.length >= 3 },
]

const RANK_STYLES = [
  { bg: 'linear-gradient(135deg,#f59e0b,#fbbf24)', color: '#7c2d12', icon: '🥇' },
  { bg: 'linear-gradient(135deg,#94a3b8,#cbd5e1)', color: '#1e293b', icon: '🥈' },
  { bg: 'linear-gradient(135deg,#f97316,#fb923c)', color: '#431407', icon: '🥉' },
]

export default function Leaderboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [myProjects, setMyProjects] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [hasTeam, setHasTeam]   = useState(false)
  const [loading, setLoading]   = useState(true)
  const [activeTab, setActiveTab] = useState('leaderboard')

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [lbRes, projRes] = await Promise.all([
        statsService.leaderboard(),
        API.get('/projects'),
      ])
      const lb = lbRes.data.leaderboard || []
      setAllProjects(projRes.data.projects || [])
      const me = lb.find((s) => s.id === user?._id)
      if (me) {
        setMyProjects(me.projects || [])
      } else {
        setMyProjects(
          (projRes.data.projects || []).filter(
            (p) => p.createdBy?._id === user?._id || p.createdBy === user?._id
          )
        )
      }
      try { await API.get('/teams/my'); setHasTeam(true) } catch { setHasTeam(false) }
    } catch {}
    finally { setLoading(false) }
  }

  // Points calculate karo
  const calcPoints = (projects) => {
    let pts = 0
    pts += projects.length * 10
    pts += projects.filter(p=>p.status==='approved').length * 20
    pts += projects.filter(p=>p.status==='completed').length * 50
    pts += projects.filter(p=>p.grade==='A+').length * 30
    pts += projects.filter(p=>p.grade==='A').length * 25
    pts += projects.filter(p=>p.grade==='B+').length * 20
    pts += projects.filter(p=>p.grade==='B').length * 15
    return pts
  }

  // Leaderboard banao
  const studentMap = {}
  allProjects.forEach(p => {
    const id   = p.createdBy?._id || p.createdBy
    const name = p.createdBy?.name || 'Unknown'
    if (!studentMap[id]) studentMap[id] = { id, name, projects: [] }
    studentMap[id].projects.push(p)
  })

  const leaderboard = Object.values(studentMap)
    .map(s => ({ ...s, points: calcPoints(s.projects), projectCount: s.projects.length, completedCount: s.projects.filter(p=>p.status==='completed').length }))
    .sort((a,b) => b.points - a.points)
    .slice(0, 10)

  // My badges
  const myBadges = BADGES.map(b => ({
    ...b,
    earned: b.condition(myProjects, hasTeam),
  }))

  const myPoints = calcPoints(myProjects)
  const myRank   = leaderboard.findIndex(s => s.id === user?._id) + 1

  const getDashboardPath = () => {
    if (user?.role === 'student') return '/student/dashboard'
    if (user?.role === 'mentor')  return '/mentor/dashboard'
    return '/teacher/dashboard'
  }

  if (loading) return (
    <div style={{ minHeight:'100vh',background:'#070b14',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:40,height:40,border:'3px solid rgba(245,158,11,0.2)',borderTop:'3px solid #f59e0b',borderRadius:'50%',animation:'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ minHeight:'100vh',background:'#070b14',fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shine{0%{background-position:-200% center}100%{background-position:200% center}}
        .rank-row:hover{background:rgba(255,255,255,0.04) !important;}
      `}</style>

      <div style={{ maxWidth:1000,margin:'0 auto',padding:'32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:28,animation:'fadeUp 0.4s ease' }}>
          <button onClick={()=>navigate(getDashboardPath())} style={{ background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:13,marginBottom:8,display:'block',padding:0 }}>← Dashboard</button>
          <h1 style={{ fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:800,color:'#f1f5f9',margin:0 }}>🏆 Leaderboard & Badges</h1>
        </div>

        {/* My Stats */}
        <div style={{ background:'linear-gradient(135deg,rgba(245,158,11,0.12) 0%,rgba(99,102,241,0.08) 100%)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:20,padding:'24px 28px',marginBottom:24,animation:'fadeUp 0.4s ease 0.1s both' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16 }}>
            <div>
              <div style={{ color:'#f59e0b',fontSize:12,fontWeight:600,letterSpacing:2,textTransform:'uppercase',marginBottom:6 }}>Your Stats</div>
              <div style={{ fontFamily:'Syne,sans-serif',fontSize:32,fontWeight:800,color:'#f1f5f9' }}>{myPoints} pts</div>
            </div>
            <div style={{ display:'flex',gap:16,flexWrap:'wrap' }}>
              {[
                { label:'Rank',      value: myRank > 0 ? `#${myRank}` : 'N/A', color:'#f59e0b' },
                { label:'Projects',  value: myProjects.length,                   color:'#6366f1' },
                { label:'Completed', value: myProjects.filter(p=>p.status==='completed').length, color:'#10b981' },
                { label:'Badges',    value: myBadges.filter(b=>b.earned).length, color:'#22d3ee' },
              ].map(s=>(
                <div key={s.label} style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:'Syne,sans-serif',fontSize:22,fontWeight:800,color:s.color }}>{s.value}</div>
                  <div style={{ color:'#475569',fontSize:11,marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex',gap:4,marginBottom:20,background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:14,padding:6,animation:'fadeUp 0.4s ease 0.15s both' }}>
          {[
            { key:'leaderboard', label:'🏆 Leaderboard' },
            { key:'badges',      label:'🎖️ My Badges' },
          ].map(tab=>(
            <button key={tab.key} onClick={()=>setActiveTab(tab.key)} style={{ flex:1,background:activeTab===tab.key?'rgba(245,158,11,0.15)':'transparent',border:`1px solid ${activeTab===tab.key?'rgba(245,158,11,0.3)':'transparent'}`,borderRadius:10,padding:'10px',color:activeTab===tab.key?'#f59e0b':'#64748b',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:13,transition:'all 0.2s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard Tab */}
        {activeTab==='leaderboard' && (
          <div style={{ animation:'fadeUp 0.4s ease' }}>

            {/* Top 3 */}
            {leaderboard.length >= 3 && (
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1.2fr 1fr',gap:12,marginBottom:20,alignItems:'flex-end' }}>
                {[leaderboard[1], leaderboard[0], leaderboard[2]].map((s,i)=>{
                  const rankIdx = i===0?1:i===1?0:2
                  const rs = RANK_STYLES[rankIdx]
                  const height = rankIdx===0?'160px':rankIdx===1?'120px':'100px'
                  return (
                    <div key={s?.id||i} style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:16,padding:'20px 16px',textAlign:'center',minHeight:height,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',gap:6 }}>
                      <div style={{ fontSize:32 }}>{rs.icon}</div>
                      <div style={{ width:44,height:44,background:rs.bg,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:rs.color,fontWeight:800,fontSize:18 }}>
                        {s?.name?.charAt(0).toUpperCase()||'?'}
                      </div>
                      <div style={{ color:'#f1f5f9',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13 }}>{s?.name?.split(' ')[0]||'—'}</div>
                      <div style={{ color:'#f59e0b',fontWeight:800,fontSize:16,fontFamily:'Syne,sans-serif' }}>{s?.points||0} pts</div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Full List */}
            <div style={{ background:'rgba(15,23,42,0.9)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,overflow:'hidden' }}>
              <div style={{ padding:'14px 20px',borderBottom:'1px solid rgba(255,255,255,0.04)',display:'grid',gridTemplateColumns:'40px 1fr 80px 80px 80px' }}>
                {['#','Student','Projects','Done','Points'].map(h=>(
                  <span key={h} style={{ color:'#334155',fontSize:11,fontWeight:600,letterSpacing:1 }}>{h}</span>
                ))}
              </div>
              {leaderboard.length===0 ? (
                <div style={{ textAlign:'center',padding:'48px',color:'#334155' }}>
                  <div style={{ fontSize:40,opacity:0.2,marginBottom:12 }}>🏆</div>
                  <p>Koi data nahi abhi</p>
                </div>
              ) : leaderboard.map((s,i)=>{
                const isMe = s.id === user?._id
                return (
                  <div key={s.id} className="rank-row" style={{ display:'grid',gridTemplateColumns:'40px 1fr 80px 80px 80px',padding:'14px 20px',borderBottom:'1px solid rgba(255,255,255,0.03)',background:isMe?'rgba(99,102,241,0.06)':'transparent',transition:'background 0.2s',alignItems:'center' }}>
                    <span style={{ fontFamily:'Syne,sans-serif',fontWeight:800,color:i<3?['#f59e0b','#94a3b8','#f97316'][i]:'#334155',fontSize:15 }}>{i+1}</span>
                    <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                      <div style={{ width:32,height:32,background:'linear-gradient(135deg,#6366f1,#22d3ee)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:13,flexShrink:0 }}>
                        {s.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ color:isMe?'#818cf8':'#e2e8f0',fontSize:14,fontWeight:isMe?700:400 }}>{s.name} {isMe&&'(You)'}</div>
                      </div>
                    </div>
                    <span style={{ color:'#64748b',fontSize:13 }}>{s.projectCount}</span>
                    <span style={{ color:'#10b981',fontSize:13 }}>{s.completedCount}</span>
                    <span style={{ color:'#f59e0b',fontWeight:700,fontFamily:'Syne,sans-serif',fontSize:14 }}>{s.points}</span>
                  </div>
                )
              })}
            </div>

            {/* Points Guide */}
            <div style={{ background:'rgba(15,23,42,0.6)',border:'1px solid rgba(255,255,255,0.04)',borderRadius:14,padding:16,marginTop:16 }}>
              <p style={{ color:'#334155',fontSize:12,margin:'0 0 8px',fontWeight:600 }}>📌 Points System:</p>
              <div style={{ display:'flex',gap:16,flexWrap:'wrap' }}>
                {[
                  {l:'Project submit',v:'+10 pts'},
                  {l:'Approved',v:'+20 pts'},
                  {l:'Completed',v:'+50 pts'},
                  {l:'A+ Grade',v:'+30 pts'},
                  {l:'A Grade',v:'+25 pts'},
                ].map(x=>(
                  <span key={x.l} style={{ color:'#475569',fontSize:12 }}>{x.l}: <strong style={{ color:'#f59e0b' }}>{x.v}</strong></span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab==='badges' && (
          <div style={{ animation:'fadeUp 0.4s ease' }}>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14 }}>
              {myBadges.map((b,i)=>(
                <div key={b.id} style={{ background:b.earned?'rgba(245,158,11,0.08)':'rgba(15,23,42,0.9)',border:`1px solid ${b.earned?'rgba(245,158,11,0.25)':'rgba(255,255,255,0.06)'}`,borderRadius:16,padding:'20px 16px',textAlign:'center',transition:'all 0.2s',opacity:b.earned?1:0.5,animation:`fadeUp 0.4s ease ${i*0.06}s both` }}>
                  <div style={{ fontSize:40,marginBottom:12,filter:b.earned?'none':'grayscale(100%)' }}>{b.icon}</div>
                  <div style={{ fontFamily:'Syne,sans-serif',color:b.earned?'#f1f5f9':'#334155',fontWeight:700,fontSize:14,marginBottom:6 }}>{b.label}</div>
                  <div style={{ color:b.earned?'#64748b':'#1e293b',fontSize:12,lineHeight:1.4 }}>{b.desc}</div>
                  {b.earned && (
                    <div style={{ marginTop:10,background:'rgba(245,158,11,0.15)',border:'1px solid rgba(245,158,11,0.3)',borderRadius:20,padding:'3px 12px',display:'inline-block',color:'#f59e0b',fontSize:11,fontWeight:600 }}>✅ Earned!</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}