import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api'
import { useApp } from '../../context/AppContext'
import RecordingPlayerModal from '../../components/RecordingPlayerModal'

export default function RecordedLessonsPage() {
  const { user, lang } = useApp()
  const [bookings, setBookings] = useState([])
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [recordingBooking, setRecordingBooking] = useState(null)

  useEffect(() => {
    api.getBookings(user.id, user.role).then(setBookings).catch(console.error)
  }, [user])

  const subjects = useMemo(() => {
    return ['all', ...new Set(bookings.map((b) => b.subject).filter(Boolean))]
  }, [bookings])

  const recordings = useMemo(() => {
    return bookings
      .filter((b) => ['teacher_approved', 'admin_approved'].includes(b.status))
      .filter((b) => subjectFilter === 'all' || b.subject === subjectFilter)
      .map((b, index) => ({
        ...b,
        duration: index % 2 === 0 ? '45 min' : '52 min',
        size: index % 2 === 0 ? '486 MB' : '532 MB',
        watched: Math.min(100, 35 + index * 18)
      }))
  }, [bookings, subjectFilter])

  return (
    <div className="grid gap-16">
      <section className="card section-card-pad reveal reveal-up glow-on-hover">
        <div className="section-title">
          <div>
            <h3>{lang === 'ar' ? 'الدروس المسجلة' : 'Recorded Lessons'}</h3>
            <div className="section-subtitle">
              {lang === 'ar'
                ? 'مكتبة مستقلة للحصص المسجلة بأسلوب قريب من منصات التعلم الحديثة.'
                : 'A standalone library for saved lessons in a modern learning-platform style.'}
            </div>
          </div>
          <select className="recorded-filter" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject === 'all' ? (lang === 'ar' ? 'كل المواد' : 'All subjects') : subject}
              </option>
            ))}
          </select>
        </div>

        <div className="recorded-hero">
          <div className="recorded-hero-copy">
            <div className="eyebrow">{lang === 'ar' ? 'مكتبة المحتوى' : 'Content library'}</div>
            <h2>{lang === 'ar' ? 'ارجع لأي شرح في أي وقت' : 'Return to any lesson anytime'}</h2>
            <p>
              {lang === 'ar'
                ? 'تشغيل أنيق، ملخص سريع، وتقدّم مشاهدة واضح حتى تكون التجربة أقرب لكورسات حقيقية داخل GUIDE ME.'
                : 'Elegant playback, quick summaries, and visible watch progress so the experience feels closer to real premium course libraries inside GUIDE ME.'}
            </p>
          </div>
          <div className="recorded-hero-stats">
            <div className="metric-pill">
              <strong>{recordings.length}</strong>
              <span>{lang === 'ar' ? 'تسجيلات متاحة' : 'Available recordings'}</span>
            </div>
            <div className="metric-pill gold">
              <strong>HD</strong>
              <span>{lang === 'ar' ? 'جودة تشغيل' : 'Playback quality'}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="recorded-grid stagger-grid">
        {recordings.length ? recordings.map((recording) => (
          <article className="card recorded-card reveal reveal-up glow-on-hover" key={`rec-${recording.id}`}>
            <div className="recorded-thumb meet-surface sweep-light">
              <div className="recorded-badge">▶ {lang === 'ar' ? 'تسجيل' : 'Recording'}</div>
              <div className="recorded-teacher">👨‍🏫 {recording.teacher}</div>
              <div className="recorded-subject">{recording.subject}</div>
            </div>
            <div className="recorded-content">
              <div className="recorded-meta-row">
                <strong>{recording.subject}</strong>
                <span className={`status ${recording.status}`}>{recording.status}</span>
              </div>
              <div className="recorded-subline">{recording.sessionDate} • {recording.sessionTime}</div>
              <div className="recorded-info-grid">
                <div><span>{lang === 'ar' ? 'المدة' : 'Duration'}</span><strong>{recording.duration}</strong></div>
                <div><span>{lang === 'ar' ? 'الحجم' : 'Size'}</span><strong>{recording.size}</strong></div>
              </div>
              <div className="watch-progress-wrap">
                <div className="watch-progress-head">
                  <span>{lang === 'ar' ? 'التقدم بالمشاهدة' : 'Watch progress'}</span>
                  <strong>{recording.watched}%</strong>
                </div>
                <div className="progress-shell compact">
                  <div className="progress-bar gold" style={{ width: `${recording.watched}%` }} />
                </div>
              </div>
              <div className="booking-actions">
                <button className="primary-btn" onClick={() => setRecordingBooking(recording)}>
                  {lang === 'ar' ? 'تشغيل التسجيل' : 'Play recording'}
                </button>
                <button className="ghost-btn">{lang === 'ar' ? 'عرض الملخص' : 'View summary'}</button>
              </div>
            </div>
          </article>
        )) : (
          <div className="card empty-state reveal reveal-up">
            {lang === 'ar' ? 'لا توجد تسجيلات مطابقة بعد.' : 'No matching recordings yet.'}
          </div>
        )}
      </section>

      <RecordingPlayerModal booking={recordingBooking} open={Boolean(recordingBooking)} onClose={() => setRecordingBooking(null)} />
    </div>
  )
}
