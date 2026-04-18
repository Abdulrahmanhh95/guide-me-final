import { useApp } from '../context/AppContext'

export default function Header({ title }) {
  const { dark, setDark, lang, setLang, user, setUser, t } = useApp()

  return (
    <header className="topbar card reveal reveal-down">
      <div className="brand-wrap slide-inline">
        <div className="brand">GUIDE ME</div>
        <div className="brand-sub">Ultra Premium Learning Platform</div>
        <div className="page-title">{title}</div>
      </div>

      <div className="header-actions slide-inline delay-2">
        <div className="icon-chip">🔥 <strong>7</strong></div>
        <div className="icon-chip">✨ {lang === 'ar' ? 'نسخة فاخرة' : 'Luxury Mode'}</div>
        <button className="ghost-btn" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>
          {lang === 'ar' ? 'EN' : 'AR'}
        </button>
        <button className="ghost-btn" onClick={() => setDark(!dark)}>
          {dark ? '☀️' : '🌙'}
        </button>
        <div className="icon-chip">🔔</div>
        <div className="icon-chip">{user.role === 'admin' ? '🛡️ Admin' : user.role === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student'}</div>
        <div className="user-badge">
          <strong>{user.name}</strong>
          <span>{user.scholarshipStatus === 'scholarship' ? t.scholarship : t.regular}</span>
        </div>
        <button className="ghost-btn danger" onClick={() => setUser(null)}>{t.logout}</button>
      </div>
    </header>
  )
}
