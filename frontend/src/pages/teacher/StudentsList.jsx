import {
  FiUsers,
  FiMail,
  FiTrendingUp,
} from "react-icons/fi";

export default function StudentsList({
  students = [],
}) {
  return (
    <div className="rounded-3xl border border-violet-500/10 bg-[#111827] p-5 shadow-xl">

      {/* HEADER */}
      <div className="flex items-center gap-3">

        <div className="rounded-2xl bg-violet-500/10 p-3">
          <FiUsers className="text-2xl text-violet-400" />
        </div>

        <div>

          <h2 className="text-xl font-semibold text-white">
            Students
          </h2>

          <p className="text-sm text-slate-400">
            Manage student information
          </p>

        </div>

      </div>

      {/* STUDENTS LIST */}
      <div className="mt-6 space-y-4">

        {students.length === 0 ? (
          <div className="rounded-2xl border border-violet-500/10 bg-[#0f172a] p-5 text-center">

            <p className="text-sm text-slate-400">
              No students found
            </p>

          </div>
        ) : (
          students.map((s) => (
            <div
              key={s._id}
              className="flex flex-col gap-4 rounded-2xl border border-violet-500/10 bg-[#0f172a] p-4 transition-all duration-300 hover:border-violet-500/30 md:flex-row md:items-center md:justify-between"
            >

              {/* LEFT */}
              <div className="flex items-center gap-4">

                {/* AVATAR */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-lg font-bold text-violet-400">

                  {s.name?.charAt(0)?.toUpperCase()}

                </div>

                {/* INFO */}
                <div>

                  <h3 className="font-semibold text-white">
                    {s.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">

                    <FiMail className="text-violet-400" />

                    {s.email}

                  </div>

                </div>

              </div>

              {/* ATTENDANCE */}
              <div className="flex items-center gap-2 rounded-2xl bg-violet-500/10 px-4 py-2">

                <FiTrendingUp className="text-violet-400" />

                <span className="text-sm font-medium text-violet-300">
                  {s.attendance || 0}%
                </span>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}