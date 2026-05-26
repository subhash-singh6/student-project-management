import { useState } from "react";
import {
  FiUsers,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";

export default function AttendancePanel({
  open,
  students = [],
  onClose,
  onSave,
}) {
  const [attendance, setAttendance] = useState({});

  if (!open) return null;

  const toggle = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      {/* MODAL */}
      <div className="w-full max-w-2xl rounded-3xl border border-violet-500/10 bg-[#111827] p-6 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-violet-500/10 p-3">
              <FiUsers className="text-2xl text-violet-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Mark Attendance
              </h2>

              <p className="text-sm text-slate-400">
                Manage student attendance
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

        {/* STUDENTS LIST */}
        <div className="mt-6 max-h-[400px] space-y-3 overflow-y-auto pr-1">

          {students.length === 0 ? (
            <div className="rounded-2xl bg-[#0f172a] p-5 text-center text-slate-400">
              No students found
            </div>
          ) : (
            students.map((s) => (
              <div
                key={s._id}
                className="flex items-center justify-between rounded-2xl border border-violet-500/10 bg-[#0f172a] p-4"
              >

                {/* STUDENT INFO */}
                <div>

                  <h3 className="font-medium text-white">
                    {s.name}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {s.email}
                  </p>

                </div>

                {/* ATTENDANCE BUTTON */}
                <button
                  onClick={() => toggle(s._id)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
                    attendance[s._id]
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-slate-600 hover:bg-slate-500"
                  }`}
                >
                  {attendance[s._id]
                    ? "Present"
                    : "Absent"}
                </button>

              </div>
            ))
          )}

        </div>

        {/* FOOTER */}
        <div className="mt-7 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-2xl border border-violet-500/10 bg-[#0f172a] px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-violet-500/10"
          >
            Close
          </button>

          <button
            onClick={() => onSave(attendance)}
            className="flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
          >

            <FiCheckCircle />

            Save Attendance

          </button>

        </div>

      </div>

    </div>
  );
}