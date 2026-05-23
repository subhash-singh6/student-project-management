// frontend/src/pages/student/AssignTeacher.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

export default function AssignTeacher() {
  const navigate = useNavigate()

  const [subjects, setSubjects]   = useState([])
  const [projects, setProjects]   = useState([])
  const [mentors, setMentors]     = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('assign')

  const [filters, setFilters] = useState({ department: '', semester: '' })
  const [form, setForm] = useState({
    projectId: '', subjectId: '', mentorId: '', message: '',
  })

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    fetchSubjects()
  }, [filters])

  const fetchData = async () => {
    try {
      const [projRes, mentorRes, reqRes] = await Promise.all([
        API.get('/projects'),
        API.get('/mentor/all'),
        API.get('/subjects/my-requests'),
      ])
      setProjects(projRes.data.projects?.filter(p => !p.teacher) || [])
      setMentors(mentorRes.data.mentors || [])
      setMyRequests(reqRes.data.requests || [])
    } catch {
      toast.error('Data pipeline synchronization failed!')
    } finally {
      setLoading(false)
    }
  }

  const fetchSubjects = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.department) params.append('department', filters.department)
      if (filters.semester)   params.append('semester', filters.semester)
      const res = await API.get(`/subjects?${params.toString()}`)
      setSubjects(res.data.subjects || [])
    } catch {}
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.projectId || !form.subjectId)
      return toast.error('Project parameter token missing!')
    setSubmitting(true)
    try {
      await API.post('/subjects/request', form)
      toast.success('Routing vector request emitted successfully! 🎉')
      setForm({ projectId: '', subjectId: '', mentorId: '', message: '' })
      fetchData()
      setActiveTab('requests')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction error on network node')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedSubject = subjects.find(s => s._id === form.subjectId)

  const STATUS_MAP = {
    pending:  { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: '⏳ Pending' },
    approved: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: '✅ Approved' },
    rejected: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: '❌ Rejected' },
  }

  if (loading) return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-sans selection:bg-indigo-500/30">
      <div className="max-w-[900px] mx-auto px-6 py-8">

        {/* Dynamic Nav Header Block */}
        <div className="mb-8 animate-fadeUp">
          <button 
            onClick={() => navigate('/student/dashboard')} 
            className="bg-transparent border-none text-slate-500 hover:text-slate-400 cursor-pointer text-xs font-bold uppercase tracking-wider mb-2 block p-0 transition-colors"
          >
            ← System Gateway
          </button>
          <h1 className="font-syne text-3xl font-extrabold text-white tracking-tight">🎓 Teacher Authorization Matrix</h1>
          <p className="text-slate-500 text-xs font-medium mt-1">Bind a designated academic operator and specific terminal subject code to your project architecture</p>
        </div>

        {/* Global Pipeline Tabs Wrapper */}
        <div className="flex gap-1.5 mb-8 bg-[#0b1324]/90 border border-white/[0.06] rounded-2xl p-1.5 shadow-xl shadow-black/10">
          {[
            { key: 'assign',   label: '📋 Initialize Vector Request' },
            { key: 'requests', label: `📊 Pipeline Logs (${myRequests.length})` },
          ].map(tab => (
            <button 
              key={tab.key} 
              onClick={() => setActiveTab(tab.key)} 
              className={`flex-1 font-syne font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all duration-200 cursor-pointer border ${
                activeTab === tab.key 
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-500/5' 
                  : 'bg-transparent border-transparent text-slate-500 hover:text-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── INTERACTIVE ASSIGNMENT MATRIX BLOCK ── */}
        {activeTab === 'assign' && (
          <div className="animate-fadeUp space-y-5">

            {projects.length === 0 ? (
              <div className="text-center py-20 bg-[#0b1324]/60 backdrop-blur-md border border-white/[0.05] rounded-3xl shadow-xl shadow-black/20">
                <div className="text-5xl opacity-20 mb-4 animate-pulse">📁</div>
                <h3 className="text-base font-bold text-slate-400">No Target Framework Configured</h3>
                <p className="text-slate-600 text-xs font-semibold mt-1">Please build or register a structural project cluster pipeline first.</p>
                <button 
                  onClick={() => navigate('/student/projects')} 
                  className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:opacity-95 transition-all shadow-md shadow-indigo-500/20 active:scale-95"
                >
                  Create Project →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Step 1 — Project Target Cluster Allocation */}
                <div className="bg-[#0b1324]/60 backdrop-blur-md border border-white/[0.05] rounded-2xl p-5 shadow-xl shadow-black/10">
                  <div className="text-indigo-400 text-[10px] font-extrabold tracking-widest uppercase mb-4">Step 01 // Target Framework Assignment</div>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/5">
                    {projects.map(p => (
                      <div 
                        key={p._id} 
                        onClick={() => setForm({ ...form, projectId: p._id })} 
                        className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 group ${
                          form.projectId === p._id 
                            ? 'bg-indigo-500/10 border-indigo-500/40 shadow-md shadow-indigo-500/5' 
                            : 'bg-white/[0.02] border-white/[0.06] hover:border-indigo-500/20 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className={`font-bold text-sm transition-colors ${form.projectId === p._id ? 'text-indigo-400' : 'text-slate-200'}`}>{p.title}</div>
                        <div className="text-slate-500 text-xs font-medium mt-1.5 flex items-center gap-2">
                          <span className="bg-white/5 px-2 py-0.5 border border-white/5 rounded-md text-[10px]">{p.category}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">{p.techStack?.slice(0, 3).join(', ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 2 — Subject Blueprint Selector & Query Filter */}
                <div className="bg-[#0b1324]/60 backdrop-blur-md border border-white/[0.05] rounded-2xl p-5 shadow-xl shadow-black/10">
                  <div className="text-amber-400 text-[10px] font-extrabold tracking-widest uppercase mb-4">Step 02 // Subject Domain & Academic Node Filter</div>

                  {/* Operational Dropdown Filters */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">Division Department</label>
                      <select 
                        value={filters.department} 
                        onChange={e => setFilters({ ...filters, department: e.target.value })} 
                        className="w-full bg-[#070b14]/90 border border-white/10 text-slate-300 font-medium text-xs rounded-xl px-4 py-3 cursor-pointer outline-none focus:border-indigo-500/30 transition-all"
                      >
                        <option value="" style={{ background: '#070b14' }}>All Departments</option>
                        {['CSE', 'ECE', 'ME', 'CE', 'IT'].map(d => <option key={d} value={d} style={{ background: '#070b14' }}>{d} Framework</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">Target Semester Sequence</label>
                      <select 
                        value={filters.semester} 
                        onChange={e => setFilters({ ...filters, semester: e.target.value })} 
                        className="w-full bg-[#070b14]/90 border border-white/10 text-slate-300 font-medium text-xs rounded-xl px-4 py-3 cursor-pointer outline-none focus:border-indigo-500/30 transition-all"
                      >
                        <option value="" style={{ background: '#070b14' }}>All Semesters</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s} style={{ background: '#070b14' }}>Term Stage 0{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {subjects.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs font-semibold">
                      No operational subject blocks matched current filter state variables.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/5">
                      {subjects.map(s => (
                        <div 
                          key={s._id} 
                          onClick={() => setForm({ ...form, subjectId: s._id })} 
                          className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 group ${
                            form.subjectId === s._id 
                              ? 'bg-amber-500/5 border-amber-500/40 shadow-md shadow-amber-500/5' 
                              : 'bg-white/[0.02] border-white/[0.06] hover:border-amber-500/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className={`font-bold text-sm transition-colors ${form.subjectId === s._id ? 'text-amber-400' : 'text-slate-200'}`}>{s.name}</div>
                              <div className="text-amber-500/80 font-mono text-xs font-bold tracking-wider mt-1">{s.code}</div>
                              <div className="text-slate-500 text-xs font-medium mt-2 flex items-center flex-wrap gap-x-2 gap-y-1">
                                <span className="text-slate-400 font-semibold">👨‍🏫 {s.teacher?.name}</span>
                                <span>•</span>
                                <span>Dept: {s.department}</span>
                                <span>•</span>
                                <span>Sem {s.semester}</span>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1.5 flex-shrink-0">
                              <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono">
                                {s.credits} CR
                              </span>
                              <div className="text-slate-600 text-[10px] font-bold uppercase tracking-wider">{s.enrolledStudents?.length || 0} Synced</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Dynamic Preview Blueprint */}
                {selectedSubject && (
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 shadow-inner">
                    <div className="text-amber-500 text-base leading-none pt-0.5">⚡</div>
                    <div>
                      <div className="text-xs font-bold text-amber-500 uppercase tracking-wider">Dynamic State Binding Target:</div>
                      <div className="text-slate-200 font-bold text-sm mt-1">{selectedSubject.name} — <span className="font-mono">{selectedSubject.code}</span></div>
                      <div className="text-slate-500 text-xs font-medium mt-1">Host Node Authority: {selectedSubject.teacher?.name} | Channel Stack {selectedSubject.department}</div>
                    </div>
                  </div>
                )}

                {/* Step 3 — Optional Mentor Framework Alignment */}
                <div className="bg-[#0b1324]/60 backdrop-blur-md border border-white/[0.05] rounded-2xl p-5 shadow-xl shadow-black/10">
                  <div className="text-cyan-400 text-[10px] font-extrabold tracking-widest uppercase mb-3">Step 03 // External Advisory Mentor Framework (Optional)</div>
                  <select 
                    value={form.mentorId} 
                    onChange={e => setForm({ ...form, mentorId: e.target.value })} 
                    className="w-full bg-[#070b14]/90 border border-white/10 text-slate-300 font-medium text-xs rounded-xl px-4 py-3 cursor-pointer outline-none focus:border-indigo-500/30 transition-all"
                  >
                    <option value="" style={{ background: '#070b14' }}>Bypass Mentor Framework Allocation</option>
                    {mentors.map(m => (
                      <option key={m._id} value={m._id} style={{ background: '#070b14' }}>
                        {m.name} — {m.organization} ({m.expertise?.slice(0, 2).join(', ')})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 4 — Request Message Data Stream Block */}
                <div className="bg-[#0b1324]/60 backdrop-blur-md border border-white/[0.05] rounded-2xl p-5 shadow-xl shadow-black/10">
                  <div className="text-emerald-400 text-[10px] font-extrabold tracking-widest uppercase mb-3">Step 04 // Request Payload Description Data (Optional)</div>
                  <textarea 
                    value={form.message} 
                    onChange={e => setForm({ ...form, message: e.target.value })} 
                    placeholder="Provide additional scope metrics, structural requirements, or dynamic repository specifications to the target host operator..." 
                    className="w-full bg-[#070b14]/90 border border-white/10 text-slate-300 placeholder-slate-600 font-medium text-xs rounded-xl px-4 py-3 outline-none focus:border-indigo-500/30 transition-all resize-y font-sans" 
                    rows={3} 
                  />
                </div>

                {/* Global Commit Execute Command Button */}
                <button 
                  type="submit" 
                  disabled={submitting || !form.projectId || !form.subjectId} 
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 disabled:from-slate-800 disabled:to-slate-800 text-white disabled:text-slate-600 font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:opacity-95 disabled:opacity-50 transition-all shadow-lg disabled:shadow-none shadow-indigo-500/10 active:scale-[0.99]"
                >
                  {submitting ? 'Broadcasting Vector Parameters...' : 'Broadcast Authorization Request Stream →'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── SYSTEM REQUESTS DEPLOYED QUEUE PIPELINE TAB ── */}
        {activeTab === 'requests' && (
          <div className="animate-fadeUp">
            {myRequests.length === 0 ? (
              <div className="text-center py-20 bg-[#0b1324]/60 backdrop-blur-md border border-white/[0.05] rounded-3xl shadow-xl shadow-black/20">
                <div className="text-5xl opacity-20 mb-4 animate-pulse">📋</div>
                <h3 className="text-base font-bold text-slate-400">Request Queue Empty</h3>
                <p className="text-slate-600 text-xs font-semibold mt-1">No transaction payloads have been structured or dispatched yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.map((r, i) => {
                  const st = STATUS_MAP[r.status] || STATUS_MAP.pending
                  return (
                    <div 
                      key={r._id} 
                      className={`bg-[#0b1324]/60 backdrop-blur-md border rounded-2xl p-5 shadow-xl shadow-black/10 transition-all duration-300 ${
                        r.status === 'approved' 
                          ? 'border-emerald-500/20 shadow-emerald-500/[0.02]' 
                          : r.status === 'rejected' 
                          ? 'border-red-500/10' 
                          : 'border-white/[0.05]'
                      }`}
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      {/* Queue Header Metadata Block */}
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <h3 className="font-syne text-slate-200 font-bold text-base tracking-tight leading-snug">{r.project?.title}</h3>
                        <span className={`px-3 py-1 border rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-block shrink-0 ${st.bg} ${st.color}`}>
                          {st.label}
                        </span>
                      </div>

                      {/* Distributed Node Parameters Information Matrix Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-3.5">
                        <div className="bg-amber-500/[0.02] border border-amber-500/10 rounded-xl p-3">
                          <div className="text-slate-500 text-[9px] font-extrabold tracking-wider uppercase mb-1">Bounded Subject System</div>
                          <div className="text-amber-500 font-mono text-xs font-bold">{r.subject?.code}</div>
                          <div className="text-slate-400 text-xs font-medium truncate mt-0.5">{r.subject?.name}</div>
                        </div>
                        <div className="bg-indigo-500/[0.02] border border-indigo-500/10 rounded-xl p-3">
                          <div className="text-slate-500 text-[9px] font-extrabold tracking-wider uppercase mb-1">Target Host Operator</div>
                          <div className="text-indigo-400 font-bold text-xs">{r.teacher?.name}</div>
                          <div className="text-slate-400 text-xs font-medium truncate mt-0.5">Faculty // {r.teacher?.department}</div>
                        </div>
                      </div>

                      {/* Deployed Faculty Execution Remarks Data Stream */}
                      {r.teacherRemarks && (
                        <div className={`border rounded-xl p-3 text-xs font-medium leading-relaxed mb-3.5 ${
                          r.status === 'approved' ? 'bg-emerald-500/[0.02] border-emerald-500/15' : 'bg-red-500/[0.02] border-red-500/15'
                        }`}>
                          <span className={r.status === 'approved' ? 'text-emerald-400' : 'text-red-400'}>
                            💬 Operator Logs: "{r.teacherRemarks}"
                          </span>
                        </div>
                      )}

                      {/* Dispatch Synchronization Time Execution Node */}
                      <div className="text-slate-600 font-mono text-[10px] font-bold uppercase tracking-wider">
                        Timestamp: {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}