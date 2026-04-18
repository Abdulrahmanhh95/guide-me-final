export default function StatCard({ label, value, hint, icon = '✦' }) {
  return (
    <div className="card stat-card reveal reveal-up glow-on-hover">
      <div className="stat-top">
        <div className="stat-label">{label}</div>
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      {hint ? <div className="stat-hint">{hint}</div> : null}
    </div>
  )
}
