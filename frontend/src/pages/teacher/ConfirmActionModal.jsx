import {
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";

export default function ConfirmActionModal({
  open,
  title,
  message,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      {/* MODAL */}
      <div className="w-full max-w-md rounded-3xl border border-red-500/10 bg-[#111827] p-6 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-red-500/10 p-3">
              <FiAlertTriangle className="text-2xl text-red-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                {title}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Please confirm your action
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-[#0f172a] p-2 transition hover:bg-red-500/10"
          >
            <FiX className="text-lg text-slate-300" />
          </button>

        </div>

        {/* MESSAGE */}
        <div className="mt-5 rounded-2xl border border-red-500/10 bg-[#0f172a] p-4">

          <p className="text-sm leading-relaxed text-slate-300">
            {message}
          </p>

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
            onClick={onConfirm}
            className="rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Confirm
          </button>

        </div>

      </div>

    </div>
  );
}