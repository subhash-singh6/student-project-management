import DashboardLayout from "../../layouts/DashboardLayout";

export default function AdminDashboard() {

  return (

    <DashboardLayout
      title="Admin Dashboard"
      subtitle="System governance and control center"
      accent="#f59e0b"
      portalLabel="Admin Core"
    >

      <div className="space-y-8">

        {/* Hero */}

        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/10 rounded-3xl p-8 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 blur-3xl rounded-full" />

          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">

              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />

              <span className="text-xs font-light tracking-widest uppercase text-amber-300">

                Admin Control Panel

              </span>

            </div>

            <h1 className="text-4xl font-semibold leading-tight">

              System Governance Dashboard

            </h1>

            <p className="text-slate-400 mt-4 max-w-2xl font-thin">

              Monitor platform activity, manage users,
              control projects and maintain system health.

            </p>

          </div>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {[
            ["👥", "Total Users", "1,248"],
            ["📁", "Projects", "326"],
            ["⚡", "Active Users", "842"],
            ["🚨", "System Alerts", "04"],
          ].map((s) => (

            <div
              key={s[1]}
              className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 hover:border-amber-500/20 transition-all"
            >

              <div className="text-3xl mb-4">

                {s[0]}

              </div>

              <div className="text-4xl font-black text-amber-400">

                {s[2]}

              </div>

              <div className="text-sm text-slate-400 mt-2">

                {s[1]}

              </div>

            </div>

          ))}

        </div>

        {/* User Table */}

        <div className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden">

          <div className="px-6 py-5 border-b border-white/5">

            <h2 className="text-2xl font-bold">

              User Governance

            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>

                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase tracking-widest">

                  <th className="px-6 py-5 text-left">

                    User

                  </th>

                  <th className="px-6 py-5 text-left">

                    Role

                  </th>

                  <th className="px-6 py-5 text-left">

                    Status

                  </th>

                  <th className="px-6 py-5 text-left">

                    Action

                  </th>

                </tr>

              </thead>

              <tbody>

                {[1,2,3,4].map((u) => (

                  <tr
                    key={u}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >

                    <td className="px-6 py-5">

                      <div className="font-semibold">

                        John Doe

                      </div>

                      <div className="text-sm text-slate-500 mt-1">

                        john@example.com

                      </div>

                    </td>

                    <td className="px-6 py-5">

                      <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/5 text-xs uppercase">

                        Student

                      </span>

                    </td>

                    <td className="px-6 py-5">

                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">

                        ACTIVE

                      </span>

                    </td>

                    <td className="px-6 py-5">

                      <button className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-semibold px-4 py-2 rounded-xl transition-all">

                        Toggle Access

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );

}