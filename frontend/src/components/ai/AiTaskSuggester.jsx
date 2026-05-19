// src/pages/student/ProjectDetail.jsx
import AITaskSuggester from '../../components/ai/AITaskSuggester'

export default function ProjectDetail() {
  const { project, tasks, fetchTasks } = useProjectData()

  return (
    <div>
      {/* ... baaki content ... */}

      {/* Kanban ke upar ya Tasks section mein */}
      <AITaskSuggester
        projectId={project._id}
        projectTitle={project.title}
        projectDescription={project.description}
        onTasksAdded={fetchTasks}
      />
    </div>
  )
}