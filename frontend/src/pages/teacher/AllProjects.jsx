// frontend/src/pages/teacher/AllProjects.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

const STATUS_MAP = {
  pending:       { theme: 'text-amber-400 bg-amber-500/12 border-amber-500/20',   label: '⏳ Pending' },
  approved:      { theme: 'text-emerald-400 bg-emerald-500/12 border-emerald-500/20', label: '✅ Approved' },
  'in-progress': { theme: 'text-indigo-400 bg-indigo-500/12 border-indigo-500/20', label: '🔄 In Progress' },
  completed:     { theme: 'text-cyan-400 bg-cyan-500/12 border-cyan-500/20',   label: '🏆 Completed' },
  rejected:      { theme: 'text-red-400 bg-red-500/12 border-red-500/20',     label: '❌ Rejected' },
}

export default function AllProjects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')
  const [approving, setApproving] = useState(null)
  const [remarks, setRemarks]     = useState('')

  useEffect(() => { fetchProjects() }, [])

  useEffect(() => {
    let list = projects
    if (filter !== 'all') list = list.filter(p => p.status === filter)
    if (search) {
      list = list.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) || 
        p.createdBy?.name?.toLowerCase().includes(search.toLowerCase())
      )
    }
    setFiltered(list)
  }, [projects, filter, search])

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects')
      setProjects(res.data.projects || [])
    } catch {
      toast.error('Projects load nahi hue!')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (projectId, status) => {
    try {
      await API.put(`/projects/${projectId}/approve`, { status, remarks })
      toast.success(`Project ${status}! ✅`)
      setApproving(null)
      setRemarks('')
      fetchProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error aaya!')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#070b14] font-sans antialiased text-slate-200">
      {/* Dynamic Font and Base Layer Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .animate-fadeUp { animation: fadeUp 0.4s ease both; }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header Control Panel */}
        <div className="mb-7 animate-fadeUp">
          <button 
            onClick={() => navigate('/teacher/dashboard')} 
            className="bg-transparent border-none text-slate-500 hover:text-slate-300 transition-colors cursor-pointer text-xs font-medium mb-2 block p-0"
          >
            ← Back to Dashboard
          </button>
          
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h1 className="font-syne text-3xl font-normal text-slate-100 tracking-tight m-0">📁 All Projects</h1>
              <p className="text-slate-500 text-xs mt-1 font-medium">{filtered.length} of {projects.length} clusters deployed</p>
            </div>
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="🔍 Search projects or students..." 
              className="w-72 bg-white/[0.02] border border-white/5 focus:border-indigo-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 font-medium outline-none transition-all"
            />
          </div>
        </div>

        {/* Dynamic State Filtering System */}
        <div className="flex gap-2 mb-6 flex-wrap animate-fadeUp" style={{ animationDelay: '0.1s' }}>
          {['all', 'pending', 'approved', 'in-progress', 'completed', 'rejected'].map(f => {
            const isActive = filter === f
            return (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer capitalize
                  ${isActive 
                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' 
                    : 'bg-white/[0.03] text-slate-500 border-white/[0.07] hover:bg-white/[0.08] hover:text-slate-300'
                  }`}
              >
                {f === 'all' ? `All (${projects.length})` : f}
              </button>
            )
          })}
        </div>

        {/* Core Project Cards Framework Container */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600 animate-fadeUp">
            <div className="text-5xl mb-3 opacity-20">📁</div>
            <p className="text-sm font-medium">No system metrics match this parameters configuration.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {filtered.map((p, i) => {
              const st = STATUS_MAP[p.status] || STATUS_MAP.pending
              return (
                <div 
                  key={p._id} 
                  className="bg-slate-900/40 backdrop-blur-md border border-white/[0.04] rounded-2xl p-6 transition-all duration-300 animate-fadeUp group
                             hover:border-indigo-500/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex justify-between items-start flex-wrap gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <h3 className="font-syne text-slate-100 text-lg font-bold m-0 group-hover:text-indigo-400 transition-colors tracking-tight">
                          {p.title}
                        </h3>
                        <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-extrabold uppercase tracking-wide ${st.theme}`}>
                          {st.label}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-3xl m-0">
                        {p.description?.slice(0, 120)}{p.description?.length > 120 ? '...' : ''}
                      </p>
                    </div>

                    {/* Action Engine Triggers for Evaluator */}
                    {p.status === 'pending' && (
                      <div className="flex gap-2 ml-4 flex-shrink-0">
                        <button 
                          onClick={() => handleApprove(p._id, 'approved')} 
                          className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          ✅ Approve
                        </button>
                        <button 
                          onClick={() => setApproving(approving === p._id ? null : p._id)} 
                          className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Operational Exception: Input Rejection Log */}
                  {approving === p._id && (
                    <div className="bg-red-500/[0.03] border border-red-500/15 rounded-xl p-4 mb-4 animate-fadeUp">
                      <input 
                        value={remarks} 
                        onChange={e => setRemarks(e.target.value)} 
                        placeholder="Provide rejection reason parameters..." 
                        className="w-full bg-white/[0.02] border border-white/5 focus:border-red-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 font-medium outline-none transition-all mb-3" 
                      />
                      <button 
                        onClick={() => handleApprove(p._id, 'rejected')} 
                        className="bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 px-5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer"
                      >
                        Confirm Termination Sequence
                      </button>
                    </div>
                  )}

                  {/* Infrastructure Meta Segment Tag Assembly */}
                  <div className="flex gap-x-4 gap-y-1.5 flex-wrap text-xs font-semibold text-slate-500 border-t border-white/[0.02] pt-3.5">
                    <span className="flex items-center gap-1.5 text-slate-400">👤 {p.createdBy?.name || 'Unknown Log'}</span>
                    {p.category && <span className="flex items-center gap-1.5">📂 {p.category}</span>}
                    {p.deadline && <span className="flex items-center gap-1.5">📅 {new Date(p.deadline).toLocaleDateString('en-IN')}</span>}
                    {p.techStack?.length > 0 && <span className="flex items-center gap-1.5 max-w-xs truncate">🔧 {p.techStack.join(', ')}</span>}
                    {p.grade && <span className="flex items-center gap-1.5 bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10 text-emerald-400 font-bold rounded">⭐ Grade: {p.grade}</span>}
                  </div>

                  {/* Metrics Velocity Assembly Bar */}
                  <div className="mt-4 border-t border-white/[0.02] pt-3">
                    <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
                      <span className="text-slate-600">Pipeline Velocity</span>
                      <span className="text-indigo-400 font-mono text-xs normal-case font-medium">{p.progress}%</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-full h-2 overflow-hidden p-[1px]">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${p.progress}%` }} 
                      />
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}