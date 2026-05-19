export default function EmptyState({ icon = '📭', title, description, actionLabel, onAction }) {
  return (
    <div className="text-center py-16 px-6 rounded-2xl border border-white/10 bg-slate-900/50">
      <div className="text-5xl opacity-30 mb-4">{icon}</div>
      <h3 className="text-slate-100 font-semibold text-lg mb-2">{title}</h3>
      {description && <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">{description}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="bg-gradient-to-r from-indigo-500 to-cyan-400 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
