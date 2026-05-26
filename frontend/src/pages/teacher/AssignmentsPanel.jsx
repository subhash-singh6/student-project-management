import { useState } from "react";
import {
  FiBookOpen,
  FiCalendar,
  FiFileText,
  FiX,
} from "react-icons/fi";

export default function AssignmentsPanel({
  open,
  onClose,
  onCreate,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      {/* MODAL */}
      <div className="w-full max-w-xl rounded-3xl border border-violet-500/10 bg-[#111827] p-6 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-violet-500/10 p-3">
              <FiBookOpen className="text-2xl text-violet-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Create Assignment
              </h2>

              <p className="text-sm text-slate-400">
                Add new assignment details
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-[#0f172a] p-2 transition hover:bg-violet-500/10"
          >
            <FiX className="text-lg text-slate-300" />
          </button>

        </div>

        {/* TITLE */}
        <div className="mt-6">

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">

            <FiBookOpen className="text-violet-400" />

            Assignment Title

          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter assignment title"
            className="w-full rounded-2xl border border-violet-500/10 bg-[#0f172a] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500"
          />

        </div>

        {/* DESCRIPTION */}
        <div className="mt-5">

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">

            <FiFileText className="text-violet-400" />

            Description

          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter assignment description"
            className="w-full resize-none rounded-2xl border border-violet-500/10 bg-[#0f172a] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500"
          />

        </div>

        {/* DATE */}
        <div className="mt-5">

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">

            <FiCalendar className="text-violet-400" />

            Due Date

          </label>

          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full rounded-2xl border border-violet-500/10 bg-[#0f172a] px-4 py-3 text-white outline-none transition focus:border-violet-500"
          />

        </div>

        {/* BUTTONS */}
        <div className="mt-7 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-2xl border border-violet-500/10 bg-[#0f172a] px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-violet-500/10"
          >
            Cancel
          </button>

          <button
            onClick={() => onCreate(form)}
            className="rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            Create Assignment
          </button>

        </div>

      </div>

    </div>
  );
}