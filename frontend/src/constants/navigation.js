import {
  FiHome, FiFolder, FiColumns, FiUsers, FiMessageSquare,
  FiBook, FiAward, FiUser, FiEdit3, FiSettings,
  FiBarChart2, FiShield
} from "react-icons/fi";

export const navigation = {
  student: [
    { label: "Dashboard", path: "/student/dashboard", icon: FiHome },
    { label: "My Projects", path: "/student/projects", icon: FiFolder },
    { label: "Kanban Board", path: "/student/kanban", icon: FiColumns },
    { label: "My Team", path: "/student/team", icon: FiUsers },
    { label: "Team Chat", path: "/student/team-chat", icon: FiMessageSquare },
    { label: "Enroll Subject", path: "/student/enroll-subject", icon: FiBook },
    { label: "Leaderboard", path: "/leaderboard", icon: FiAward },
    { label: "Profile", path: "/profile", icon: FiUser },
  ],

  teacher: [
    { label: "Dashboard", path: "/teacher/dashboard", icon: FiHome },
    { label: "My Classes", path: "/teacher/classes", icon: FiFolder },
    { label: "Students", path: "/teacher/students", icon: FiUsers },
    { label: "Assignments", path: "/teacher/assignments", icon: FiEdit3 },
    { label: "Grades", path: "/teacher/grades", icon: FiBarChart2 },
  ],

  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: FiHome },
    { label: "Users", path: "/admin/users", icon: FiUsers },
    { label: "Settings", path: "/admin/settings", icon: FiSettings },
  ]
};

export const getNavForRole = (role) => navigation[role] || [];