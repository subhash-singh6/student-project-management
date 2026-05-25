// constants/navigation.js

// Common links for all roles
const COMMON_NAV = [
  { path: '/analytics', label: 'Analytics', icon: '📊' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

export const STUDENT_NAV = [
  { path: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/student/projects', label: 'My Projects', icon: '📁' },
  { path: '/student/team', label: 'My Team', icon: '👥' },
  { path: '/student/chat', label: 'Team Chat', icon: '💬' },
  { path: '/student/kanban', label: 'Kanban', icon: '📋' },
  { path: '/student/assign-teacher', label: 'Assign Reviewer', icon: '🎓' },
  ...COMMON_NAV
];

export const TEACHER_NAV = [
  { path: '/teacher/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/teacher/projects', label: 'Review Projects', icon: '📁' },
  { path: '/teacher/grades', label: 'Grades & Feedback', icon: '⭐' },
  { path: '/teacher/subjects', label: 'Subjects', icon: '📚' },
  { path: '/teacher/admin', label: 'System Admin', icon: '⚙️' },
  ...COMMON_NAV
];

export const ADMIN_NAV = [
  { path: '/admin/dashboard', label: 'Admin Panel', icon: '⚡' },
  { path: '/admin/users', label: 'Manage Users', icon: '👥' },
  { path: '/admin/projects', label: 'All Projects', icon: '📁' },
  { path: '/admin/logs', label: 'System Logs', icon: '📜' },
  ...COMMON_NAV
];

export const getNavForRole = (role) => {
  if (role === 'student') return STUDENT_NAV;
  if (role === 'teacher') return TEACHER_NAV;
  if (role === 'admin') return ADMIN_NAV;
  return [];
};

export const ROLE_HOME = {
  student: '/student/dashboard',
  teacher: '/teacher/dashboard',
  admin: '/admin/dashboard',
};