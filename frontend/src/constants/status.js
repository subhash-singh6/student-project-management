export const PROJECT_STATUS = {
  pending:       { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  label: '⏳ Pending' },
  approved:      { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  label: '✅ Approved' },
  'in-progress': { color: '#818cf8', bg: 'rgba(129,140,248,0.12)', label: '🔄 In Progress' },
  completed:     { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)',  label: '🏆 Completed' },
  rejected:      { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: '❌ Rejected' },
}

export const getStatusStyle = (status) =>
  PROJECT_STATUS[status] || PROJECT_STATUS.pending
