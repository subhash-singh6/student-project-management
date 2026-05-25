import DashboardLayout from "../../layouts/DashboardLayout";

export default function StudentDashboard() {

  return (

    <DashboardLayout
      title="Student Dashboard"
      subtitle="Manage your academic projects"
      accent="#14b8a6"
      portalLabel="Student Hub"
    >

      <div className="space-y-8">

        {/* Hero Section */}

        <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/5 border border-teal-500/10 rounded-3xl p-8 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 blur-3xl rounded-full" />

          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 mb-6">

              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />

              <span className="text-xs font-light tracking-widest uppercase text-teal-300">

                Student Workspace

              </span>

            </div>

            <h1 className="text-4xl font-light leading-tight">

              Welcome Back 👋

            </h1>

            <p className="text-slate-400 mt-4 max-w-2xl font-thin">

              Track your academic projects, collaborate with teammates,
              manage submissions and stay productive.

            </p>

          </div>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {[
            {
              title: "My Projects",
              value: "08",
              color: "text-teal-400",
              bg: "from-teal-500/10 to-cyan-500/5",
              icon: "📁",
            },

            {
              title: "Pending Tasks",
              value: "14",
              color: "text-amber-400",
              bg: "from-amber-500/10 to-orange-500/5",
              icon: "⏳",
            },

            {
              title: "Team Members",
              value: "26",
              color: "text-indigo-400",
              bg: "from-indigo-500/10 to-cyan-500/5",
              icon: "👥",
            },

            {
              title: "Completed",
              value: "12",
              color: "text-emerald-400",
              bg: "from-emerald-500/10 to-green-500/5",
              icon: "✅",
            },

          ].map((card) => (

            <div
              key={card.title}
              className={`bg-gradient-to-br ${card.bg} border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all duration-300`}
            >

              <div className="text-3xl mb-4">

                {card.icon}

              </div>

              <div className={`text-4xl font-black ${card.color}`}>

                {card.value}

              </div>

              <div className="text-sm text-slate-400 mt-2">

                {card.title}

              </div>

            </div>

          ))}

        </div>

        {/* Main Grid */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Projects */}

          <div className="xl:col-span-2 bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden">

            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold">

                  Active Projects

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  Recent activity and updates

                </p>

              </div>

            </div>

            <div className="p-6 space-y-4">

              {[1,2,3].map((p) => (

                <div
                  key={p}
                  className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-teal-500/20 transition-all"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-lg font-bold">

                        AI Based Attendance System

                      </h3>

                      <p className="text-sm text-slate-500 mt-2">

                        Team collaboration project

                      </p>

                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 border border-teal-500/20 text-teal-400">

                      ACTIVE

                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Quick Actions */}

          <div className="space-y-6">

            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6">

              <h2 className="text-xl font-bold mb-5">

                Quick Actions

              </h2>

              <div className="grid grid-cols-2 gap-4">

                {[
                  "📁 Projects",
                  "🧠 Kanban",
                  "👥 Team",
                  "📚 Subjects",
                ].map((a) => (

                  <button
                    key={a}
                    className="bg-white/[0.03] border border-white/5 rounded-2xl py-5 hover:bg-white/[0.05] hover:border-teal-500/20 transition-all text-sm font-semibold"
                  >

                    {a}

                  </button>

                ))}

              </div>

            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6">

              <h2 className="text-xl font-bold mb-5">

                Notifications

              </h2>

              <div className="space-y-4">

                {[1,2,3].map((n) => (

                  <div
                    key={n}
                    className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
                  >

                    <div className="text-sm font-semibold">

                      Project deadline approaching

                    </div>

                    <div className="text-xs text-slate-500 mt-2">

                      2 hours ago

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );

}