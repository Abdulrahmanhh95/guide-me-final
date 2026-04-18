import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import { useApp } from '../context/AppContext'

const API = 'http://localhost:5000/api/teacher'

function StatCard({ title, value, sub }) {
  return (
    <div className="card glow-on-hover">
      <div className="muted-label">{title}</div>
      <div className="metric-value">{value}</div>
      {sub ? <div className="muted-copy">{sub}</div> : null}
    </div>
  )
}

export default function TeacherPage() {
  const { user, lang } = useApp()
  const [summary, setSummary] = useState(null)
  const [bookings, setBookings] = useState([])
  const [availability, setAvailability] = useState([])
  const [tab, setTab] = useState('dashboard')
  const [slotForm, setSlotForm] = useState({ day: '', from: '', to: '' })

  async function load() {
    const [summaryRes, bookingsRes, availabilityRes] = await Promise.all([
      fetch(`${API}/summary/${user.id}`).then(r => r.json()),
      fetch(`${API}/bookings/${user.id}`).then(r => r.json()),
      fetch(`${API}/availability/${user.id}`).then(r => r.json())
    ])
    setSummary(summaryRes)
    setBookings(bookingsRes)
    setAvailability(availabilityRes)
  }

  useEffect(() => {
    load().catch(console.error)
  }, [user.id])

  const pending = useMemo(() => bookings.filter((b) => b.status === 'pending'), [bookings])

  async function approve(id) {
    await fetch(`${API}/bookings/${id}/approve`, { method: 'PATCH' })
    await load()
  }

  async function reject(id) {
    const reason = window.prompt(lang === 'ar' ? 'سبب الرفض' : 'Rejection reason', 'Rejected by teacher') || 'Rejected by teacher'
    await fetch(`${API}/bookings/${id}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    })
    await load()
  }

  async function addSlot() {
    if (!slotForm.day || !slotForm.from || !slotForm.to) return
    await fetch(`${API}/availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherId: user.id, ...slotForm })
    })
    setSlotForm({ day: '', from: '', to: '' })
    await load()
  }

  async function deleteSlot(slotId) {
    await fetch(`${API}/availability/${user.id}/${slotId}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div className="app-shell">
      <Header title={lang === 'ar' ? 'لوحة المعلم' : 'Teacher Panel'} />
      <main className="page-area grid gap-16">
        <section className="hero card reveal reveal-up cinematic-panel">
          <div className="hero-copy">
            <div className="eyebrow">{lang === 'ar' ? 'إدارة المعلم' : 'Teacher control'}</div>
            <h2>{user.name}</h2>
            <p>{lang === 'ar' ? 'قبول الطلبات، متابعة الجلسات، وتنظيم الأوقات المتاحة من واجهة واحدة.' : 'Approve requests, track sessions, and manage your available slots from one place.'}</p>
            <div className="pill-row">
              {['dashboard', 'requests', 'sessions', 'availability'].map((item) => (
                <button key={item} className={`ghost-btn ${tab === item ? 'active-tab' : ''}`} onClick={() => setTab(item)}>
                  {item === 'dashboard' ? (lang === 'ar' ? 'لوحة التحكم' : 'Dashboard') :
                   item === 'requests' ? (lang === 'ar' ? 'طلبات الحجز' : 'Requests') :
                   item === 'sessions' ? (lang === 'ar' ? 'الجلسات' : 'Sessions') :
                   (lang === 'ar' ? 'الأوقات المتاحة' : 'Availability')}
                </button>
              ))}
            </div>
          </div>
        </section>

        {tab === 'dashboard' && summary ? (
          <>
            <section className="stats-grid">
              <StatCard title={lang === 'ar' ? 'إجمالي الجلسات' : 'Total sessions'} value={summary.totalSessions} />
              <StatCard title={lang === 'ar' ? 'طلبات جديدة' : 'New requests'} value={summary.pending} />
              <StatCard title={lang === 'ar' ? 'بانتظار الأدمن' : 'Waiting for admin'} value={summary.approvedByTeacher} />
              <StatCard title={lang === 'ar' ? 'مثبتة نهائيًا' : 'Final approved'} value={summary.approvedFinal} sub={`${lang === 'ar' ? 'ملغاة' : 'Cancelled'}: ${summary.cancelled}`} />
            </section>

            <section className="card reveal reveal-up">
              <h3>{lang === 'ar' ? 'الطلبات العاجلة' : 'Urgent requests'}</h3>
              <div className="grid gap-12">
                {pending.length === 0 ? <div className="muted-copy">{lang === 'ar' ? 'لا توجد طلبات جديدة' : 'No new requests'}</div> : pending.map((booking) => (
                  <div key={booking.id} className="booking-card card glow-on-hover">
                    <div className="booking-main">
                      <strong>{booking.subject}</strong>
                      <div className="booking-meta">
                        <div>{lang === 'ar' ? 'الطالب:' : 'Student:'} {booking.student}</div>
                        <div>{booking.sessionDate} — {booking.sessionTime}</div>
                        {booking.note ? <div>{booking.note}</div> : null}
                      </div>
                    </div>
                    <div className="booking-actions vertical">
                      <button className="primary-btn small" onClick={() => approve(booking.id)}>{lang === 'ar' ? 'قبول' : 'Approve'}</button>
                      <button className="ghost-btn small danger" onClick={() => reject(booking.id)}>{lang === 'ar' ? 'رفض' : 'Reject'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {tab === 'requests' ? (
          <section className="grid gap-12">
            {pending.map((booking) => (
              <div key={booking.id} className="booking-card card glow-on-hover">
                <div className="booking-main">
                  <strong>{booking.subject}</strong>
                  <div className="booking-meta">
                    <div>{lang === 'ar' ? 'الطالب:' : 'Student:'} {booking.student}</div>
                    <div>{booking.sessionDate} — {booking.sessionTime}</div>
                  </div>
                </div>
                <div className="booking-actions vertical">
                  <button className="primary-btn small" onClick={() => approve(booking.id)}>{lang === 'ar' ? 'قبول' : 'Approve'}</button>
                  <button className="ghost-btn small danger" onClick={() => reject(booking.id)}>{lang === 'ar' ? 'رفض' : 'Reject'}</button>
                </div>
              </div>
            ))}
          </section>
        ) : null}

        {tab === 'sessions' ? (
          <section className="grid gap-12">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card card glow-on-hover">
                <div className="booking-main">
                  <strong>{booking.subject}</strong>
                  <div className="booking-meta">
                    <div>{lang === 'ar' ? 'الطالب:' : 'Student:'} {booking.student}</div>
                    <div>{booking.sessionDate} — {booking.sessionTime}</div>
                    <div className={`status ${booking.status}`}>{booking.status}</div>
                    {booking.cancelReason ? <div>{booking.cancelReason}</div> : null}
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : null}

        {tab === 'availability' ? (
          <section className="grid two-col gap-16">
            <div className="card reveal reveal-up">
              <h3>{lang === 'ar' ? 'إضافة وقت متاح' : 'Add available slot'}</h3>
              <div className="grid gap-12">
                <input value={slotForm.day} onChange={(e) => setSlotForm({ ...slotForm, day: e.target.value })} placeholder={lang === 'ar' ? 'اليوم' : 'Day'} />
                <input value={slotForm.from} onChange={(e) => setSlotForm({ ...slotForm, from: e.target.value })} placeholder={lang === 'ar' ? 'من' : 'From'} />
                <input value={slotForm.to} onChange={(e) => setSlotForm({ ...slotForm, to: e.target.value })} placeholder={lang === 'ar' ? 'إلى' : 'To'} />
                <button className="primary-btn" onClick={addSlot}>{lang === 'ar' ? 'إضافة' : 'Add Slot'}</button>
              </div>
            </div>

            <div className="card reveal reveal-up">
              <h3>{lang === 'ar' ? 'الأوقات الحالية' : 'Current availability'}</h3>
              <div className="grid gap-12">
                {availability.length === 0 ? <div className="muted-copy">{lang === 'ar' ? 'لا توجد أوقات مضافة' : 'No slots yet'}</div> : availability.map((slot) => (
                  <div key={slot.id} className="row-between soft-row">
                    <div>
                      <strong>{slot.day}</strong>
                      <div className="muted-copy">{slot.from} - {slot.to}</div>
                    </div>
                    <button className="ghost-btn small danger" onClick={() => deleteSlot(slot.id)}>{lang === 'ar' ? 'حذف' : 'Delete'}</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
