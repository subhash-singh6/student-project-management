// frontend/src/pages/student/KanbanBoard.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { taskService } from '../../services/taskService'
import { useProjects } from '../../hooks/useProjects'
import DashboardLayout from '../../layouts/DashboardLayout'
import PageLoader from '../../components/PageLoader'
import toast from 'react-hot-toast'

const COLUMNS = [
  { id: 'todo', title: '📋 To Do', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
  { id: 'inprogress', title: '🔄 In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { id: 'review', title: '👀 In Review', color: '#22d3ee', bg: 'rgba(34,211,238,0.08)' },
  { id: 'done', title: '✅ Done', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
]

const PRIORITIES = [
  { value: 'low', color: '#10b981', label: 'Low' },
  { value: 'medium', color: '#f59e0b', label: 'Medium' },
  { value: 'high', color: '#ef4444', label: 'High' },
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
    if (!newTask.title.trim()) return toast.error('Task title zaroori hai!')
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
      toast.success('Task saved to database! ✅')
      loadTasks(selectedProject)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Task add failed')
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await taskService.remove(taskId)
      loadTasks(selectedProject)
    } catch {
      toast.error('Delete failed')
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
      toast.success(`Moved to ${COLUMNS.find((c) => c.id === toCol)?.title}`)
    } catch {
      toast.error('Move failed')
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
      title="Kanban Board"
      subtitle="Tasks persist in MongoDB"
      portalLabel="Student Portal"
    >
      <div style={{ fontFamily: "'DM Sans', sans-serif", overflowX: 'auto' }}>
        <style>{`
          @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
          .task-card{cursor:grab !important;}
          .task-card:active{cursor:grabbing !important;opacity:0.7;}
          .task-card:hover{border-color:rgba(99,102,241,0.3) !important;transform:translateY(-2px);}
        `}</style>

        <div style={{ minWidth: 900, padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{
                background: 'rgba(15,23,42,0.9)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                padding: '8px 14px',
                color: '#94a3b8',
                fontSize: 13,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
            {loadingTasks && <span style={{ color: '#64748b', fontSize: 12 }}>Syncing tasks...</span>}
          </div>

          {totalTasks > 0 && (
            <div
              style={{
                background: 'rgba(15,23,42,0.9)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14,
                padding: '14px 20px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#94a3b8', fontSize: 13 }}>Overall Progress</span>
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: 13 }}>{progress}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 99, height: 8 }}>
                  <div
                    style={{
                      background: 'linear-gradient(135deg,#6366f1,#10b981)',
                      borderRadius: 99,
                      height: '100%',
                      width: `${progress}%`,
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
                <span style={{ color: '#64748b', fontSize: 12 }}>
                  Total: <strong style={{ color: '#94a3b8' }}>{totalTasks}</strong>
                </span>
                <span style={{ color: '#64748b', fontSize: 12 }}>
                  Done: <strong style={{ color: '#10b981' }}>{doneTasks}</strong>
                </span>
              </div>
            </div>
          )}

          {projects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#334155' }}>
              <div style={{ fontSize: 48, opacity: 0.2, marginBottom: 12 }}>📋</div>
              <p>Pehle project banao!</p>
              <button
                type="button"
                onClick={() => navigate('/student/projects')}
                style={{
                  marginTop: 16,
                  background: 'linear-gradient(135deg,#6366f1,#818cf8)',
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px 24px',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Create Project →
              </button>
            </div>
          )}

          {projects.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {COLUMNS.map((col) => (
                <div
                  key={col.id}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop(col.id)}
                  style={{
                    background: 'rgba(15,23,42,0.9)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 18,
                    padding: '16px 14px',
                    minHeight: 400,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div>
                      <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14 }}>{col.title}</div>
                      <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>{tasks[col.id].length} tasks</div>
                    </div>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        background: col.bg,
                        border: `1px solid ${col.color}30`,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: col.color,
                        fontWeight: 800,
                        fontSize: 12,
                      }}
                    >
                      {tasks[col.id].length}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                    {tasks[col.id].map((task) => {
                      const pr = PRIORITIES.find((p) => p.value === task.priority) || PRIORITIES[1]
                      return (
                        <div
                          key={task._id || task.id}
                          className="task-card"
                          draggable
                          onDragStart={() => onDragStart(task, col.id)}
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 12,
                            padding: '12px 14px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <p style={{ color: '#e2e8f0', fontSize: 13, margin: 0, flex: 1 }}>{task.title}</p>
                            <button
                              type="button"
                              onClick={() => deleteTask(task._id || task.id)}
                              style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: 14 }}
                            >
                              ×
                            </button>
                          </div>
                          <span
                            style={{
                              background: `${pr.color}20`,
                              color: pr.color,
                              padding: '2px 8px',
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            {pr.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {showAdd === col.id ? (
                    <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: 12 }}>
                      <input
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && addTask(col.id)}
                        placeholder="Task title..."
                        autoFocus
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 8,
                          padding: '8px 10px',
                          color: '#f1f5f9',
                          fontSize: 13,
                          width: '100%',
                          outline: 'none',
                          marginBottom: 8,
                        }}
                      />
                      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                        {PRIORITIES.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => setNewTask({ ...newTask, priority: p.value })}
                            style={{
                              flex: 1,
                              background: newTask.priority === p.value ? `${p.color}20` : 'transparent',
                              border: `1px solid ${newTask.priority === p.value ? p.color : 'rgba(255,255,255,0.08)'}`,
                              borderRadius: 8,
                              padding: 4,
                              color: newTask.priority === p.value ? p.color : '#475569',
                              cursor: 'pointer',
                              fontSize: 11,
                            }}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button type="button" onClick={() => addTask(col.id)} style={{ flex: 1, padding: 7, borderRadius: 8, border: `1px solid ${col.color}40`, background: col.bg, color: col.color, cursor: 'pointer' }}>
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAdd(null)
                            setNewTask({ title: '', priority: 'medium', assignee: '' })
                          }}
                          style={{ flex: 1, padding: 7, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: '#475569', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAdd(col.id)}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: '1px dashed rgba(255,255,255,0.08)',
                        borderRadius: 10,
                        padding: 8,
                        color: '#334155',
                        cursor: 'pointer',
                        fontSize: 13,
                      }}
                    >
                      + Add Task
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
