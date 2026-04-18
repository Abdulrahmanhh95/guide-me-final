import { useApp } from '../context/AppContext'

const items = [
  { key: 'dashboard', icon: '🏠' },
  { key: 'booking', icon: '📘' },
  { key: 'sessions', icon: '📅' },
  { key: 'recordings', icon: '🎥' },
  { key: 'account', icon: '👤' }
]

export default function BottomNav({ active, onChange }) {
  const { t } = useApp()

  return (
    <nav className="bottom-nav card reveal reveal-up delay-3">
      {items.map((item) => (
        <button
          key={item.key}
          className={`nav-item ${active === item.key ? 'active' : ''}`}
          onClick={() => onChange(item.key)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{t[item.key]}</span>
        </button>
      ))}
    </nav>
  )
}
