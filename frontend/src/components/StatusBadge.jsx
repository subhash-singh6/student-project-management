import { getStatusStyle } from '../constants/status'

export default function StatusBadge({ status }) {
  const s = getStatusStyle(status)
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: '4px 12px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  )
}
