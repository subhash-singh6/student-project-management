import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

export default function AllProjects() {

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {

    try {

      const res = await API.get("/admin/overview");

      setProjects(res.data.recentProjects || []);

    } catch (error) {

      toast.error("Failed to load projects.");

    } finally {

      setLoading(false);

    }

  };

  const filteredProjects = useMemo(() => {

    return projects.filter((p) => {

      const matchesSearch =
        p.title
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : p.status === statusFilter;

      return matchesSearch && matchesStatus;

    });

  }, [projects, search, statusFilter]);

  const completedCount =
    projects.filter(
      (p) => p.status === "completed"
    ).length;

  const activeCount =
    projects.filter(
      (p) => p.status !== "completed"
    ).length;

  if (loading) {

    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white">
        Loading Global Projects Monitor...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-[#070b14] text-white p-4 md:p-8">

      {/* Header */}

      <div className="mb-10">

        <h1 className="text-3xl md:text-4xl font-black">
          Global Projects Monitor
        </h1>

        <p className="text-slate-500 mt-2">
          Centralized governance & monitoring system
        </p>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">

          <div className="text-sm text-slate-500">
            Total Projects
          </div>

          <div className="text-4xl font-black text-blue-400 mt-2">
            {projects.length}
          </div>

        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">

          <div className="text-sm text-slate-500">
            Completed Projects
          </div>

          <div className="text-4xl font-black text-emerald-400 mt-2">
            {completedCount}
          </div>

        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">

          <div className="text-sm text-slate-500">
            Active Projects
          </div>

          <div className="text-4xl font-black text-yellow-400 mt-2">
            {activeCount}
          </div>

        </div>

      </div>

      {/* Filters */}

      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-8">

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 outline-none w-full"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3"
          >
            <option value="all">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="pending">
              Pending
            </option>

          </select>

        </div>

      </div>

      {/* Projects List */}

      <div className="grid gap-5">

        {filteredProjects.length > 0 ? (

          filteredProjects.map((p) => (

            <div
              key={p._id}
              className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-all"
            >

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                {/* Left */}

                <div>

                  <h2 className="text-xl font-bold">
                    {p.title}
                  </h2>

                  <p className="text-sm text-slate-400 mt-2">
                    Created by:
                    {" "}
                    {p.createdBy?.name || "Unknown"}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-4">

                    {p.subject && (

                      <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs">
                        {p.subject}
                      </span>

                    )}

                    {p.deadline && (

                      <span className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full text-xs">
                        Deadline:
                        {" "}
                        {new Date(
                          p.deadline
                        ).toLocaleDateString()}
                      </span>

                    )}

                  </div>

                </div>

                {/* Right */}

                <div className="flex flex-col items-start lg:items-end gap-4">

                  <span
                    className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider
                    ${
                      p.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : p.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {p.status?.toUpperCase() || "ACTIVE"}
                  </span>

                  <div className="text-xs text-slate-500">

                    Created:
                    {" "}
                    {new Date(
                      p.createdAt
                    ).toLocaleDateString()}

                  </div>

                </div>

              </div>

            </div>

          ))

        ) : (

          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-10 text-center text-slate-500">

            No matching projects found.

          </div>

        )}

      </div>

    </div>

  );

}