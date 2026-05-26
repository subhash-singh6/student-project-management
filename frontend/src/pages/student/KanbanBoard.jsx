import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { taskService } from '../../services/taskService'
import { useProjects } from '../../hooks/useProjects'
import DashboardLayout from '../../layouts/DashboardLayout'
import PageLoader from '../../components/PageLoader'
import toast from 'react-hot-toast'
import { FiCheckSquare, FiRefreshCw, FiEye, FiCheckCircle, FiPlus, FiX } from 'react-icons/fi'

const COLUMNS = [
  { id: 'todo', title: 'To Do', icon: <FiCheckSquare />, border: 'group-hover:border-indigo-500/20', text: 'text-indigo-400', badge: 'bg-indigo-500/10 border-indigo-500/20' },
  { id: 'inprogress', title: 'In Progress', icon: <FiRefreshCw />, border: 'group-hover:border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/20' },
  { id: 'review', title: 'In Review', icon: <FiEye />, border: 'group-hover:border-cyan-500/20', text: 'text-cyan-400', badge: 'bg-cyan-500/10 border-cyan-500/20' },
  { id: 'done', title: 'Done', icon: <FiCheckCircle />, border: 'group-hover:border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20' },
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
    if (!newTask.title.trim()) return toast.error('Task title required!')
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
      toast.success('Task added successfully!')
      loadTasks(selectedProject)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Task creation failed')
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await taskService.remove(taskId)
      loadTasks(selectedProject)
    } catch {
      toast.error('Task deletion failed')
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
      toast.success(`Task moved to ${toCol}`)
    } catch {
      toast.error('Task movement failed')
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
      title="Sprint Board"
      subtitle="Track your project workflow"
      portalLabel="Student Portal"
    >
      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/5 font-sans">
        <div className="min-w-[1000px] py-2">
          
          <div className="flex items-center justify-between gap-6 mb-6">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-[#0b1324]/90 border border-white/5 text-slate-300 font-medium text-sm rounded-xl px-4 py-2.5 outline-none transition-all"
            >
              {projects.map((p) => (
                <option key={p._id} value={p._id} style={{ background: '#070b14' }}>{p.title}</option>
              ))}
            </select>
          </div>

          {totalTasks > 0 && (
            <div className="bg-[#0b1324]/60 backdrop-blur-md border border-white/[0.04] rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2 text-xs font-semibold">
                <span className="text-slate-500 uppercase tracking-wider">Project Velocity</span>
                <span className="text-emerald-400 font-bold">{progress}%</span>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4 items-start">
            {COLUMNS.map((col) => (
              <div
                key={col.id}
                onDragOver={onDragOver}
                onDrop={() => onDrop(col.id)}
                className={`bg-[#0b1324]/40 border border-white/[0.04] rounded-2xl p-4 min-h-[450px] flex flex-col group ${col.border}`}
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <span className={col.text}>{col.icon}</span>
                    <span className="text-white font-bold text-sm">{col.title}</span>
                  </div>
                  <div className={`w-6 h-6 border rounded-lg flex items-center justify-center font-mono text-xs font-bold ${col.text} ${col.badge}`}>
                    {tasks[col.id].length}
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 mb-4 flex-1 overflow-y-auto">
                  {tasks[col.id].map((task) => {
                    const pr = PRIORITIES.find((p) => p.value === task.priority) || PRIORITIES[1]
                    return (
                      <div
                        key={task._id || task.id}
                        draggable
                        onDragStart={() => onDragStart(task, col.id)}
                        className="bg-[#0e172a]/80 border border-white/[0.05] rounded-xl p-3.5 hover:border-indigo-500/20 transition-all cursor-grab"
                      >
                        <div className="flex justify-between items-start gap-2 mb-2.5">
                          <p className="text-slate-300 text-sm">{task.title}</p>
                          <button onClick={() => deleteTask(task._id || task.id)} className="text-slate-600 hover:text-red-400">
                            <FiX />
                          </button>
                        </div>
                        <span className={`px-2 py-0.5 border rounded-full text-[9px] font-bold uppercase ${pr.theme}`}>
                          {pr.label}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {showAdd === col.id ? (
                  <div className="bg-[#070b14]/90 border border-indigo-500/20 rounded-xl p-3">
                    <input
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && addTask(col.id)}
                      placeholder="Enter task title..."
                      className="w-full bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none mb-2"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => addTask(col.id)} className="flex-1 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold">Save</button>
                      <button onClick={() => setShowAdd(null)} className="flex-1 py-1.5 rounded-lg border border-white/5 text-slate-500 text-xs font-bold">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAdd(col.id)}
                    className="w-full bg-white/[0.01] hover:bg-white/[0.03] border border-dashed border-white/5 text-slate-500 text-xs font-bold py-2.5 rounded-xl transition-all"
                  >
                    <FiPlus className="inline mr-1" /> Add Task
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}