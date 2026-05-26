import {
  FiFolder,
  FiClock,
  FiCheckCircle,
  FiAward,
} from "react-icons/fi";

export default function PerformanceStats({
  stats,
}) {
  const cards = [
    {
      title: "Total Projects",
      value: stats?.totalProjects || 0,
      icon: <FiFolder size={22} />,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
    },

    {
      title: "Pending Reviews",
      value: stats?.pendingReviews || 0,
      icon: <FiClock size={22} />,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
    },

    {
      title: "Approved",
      value: stats?.approvedProjects || 0,
      icon: <FiCheckCircle size={22} />,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
    },

    {
      title: "Graded",
      value: stats?.gradedProjects || 0,
      icon: <FiAward size={22} />,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

      {cards.map((card, index) => (
        <div
          key={index}
          className="rounded-3xl border border-violet-500/10 bg-[#111827] p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30"
        >

          {/* HEADER */}
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                {card.title}
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {card.value}
              </h2>
            </div>

            <div
              className={`rounded-2xl p-3 ${card.iconBg}`}
            >
              <div className={card.iconColor}>
                {card.icon}
              </div>
            </div>

          </div>

        </div>
      ))}

    </div>
  );
}