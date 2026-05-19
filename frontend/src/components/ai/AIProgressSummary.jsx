// src/pages/student/Dashboard.jsx  (ya ProjectDetail.jsx)
import AIProgressSummary from '../../components/ai/AIProgressSummary'

export default function Dashboard() {
  const { project, tasks, submissions } = useData()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Left: existing content */}
      <div>...</div>

      {/* Right: AI Summary */}
      <div className="flex flex-col gap-6">
        <AIProgressSummary
          project={project}
          tasks={tasks}
          submissions={submissions}
        />
      </div>

    </div>
  )
}