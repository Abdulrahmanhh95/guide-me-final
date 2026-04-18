import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { api } from '../../api'
import StatCard from '../../components/StatCard'
import JoinSessionModal from '../../components/JoinSessionModal'
import CountdownBadge from '../../components/CountdownBadge'
import RecordingPlayerModal from '../../components/RecordingPlayerModal'

export default function DashboardPage() {
  const { user, t, lang } = useApp()
  const [bookings, setBookings] = useState([])
  const [activeBooking, setActiveBooking] = useState(null)
  const [recordingBooking, setRecordingBooking] = useState(null)

  useEffect(() => {
    api.getBookings(user.id, user.role).then(setBookings).catch(console.error)
  }, [user])

  const next = bookings[0]
  const progress = user.scholarshipStatus === 'scholarship'
    ? Math.min(100, Math.max(10, ((user.remainingSessions ?? 0) / 12) * 100))
    : 68

  return (
    <div className="grid gap-16">
      <section className="hero card reveal reveal-up cinematic-panel">
        <div className="hero-copy">
          <div className="eyebrow">{t.welcome}</div>
          <h2>{user.name}</h2>
          <p>
            {user.scholarshipStatus === 'scholarship'
              ? (lang === 'ar' ? `أنت مدعوم من ${user.sponsor}. بقي لديك ${user.remainingSessions ?? 0} جلسة، ويمكنك متابعة الحجز والمراجعة من نفس اللوحة.` : `You are supported by ${user.sponsor}. You still have ${user.remainingSessions ?? 0} sessions and can manage booking and follow-up from one elegant dashboard.`)
              : (lang === 'ar' ? 'هذا حساب طالب عادي مع تجربة حجز مرنة ولوحة متابعة أفخم لعرض المنصة بشكل احترافي.' : 'This is a regular student account with flexible booking and a richer premium dashboard for presenting the platform professionally.')}
          </p>
          <div className="badge-row">
            <div className="badge gold">✨ {lang === 'ar' ? 'Ultra Premium' : 'Ultra Premium'}</div>
            <div className="badge">📚 {user.track || '-'}</div>
            <div className="badge">🔔 {lang === 'ar' ? 'تنبيهات مفعلة' : 'Notifications on'}</div>
            <div className="badge">🌙 {lang === 'ar' ? 'دارك مود' : 'Dark mode'}</div>
          </div>
          <div className="ring-note">{lang === 'ar' ? 'جاهز للعرض على ممول أو مطور مباشرة' : 'Ready to show to a funder or developer immediately'}</div>
        </div>

        <div className="hero-side">
          <div className="flame pulse-float">🔥 7</div>
          <div className="floating-chip">⏳ {lang === 'ar' ? 'أقرب جلسة جاهزة' : 'Next session ready'}</div>
          {next ? <CountdownBadge date={next.sessionDate} time={next.sessionTime} compact smart /> : null}
          <div className="floating-chip">🎓 {user.scholarshipStatus === 'scholarship' ? t.scholarship : t.regular}</div>
          <div className="floating-chip">🎥 {lang === 'ar' ? 'تسجيلات محفوظة' : 'Saved recordings'}</div>
        </div>
      </section>

      <section className="stats-grid stagger-grid">
        <StatCard label={lang === 'ar' ? 'الجلسات المتبقية' : 'Remaining Sessions'} value={user.remainingSessions ?? 0} hint={lang === 'ar' ? 'رصيد المنحة' : 'Scholarship quota'} icon="🎫" />
        <StatCard label={lang === 'ar' ? 'الجلسات القادمة' : 'Upcoming'} value={bookings.length} hint={lang === 'ar' ? 'جلسات مجدولة' : 'Scheduled sessions'} icon="📅" />
        <StatCard label={lang === 'ar' ? 'المسار' : 'Track'} value={user.track || '-'} icon="🧭" />
      </section>

      <section className="dashboard-lux-grid stagger-grid">
        <div className="card promo-panel reveal reveal-up glow-on-hover">
          <div className="section-title">
            <div>
              <h3>{lang === 'ar' ? 'ملف الطالب' : 'Student Journey'}</h3>
              <div className="section-subtitle">{lang === 'ar' ? 'عرض مختصر لمستوى التقدم والانطباع العام' : 'A compact premium overview of progress and experience'}</div>
            </div>
          </div>
          <div className="lux-row" style={{ padding: 0, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <strong>{lang === 'ar' ? 'تقدمك الحالي' : 'Current progress'}</strong>
              <div className="progress-shell">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <div className="ring-note">{lang === 'ar' ? `${Math.round(progress)}% من المسار الحالي` : `${Math.round(progress)}% of the current path`}</div>
            </div>
          </div>
          <div className="mini-panel-list" style={{ marginTop: 8 }}>
            <div className="mini-line">
              <div>
                <strong>{lang === 'ar' ? 'أقرب أولوية' : 'Next priority'}</strong>
                <span>{lang === 'ar' ? 'مراجعة الرياضيات والانضمام للجلسة القادمة' : 'Review mathematics and join the next session'}</span>
              </div>
              <strong>01</strong>
            </div>
            <div className="mini-line">
              <div>
                <strong>{lang === 'ar' ? 'الوضع الحالي' : 'Current mode'}</strong>
                <span>{user.scholarshipStatus === 'scholarship' ? (lang === 'ar' ? 'طالب منحة مع جلسات متبقية' : 'Scholarship student with remaining sessions') : (lang === 'ar' ? 'طالب عادي بحجز مرن' : 'Regular student with flexible booking')}</span>
              </div>
              <strong>02</strong>
            </div>
            <div className="mini-line">
              <div>
                <strong>{lang === 'ar' ? 'التجربة' : 'Experience'}</strong>
                <span>{lang === 'ar' ? 'واجهة عرض قوية للموبايل والويب' : 'Strong visual experience for mobile and web'}</span>
              </div>
              <strong>03</strong>
            </div>
          </div>
        </div>

        <div className="card mini-panel reveal reveal-up delay-2 glow-on-hover">
          <div className="section-title">
            <div>
              <h3>{lang === 'ar' ? 'حالة الحساب' : 'Account Snapshot'}</h3>
              <div className="section-subtitle">{lang === 'ar' ? 'لمحة سريعة قابلة للعرض' : 'A fast presentable overview'}</div>
            </div>
          </div>
          <div className="mini-panel-list">
            <div className="mini-line">
              <div>
                <strong>{lang === 'ar' ? 'النوع' : 'Type'}</strong>
                <span>{user.scholarshipStatus === 'scholarship' ? t.scholarship : t.regular}</span>
              </div>
              <strong>🎓</strong>
            </div>
            <div className="mini-line">
              <div>
                <strong>{lang === 'ar' ? 'الراعي' : 'Sponsor'}</strong>
                <span>{user.sponsor || '-'}</span>
              </div>
              <strong>🤝</strong>
            </div>
            <div className="mini-line">
              <div>
                <strong>{lang === 'ar' ? 'اللغة' : 'Language'}</strong>
                <span>{lang === 'ar' ? 'العربية الافتراضية' : 'English active'}</span>
              </div>
              <strong>🌐</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="card section-card-pad reveal reveal-up delay-2 glow-on-hover">
        <div className="section-title">
          <div>
            <h3>{t.upcomingSessions}</h3>
            <div className="section-subtitle">{lang === 'ar' ? 'واجهة أفخم لأقرب نشاط دراسي' : 'A richer display for the nearest study activity'}</div>
          </div>
          <button className="soft-btn">{lang === 'ar' ? 'عرض المزيد' : 'View more'}</button>
        </div>
        {next ? (
          <div className="session-highlight" style={{ paddingInline: 0, paddingBottom: 0 }}>
            <div className="highlight-meta">
              <strong>{next.subject}</strong>
              <div>{next.sessionDate} — {next.sessionTime}</div>
              <div>{lang === 'ar' ? 'المدرس:' : 'Teacher:'} {next.teacher}</div>
              <div>{lang === 'ar' ? 'تم تجهيز زر الانضمام والعرض بشكل أقوى بصريًا.' : 'Join flow is now staged with a stronger visual presentation.'}</div>
              <CountdownBadge date={next.sessionDate} time={next.sessionTime} smart />
            </div>
            <div className="booking-actions vertical">
              <span className={`status ${next.status}`}>{next.status}</span>
              <button className="primary-btn" onClick={() => setActiveBooking(next)}>{lang === 'ar' ? 'انضم الآن' : 'Join now'}</button>
              <button className="ghost-btn small" onClick={() => setRecordingBooking(next)}>{lang === 'ar' ? 'مشاهدة التسجيلات' : 'View recordings'}</button>
            </div>
          </div>
        ) : (
          <div className="empty-state">{lang === 'ar' ? 'لا توجد جلسات قادمة بعد.' : 'No upcoming sessions yet.'}</div>
        )}
      </section>
      <JoinSessionModal booking={activeBooking} open={Boolean(activeBooking)} onClose={() => setActiveBooking(null)} />
      <RecordingPlayerModal booking={recordingBooking} open={Boolean(recordingBooking)} onClose={() => setRecordingBooking(null)} />
    </div>
  )
}
