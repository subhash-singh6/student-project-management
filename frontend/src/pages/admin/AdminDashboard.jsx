import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

export default function AdminDashboard() {

  const [data, setData] = useState({
    users: [],
    projectCount: 0,
    recentProjects: [],
  });

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {

    try {

      const res = await API.get("/admin/overview");

      setData(res.data);

    } catch (err) {

      toast.error("Failed to load admin dashboard.");

    } finally {

      setLoading(false);

    }

  };

  const toggleStatus = async (id) => {

    try {

      await API.put(`/admin/users/${id}/toggle`);

      toast.success("User status updated.");

      fetchAdminData();

    } catch (err) {

      toast.error("Action failed.");

    }

  };

  const filteredUsers = useMemo(() => {

    return data.users.filter((u) => {

      const matchesSearch =

        u.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        u.email
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesRole =

        roleFilter === "all"
          ? true
          : u.role === roleFilter;

      return matchesSearch && matchesRole;

    });

  }, [data.users, search, roleFilter]);

  const activeUsers =
    data.users.filter((u) => u.isActive).length;

  const inactiveUsers =
    data.users.filter((u) => !u.isActive).length;

  const admins =
    data.users.filter((u) => u.role === "admin").length;

  if (loading) {

    return (

      <div className="min-h-screen bg-[#060A12] flex items-center justify-center text-white">

        Loading Governance System...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#060A12] text-[#f8fafc] overflow-x-hidden">

      {/* Ambient Background */}

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">

        <div className="absolute -top-[180px] -left-[180px] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-500/5 to-transparent blur-[80px]" />

        <div className="absolute -bottom-[220px] -right-[220px] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-indigo-500/5 to-transparent blur-[80px]" />

      </div>

      <div className="relative z-10 p-4 md:p-8">

        {/* Header */}

        <div className="mb-12">

          <div className="inline-flex items-center bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-5">

            <span className="text-xs text-[#fbbf24] font-semibold tracking-widest uppercase">
              Admin Control Panel
            </span>

          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">

            System Governance Dashboard

          </h1>

          <p className="text-[#64748b] mt-4 max-w-2xl leading-relaxed">

            Monitor platform activity, manage users, review projects,
            and control the academic ecosystem in real-time.

          </p>

        </div>

        {/* Stats Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">

          {/* Total Users */}

          <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:border-amber-500/20 transition-all duration-300">

            <div className="text-sm text-[#64748b] mb-2">
              Total Users
            </div>

            <div className="text-4xl font-black text-amber-400">
              {data.users.length}
            </div>

          </div>

          {/* Active Users */}

          <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-300">

            <div className="text-sm text-[#64748b] mb-2">
              Active Users
            </div>

            <div className="text-4xl font-black text-emerald-400">
              {activeUsers}
            </div>

          </div>

          {/* Inactive */}

          <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:border-rose-500/20 transition-all duration-300">

            <div className="text-sm text-[#64748b] mb-2">
              Restricted Users
            </div>

            <div className="text-4xl font-black text-rose-400">
              {inactiveUsers}
            </div>

          </div>

          {/* Projects */}

          <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:border-indigo-500/20 transition-all duration-300">

            <div className="text-sm text-[#64748b] mb-2">
              Total Projects
            </div>

            <div className="text-4xl font-black text-indigo-400">
              {data.projectCount}
            </div>

          </div>

        </div>

        {/* Filters */}

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-10 backdrop-blur-md">

          <div className="flex flex-col lg:flex-row gap-4">

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 outline-none w-full focus:border-amber-500/30 transition-all"
            />

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              className="bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500/30 transition-all"
            >
              <option value="all">
                All Roles
              </option>

              <option value="student">
                Student
              </option>

              <option value="teacher">
                Teacher
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

          </div>

        </div>

        {/* User Governance Table */}

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden mb-12">

          {/* Table Header */}

          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">

            <div>

              <h2 className="text-2xl font-bold">
                User Governance
              </h2>

              <p className="text-[#64748b] text-sm mt-1">
                Manage permissions and account activity
              </p>

            </div>

            <div className="hidden md:flex items-center gap-2">

              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

              <span className="text-xs text-emerald-400">
                LIVE
              </span>

            </div>

          </div>

          {/* Table */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px] text-left">

              <thead>

                <tr className="text-[#64748b] text-xs uppercase tracking-widest border-b border-white/5">

                  <th className="px-6 py-5">
                    User
                  </th>

                  <th className="px-6 py-5">
                    Role
                  </th>

                  <th className="px-6 py-5">
                    Status
                  </th>

                  <th className="px-6 py-5">
                    Joined
                  </th>

                  <th className="px-6 py-5">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.length > 0 ? (

                  filteredUsers.map((u) => (

                    <tr
                      key={u._id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-all"
                    >

                      {/* User */}

                      <td className="px-6 py-5">

                        <div className="font-semibold text-[#f8fafc]">
                          {u.name}
                        </div>

                        <div className="text-sm text-[#64748b] mt-1">
                          {u.email}
                        </div>

                      </td>

                      {/* Role */}

                      <td className="px-6 py-5">

                        <span className="uppercase text-xs bg-white/[0.05] border border-white/5 px-3 py-1 rounded-full">

                          {u.role}

                        </span>

                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">

                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider
                          ${
                            u.isActive
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {u.isActive
                            ? "ACTIVE"
                            : "RESTRICTED"}
                        </span>

                      </td>

                      {/* Joined */}

                      <td className="px-6 py-5 text-sm text-[#64748b]">

                        {new Date(
                          u.createdAt
                        ).toLocaleDateString()}

                      </td>

                      {/* Actions */}

                      <td className="px-6 py-5">

                        <button
                          onClick={() =>
                            toggleStatus(u._id)
                          }
                          className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                        >
                          Toggle Access
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-14 text-[#64748b]"
                    >

                      No users found.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Recent Projects */}

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden">

          {/* Header */}

          <div className="px-6 py-5 border-b border-white/5">

            <h2 className="text-2xl font-bold">
              Recent Projects
            </h2>

            <p className="text-[#64748b] text-sm mt-1">
              Latest academic project activity
            </p>

          </div>

          {/* Projects */}

          <div className="p-6 space-y-5">

            {data.recentProjects.length > 0 ? (

              data.recentProjects.map((p) => (

                <div
                  key={p._id}
                  className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-amber-500/15 transition-all duration-300"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>

                      <h3 className="text-lg font-bold">
                        {p.title}
                      </h3>

                      <p className="text-sm text-[#64748b] mt-2">

                        Created by:
                        {" "}
                        {p.createdBy?.name || "Unknown"}

                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold
                        ${
                          p.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {p.status || "ACTIVE"}
                      </span>

                    </div>

                  </div>

                </div>

              ))

            ) : (

              <div className="text-center text-[#64748b] py-12">

                No recent projects available.

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}