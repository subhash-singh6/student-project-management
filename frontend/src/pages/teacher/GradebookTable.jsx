import { useState } from "react";
import {
  FiBookOpen,
  FiSave,
  FiUser,
} from "react-icons/fi";

export default function GradebookTable({
  students = [],
  onSave,
}) {
  const [marks, setMarks] = useState({});

  const change = (id, val) => {
    setMarks((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  return (
    <div className="rounded-3xl border border-violet-500/10 bg-[#111827] p-5 shadow-xl">

      {/* HEADER */}
      <div className="flex items-center gap-3">

        <div className="rounded-2xl bg-violet-500/10 p-3">
          <FiBookOpen className="text-2xl text-violet-400" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white">
            Gradebook
          </h2>

          <p className="text-sm text-slate-400">
            Manage and save student grades
          </p>
        </div>

      </div>

      {/* STUDENTS */}
      <div className="mt-6 space-y-4">

        {students.length === 0 ? (
          <div className="rounded-2xl bg-[#0f172a] p-5 text-center text-slate-400">
            No students available
          </div>
        ) : (
          students.map((s) => (
            <div
              key={s._id}
              className="flex flex-col gap-3 rounded-2xl border border-violet-500/10 bg-[#0f172a] p-4 md:flex-row md:items-center"
            >

              {/* STUDENT INFO */}
              <div className="flex items-center gap-3 md:w-56">

                <div className="rounded-xl bg-violet-500/10 p-2">
                  <FiUser className="text-violet-400" />
                </div>

                <div>
                  <h3 className="font-medium text-white">
                    {s.name}
                  </h3>

                  <p className="text-xs text-slate-400">
                    Student
                  </p>
                </div>

              </div>

              {/* INPUT */}
              <input
                type="number"
                value={marks[s._id] || ""}
                onChange={(e) =>
                  change(s._id, e.target.value)
                }
                placeholder="Enter marks"
                className="flex-1 rounded-2xl border border-violet-500/10 bg-[#111827] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500"
              />

            </div>
          ))
        )}

      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={() => onSave(marks)}
        className="mt-6 flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
      >

        <FiSave />

        Save Grades

      </button>

    </div>
  );
}