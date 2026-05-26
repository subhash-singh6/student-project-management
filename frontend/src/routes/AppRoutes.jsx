import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Import all your components here...
import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Profile from "../pages/Profile";
import Leaderboard from "../pages/Leaderboard";
import StudentDashboard from "../pages/student/StudentDashboard";
import MyProjects from "../pages/student/MyProjects";
import MyTeam from "../pages/student/MyTeam";
import KanbanBoard from "../pages/student/KanbanBoard";
import EnrollSubject from "../pages/student/EnrollSubject";
import ProjectDetails from "../pages/student/ProjectDetails";
import TeamChat from "../pages/student/TeamChat";
import CreateProject from "../pages/student/CreateProject";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import AllProjects from "../pages/teacher/AllProjects";
import GiveGrades from "../pages/teacher/GiveGrades";
import SubjectManagement from "../pages/teacher/SubjectManagement";
import AdminPanel from "../pages/teacher/AdminPanel";
import Analytics from "../pages/admin/Analytics";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import AllProjectsAdmin from "../pages/admin/AllProjectsAdmin";
import SystemLogs from "../pages/admin/SystemLogs";

const routes = [
  // Public
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },

  // Common
  { path: "/profile", roles: ["student", "teacher", "admin"], element: <Profile /> },
  { path: "/leaderboard", roles: ["student", "teacher", "admin"], element: <Leaderboard /> },

  // Student
  { path: "/student/dashboard", roles: ["student"], element: <StudentDashboard /> },
  { path: "/student/projects", roles: ["student"], element: <MyProjects /> },
  { path: "/student/create-project", roles: ["student"], element: <CreateProject /> },
  { path: "/student/project/:id", roles: ["student"], element: <ProjectDetails /> },
  { path: "/student/team", roles: ["student"], element: <MyTeam /> },
  { path: "/student/team-chat", roles: ["student"], element: <TeamChat /> },
  { path: "/student/kanban", roles: ["student"], element: <KanbanBoard /> },
  { path: "/student/enroll-subject", roles: ["student"], element: <EnrollSubject /> },

  // Teacher
  { path: "/teacher/dashboard", roles: ["teacher"], element: <TeacherDashboard /> },
  { path: "/teacher/projects", roles: ["teacher"], element: <AllProjects /> },
  { path: "/teacher/grades", roles: ["teacher"], element: <GiveGrades /> },
  { path: "/teacher/subjects", roles: ["teacher"], element: <SubjectManagement /> },
  { path: "/teacher/admin", roles: ["teacher"], element: <AdminPanel /> },

  // Admin
  { path: "/admin/dashboard", roles: ["admin"], element: <AdminDashboard /> },
  { path: "/admin/users", roles: ["admin"], element: <ManageUsers /> },
  { path: "/admin/projects", roles: ["admin"], element: <AllProjectsAdmin /> },
  { path: "/admin/logs", roles: ["admin"], element: <SystemLogs /> },
  { path: "/analytics", roles: ["admin"], element: <Analytics /> },
];

export default function AppRoutes() {
  return (
    <Routes>
      {routes.map((route, i) => (
        <Route
          key={i}
          path={route.path}
          element={
            route.roles ? (
              <PrivateRoute allowedRoles={route.roles}>{route.element}</PrivateRoute>
            ) : (
              route.element
            )
          }
        />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}