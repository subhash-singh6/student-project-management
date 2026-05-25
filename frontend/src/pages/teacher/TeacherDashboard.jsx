import DashboardLayout from "../../layouts/DashboardLayout";

export default function TeacherDashboard() {

  return (

    <DashboardLayout
      title="Teacher Dashboard"
      subtitle="Review and manage student submissions"
      accent="#f59e0b"
      portalLabel="Teacher Board"
    >

      <div className="space-y-8">

        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/10 rounded-3xl p-8">

          <h1 className="text-4xl font-normal leading-tight">

            Faculty Command Center 👨‍🏫

          </h1>

          <p className="text-slate-400 mt-4 max-w-2xl">

            Review submissions, approve projects,
            manage grades and monitor academic progress.

          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {[
            ["📁", "Total Projects", "84"],
            ["⏳", "Pending Reviews", "12"],
            ["✅", "Approved", "48"],
            ["⭐", "Grades Assigned", "66"],
          ].map((s) => (

            <div
              key={s[1]}
              className="bg-white/[0.03] border border-white/5 rounded-3xl p-6"
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

      </div>

    </DashboardLayout>

  );

}