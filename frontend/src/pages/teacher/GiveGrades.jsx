// frontend/src/pages/teacher/GiveGrades.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

const GRADES = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F']

const GRADE_COLORS = {
  'A+': { theme: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20' },
  'A':  { theme: 'text-emerald-400 bg-emerald-500/12 border-emerald-500/15' },
  'B+': { theme: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/20' },
  'B':  { theme: 'text-indigo-400 bg-indigo-500/12 border-indigo-500/15' },
  'C':  { theme: 'text-amber-400 bg-amber-500/12 border-amber-500/15' },
  'D':  { theme: 'text-orange-400 bg-orange-500/12 border-orange-500/15' },
  'F':  { theme: 'text-red-400 bg-red-500/12 border-red-500/15' },
}

export default function GiveGrades() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [grading, setGrading]   = useState(null)
  const [selectedGrade, setSelectedGrade] = useState('')
  const [gradeRemarks, setGradeRemarks]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState('approved')

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects')
      setProjects(res.data.projects || [])
    } catch {
      toast.error('Failed to load clusters!')
    } finally {
      setLoading(false)
    }
  }

  const handleGrade = async (projectId) => {
    if (!selectedGrade) return toast.error('Please select a valid evaluation score!')
    setSubmitting(true)
    try {
      await API.put(`/projects/${projectId}/grade`, {
        grade: selectedGrade,
        gradeRemarks,
      })
      toast.success(`Grade ${selectedGrade} assigned successfully! ⭐`)
      setGrading(null)
      setSelectedGrade('')
      setGradeRemarks('')
      fetchProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Execution error during grade assignment!')
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = filter === 'graded'
    ? projects.filter(p => p.grade)
    : projects.filter(p => p.status === 'approved' && !p.grade)

  if (loading) return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#070b14] font-sans antialiased text-slate-200">
      {/* Global CSS Injector Framework */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .animate-fadeUp { animation: fadeUp 0.4s ease both; }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header Segment Container */}
        <div className="mb-7 animate-fadeUp">
          <button 
            onClick={() => navigate('/teacher/dashboard')} 
            className="bg-transparent border-none text-slate-500 hover:text-slate-300 transition-colors cursor-pointer text-xs font-medium mb-2 block p-0"
          >
            ← Back to Dashboard
          </button>
          <h1 className="font-syne text-3xl font-extrabold text-slate-100 tracking-tight m-0">⭐ Assign Grades</h1>
          <p className="text-slate-500 text-xs mt-1 font-medium">Evaluate and score system-approved project clusters</p>
        </div>

        {/* Operational Scope State Filters */}
        <div className="flex gap-2 mb-6 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
          {[
            { key: 'approved', label: `Pending (${projects.filter(p => p.status === 'approved' && !p.grade).length})` },
            { key: 'graded',   label: `Graded (${projects.filter(p => p.grade).length})` },
          ].map(tab => {
            const isActive = filter === tab.key
            return (
              <button 
                key={tab.key} 
                onClick={() => setFilter(tab.key)} 
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all cursor-pointer
                  ${isActive 
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold' 
                    : 'bg-white/[0.03] text-slate-500 border-white/[0.07] hover:bg-white/[0.08] hover:text-slate-300'
                  }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Dynamic Project Stream Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 backdrop-blur-md border border-white/[0.06] rounded-3xl animate-fadeUp">
            <div className="text-5xl mb-3 opacity-20">⭐</div>
            <p className="text-slate-500 text-sm font-medium">
              {filter === 'approved' ? 'All active cluster projects have been evaluated!' : 'No historical grade structures tracked.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((p, i) => {
              const gc = p.grade ? GRADE_COLORS[p.grade] || GRADE_COLORS['C'] : null
              return (
                <div 
                  key={p._id} 
                  className="bg-slate-900/40 backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 animate-fadeUp group
                             hover:border-amber-500/25 hover:-translate-y-0.5"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="flex justify-between items-start flex-wrap gap-4 mb-3">
                    <div>
                      <h3 className="font-syne text-slate-100 text-lg font-bold m-0 group-hover:text-amber-400 transition-colors tracking-tight">
                        {p.title}
                      </h3>
                      <div className="flex gap-3 mt-1.5 flex-wrap text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1">👤 {p.createdBy?.name || 'System Identity'}</span>
                        {p.category && <span className="flex items-center gap-1">📂 {p.category}</span>}
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-center flex-shrink-0">
                      {p.grade && (
                        <div className={`border rounded-xl px-4 py-1.5 min-w-[56px] text-center ${gc.theme}`}>
                          <div className="font-syne font-extrabold text-xl tracking-tight">{p.grade}</div>
                        </div>
                      )}
                      {!p.grade && (
                        <button 
                          onClick={() => setGrading(grading === p._id ? null : p._id)} 
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 shadow-md shadow-orange-500/10 text-white border-none px-4 py-2 rounded-xl text-xs font-bold font-syne transition-all cursor-pointer"
                        >
                          ⭐ Grade Now
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Historical Evaluation Logs */}
                  {p.gradeRemarks && (
                    <div className="bg-emerald-500/[0.04] border border-emerald-500/10 rounded-xl p-3 mb-1">
                      <span className="text-emerald-400 text-xs font-medium leading-relaxed block">💬 {p.gradeRemarks}</span>
                    </div>
                  )}

                  {/* Submission Input Engine Layer */}
                  {grading === p._id && (
                    <div className="bg-amber-500/[0.03] border border-amber-500/15 rounded-xl p-5 mt-3 animate-fadeUp">
                      <p className="text-slate-400 text-xs font-semibold mb-3 tracking-wide uppercase text-slate-500">Select Score Vector:</p>

                      {/* Grade Parameter Grid Configuration */}
                      <div className="flex gap-2 flex-wrap mb-4">
                        {GRADES.map(g => {
                          const gc2 = GRADE_COLORS[g]
                          const isSelected = selectedGrade === g
                          return (
                            <button 
                              key={g} 
                              onClick={() => setSelectedGrade(g)} 
                              className={`font-syne font-extrabold text-sm rounded-xl px-4 py-2.5 min-w-[52px] cursor-pointer transition-all border
                                ${isSelected 
                                  ? `${gc2.theme} border-2 scale-105` 
                                  : 'bg-white/[0.04] text-slate-500 border-white/[0.08] hover:bg-white/[0.08] hover:text-slate-300'
                                }`}
                            >
                              {g}
                            </button>
                          )
                        })}
                      </div>

                      {/* Evaluator Comment Stream Log */}
                      <div className="mb-4">
                        <label className="text-[10px] text-slate-600 font-extrabold mb-1.5 block uppercase tracking-wider">Evaluation Narrative (Optional)</label>
                        <input 
                          value={gradeRemarks} 
                          onChange={e => setGradeRemarks(e.target.value)} 
                          placeholder="Provide descriptive feedback or internal comments..." 
                          className="w-full bg-white/[0.02] border border-white/5 focus:border-amber-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 font-medium outline-none transition-all" 
                        />
                      </div>

                      {/* Configuration Dispatch Buttons */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleGrade(p._id)} 
                          disabled={submitting || !selectedGrade} 
                          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none rounded-xl py-2.5 text-xs font-bold font-syne shadow-md shadow-orange-500/5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? 'Committing Parameters...' : 'Submit Evaluation Vector →'}
                        </button>
                        <button 
                          onClick={() => { setGrading(null); setSelectedGrade(''); setGradeRemarks('') }} 
                          className="bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200 px-4 rounded-xl text-xs font-bold font-syne cursor-pointer transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}