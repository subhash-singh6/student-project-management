import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'
import {
  FiStar,
  FiUser,
  FiFolder,
  FiMessageSquare,
  FiEdit3,
} from 'react-icons/fi'

const GRADES = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F']

const GRADE_COLORS = {
  'A+': { theme: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20' },
  'A': { theme: 'text-emerald-400 bg-emerald-500/12 border-emerald-500/15' },
  'B+': { theme: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/20' },
  'B': { theme: 'text-indigo-400 bg-indigo-500/12 border-indigo-500/15' },
  'C': { theme: 'text-amber-400 bg-amber-500/12 border-amber-500/15' },
  'D': { theme: 'text-orange-400 bg-orange-500/12 border-orange-500/15' },
  'F': { theme: 'text-red-400 bg-red-500/12 border-red-500/15' },
}

export default function GiveGrades() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [grading, setGrading] = useState(null)
  const [selectedGrade, setSelectedGrade] = useState('')
  const [gradeRemarks, setGradeRemarks] = useState('')
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

  const filtered =
    filter === 'graded'
      ? projects.filter(p => p.grade)
      : projects.filter(p => p.status === 'approved' && !p.grade)

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#070b14]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#070b14] font-sans text-slate-200 antialiased">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-7 animate-fadeUp">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="mb-2 block cursor-pointer border-none bg-transparent p-0 text-xs font-medium text-slate-500 transition-colors hover:text-slate-300"
          >
            ← Back to Dashboard
          </button>
          <h1 className="m-0 text-3xl font-extrabold tracking-tight text-slate-100">
            <span className="inline-flex items-center gap-2">
              <FiStar className="text-amber-400" />
              Assign Grades
            </span>
          </h1>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Evaluate and score system-approved project clusters
          </p>
        </div>

        <div className="mb-6 flex gap-2 animate-fadeUp">
          {[
            { key: 'approved', label: `Pending (${projects.filter(p => p.status === 'approved' && !p.grade).length})` },
            { key: 'graded', label: `Graded (${projects.filter(p => p.grade).length})` },
          ].map(tab => {
            const isActive = filter === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition-all
                  ${isActive
                    ? 'border-amber-500/30 bg-amber-500/15 font-bold text-amber-400'
                    : 'border-white/[0.07] bg-white/[0.03] text-slate-500 hover:bg-white/[0.08] hover:text-slate-300'
                  }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="animate-fadeUp rounded-3xl border border-white/[0.06] bg-slate-900/40 py-16 text-center backdrop-blur-md">
            <div className="mb-3 text-5xl opacity-20">
              <FiStar className="mx-auto" />
            </div>
            <p className="text-sm font-medium text-slate-500">
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
                  className="group animate-fadeUp rounded-2xl border border-white/[0.06] bg-slate-900/40 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-500/25"
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="m-0 text-lg font-bold tracking-tight text-slate-100 transition-colors group-hover:text-amber-400">
                        {p.title}
                      </h3>

                      <div className="mt-1.5 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1">
                          <FiUser /> {p.createdBy?.name || 'System Identity'}
                        </span>
                        {p.category && (
                          <span className="flex items-center gap-1">
                            <FiFolder /> {p.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2.5">
                      {p.grade && (
                        <div className={`min-w-[56px] rounded-xl border px-4 py-1.5 text-center ${gc.theme}`}>
                          <div className="text-xl font-extrabold tracking-tight">
                            {p.grade}
                          </div>
                        </div>
                      )}
                      {!p.grade && (
                        <button
                          onClick={() => setGrading(grading === p._id ? null : p._id)}
                          className="cursor-pointer rounded-xl border-none bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/10 transition-all hover:opacity-95"
                        >
                          <span className="inline-flex items-center gap-1">
                            <FiEdit3 /> Grade Now
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {p.gradeRemarks && (
                    <div className="mb-1 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] p-3">
                      <span className="block text-xs font-medium leading-relaxed text-emerald-400">
                        <span className="inline-flex items-center gap-1">
                          <FiMessageSquare /> {p.gradeRemarks}
                        </span>
                      </span>
                    </div>
                  )}

                  {grading === p._id && (
                    <div className="mt-3 animate-fadeUp rounded-xl border border-amber-500/15 bg-amber-500/[0.03] p-5">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Select Score Vector:
                      </p>

                      <div className="mb-4 flex flex-wrap gap-2">
                        {GRADES.map(g => {
                          const gc2 = GRADE_COLORS[g]
                          const isSelected = selectedGrade === g
                          return (
                            <button
                              key={g}
                              onClick={() => setSelectedGrade(g)}
                              className={`min-w-[52px] cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-extrabold transition-all
                                ${isSelected
                                  ? `${gc2.theme} scale-105 border-2`
                                  : 'border-white/[0.08] bg-white/[0.04] text-slate-500 hover:bg-white/[0.08] hover:text-slate-300'
                                }`}
                            >
                              {g}
                            </button>
                          )
                        })}
                      </div>

                      <div className="mb-4">
                        <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                          Evaluation Narrative (Optional)
                        </label>
                        <input
                          value={gradeRemarks}
                          onChange={e => setGradeRemarks(e.target.value)}
                          placeholder="Provide descriptive feedback or internal comments..."
                          className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-slate-200 outline-none transition-all placeholder:text-slate-600 focus:border-amber-500/30"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleGrade(p._id)}
                          disabled={submitting || !selectedGrade}
                          className="flex-1 cursor-pointer rounded-xl border-none bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/5 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {submitting ? 'Committing Parameters...' : 'Submit Evaluation Vector →'}
                        </button>
                        <button
                          onClick={() => { setGrading(null); setSelectedGrade(''); setGradeRemarks('') }}
                          className="cursor-pointer rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-xs font-bold text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-slate-200"
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