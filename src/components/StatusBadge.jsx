const statusConfig = {
  AVAILABLE: { label: 'Tersedia', tone: 'success' },
  SOLD_OUT: { label: 'Habis', tone: 'danger' },
  
  NEW: { label: 'Baru', tone: 'info' },
  PREPARING: { label: 'Diproses', tone: 'warning' },
  READY: { label: 'Siap', tone: 'success' },
  DONE: { label: 'Selesai', tone: 'success' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status?.replaceAll('_', ' ') ?? 'Unknown',
    tone: 'neutral',
  };

  return <span className={`status-badge ${config.tone}`}>{config.label}</span>;
}