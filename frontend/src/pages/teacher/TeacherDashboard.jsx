import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  FiSearch,
  FiFolder,
  FiCheckCircle,
  FiClock,
  FiUsers,
} from "react-icons/fi";

import toast from "react-hot-toast";
import API from "../../services/teacherApi";
import useTeacherDashboard from "../../hooks/useTeacherDashboard";

import ProjectDetailsModal from "../../pages/teacher/ProjectDetailsModal";
import AttendancePanel from "../../pages/teacher/AttendancePanel";
import AssignmentsPanel from "../../pages/teacher/AssignmentsPanel";
import AnnouncementsPanel from "../../pages/teacher/AnnouncementsPanel";

export default function TeacherDashboard() {
  const { projects, loading, stats, refresh } =
    useTeacherDashboard();

  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] =
    useState(null);

  const [showAttendance, setShowAttendance] =
    useState(false);

  const [showAssignments, setShowAssignments] =
    useState(false);

  const [showAnnouncements, setShowAnnouncements] =
    useState(false);

  const [students, setStudents] = useState([]);

  // FETCH STUDENTS
  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");

      setStudents(res.data.students || []);
    } catch (error) {
      console.log(error);
      setStudents([]);
    }
  };

  // OPEN ATTENDANCE
  const openAttendancePanel = async () => {
    await fetchStudents();
    setShowAttendance(true);
  };

  // APPROVE PROJECT
  const approveProject = async (id) => {
    await API.put(`/projects/${id}/approve`, {
      status: "approved",
    });

    toast.success("Project approved");

    refresh();

    setSelectedProject(null);
  };

  // REJECT PROJECT
  const rejectProject = async (id) => {
    await API.put(`/projects/${id}/approve`, {
      status: "rejected",
    });

    toast.success("Project rejected");

    refresh();

    setSelectedProject(null);
  };

  // SAVE GRADE
  const saveGrade = async (id, grade) => {
    await API.put(`/projects/${id}/grade`, {
      grade,
    });

    toast.success("Grade saved");

    refresh();

    setSelectedProject(null);
  };

  // FILTER PROJECTS
  const filteredProjects = projects.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Teacher Dashboard"
      subtitle="Manage students and projects"
      accent="#7c3aed"
      portalLabel="Faculty Hub"
    >
      <div className="space-y-5 text-white">

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* PROJECTS */}
          <div className="rounded-2xl border border-violet-500/10 bg-[#111827] p-4 shadow-lg">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Projects
              </p>

              <div className="rounded-xl bg-violet-500/10 p-2">
                <FiFolder className="text-lg text-violet-400" />
              </div>

            </div>

            <h2 className="mt-3 text-2xl font-bold text-white">
              {stats?.totalProjects || 0}
            </h2>

          </div>

          {/* APPROVED */}
          <div className="rounded-2xl border border-violet-500/10 bg-[#111827] p-4 shadow-lg">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Approved
              </p>

              <div className="rounded-xl bg-green-500/10 p-2">
                <FiCheckCircle className="text-lg text-green-400" />
              </div>

            </div>

            <h2 className="mt-3 text-2xl font-bold text-white">
              {stats?.approvedProjects || 0}
            </h2>

          </div>

          {/* PENDING */}
          <div className="rounded-2xl border border-violet-500/10 bg-[#111827] p-4 shadow-lg">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Pending
              </p>

              <div className="rounded-xl bg-yellow-500/10 p-2">
                <FiClock className="text-lg text-yellow-400" />
              </div>

            </div>

            <h2 className="mt-3 text-2xl font-bold text-white">
              {stats?.pendingProjects || 0}
            </h2>

          </div>

          {/* STUDENTS */}
          <div className="rounded-2xl border border-violet-500/10 bg-[#111827] p-4 shadow-lg">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Students
              </p>

              <div className="rounded-xl bg-cyan-500/10 p-2">
                <FiUsers className="text-lg text-cyan-400" />
              </div>

            </div>

            <h2 className="mt-3 text-2xl font-bold text-white">
              {students?.length || 0}
            </h2>

          </div>

        </div>

        {/* SEARCH + BUTTONS */}
        <div className="flex flex-col gap-4 rounded-2xl border border-violet-500/10 bg-[#111827] p-4 shadow-lg lg:flex-row lg:items-center lg:justify-between">

          {/* SEARCH */}
          <div className="relative w-full lg:max-w-md">

            <FiSearch className="absolute left-3 top-3 text-slate-400" />

            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-violet-500/10 bg-[#0f172a] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-violet-500"
            />

          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-3">

            <button
              onClick={openAttendancePanel}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold transition hover:bg-violet-500"
            >
              Attendance
            </button>

            <button
              onClick={() =>
                setShowAssignments(true)
              }
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold transition hover:bg-violet-500"
            >
              Assignments
            </button>

            <button
              onClick={() =>
                setShowAnnouncements(true)
              }
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold transition hover:bg-violet-500"
            >
              Announcement
            </button>

          </div>

        </div>

        {/* PROJECTS */}
        <div className="space-y-4">

          <h2 className="text-xl font-semibold text-white">
            Recent Projects
          </h2>

          {loading ? (
            <div className="text-slate-400">
              Loading...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-slate-400">
              No submissions found
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">

              {filteredProjects
                .slice(0, 6)
                .map((project) => (
                  <div
                    key={project._id}
                    className="rounded-2xl border border-violet-500/10 bg-[#111827] p-4 shadow-lg"
                  >

                    <h3 className="font-semibold text-white">
                      {project.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-400">
                      {project.description?.slice(
                        0,
                        90
                      ) || "No description"}
                    </p>

                    <button
                      onClick={() =>
                        setSelectedProject(project)
                      }
                      className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium transition hover:bg-violet-500"
                    >
                      Open
                    </button>

                  </div>
                ))}

            </div>
          )}

        </div>

        {/* MODALS */}
        <ProjectDetailsModal
          open={!!selectedProject}
          project={selectedProject}
          onClose={() =>
            setSelectedProject(null)
          }
          onApprove={approveProject}
          onReject={rejectProject}
          onGrade={saveGrade}
        />

        <AttendancePanel
          open={showAttendance}
          students={students}
          onClose={() =>
            setShowAttendance(false)
          }
          onSave={async () => {
            toast.success("Attendance saved");

            setShowAttendance(false);

            await refresh();
          }}
        />

        <AssignmentsPanel
          open={showAssignments}
          onClose={() =>
            setShowAssignments(false)
          }
          onCreate={async () => {
            toast.success(
              "Assignment created"
            );

            setShowAssignments(false);

            await refresh();
          }}
        />

        <AnnouncementsPanel
          open={showAnnouncements}
          onClose={() =>
            setShowAnnouncements(false)
          }
          onPost={async () => {
            toast.success(
              "Announcement posted"
            );

            setShowAnnouncements(false);

            await refresh();
          }}
        />

      </div>
    </DashboardLayout>
  );
}