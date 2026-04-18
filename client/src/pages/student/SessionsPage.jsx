import { useEffect, useState } from 'react'
import { api } from '../../api'
import { useApp } from '../../context/AppContext'
import JoinSessionModal from '../../components/JoinSessionModal'
import RecordingPlayerModal from '../../components/RecordingPlayerModal'
import CountdownBadge from '../../components/CountdownBadge'

export default function SessionsPage() {
  const { user, lang } = useApp()
  const [bookings, setBookings] = useState([])
  const [activeBooking, setActiveBooking] = useState(null)
  const [recordingBooking, setRecordingBooking] = useState(null)

  async function load() {
    const data = await api.getBookings(user.id, user.role)
    setBookings(data)
  }

  useEffect(() => {
    load().catch(console.error)
  }, [user])

  return (
    <div className="grid gap-16 stagger-grid">
      {bookings.map((booking) => (
        <div className="card booking-card reveal reveal-up glow-on-hover" key={booking.id}>
          <div className="booking-main">
            <strong>{booking.subject}</strong>
            <div className="booking-meta">
              <div>{booking.sessionDate} — {booking.sessionTime}</div>
              <div>{lang === 'ar' ? 'المدرس:' : 'Teacher:'} {booking.teacher}</div>
              <div>{booking.note || (lang === 'ar' ? 'لا يوجد ملاحظات' : 'No note provided')}</div>
              <CountdownBadge date={booking.sessionDate} time={booking.sessionTime} compact />
            </div>
          </div>
          <div className="booking-actions vertical">
            <span className={`status ${booking.status}`}>{booking.status}</span>
            <button className="primary-btn small" onClick={() => setActiveBooking(booking)}>{lang === 'ar' ? 'انضم الآن' : 'Join now'}</button>
            <button className="ghost-btn small" onClick={() => setRecordingBooking(booking)}>{lang === 'ar' ? 'عرض التسجيل' : 'View recording'}</button>
          </div>
        </div>
      ))}
      {bookings.length === 0 ? <div className="card empty-state reveal reveal-up">{lang === 'ar' ? 'لا توجد جلسات حالياً.' : 'No sessions found.'}</div> : null}
      <JoinSessionModal booking={activeBooking} open={Boolean(activeBooking)} onClose={() => setActiveBooking(null)} />
      <RecordingPlayerModal booking={recordingBooking} open={Boolean(recordingBooking)} onClose={() => setRecordingBooking(null)} />
    </div>
  )
}
