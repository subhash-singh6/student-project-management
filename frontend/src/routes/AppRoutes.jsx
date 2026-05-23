import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Public
import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Common
import Profile from "../pages/Profile";
import Analytics from "../pages/Analytics";
import Leaderboard from "../pages/Leaderboard";

// Student
import StudentDashboard from "../pages/student/StudentDashboard";
import MyProjects from "../pages/student/MyProjects";
import MyTeam from "../pages/student/MyTeam";
import TeamChat from "../pages/student/TeamChat";
import KanbanBoard from "../pages/student/KanbanBoard";
import AssignTeacher from "../pages/student/AssignTeacher";
import ProjectDetails from "../pages/student/ProjectDetails"; // ✅ Import clean kar diya hai

// Mentor
import MentorDashboard from "../pages/mentor/MentorDashboard";
import AssignedStudents from "../pages/mentor/AssignedStudents";
import ScheduleMeeting from "../pages/mentor/ScheduleMeeting";

// Teacher
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import AllProjects from "../pages/teacher/AllProjects";
import GiveGrades from "../pages/teacher/GiveGrades";
import SubjectManagement from "../pages/teacher/SubjectManagement";

// Admin
import AdminPanel from "../pages/admin/AdminPanel";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/profile"
        element={
          <PrivateRoute allowedRoles={["student", "mentor", "teacher"]}>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <PrivateRoute allowedRoles={["student", "mentor", "teacher"]}>
            <Analytics />
          </PrivateRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <PrivateRoute allowedRoles={["student", "mentor", "teacher"]}>
            <Leaderboard />
          </PrivateRoute>
        }
      />

      {/* ── STUDENT ROUTES CONTROL BLOCK ── */}
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
      
      {/* 👇 YE NAYA DYNAMIC ROUTE ADD KAR DIYA HAI */}
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
        path="/student/chat"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <TeamChat />
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
        path="/student/assign-teacher"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <AssignTeacher />
          </PrivateRoute>
        }
      />

      {/* ── MENTOR ROUTES CONTROL BLOCK ── */}
      <Route
        path="/mentor/dashboard"
        element={
          <PrivateRoute allowedRoles={["mentor"]}>
            <MentorDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/students"
        element={
          <PrivateRoute allowedRoles={["mentor"]}>
            <AssignedStudents />
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/meetings"
        element={
          <PrivateRoute allowedRoles={["mentor"]}>
            <ScheduleMeeting />
          </PrivateRoute>
        }
      />

      {/* ── TEACHER ROUTES CONTROL BLOCK ── */}
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}