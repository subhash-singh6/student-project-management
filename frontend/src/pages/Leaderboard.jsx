import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../constants/context/AuthContext'
import API from '../api/axios'
import { statsService } from '../services/statsService'
import { Trophy, Users, Star, Award, CheckCircle, Sparkles, Calendar, Layers } from 'lucide-react'

const BADGES = [
  { id: 'first_project', icon: Sparkles, label: 'First Project', desc: 'Pehla project submit kiya', condition: (p) => p.length >= 1 },
  { id: 'approved', icon: CheckCircle, label: 'Approved!', desc: 'Project approve hua', condition: (p) => p.some(x => x.status === 'approved') },
  { id: 'completed', icon: Award, label: 'Project Champion', desc: 'Project complete kiya', condition: (p) => p.some(x => x.status === 'completed') },
  { id: 'a_grade', icon: Star, label: 'Star Student', desc: 'A ya A+ grade mila', condition: (p) => p.some(x => x.grade === 'A' || x.grade === 'A+') },
  { id: 'five_projects', icon: Layers, label: 'Project Master', desc: '5 projects submit kiye', condition: (p) => p.length >= 5 },
  { id: 'team_player', icon: Users, label: 'Team Player', desc: 'Team mein join kiya', condition: (p, hasTeam) => hasTeam },
  { id: 'multi_tech', icon: Trophy, label: 'Tech Explorer', desc: '3+ technologies use ki', condition: (p) => { const techs = new Set(p.flatMap(x => x.techStack || [])); return techs.size >= 3 } },
  { id: 'consistent', icon: Calendar, label: 'Consistent', desc: '3 projects submit kiye', condition: (p) => p.length >= 3 },
]

const RANK_STYLES = [
  { bg: 'bg-gradient-to-br from-amber-400 to-yellow-300', color: 'text-amber-950', icon: '🥇' },
  { bg: 'bg-gradient-to-br from-slate-400 to-slate-200', color: 'text-slate-900', icon: '🥈' },
  { bg: 'bg-gradient-to-br from-orange-500 to-orange-300', color: 'text-orange-950', icon: '🥉' },
]

export default function Leaderboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [myProjects, setMyProjects] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [hasTeam, setHasTeam] = useState(false)
  const [loading, setLoading] = useState(true)
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
      try {
        await API.get('/teams/my')
        setHasTeam(true)
      } catch {
        setHasTeam(false)
      }
    } catch {}
    finally {
      setLoading(false)
    }
  }

  const calcPoints = (projects) => {
    let pts = 0
    pts += projects.length * 10
    pts += projects.filter(p => p.status === 'approved').length * 20
    pts += projects.filter(p => p.status === 'completed').length * 50
    pts += projects.filter(p => p.grade === 'A+').length * 30
    pts += projects.filter(p => p.grade === 'A').length * 25
    pts += projects.filter(p => p.grade === 'B+').length * 20
    pts += projects.filter(p => p.grade === 'B').length * 15
    return pts
  }

  const studentMap = {}
  allProjects.forEach(p => {
    const id = p.createdBy?._id || p.createdBy
    const name = p.createdBy?.name || 'Unknown'
    if (!studentMap[id]) studentMap[id] = { id, name, projects: [] }
    studentMap[id].projects.push(p)
  })

  const leaderboard = Object.values(studentMap)
    .map(s => ({
      ...s,
      points: calcPoints(s.projects),
      projectCount: s.projects.length,
      completedCount: s.projects.filter(p => p.status === 'completed').length
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 10)

  const myBadges = BADGES.map(b => ({
    ...b,
    earned: b.condition(myProjects, hasTeam),
  }))

  const myPoints = calcPoints(myProjects)
  const myRank = leaderboard.findIndex(s => s.id === user?._id) + 1

  const getDashboardPath = () => {
    if (user?.role === 'student') return '/student/dashboard'
    if (user?.role === 'mentor') return '/mentor/dashboard'
    return '/teacher/dashboard'
  }

  if (loading) return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div className="w-10 h-10 border-[3px] border-amber-500/20 border-t-amber-500 rounded-full animate-[spin_1s_linear_infinite]" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#070b14] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div className="max-w-[1000px] mx-auto px-6 py-8">
        <div className="mb-7 animate-[fadeUp_0.4s_ease]">
          <button
            onClick={() => navigate(getDashboardPath())}
            className="block mb-2 p-0 border-0 bg-transparent text-slate-500 cursor-pointer text-[13px]"
          >
            ← Dashboard
          </button>
          <h1 className="font-syne text-[28px] font-semibold text-slate-100 m-0">
            🏆 Leaderboard & Badges
          </h1>
        </div>

        <div className="mb-6 rounded-[20px] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-indigo-500/10 px-7 py-6 animate-[fadeUp_0.4s_ease_0.1s_both]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-[2px] text-amber-500">
                Your Stats
              </div>
              <div className="font-syne text-[32px] font-bold text-slate-100">
                {myPoints} pts
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Rank', value: myRank > 0 ? `#${myRank}` : 'N/A', color: 'text-amber-500' },
                { label: 'Projects', value: myProjects.length, color: 'text-indigo-500' },
                { label: 'Completed', value: myProjects.filter(p => p.status === 'completed').length, color: 'text-emerald-500' },
                { label: 'Badges', value: myBadges.filter(b => b.earned).length, color: 'text-cyan-400' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className={`font-syne text-[22px] font-bold ${s.color}`}>{s.value}</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5 flex gap-1 rounded-[14px] border border-white/5 bg-slate-900/90 p-1.5 animate-[fadeUp_0.4s_ease_0.15s_both]">
          {[
            { key: 'leaderboard', label: '🏆 Leaderboard' },
            { key: 'badges', label: '🎖️ My Badges' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-[10px] px-3 py-2 text-[13px] font-semibold transition-all font-syne ${
                activeTab === tab.key
                  ? 'border border-amber-500/20 bg-amber-500/10 text-amber-500'
                  : 'border border-transparent bg-transparent text-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'leaderboard' && (
          <div className="animate-[fadeUp_0.4s_ease]">
            {leaderboard.length >= 3 && (
              <div className="mb-5 grid grid-cols-[1fr_1.2fr_1fr] items-end gap-3">
                {[leaderboard[1], leaderboard[0], leaderboard[2]].map((s, i) => {
                  const rankIdx = i === 0 ? 1 : i === 1 ? 0 : 2
                  const rs = RANK_STYLES[rankIdx]
                  const height = rankIdx === 0 ? 'h-[160px]' : rankIdx === 1 ? 'h-[120px]' : 'h-[100px]'
                  return (
                    <div
                      key={s?.id || i}
                      className={`flex flex-col items-center justify-end gap-1.5 rounded-[16px] border border-white/5 bg-slate-900/90 px-4 py-5 text-center ${height}`}
                    >
                      <div className="text-[24px]">{rs.icon}</div>
                      <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${rankIdx === 0 ? 'from-amber-400 to-yellow-300' : rankIdx === 1 ? 'from-slate-400 to-slate-200' : 'from-orange-500 to-orange-300'} text-[18px] font-extrabold ${rs.color}`}>
                        {s?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="font-syne text-[13px] font-semibold text-slate-100">
                        {s?.name?.split(' ')[0] || '—'}
                      </div>
                      <div className="font-syne text-[16px] font-bold text-amber-500">
                        {s?.points || 0} pts
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="overflow-hidden rounded-[20px] border border-white/5 bg-slate-900/90">
              <div className="grid grid-cols-[40px_1fr_80px_80px_80px] border-b border-white/5 px-5 py-3">
                {['#', 'Student', 'Projects', 'Done', 'Points'].map(h => (
                  <span key={h} className="text-[11px] font-semibold tracking-[1px] text-slate-600">
                    {h}
                  </span>
                ))}
              </div>

              {leaderboard.length === 0 ? (
                <div className="p-12 text-center text-slate-600">
                  <div className="mb-3 text-[40px] opacity-20">
                    <Trophy className="inline h-10 w-10" />
                  </div>
                  <p>Koi data nahi abhi</p>
                </div>
              ) : (
                leaderboard.map((s, i) => {
                  const isMe = s.id === user?._id
                  return (
                    <div
                      key={s.id}
                      className={`rank-row grid grid-cols-[40px_1fr_80px_80px_80px] items-center border-b border-white/3 px-5 py-3 transition-colors ${
                        isMe ? 'bg-indigo-500/5' : 'bg-transparent'
                      }`}
                    >
                      <span className={`font-syne text-[15px] font-extrabold ${i < 3 ? ['text-amber-500', 'text-slate-400', 'text-orange-500'][i] : 'text-slate-600'}`}>
                        {i + 1}
                      </span>

                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-[13px] font-bold text-white">
                          {s.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className={`text-[14px] font-medium ${isMe ? 'text-indigo-300 font-bold' : 'text-slate-200'}`}>
                            {s.name} {isMe && '(You)'}
                          </div>
                        </div>
                      </div>

                      <span className="text-[13px] text-slate-500">{s.projectCount}</span>
                      <span className="text-[13px] text-emerald-500">{s.completedCount}</span>
                      <span className="font-syne text-[14px] font-bold text-amber-500">{s.points}</span>
                    </div>
                  )
                })
              )}
            </div>

            <div className="mt-4 rounded-[14px] border border-white/5 bg-slate-900/60 p-4">
              <p className="mb-2 text-[12px] font-semibold text-slate-600">
                📌 Points System:
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { l: 'Project submit', v: '+10 pts' },
                  { l: 'Approved', v: '+20 pts' },
                  { l: 'Completed', v: '+50 pts' },
                  { l: 'A+ Grade', v: '+30 pts' },
                  { l: 'A Grade', v: '+25 pts' },
                ].map(x => (
                  <span key={x.l} className="text-[12px] text-slate-500">
                    {x.l}: <strong className="text-amber-500">{x.v}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="animate-[fadeUp_0.4s_ease]">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5">
              {myBadges.map((b, i) => {
                const Icon = b.icon
                return (
                  <div
                    key={b.id}
                    className={`rounded-[16px] border px-4 py-5 text-center transition-all animate-[fadeUp_0.4s_ease] ${
                      b.earned
                        ? 'border-amber-500/25 bg-amber-500/8 opacity-100'
                        : 'border-white/5 bg-slate-900/90 opacity-50'
                    }`}
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div className={`mb-3 text-[40px] ${b.earned ? 'text-amber-500' : 'text-slate-500'}`}>
                      <Icon className="mx-auto h-10 w-10" />
                    </div>
                    <div className={`mb-1.5 font-syne text-[14px] font-semibold ${b.earned ? 'text-slate-100' : 'text-slate-600'}`}>
                      {b.label}
                    </div>
                    <div className={`text-[12px] leading-5 ${b.earned ? 'text-slate-500' : 'text-slate-700'}`}>
                      {b.desc}
                    </div>
                    {b.earned && (
                      <div className="mt-2.5 inline-block rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-0.5 text-[11px] font-semibold text-amber-500">
                        ✅ Earned!
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}