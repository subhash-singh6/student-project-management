import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

export default function SystemLogs() {

  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {

    try {

      const res = await API.get("/admin/logs");

      setLogs(res.data.logs || []);

    } catch (error) {

      toast.error("Failed to load logs");

    } finally {

      setLoading(false);

    }

  };

  const filteredLogs = useMemo(() => {

    return logs.filter((log) => {

      const matchesSearch =

        log.action
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        log.user
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =

        typeFilter === "all"
          ? true
          : log.action
              ?.toLowerCase()
              .includes(typeFilter);

      return matchesSearch && matchesType;

    });

  }, [logs, search, typeFilter]);

  const todayLogs = logs.filter((log) => {

    const logDate =
      new Date(log.timestamp)
        .toDateString();

    const today =
      new Date().toDateString();

    return logDate === today;

  }).length;

  const criticalLogs = logs.filter((log) =>

    log.action
      ?.toLowerCase()
      .includes("delete") ||

    log.action
      ?.toLowerCase()
      .includes("ban") ||

    log.action
      ?.toLowerCase()
      .includes("failed")

  ).length;

  if (loading) {

    return (

      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white">

        Initializing Log Engine...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#070b14] text-white p-4 md:p-8">

      {/* Header */}

      <div className="mb-10">

        <h1 className="text-3xl md:text-4xl font-black">
          System Audit Logs
        </h1>

        <p className="text-slate-500 mt-2">
          Real-time monitoring & governance activity records
        </p>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6">

          <div className="text-sm text-slate-400">
            Total Logs
          </div>

          <div className="text-4xl font-black text-cyan-400 mt-2">
            {logs.length}
          </div>

        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">

          <div className="text-sm text-slate-400">
            Today's Activity
          </div>

          <div className="text-4xl font-black text-emerald-400 mt-2">
            {todayLogs}
          </div>

        </div>

        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6">

          <div className="text-sm text-slate-400">
            Critical Events
          </div>

          <div className="text-4xl font-black text-rose-400 mt-2">
            {criticalLogs}
          </div>

        </div>

      </div>

      {/* Filters */}

      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-8">

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 outline-none w-full"
          />

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
            className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3"
          >
            <option value="all">
              All Events
            </option>

            <option value="login">
              Login
            </option>

            <option value="delete">
              Delete
            </option>

            <option value="update">
              Update
            </option>

            <option value="failed">
              Failed
            </option>

          </select>

        </div>

      </div>

      {/* Logs Console */}

      <div className="bg-black border border-white/10 rounded-2xl overflow-hidden">

        {/* Console Header */}

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">

          <div>

            <h2 className="font-bold">
              Live System Console
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Monitoring administrator activities
            </p>

          </div>

          <div className="flex items-center gap-2">

            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

            <span className="text-xs text-emerald-400">
              LIVE
            </span>

          </div>

        </div>

        {/* Logs */}

        <div className="font-mono text-xs text-emerald-400 overflow-y-auto max-h-[600px] p-6 space-y-3">

          {filteredLogs.length > 0 ? (

            filteredLogs.map((log, i) => (

              <div
                key={i}
                className="border-b border-white/5 pb-3"
              >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">

                  <div className="break-all">

                    <span className="text-cyan-400">

                      [
                      {new Date(
                        log.timestamp
                      ).toLocaleTimeString()}
                      ]

                    </span>

                    {" "}

                    <span className="text-emerald-400">

                      {log.action}

                    </span>

                    {" "}

                    <span className="text-slate-500">

                      — User:
                      {" "}
                      {log.user || "Unknown"}

                    </span>

                  </div>

                  <div className="text-slate-600 text-[10px]">

                    {new Date(
                      log.timestamp
                    ).toLocaleDateString()}

                  </div>

                </div>

              </div>

            ))

          ) : (

            <div className="text-center text-slate-500 py-10">

              No logs found.

            </div>

          )}

        </div>

      </div>

    </div>

  );

}