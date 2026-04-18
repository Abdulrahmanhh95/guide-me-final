import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'

export default function RecordingPlayerModal({ booking, open, onClose }) {
  const { lang } = useApp()
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(38)

  const labels = useMemo(() => ({
    title: lang === 'ar' ? 'تسجيل الحصة' : 'Lesson recording',
    close: lang === 'ar' ? 'إغلاق' : 'Close',
    playback: lang === 'ar' ? 'تشغيل التسجيل' : 'Playback recording',
    saved: lang === 'ar' ? 'تم حفظ التسجيل على المنصة' : 'Recording saved on the platform',
    duration: lang === 'ar' ? 'المدة' : 'Duration',
    size: lang === 'ar' ? 'الحجم' : 'Size',
    quality: lang === 'ar' ? 'الجودة' : 'Quality',
    notes: lang === 'ar' ? 'ملخص سريع' : 'Quick summary',
    summary: lang === 'ar' ? 'مراجعة الشرح، النقاط المهمة، والرجوع للأسئلة المطلوبة قبل الجلسة القادمة.' : 'Review the explanation, the key points, and the required questions before the next session.',
    play: lang === 'ar' ? 'تشغيل' : 'Play',
    pause: lang === 'ar' ? 'إيقاف' : 'Pause',
    replay: lang === 'ar' ? 'إعادة من البداية' : 'Replay from start'
  }), [lang])

  if (!open || !booking) return null

  return (
    <div className="join-overlay" onClick={onClose}>
      <div className="recording-modal card" onClick={(e) => e.stopPropagation()}>
        <div className="join-header">
          <div>
            <div className="eyebrow">{labels.saved}</div>
            <h3>{labels.title}</h3>
            <p>{booking.subject} • {booking.teacher}</p>
          </div>
          <button className="ghost-btn small" onClick={onClose}>{labels.close}</button>
        </div>

        <div className="recording-stage meet-surface sweep-light">
          <div className="recording-topbar">
            <div className="live-badge">▶ PLAYBACK</div>
            <div className="connection-chip">HD • 1080p</div>
          </div>
          <div className="recording-screen">
            <div className="teacher-screen phase-live recording-screen-inner">
              <div className="teacher-glow" />
              <div className="teacher-avatar pulse-float">👨‍🏫</div>
              <div className="teacher-name">{booking.teacher}</div>
              <div className="teacher-board">
                <div className="board-line long" />
                <div className="board-line" />
                <div className="board-line short" />
              </div>
            </div>
          </div>
          <div className="recording-progress-wrap">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
            />
            <div className="recording-actions">
              <button className="ghost-btn small" onClick={() => setPlaying((v) => !v)}>{playing ? labels.pause : labels.play}</button>
              <button className="soft-btn small" onClick={() => { setProgress(0); setPlaying(false) }}>{labels.replay}</button>
            </div>
          </div>
        </div>

        <div className="recording-meta-grid">
          <div className="profile-item">
            <span>{labels.duration}</span>
            <strong>45 min</strong>
          </div>
          <div className="profile-item">
            <span>{labels.size}</span>
            <strong>486 MB</strong>
          </div>
          <div className="profile-item">
            <span>{labels.quality}</span>
            <strong>Full HD</strong>
          </div>
        </div>

        <div className="note-surface" style={{ marginTop: 16 }}>
          <strong>{labels.notes}</strong>
          <div style={{ marginTop: 8 }}>{booking.note || labels.summary}</div>
        </div>
      </div>
    </div>
  )
}
