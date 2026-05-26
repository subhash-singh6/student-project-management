import {
  FiBook,
  FiHash,
} from "react-icons/fi";

export default function SubjectCard({
  subject,
}) {
  return (
    <div className="rounded-3xl border border-violet-500/10 bg-[#111827] p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-violet-900/20">

      {/* TOP */}
      <div className="flex items-start justify-between">

        {/* SUBJECT INFO */}
        <div>

          <h3 className="text-lg font-semibold text-white">
            {subject.name}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">

            <FiHash className="text-violet-400" />

            {subject.code || "No code"}

          </div>

        </div>

        {/* ICON */}
        <div className="rounded-2xl bg-violet-500/10 p-3">

          <FiBook className="text-xl text-violet-400" />

        </div>

      </div>

    </div>
  );
}