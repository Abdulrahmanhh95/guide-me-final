import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import CountdownBadge from './CountdownBadge'

const stepKeys = ['connect', 'audio', 'teacher', 'live']

export default function JoinSessionModal({ booking, open, onClose }) {
  const { lang } = useApp()
  const [phase, setPhase] = useState(0)
  const [mic, setMic] = useState(true)
  const [cam, setCam] = useState(false)
  const [captions, setCaptions] = useState(true)

  useEffect(() => {
    if (!open) return
    setPhase(0)
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1750),
      setTimeout(() => setPhase(3), 2850)
    ]
    return () => timers.forEach(clearTimeout)
  }, [open, booking?.id])

  const labels = useMemo(() => ({
    title: lang === 'ar' ? 'الانضمام إلى الجلسة' : 'Join session',
    connecting: lang === 'ar' ? 'جاري تجهيز الاتصال الآمن' : 'Preparing a secure connection',
    checking: lang === 'ar' ? 'فحص الصوت والصورة' : 'Checking audio and camera',
    waiting: lang === 'ar' ? 'بانتظار ظهور المدرس' : 'Waiting for the teacher',
    live: lang === 'ar' ? 'الجلسة أصبحت مباشرة' : 'Session is now live',
    close: lang === 'ar' ? 'إغلاق' : 'Close',
    leave: lang === 'ar' ? 'مغادرة الجلسة' : 'Leave session',
    joinNow: lang === 'ar' ? 'انضم الآن' : 'Join now',
    liveClass: lang === 'ar' ? 'فصل مباشر' : 'Live class',
    yourPreview: lang === 'ar' ? 'معاينتك' : 'Your preview',
    teacher: lang === 'ar' ? 'المدرس' : 'Teacher',
    lessonFlow: lang === 'ar' ? 'سير الجلسة' : 'Session flow',
    quality: lang === 'ar' ? 'جودة الاتصال ممتازة' : 'Connection quality is excellent',
    mic: lang === 'ar' ? 'المايك' : 'Mic',
    camera: lang === 'ar' ? 'الكاميرا' : 'Camera',
    captions: lang === 'ar' ? 'الترجمة' : 'Captions',
    notes: lang === 'ar' ? 'ملاحظات الجلسة' : 'Session notes',
    noteText: lang === 'ar' ? 'ابدأ بمراجعة السؤال المطلوب ثم تابع مع المدرس خطوة بخطوة.' : 'Start by reviewing the requested question, then continue with the teacher step by step.',
    recording: lang === 'ar' ? 'التسجيل قيد الحفظ تلقائيًا' : 'Recording is being saved automatically',
    focus: lang === 'ar' ? 'وضع التركيز مفعّل' : 'Focus mode enabled',
    meetStyle: lang === 'ar' ? 'واجهة مباشرة بأسلوب قريب من Google Meet' : 'Live room in a Google Meet-like style',
    participation: lang === 'ar' ? 'الحضور والتقدم' : 'Attendance & progress',
    present: lang === 'ar' ? 'تم تسجيل حضورك' : 'Attendance marked',
    progress: lang === 'ar' ? 'التقدم داخل الجلسة' : 'In-session progress',
    participationHint: lang === 'ar' ? 'تم تفعيل الحضور، التفاعل، والمتابعة الحية.' : 'Attendance, interaction, and live follow-up are active.'
  }), [lang])

  const steps = [
    { title: labels.connecting, hint: lang === 'ar' ? 'ربط سريع وآمن قبل بدء الحصة.' : 'Fast and secure room setup before class starts.' },
    { title: labels.checking, hint: lang === 'ar' ? 'اختبار المايك والسماعات ومعاينة الكاميرا.' : 'Testing microphone, speakers, and camera preview.' },
    { title: labels.waiting, hint: lang === 'ar' ? 'يتم إدخال المدرس وتجهيز السبورة.' : 'Bringing in the teacher and preparing the board.' },
    { title: labels.live, hint: lang === 'ar' ? 'يمكنك الآن البدء والمشاركة.' : 'You can now begin and participate.' }
  ]

  if (!open || !booking) return null

  return (
    <div className="join-overlay" onClick={onClose}>
      <div className="join-modal card" onClick={(e) => e.stopPropagation()}>
        <div className="join-header">
          <div>
            <div className="eyebrow">{labels.liveClass}</div>
            <h3>{labels.title}</h3>
            <p>{booking.subject} • {booking.sessionDate} • {booking.sessionTime}</p>
            <CountdownBadge date={booking.sessionDate} time={booking.sessionTime} compact />
          </div>
          <button className="ghost-btn small" onClick={onClose}>{labels.close}</button>
        </div>

        <div className="join-body">
          <div className="join-stage sweep-light meet-surface">
            <div className="session-stage-top">
              <div className="live-badge">● LIVE</div>
              <div className="connection-chip">{labels.quality}</div>
              <div className="connection-chip subtle">{labels.meetStyle}</div>
            </div>

            <div className={`teacher-screen phase-${stepKeys[phase]}`}>
              <div className="teacher-glow" />
              <div className="teacher-avatar pulse-float">👨‍🏫</div>
              <div className="teacher-name">{labels.teacher}: {booking.teacher}</div>
              <div className="teacher-board">
                <div className="board-line long" />
                <div className="board-line" />
                <div className="board-line short" />
              </div>
            </div>

            <div className="self-preview card">
              <div className="preview-label">{labels.yourPreview}</div>
              <div className="preview-avatar">🧑‍🎓</div>
              <div className="preview-meters">
                <span className={mic ? 'active' : ''}>🎤</span>
                <span className={cam ? 'active' : ''}>📷</span>
                <span className={captions ? 'active' : ''}>💬</span>
              </div>
            </div>

            <div className="session-controls">
              <button className={`control-dot ${mic ? 'on' : ''}`} onClick={() => setMic((v) => !v)}>🎤</button>
              <button className={`control-dot ${cam ? 'on' : ''}`} onClick={() => setCam((v) => !v)}>📷</button>
              <button className={`control-dot ${captions ? 'on' : ''}`} onClick={() => setCaptions((v) => !v)}>💬</button>
              <button className="control-dot leave" onClick={onClose}>⏹</button>
            </div>
          </div>

          <div className="join-sidebar">
            <div className="card join-progress-card">
              <div className="section-title compact">
                <div>
                  <h4>{labels.lessonFlow}</h4>
                  <div className="section-subtitle">{labels.focus}</div>
                </div>
              </div>
              <div className="join-steps">
                {steps.map((step, index) => (
                  <div key={step.title} className={`join-step ${index <= phase ? 'done' : ''} ${index === phase ? 'current' : ''}`}>
                    <div className="step-dot">{index < phase ? '✓' : index + 1}</div>
                    <div>
                      <strong>{step.title}</strong>
                      <span>{step.hint}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card join-notes-card">
              <div className="section-title compact">
                <div>
                  <h4>{labels.notes}</h4>
                  <div className="section-subtitle">{labels.recording}</div>
                </div>
              </div>
              <div className="note-surface">{booking.note || labels.noteText}</div>
              <div className="join-mini-grid">
                <div className={`tiny-indicator ${mic ? 'on' : ''}`}>{labels.mic}</div>
                <div className={`tiny-indicator ${cam ? 'on' : ''}`}>{labels.camera}</div>
                <div className={`tiny-indicator ${captions ? 'on' : ''}`}>{labels.captions}</div>
              </div>
              <div className="session-participation">
                <div className="section-title compact">
                  <div>
                    <h4>{labels.participation}</h4>
                    <div className="section-subtitle">{labels.participationHint}</div>
                  </div>
                </div>
                <div className="attendance-chip">✅ {labels.present}</div>
                <div className="watch-progress-wrap in-session">
                  <div className="watch-progress-head">
                    <span>{labels.progress}</span>
                    <strong>{phase === 3 ? '82%' : phase === 2 ? '56%' : phase === 1 ? '28%' : '10%'}</strong>
                  </div>
                  <div className="progress-shell compact">
                    <div className="progress-bar" style={{ width: phase === 3 ? '82%' : phase === 2 ? '56%' : phase === 1 ? '28%' : '10%' }} />
                  </div>
                </div>
              </div>
              <button className="primary-btn">{phase === 3 ? labels.leave : labels.joinNow}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
