import { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  BookOpen,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

const MyClasses = () => {
  const [activeTab, setActiveTab] =
    useState("ongoing");

  // DEMO DATA
  const classes = [
    {
      id: 1,
      title: "Advanced React Patterns",
      instructor: "Rahul Sharma",
      time: "10:00 AM",
      status: "ongoing",
    },
    {
      id: 2,
      title: "Database Systems",
      instructor: "Dr. Anita",
      time: "02:00 PM",
      status: "ongoing",
    },
    {
      id: 3,
      title: "System Design",
      instructor: "Vikram Singh",
      time: "Yesterday",
      status: "completed",
    },
  ];

  const filteredClasses = classes.filter(
    (c) => c.status === activeTab
  );

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-white">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-white">
            My Classes
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage your schedule and access materials
          </p>

        </div>

        {/* DATE */}
        <div className="flex items-center gap-2 rounded-2xl border border-violet-500/10 bg-[#111827] px-4 py-3 text-sm text-slate-300 shadow-lg">

          <Calendar size={18} className="text-violet-400" />

          Today Schedule

        </div>

      </div>

      {/* TABS */}
      <div className="mb-6 flex gap-4 border-b border-violet-500/10">

        {["ongoing", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-t-xl px-4 py-3 text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? "border-b-2 border-violet-500 text-violet-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab} Classes
          </button>
        ))}

      </div>

      {/* CLASSES */}
      <div className="grid gap-5">

        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <div
              key={cls.id}
              className="flex flex-col gap-5 rounded-3xl border border-violet-500/10 bg-[#111827] p-5 shadow-xl transition-all duration-300 hover:border-violet-500/30 hover:shadow-violet-900/20 md:flex-row md:items-center md:justify-between"
            >

              {/* LEFT */}
              <div className="flex items-center gap-4">

                {/* ICON */}
                <div
                  className={`rounded-2xl p-4 ${
                    cls.status === "ongoing"
                      ? "bg-violet-500/10 text-violet-400"
                      : "bg-green-500/10 text-green-400"
                  }`}
                >

                  {cls.status === "ongoing" ? (
                    <Video size={24} />
                  ) : (
                    <CheckCircle size={24} />
                  )}

                </div>

                {/* INFO */}
                <div>

                  <h3 className="text-lg font-semibold text-white">
                    {cls.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-400">

                    <span className="flex items-center gap-1">

                      <BookOpen
                        size={15}
                        className="text-violet-400"
                      />

                      {cls.instructor}

                    </span>

                    <span className="flex items-center gap-1">

                      <Clock
                        size={15}
                        className="text-violet-400"
                      />

                      {cls.time}

                    </span>

                  </div>

                </div>

              </div>

              {/* BUTTON */}
              <button
                className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${
                  cls.status === "ongoing"
                    ? "bg-violet-600 text-white hover:bg-violet-500"
                    : "bg-green-600 text-white hover:bg-green-500"
                }`}
              >

                {cls.status === "ongoing"
                  ? "Join Now"
                  : "View Materials"}

                <ChevronRight size={18} />

              </button>

            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-violet-500/10 bg-[#111827] py-16 text-center shadow-xl">

            <Calendar
              className="mx-auto mb-4 text-slate-500"
              size={40}
            />

            <p className="text-slate-400">
              No classes found in this category
            </p>

          </div>
        )}

      </div>

    </div>
  );
};

export default MyClasses;