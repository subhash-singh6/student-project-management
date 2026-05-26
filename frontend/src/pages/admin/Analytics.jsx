import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../constants/context/AuthContext";
import API from "../../api/axios";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

import {
  Bar,
  Doughnut,
  Line,
} from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const CHART_DEFAULTS = {

  plugins: {

    legend: {
      labels: {
        color: "#94a3b8",
      },
    },

  },

  scales: {

    x: {
      ticks: {
        color: "#475569",
      },
      grid: {
        color: "rgba(255,255,255,0.04)",
      },
    },

    y: {
      ticks: {
        color: "#475569",
      },
      grid: {
        color: "rgba(255,255,255,0.04)",
      },
    },

  },

};

export default function Analytics() {

  const { user } = useAuth();

  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      const res = await API.get("/projects");

      setProjects(res.data.projects || []);

    } catch (error) {

      toast.error("Analytics load failed.");

    } finally {

      setLoading(false);

    }

  };

  const getDashboardPath = () => {

    if (user?.role === "student") {
      return "/student/dashboard";
    }

    if (user?.role === "teacher") {
      return "/teacher/dashboard";
    }

    return "/admin/dashboard";

  };

  const statusCount = useMemo(() => ({

    pending:
      projects.filter(
        (p) => p.status === "pending"
      ).length,

    approved:
      projects.filter(
        (p) => p.status === "approved"
      ).length,

    completed:
      projects.filter(
        (p) => p.status === "completed"
      ).length,

    rejected:
      projects.filter(
        (p) => p.status === "rejected"
      ).length,

    active:
      projects.filter(
        (p) =>
          p.status !== "completed" &&
          p.status !== "rejected"
      ).length,

  }), [projects]);

  const categoryCount = {};

  projects.forEach((p) => {

    categoryCount[p.category || "Other"] =
      (categoryCount[p.category || "Other"] || 0) + 1;

  });

  const subjectCount = {};

  projects.forEach((p) => {

    subjectCount[p.subject?.name || "Other"] =
      (subjectCount[p.subject?.name || "Other"] || 0) + 1;

  });

  const monthCount = {};

  projects.forEach((p) => {

    const month = new Date(
      p.createdAt
    ).toLocaleString("en-IN", {
      month: "short",
      year: "2-digit",
    });

    monthCount[month] =
      (monthCount[month] || 0) + 1;

  });

  const overdueProjects = projects.filter(

    (p) =>
      p.deadline &&
      new Date(p.deadline) < new Date() &&
      p.status !== "completed"

  );

  const totalProjects = projects.length;

  const completedPct =
    totalProjects > 0
      ? Math.round(
          (
            statusCount.completed /
            totalProjects
          ) * 100
        )
      : 0;

  const statusChart = {

    labels: [
      "Pending",
      "Approved",
      "Completed",
      "Rejected",
      "Active",
    ],

    datasets: [

      {
        label: "Projects",

        data: [
          statusCount.pending,
          statusCount.approved,
          statusCount.completed,
          statusCount.rejected,
          statusCount.active,
        ],

        backgroundColor: [
          "rgba(245,158,11,0.7)",
          "rgba(16,185,129,0.7)",
          "rgba(34,197,94,0.7)",
          "rgba(239,68,68,0.7)",
          "rgba(59,130,246,0.7)",
        ],

        borderWidth: 2,
        borderRadius: 8,

      },

    ],

  };

  const subjectChart = {

    labels: Object.keys(subjectCount),

    datasets: [

      {
        data: Object.values(subjectCount),

        backgroundColor: [
          "rgba(99,102,241,0.8)",
          "rgba(34,211,238,0.8)",
          "rgba(16,185,129,0.8)",
          "rgba(245,158,11,0.8)",
          "rgba(239,68,68,0.8)",
          "rgba(168,85,247,0.8)",
        ],

        borderWidth: 2,

      },

    ],

  };

  const trendChart = {

    labels: Object.keys(monthCount),

    datasets: [

      {
        label: "Projects",

        data: Object.values(monthCount),

        borderColor: "#6366f1",

        backgroundColor:
          "rgba(99,102,241,0.1)",

        fill: true,

        tension: 0.4,

      },

    ],

  };

  if (loading) {

    return (

      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white">

        Loading Analytics...

      </div>

    );

  }

  return (

    // <div className="min-h-screen bg-[#070b14] text-white p-4 md:p-8">
    <DashboardLayout title="Analytics Dashboard" subtitle="Project performance & governance insights" portalLabel="Analytics Center">

      {/* Header */}

      <div className="mb-10">

        <button
          onClick={() => navigate(getDashboardPath())}
          className="text-slate-500 hover:text-white mb-4 text-sm"
        >
          ← Dashboard
        </button>

        <h1 className="text-3xl md:text-4xl font-black">
          Analytics Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Project performance & governance insights
        </p>

      </div>

      {/* Stats Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6">

          <div className="text-sm text-slate-400">
            Total Projects
          </div>

          <div className="text-4xl font-black text-indigo-400 mt-2">
            {totalProjects}
          </div>

        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">

          <div className="text-sm text-slate-400">
            Completion Rate
          </div>

          <div className="text-4xl font-black text-emerald-400 mt-2">
            {completedPct}%
          </div>

        </div>

        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6">

          <div className="text-sm text-slate-400">
            Overdue Projects
          </div>

          <div className="text-4xl font-black text-rose-400 mt-2">
            {overdueProjects.length}
          </div>

        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6">

          <div className="text-sm text-slate-400">
            Active Projects
          </div>

          <div className="text-4xl font-black text-cyan-400 mt-2">
            {statusCount.active}
          </div>

        </div>

      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

        {/* Status Chart */}

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">

          <h2 className="text-xl font-bold mb-6">
            Project Status Analytics
          </h2>

          <Bar
            data={statusChart}
            options={{
              ...CHART_DEFAULTS,
              responsive: true,
            }}
          />

        </div>

        {/* Subject Chart */}

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">

          <h2 className="text-xl font-bold mb-6">
            Subject Distribution
          </h2>

          <div className="max-w-[400px] mx-auto">

            <Doughnut
              data={subjectChart}
            />

          </div>

        </div>

      </div>

      {/* Trend Chart */}

      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-10">

        <h2 className="text-xl font-bold mb-6">
          Monthly Submission Trend
        </h2>

        <Line
          data={trendChart}
          options={{
            ...CHART_DEFAULTS,
            responsive: true,
          }}
        />

      </div>

      {/* Overdue Projects */}

      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">

        <h2 className="text-xl font-bold mb-6">
          Overdue Projects
        </h2>

        <div className="space-y-4">

          {overdueProjects.length > 0 ? (

            overdueProjects.map((p) => (

              <div
                key={p._id}
                className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>

                    <h3 className="font-bold">
                      {p.title}
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                      Deadline:
                      {" "}
                      {new Date(
                        p.deadline
                      ).toLocaleDateString()}
                    </p>

                  </div>

                  <span className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full text-xs font-bold w-fit">
                    OVERDUE
                  </span>

                </div>

              </div>

            ))

          ) : (

            <div className="text-center text-slate-500 py-10">

              No overdue projects found.

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>

  );

}