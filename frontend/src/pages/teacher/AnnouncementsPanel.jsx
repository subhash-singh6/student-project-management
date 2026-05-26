import { useState } from "react";

import {
  FiBell,
  FiEdit3,
  FiMessageSquare,
  FiSend,
  FiX,
} from "react-icons/fi";

export default function AnnouncementsPanel({
  open,
  onClose,
  onPost,
}) {
  const [form, setForm] = useState({
    title: "",
    message: "",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      {/* MODAL */}
      <div className="w-full max-w-xl rounded-3xl border border-violet-500/10 bg-[#111827] p-6 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-violet-500/10 p-3">
              <FiBell className="text-2xl text-violet-400" />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-white">
                New Announcement
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Share updates with students
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

        {/* TITLE */}
        <div className="mt-6">

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">

            <FiEdit3 className="text-violet-400" />

            Announcement Title

          </label>

          <input
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            placeholder="Enter announcement title"
            className="w-full rounded-2xl border border-violet-500/10 bg-[#0f172a] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500"
          />

        </div>

        {/* MESSAGE */}
        <div className="mt-5">

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">

            <FiMessageSquare className="text-violet-400" />

            Announcement Message

          </label>

          <textarea
            value={form.message}
            onChange={(e) =>
              setForm({
                ...form,
                message: e.target.value,
              })
            }
            rows={5}
            placeholder="Write your announcement..."
            className="w-full resize-none rounded-2xl border border-violet-500/10 bg-[#0f172a] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500"
          />

        </div>

        {/* BUTTONS */}
        <div className="mt-7 flex justify-end gap-3">

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="rounded-2xl border border-violet-500/10 bg-[#0f172a] px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-violet-500/10"
          >
            Close
          </button>

          {/* POST */}
          <button
            onClick={() => onPost(form)}
            className="flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
          >

            <FiSend />

            Post Announcement

          </button>

        </div>

      </div>

    </div>
  );
}