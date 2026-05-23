// frontend/src/pages/student/ProjectDetails.jsx

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

// Sub-components ko import karenge (Jo aapke folder mein pehle se hain)
import KanbanBoard from './KanbanBoard'
import MyTeam from './MyTeam'
import TeamChat from './TeamChat'

export default function ProjectDetails() {
  const { id } = useParams() // URL se project ID nikalne ke liye
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSubTab, setActiveSubTab] = useState('overview')

  useEffect(() => {
    fetchProjectDetails()
  }, [id])

  const fetchProjectDetails = async () => {
    try {
      const res = await API.get(`/projects/${id}`)
      setProject(res.data.project)
    } catch (err) {
      toast.error('Project details load nahi hui!')
      navigate('/student/dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  )

  if (!project) return <div className="text-white text-center py-20">Project nahi mila!</div>

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Header Navigation */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/student/dashboard')} 
            className="text-slate-500 hover:text-indigo-400 text-xs font-bold uppercase tracking-wider bg-transparent border-none cursor-pointer transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Project Meta Card */}
        <div className="bg-[#0b1324]/60 backdrop-blur-md border border-white/[0.05] rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                {project.category || 'General Project'}
              </span>
              <h1 className="font-syne text-2xl font-extrabold text-white mt-3 tracking-tight">{project.title}</h1>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl">{project.description || 'No description provided yet.'}</p>
            </div>
            
            {/* Faculty Bind Status */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 min-w-[220px]">
              <div className="text-slate-500 text-[9px] font-extrabold tracking-wider uppercase mb-1">Assigned Guide</div>
              {project.teacher ? (
                <div>
                  <div className="text-emerald-400 font-bold text-sm">✅ {project.teacher.name}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{project.subject?.name} ({project.subject?.code})</div>
                </div>
              ) : (
                <div>
                  <div className="text-amber-400 font-bold text-xs flex items-center gap-1">⏳ No Teacher Assigned</div>
                  <button 
                    onClick={() => navigate('/student/assign-teacher')} 
                    className="mt-2 text-[11px] font-bold text-indigo-400 hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Assign Teacher Now →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tech Stack Badge Cluster */}
          <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-white/[0.04]">
            {project.techStack?.map((tech, index) => (
              <span key={index} className="bg-[#070b14] border border-white/5 font-mono text-slate-400 px-2.5 py-1 rounded-md text-xs">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Sub-Navigation Interface Hub */}
        <div className="flex border-b border-white/[0.06] mb-6 gap-6">
          {[
            { id: 'overview', label: 'Overview & Specs' },
            { id: 'kanban', label: 'Kanban Tasks' },
            { id: 'team', label: 'Team Configuration' },
            { id: 'chat', label: 'Team Stream Chat' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`pb-3 font-bold text-xs uppercase tracking-wider bg-transparent border-none cursor-pointer transition-all relative ${
                activeSubTab === tab.id ? 'text-indigo-400 font-extrabold' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              {tab.label}
              {activeSubTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-full animate-fadeIn" />
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Inner Panel View Router */}
        <div className="mt-4">
          {activeSubTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeUp">
              {/* Left Column: Repo Links */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-[#0b1324]/60 border border-white/[0.05] rounded-2xl p-5">
                  <h3 className="font-syne text-white text-sm font-bold uppercase tracking-wider mb-4">Project Assets & Handshakes</h3>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">Repository Endpoint (GitHub)</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={project.gitRepo || 'No repository linked.'} 
                    className="w-full bg-[#070b14]/90 border border-white/10 text-slate-400 font-mono text-xs rounded-xl px-4 py-3 outline-none"
                  />
                </div>
              </div>

              {/* Right Column: Metadata logs */}
              <div className="bg-[#0b1324]/60 border border-white/[0.05] rounded-2xl p-5 h-fit">
                <h3 className="font-syne text-white text-sm font-bold uppercase tracking-wider mb-3">System Logs</h3>
                <div className="text-slate-500 text-xs space-y-2">
                  <div>Created: <span className="text-slate-400 font-mono">{new Date(project.createdAt).toLocaleDateString()}</span></div>
                  <div>Status: <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">{project.status || 'Active'}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Render target layout sub-modules based on layout tab state */}
          {activeSubTab === 'kanban' && <KanbanBoard projectId={id} />}
          {activeSubTab === 'team' && <MyTeam projectId={id} projectData={project} onUpdate={fetchProjectDetails} />}
          {activeSubTab === 'chat' && <TeamChat projectId={id} />}
        </div>

      </div>
    </div>
  )
}