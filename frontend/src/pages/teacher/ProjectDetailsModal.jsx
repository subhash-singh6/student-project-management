import { useEffect, useState } from "react";

import {
  FiBookOpen,
  FiUser,
  FiTag,
  FiAward,
  FiCheckCircle,
  FiXCircle,
  FiSave,
  FiX,
} from "react-icons/fi";

export default function ProjectDetailsModal({
  open,
  project,
  onClose,
  onApprove,
  onReject,
  onGrade,
}) {
  const [grade, setGrade] = useState("");

  useEffect(() => {
    setGrade(project?.grade || "");
  }, [project]);

  if (!open || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      {/* MODAL */}
      <div className="w-full max-w-2xl rounded-3xl border border-violet-500/10 bg-[#111827] p-6 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-violet-500/10 p-3">
              <FiBookOpen className="text-2xl text-violet-400" />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-white">
                {project.title}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Project Details & Review
              </p>

            </div>

          </div>

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="rounded-xl bg-[#0f172a] p-2 transition hover:bg-violet-500/10"
          >
            <FiX className="text-lg text-slate-300" />
          </button>

        </div>

        {/* DESCRIPTION */}
        <div className="mt-6 rounded-2xl border border-violet-500/10 bg-[#0f172a] p-4">

          <p className="text-sm leading-relaxed text-slate-300">
            {project.description ||
              "No description available"}
          </p>

        </div>

        {/* DETAILS */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">

          {/* SUBJECT */}
          <div className="rounded-2xl border border-violet-500/10 bg-[#0f172a] p-4">

            <div className="flex items-center gap-2 text-violet-400">

              <FiTag />

              <span className="text-sm font-medium">
                Subject
              </span>

            </div>

            <p className="mt-2 text-sm text-white">
              {project.subject?.name ||
                "No Subject"}
            </p>

          </div>

          {/* STATUS */}
          <div className="rounded-2xl border border-violet-500/10 bg-[#0f172a] p-4">

            <div className="flex items-center gap-2 text-yellow-400">

              <FiCheckCircle />

              <span className="text-sm font-medium">
                Status
              </span>

            </div>

            <p className="mt-2 capitalize text-sm text-white">
              {project.status}
            </p>

          </div>

          {/* STUDENT */}
          <div className="rounded-2xl border border-violet-500/10 bg-[#0f172a] p-4">

            <div className="flex items-center gap-2 text-cyan-400">

              <FiUser />

              <span className="text-sm font-medium">
                Student
              </span>

            </div>

            <p className="mt-2 text-sm text-white">
              {project.createdBy?.name ||
                "Unknown"}
            </p>

          </div>

        </div>

        {/* GRADE */}
        <div className="mt-6">

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">

            <FiAward className="text-violet-400" />

            Grade

          </label>

          <input
            value={grade}
            onChange={(e) =>
              setGrade(e.target.value)
            }
            placeholder="Enter project grade"
            className="w-full rounded-2xl border border-violet-500/10 bg-[#0f172a] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500"
          />

        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-7 flex flex-wrap justify-end gap-3">

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="rounded-2xl border border-violet-500/10 bg-[#0f172a] px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-violet-500/10"
          >
            Close
          </button>

          {/* REJECT */}
          <button
            onClick={() =>
              onReject(project._id)
            }
            className="flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >

            <FiXCircle />

            Reject

          </button>

          {/* APPROVE */}
          <button
            onClick={() =>
              onApprove(project._id)
            }
            className="flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500"
          >

            <FiCheckCircle />

            Approve

          </button>

          {/* SAVE GRADE */}
          <button
            onClick={() =>
              onGrade(project._id, grade)
            }
            className="flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
          >

            <FiSave />

            Save Grade

          </button>

        </div>

      </div>

    </div>
  );
}