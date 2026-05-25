import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Public
import ForgotPassword from "../pages/auth/ForgotPassword";
import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Common
import Profile from "../pages/Profile";
// import Analytics from "../pages/Analytics";
import Leaderboard from "../pages/Leaderboard";

// Student
import StudentDashboard from "../pages/student/StudentDashboard";
import MyProjects from "../pages/student/MyProjects";
import MyTeam from "../pages/student/MyTeam";
import KanbanBoard from "../pages/student/KanbanBoard";
import EnrollSubject from "../pages/student/EnrollSubject";
import ProjectDetails from "../pages/student/ProjectDetails";

// Teacher
// import AdminPanel from "../pages/teacher/AdminPanel";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import AllProjects from "../pages/teacher/AllProjects";
import GiveGrades from "../pages/teacher/GiveGrades";
import SubjectManagement from "../pages/teacher/SubjectManagement";
import AdminPanel from "../pages/teacher/AdminPanel"; // Teacher specific admin area

// Admin (System-wide)
import Analytics from "../pages/admin/Analytics";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import AllProjectsAdmin from "../pages/admin/AllProjectsAdmin";
import SystemLogs from "../pages/admin/SystemLogs";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Common Protected Routes */}
      <Route
        path="/profile"
        element={
          <PrivateRoute allowedRoles={["student", "teacher", "admin"]}>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <PrivateRoute allowedRoles={["student", "teacher", "admin"]}>
            <Analytics />
          </PrivateRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <PrivateRoute allowedRoles={["student", "teacher", "admin"]}>
            <Leaderboard />
          </PrivateRoute>
        }
      />

      {/* STUDENT ROUTES */}
      <Route
        path="/student/dashboard"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/projects"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <MyProjects />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/project/:id"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <ProjectDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/team"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <MyTeam />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/kanban"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <KanbanBoard />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/enroll-subject"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <EnrollSubject />
          </PrivateRoute>
        }
      />

      {/* TEACHER ROUTES */}
      <Route
        path="/teacher/dashboard"
        element={
          <PrivateRoute allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/projects"
        element={
          <PrivateRoute allowedRoles={["teacher"]}>
            <AllProjects />
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/grades"
        element={
          <PrivateRoute allowedRoles={["teacher"]}>
            <GiveGrades />
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/subjects"
        element={
          <PrivateRoute allowedRoles={["teacher"]}>
            <SubjectManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/admin"
        element={
          <PrivateRoute allowedRoles={["teacher"]}>
            <AdminPanel />
          </PrivateRoute>
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AllProjectsAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/logs"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <SystemLogs />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
