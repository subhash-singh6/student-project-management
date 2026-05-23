export const ROLE_HOME = {
  student: '/student/dashboard',
  mentor: '/mentor/dashboard',
  teacher: '/teacher/dashboard',
}

export const STUDENT_NAV = [
  { path: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/student/projects', label: 'Projects', icon: '📁' },
  { path: '/student/team', label: 'My Team', icon: '👥' },
  { path: '/student/chat', label: 'Team Chat', icon: '💬' },
  { path: '/student/kanban', label: 'Kanban', icon: '📋' },
  { path: '/student/assign-teacher', label: 'Assign Teacher', icon: '🎓' },
  { path: '/analytics', label: 'Analytics', icon: '📊' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { path: '/profile', label: 'Profile', icon: '👤' },
]

export const MENTOR_NAV = [
  { path: '/mentor/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/mentor/students', label: 'Students', icon: '👨‍🎓' },
  { path: '/mentor/meetings', label: 'Meetings', icon: '📅' },
  { path: '/analytics', label: 'Analytics', icon: '📊' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { path: '/profile', label: 'Profile', icon: '👤' },
]

export const TEACHER_NAV = [
  { path: '/teacher/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/teacher/projects', label: 'Projects', icon: '📁' },
  { path: '/teacher/grades', label: 'Grades', icon: '⭐' },
  { path: '/teacher/subjects', label: 'Subjects', icon: '📚' },
  { path: '/teacher/admin', label: 'Admin Panel', icon: '⚙️' },
  { path: '/analytics', label: 'Analytics', icon: '📊' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { path: '/profile', label: 'Profile', icon: '👤' },
]

export const getNavForRole = (role) => {
  if (role === 'student') return STUDENT_NAV
  if (role === 'mentor') return MENTOR_NAV
  if (role === 'teacher') return TEACHER_NAV
  return []
}


