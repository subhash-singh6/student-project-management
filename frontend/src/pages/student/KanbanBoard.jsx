// frontend/src/pages/student/KanbanBoard.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { taskService } from '../../services/taskService'
import { useProjects } from '../../hooks/useProjects'
import DashboardLayout from '../../layouts/DashboardLayout'
import PageLoader from '../../components/PageLoader'
import toast from 'react-hot-toast'

const COLUMNS = [
  { id: 'todo', title: '📋 To Do', border: 'group-hover:border-indigo-500/20', text: 'text-indigo-400', badge: 'bg-indigo-500/10 border-indigo-500/20' },
  { id: 'inprogress', title: '🔄 In Progress', border: 'group-hover:border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/20' },
  { id: 'review', title: '👀 In Review', border: 'group-hover:border-cyan-500/20', text: 'text-cyan-400', badge: 'bg-cyan-500/10 border-cyan-500/20' },
  { id: 'done', title: '✅ Done', border: 'group-hover:border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20' },
]

const PRIORITIES = [
  { value: 'low', theme: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'Low' },
  { value: 'medium', theme: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: 'Medium' },
  { value: 'high', theme: 'text-red-400 bg-red-500/10 border-red-500/20', label: 'High' },
]

export default function KanbanBoard() {
  const navigate = useNavigate()
  const { projects, loading: projectsLoading } = useProjects()
  const [selectedProject, setSelectedProject] = useState('')
  const [tasks, setTasks] = useState({ todo: [], inprogress: [], review: [], done: [] })
  const [dragTask, setDragTask] = useState(null)
  const [dragFrom, setDragFrom] = useState(null)
  const [showAdd, setShowAdd] = useState(null)
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', assignee: '' })
  const [loadingTasks, setLoadingTasks] = useState(false)

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]._id)
    }
  }, [projects, selectedProject])

  useEffect(() => {
    if (selectedProject) loadTasks(selectedProject)
  }, [selectedProject])

  const loadTasks = async (projectId) => {
    setLoadingTasks(true)
    try {
      const res = await taskService.getByProject(projectId)
      setTasks(res.data.tasks || { todo: [], inprogress: [], review: [], done: [] })
    } catch {
      setTasks({ todo: [], inprogress: [], review: [], done: [] })
    } finally {
      setLoadingTasks(false)
    }
  }

  const addTask = async (colId) => {
    if (!newTask.title.trim()) return toast.error('Task title token required!')
    try {
      await taskService.create({
        projectId: selectedProject,
        title: newTask.title.trim(),
        priority: newTask.priority,
        assignee: newTask.assignee,
        column: colId,
      })
      setShowAdd(null)
      setNewTask({ title: '', priority: 'medium', assignee: '' })
      toast.success('Task commit saved to node database! ✅')
      loadTasks(selectedProject)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Task compilation failed')
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await taskService.remove(taskId)
      loadTasks(selectedProject)
    } catch {
      toast.error('Task execution drop failed')
    }
  }

  const onDragStart = (task, fromCol) => {
    setDragTask(task)
    setDragFrom(fromCol)
  }

  const onDragOver = (e) => e.preventDefault()

  const onDrop = async (toCol) => {
    if (!dragTask || dragFrom === toCol) return
    const taskId = dragTask._id || dragTask.id
    try {
      await taskService.move(taskId, { column: toCol })
      await loadTasks(selectedProject)
      toast.success(`Task shifted to terminal matrix block.`)
    } catch {
      toast.error('Task reassignment shift failed')
    }
    setDragTask(null)
    setDragFrom(null)
  }

  const totalTasks = Object.values(tasks).flat().length
  const doneTasks = tasks.done.length
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  if (projectsLoading) return <PageLoader />

  return (
    <DashboardLayout
      title="Sprint Operations Board"
      subtitle="Distributed workflow state synchronization"
      portalLabel="Student Portal"
    >
      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/5 font-sans">
        <div className="min-w-[1000px] py-2">
          
          {/* Top Board Action Metrics Bar */}
          <div className="flex items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-3">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="bg-[#0b1324]/90 border border-white/5 focus:border-indigo-500/30 text-slate-300 font-medium text-sm rounded-xl px-4 py-2.5 cursor-pointer outline-none transition-all"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id} style={{ background: '#070b14' }}>
                    {p.title}
                  </option>
                ))}
              </select>
              {loadingTasks && (
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                  Syncing operational logs...
                </span>
              )}
            </div>
          </div>

          {/* Core Sprint Velocity Progress Tracker */}
          {totalTasks > 0 && (
            <div className="bg-[#0b1324]/60 backdrop-blur-md border border-white/[0.04] rounded-2xl p-4 mb-6 flex items-center gap-6 shadow-xl shadow-black/10">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2 text-xs font-semibold">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-extrabold">Overall Task Velocity</span>
                  <span className="text-emerald-400 font-mono text-sm font-bold">{progress}%</span>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-full h-2 overflow-hidden p-[1px]">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out shadow-md shadow-indigo-500/20"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-4 flex-shrink-0 text-xs font-bold uppercase tracking-wider border-l border-white/5 pl-6">
                <span className="text-slate-500">
                  Total Payload: <strong className="text-slate-300 font-mono font-bold ml-1">{totalTasks}</strong>
                </span>
                <span className="text-slate-500">
                  Committed: <strong className="text-emerald-400 font-mono font-bold ml-1">{doneTasks}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Fallback Empty Context State */}
          {projects.length === 0 && (
            <div className="text-center py-24 bg-[#0b1324]/40 border border-white/[0.04] rounded-3xl shadow-xl shadow-black/20">
              <div className="text-5xl opacity-15 mb-4 animate-pulse">📋</div>
              <h3 className="text-base font-bold text-slate-400">No Target Framework Configured</h3>
              <p className="text-slate-600 text-xs font-semibold mt-1">Please build or register a structural project cluster pipeline first.</p>
              <button
                type="button"
                onClick={() => navigate('/student/projects')}
                className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 font-bold text-xs uppercase tracking-wider text-white px-6 py-3 rounded-xl hover:opacity-95 transition-all shadow-md shadow-indigo-500/20 active:scale-95"
              >
                Launch Project Engine →
              </button>
            </div>
          )}

          {/* Grid Layout Kanban Pipeline Matrix */}
          {projects.length > 0 && (
            <div className="grid grid-cols-4 gap-4 items-start">
              {COLUMNS.map((col) => (
                <div
                  key={col.id}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop(col.id)}
                  className={`bg-[#0b1324]/40 border border-white/[0.04] rounded-2xl p-4 min-h-[450px] flex flex-col transition-all group duration-300 ${col.border}`}
                >
                  {/* Grid Column Header Information Node */}
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/[0.02]">
                    <div>
                      <div className="text-white font-bold text-sm tracking-tight">{col.title}</div>
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">{tasks[col.id].length} Nodes Allocated</div>
                    </div>
                    <div className={`w-6 h-6 border rounded-lg flex items-center justify-center font-mono text-xs font-bold ${col.text} ${col.badge}`}>
                      {tasks[col.id].length}
                    </div>
                  </div>

                  {/* Operational Kanban Segment Cards Stack */}
                  <div className="flex flex-col gap-2.5 mb-4 flex-1 overflow-y-auto max-h-[500px] scrollbar-none">
                    {tasks[col.id].map((task) => {
                      const pr = PRIORITIES.find((p) => p.value === task.priority) || PRIORITIES[1]
                      return (
                        <div
                          key={task._id || task.id}
                          draggable
                          onDragStart={() => onDragStart(task, col.id)}
                          className="task-card bg-[#0e172a]/80 hover:bg-[#111c34]/90 border border-white/[0.05] hover:border-indigo-500/20 rounded-xl p-3.5 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:cursor-grabbing group/card"
                        >
                          <div className="flex justify-between items-start gap-2 mb-2.5">
                            <p className="text-slate-300 font-medium text-sm leading-snug break-words flex-1">{task.title}</p>
                            <button
                              type="button"
                              onClick={() => deleteTask(task._id || task.id)}
                              className="text-slate-600 hover:text-red-400 font-bold text-base leading-none transition-colors px-1"
                              title="Drop Task Vector"
                            >
                              ×
                            </button>
                          </div>
                          <span className={`px-2 py-0.5 border rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${pr.theme}`}>
                            {pr.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Nested Inline Task Builder Form Block */}
                  {showAdd === col.id ? (
                    <div className="bg-[#070b14]/90 border border-indigo-500/20 rounded-xl p-3 animate-fadeUp shadow-inner">
                      <input
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && addTask(col.id)}
                        placeholder="Configure task segment token..."
                        autoFocus
                        className="w-full bg-white/[0.02] border border-white/5 focus:border-indigo-500/20 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none transition-all mb-2.5 font-medium"
                      />
                      <div className="flex gap-1.5 mb-2.5">
                        {PRIORITIES.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => setNewTask({ ...newTask, priority: p.value })}
                            className={`flex-1 py-1 border rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${
                              newTask.priority === p.value
                                ? p.theme
                                : 'bg-transparent border-white/5 text-slate-500 hover:text-slate-400'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          type="button" 
                          onClick={() => addTask(col.id)} 
                          className="flex-1 py-1.5 rounded-lg border border-indigo-500/20 hover:border-indigo-500/30 text-indigo-400 text-xs font-bold transition-all bg-indigo-500/5 hover:bg-indigo-500/10"
                        >
                          Save Log
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAdd(null)
                            setNewTask({ title: '', priority: 'medium', assignee: '' })
                          }}
                          className="flex-1 py-1.5 rounded-lg border border-white/5 text-slate-500 hover:text-slate-400 text-xs font-bold transition-all bg-transparent hover:bg-white/5"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAdd(col.id)}
                      className="w-full bg-white/[0.01] hover:bg-white/[0.03] border border-dashed border-white/5 hover:border-white/10 text-slate-600 hover:text-slate-400 text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all duration-200 mt-auto"
                    >
                      + Allocate Node Vector
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}