import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

export default function ManageUsers() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {

    try {

      const res = await API.get("/admin/users");

      setUsers(res.data.users || []);

    } catch (err) {

      toast.error("Failed to load users");

    } finally {

      setLoading(false);

    }

  };

  const toggleStatus = async (id) => {

    try {

      await API.put(`/admin/users/${id}/toggle`);

      toast.success("User status updated");

      fetchUsers();

    } catch (err) {

      toast.error("Action failed");

    }

  };

  const deleteUser = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmDelete) return;

    try {

      await API.delete(`/admin/users/${id}`);

      toast.success("User deleted");

      fetchUsers();

    } catch (err) {

      toast.error("Delete failed");

    }

  };

  const filteredUsers = useMemo(() => {

    return users.filter((u) => {

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

  }, [users, search, roleFilter]);

  const activeUsers =
    users.filter((u) => u.isActive).length;

  const inactiveUsers =
    users.filter((u) => !u.isActive).length;

  const admins =
    users.filter((u) => u.role === "admin").length;

  if (loading) {

    return (

      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white">

        Loading Governance System...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#070b14] text-white p-4 md:p-8">

      {/* Header */}

      <div className="mb-10">

        <h1 className="text-3xl md:text-4xl font-black">
          User Governance
        </h1>

        <p className="text-slate-500 mt-2">
          Manage system users, permissions & activity
        </p>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">

          <div className="text-sm text-slate-400">
            Total Users
          </div>

          <div className="text-4xl font-black text-blue-400 mt-2">
            {users.length}
          </div>

        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">

          <div className="text-sm text-slate-400">
            Active Users
          </div>

          <div className="text-4xl font-black text-emerald-400 mt-2">
            {activeUsers}
          </div>

        </div>

        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6">

          <div className="text-sm text-slate-400">
            Inactive Users
          </div>

          <div className="text-4xl font-black text-rose-400 mt-2">
            {inactiveUsers}
          </div>

        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6">

          <div className="text-sm text-slate-400">
            Admin Accounts
          </div>

          <div className="text-4xl font-black text-purple-400 mt-2">
            {admins}
          </div>

        </div>

      </div>

      {/* Filters */}

      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-8">

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 outline-none w-full"
          />

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3"
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

      {/* Users Table */}

      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 overflow-x-auto">

        <table className="w-full min-w-[900px] text-left">

          <thead>

            <tr className="text-slate-500 text-xs uppercase tracking-widest border-b border-white/5">

              <th className="pb-5">
                User
              </th>

              <th className="pb-5">
                Role
              </th>

              <th className="pb-5">
                Status
              </th>

              <th className="pb-5">
                Joined
              </th>

              <th className="pb-5">
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

                  <td className="py-5">

                    <div className="font-semibold">
                      {u.name}
                    </div>

                    <div className="text-sm text-slate-500 mt-1">
                      {u.email}
                    </div>

                  </td>

                  {/* Role */}

                  <td className="py-5">

                    <span className="uppercase text-xs bg-white/[0.05] px-3 py-1 rounded-full">

                      {u.role}

                    </span>

                  </td>

                  {/* Status */}

                  <td className="py-5">

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider
                      ${
                        u.isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {u.isActive
                        ? "ACTIVE"
                        : "INACTIVE"}
                    </span>

                  </td>

                  {/* Created */}

                  <td className="py-5 text-sm text-slate-400">

                    {new Date(
                      u.createdAt
                    ).toLocaleDateString()}

                  </td>

                  {/* Actions */}

                  <td className="py-5">

                    <div className="flex gap-3">

                      <button
                        onClick={() =>
                          toggleStatus(u._id)
                        }
                        className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-xs px-4 py-2 rounded-xl transition-all"
                      >
                        Toggle
                      </button>

                      <button
                        onClick={() =>
                          deleteUser(u._id)
                        }
                        className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs px-4 py-2 rounded-xl transition-all"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="5"
                  className="text-center py-10 text-slate-500"
                >

                  No users found.

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}