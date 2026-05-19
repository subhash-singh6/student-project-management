export default function PageLoader({ label = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center gap-4">
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div
        className="w-12 h-12 rounded-full border-[3px] border-indigo-500/20 border-t-indigo-500"
        style={{ animation: 'spin 1s linear infinite' }}
      />
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  )
}
