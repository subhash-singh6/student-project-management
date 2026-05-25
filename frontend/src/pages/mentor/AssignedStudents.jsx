// frontend/src/pages/mentor/AssignedStudents.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

export default function AssignedStudents() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [stuRes, projRes] = await Promise.all([
        API.get('/mentor/students'),
        API.get('/projects'),
      ])
      setStudents(stuRes.data.students || [])
      setProjects(projRes.data.projects || [])
    } catch (err) {
      toast.error('Failed to load data!')
    } finally {
      setLoading(false)
    }
  }

  const handleFeedback = async (e) => {
    e.preventDefault()
    if (!feedback || !selectedProject) return toast.error('Please select a project and enter feedback!')
    setSubmitting(true)
    try {
      await API.post('/mentor/feedback', { projectId: selectedProject, feedback })
      toast.success('Feedback sent successfully! 🎉')
      setShowFeedback(false)
      setFeedback('')
      setSelectedProject('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred!')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/mentor/dashboard')}
            className="mb-2 inline-flex items-center text-sm text-slate-400 transition-colors hover:text-slate-200"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">
            Assigned Students
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {students.length} student{students.length !== 1 ? 's' : ''} assigned
          </p>
        </div>

        {showFeedback && selectedStudent && (
          <div className="mb-6 rounded-2xl border border-indigo-500/30 bg-slate-900/95 p-5 shadow-lg sm:p-7">
            <h2 className="text-lg font-bold text-slate-100">Give Feedback</h2>
            <p className="mt-1 text-sm text-slate-500">To: {selectedStudent.name}</p>

            <form onSubmit={handleFeedback} className="mt-5 flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Select Project *
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-500"
                >
                  <option value="">Select a project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Feedback *
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Write your feedback here..."
                  rows={4}
                  className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 px-4 py-3 text-sm font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Sending...' : 'Send Feedback →'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFeedback(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {students.length === 0 ? (
          <div className="rounded-3xl border border-white/5 bg-slate-900/90 py-20 text-center">
            <div className="mb-4 text-6xl opacity-30">👨‍🎓</div>
            <p className="text-base text-slate-400">No students have been assigned yet.</p>
            <p className="mt-2 text-sm text-slate-600">Your teacher will assign students to you.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {students.map((s) => (
              <div
                key={s._id}
                className="rounded-2xl border border-white/5 bg-slate-900/90 p-6 transition-transform duration-200 hover:-translate-y-0.5 hover:border-indigo-500/30"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-lg font-extrabold text-white">
                    {s.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-base font-bold text-slate-100">{s.name}</div>
                    <div className="truncate text-sm text-slate-500">{s.email}</div>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {s.branch && (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                      🏫 {s.branch}
                    </span>
                  )}
                  {s.semester && (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                      📚 Sem {s.semester}
                    </span>
                  )}
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    onClick={() => {
                      setSelectedStudent(s)
                      setShowFeedback(true)
                    }}
                    className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/15"
                  >
                    💬 Feedback
                  </button>
                  <button
                    onClick={() => navigate('/mentor/meetings')}
                    className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/15"
                  >
                    📅 Meeting
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}