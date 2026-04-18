import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import { useApp } from '../context/AppContext'

const API = 'http://localhost:5000/api/admin'

function StatCard({ title, value, sub }) {
  return (
    <div className="card glow-on-hover">
      <div className="muted-label">{title}</div>
      <div className="metric-value">{value}</div>
      {sub ? <div className="muted-copy">{sub}</div> : null}
    </div>
  )
}

export default function AdminPage() {
  const { lang } = useApp()
  const [summary, setSummary] = useState(null)
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [tab, setTab] = useState('dashboard')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '123456',
    role: 'student',
    scholarshipStatus: 'regular',
    remainingSessions: 0
  })

  async function load() {
    const [summaryRes, usersRes, bookingsRes] = await Promise.all([
      fetch(`${API}/summary`).then(r => r.json()),
      fetch(`${API}/users`).then(r => r.json()),
      fetch(`${API}/bookings`).then(r => r.json())
    ])
    setSummary(summaryRes)
    setUsers(usersRes)
    setBookings(bookingsRes)
  }

  useEffect(() => {
    load().catch(console.error)
  }, [])

  const actionable = useMemo(() => bookings.filter((b) => ['pending', 'teacher_approved'].includes(b.status)), [bookings])

  async function createUser() {
    if (!form.name || !form.email) return
    await fetch(`${API}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ name: '', email: '', password: '123456', role: 'student', scholarshipStatus: 'regular', remainingSessions: 0 })
    await load()
    setTab('users')
  }

  async function deleteUser(id) {
    await fetch(`${API}/users/${id}`, { method: 'DELETE' })
    await load()
  }

  async function approve(id) {
    await fetch(`${API}/bookings/${id}/approve`, { method: 'PATCH' })
    await load()
  }

  async function cancel(id) {
    const reason = window.prompt(lang === 'ar' ? 'سبب الإلغاء' : 'Cancellation reason', 'Cancelled by admin') || 'Cancelled by admin'
    await fetch(`${API}/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    })
    await load()
  }

  return (
    <div className="app-shell">
      <Header title={lang === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'} />
      <main className="page-area grid gap-16">
        <section className="hero card reveal reveal-up cinematic-panel">
          <div className="hero-copy">
            <div className="eyebrow">{lang === 'ar' ? 'مركز التحكم' : 'Control center'}</div>
            <h2>{lang === 'ar' ? 'إدارة GUIDE ME' : 'Manage GUIDE ME'}</h2>
            <p>{lang === 'ar' ? 'مستخدمون، جلسات، وموافقات نهائية من واجهة واحدة موحدة.' : 'Users, sessions, and final approvals from one unified workspace.'}</p>
            <div className="pill-row">
              {['dashboard', 'users', 'bookings', 'create'].map((item) => (
                <button key={item} className={`ghost-btn ${tab === item ? 'active-tab' : ''}`} onClick={() => setTab(item)}>
                  {item === 'dashboard' ? (lang === 'ar' ? 'لوحة التحكم' : 'Dashboard') :
                   item === 'users' ? (lang === 'ar' ? 'المستخدمون' : 'Users') :
                   item === 'bookings' ? (lang === 'ar' ? 'الجلسات' : 'Bookings') :
                   (lang === 'ar' ? 'إضافة مستخدم' : 'Create User')}
                </button>
              ))}
            </div>
          </div>
        </section>

        {tab === 'dashboard' && summary ? (
          <>
            <section className="stats-grid">
              <StatCard title={lang === 'ar' ? 'إجمالي المستخدمين' : 'Total users'} value={summary.users.total} sub={`${lang === 'ar' ? 'طلاب' : 'Students'}: ${summary.users.students} • ${lang === 'ar' ? 'مدرسون' : 'Teachers'}: ${summary.users.teachers}`} />
              <StatCard title={lang === 'ar' ? 'إجمالي الجلسات' : 'Total bookings'} value={summary.bookings.total} sub={`${lang === 'ar' ? 'قيد الانتظار' : 'Pending'}: ${summary.bookings.pending}`} />
              <StatCard title={lang === 'ar' ? 'بانتظار الأدمن' : 'Waiting for admin'} value={summary.bookings.teacherApproved} />
              <StatCard title={lang === 'ar' ? 'المثبتة نهائيًا' : 'Final approved'} value={summary.bookings.adminApproved} sub={`${lang === 'ar' ? 'ملغاة' : 'Cancelled'}: ${summary.bookings.cancelled}`} />
            </section>

            <section className="card reveal reveal-up">
              <h3>{lang === 'ar' ? 'الجلسات التي تحتاج إجراء' : 'Bookings requiring action'}</h3>
              <div className="grid gap-12">
                {actionable.length === 0 ? <div className="muted-copy">{lang === 'ar' ? 'لا توجد جلسات معلقة' : 'No pending bookings'}</div> : actionable.map((booking) => (
                  <div key={booking.id} className="booking-card card glow-on-hover">
                    <div className="booking-main">
                      <strong>{booking.subject}</strong>
                      <div className="booking-meta">
                        <div>{lang === 'ar' ? 'الطالب:' : 'Student:'} {booking.student}</div>
                        <div>{lang === 'ar' ? 'المدرس:' : 'Teacher:'} {booking.teacher}</div>
                        <div>{booking.sessionDate} — {booking.sessionTime}</div>
                        <div className={`status ${booking.status}`}>{booking.status}</div>
                      </div>
                    </div>
                    <div className="booking-actions vertical">
                      <button className="primary-btn small" onClick={() => approve(booking.id)}>{lang === 'ar' ? 'اعتماد نهائي' : 'Final Approve'}</button>
                      <button className="ghost-btn small danger" onClick={() => cancel(booking.id)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {tab === 'users' ? (
          <section className="card reveal reveal-up">
            <h3>{lang === 'ar' ? 'المستخدمون' : 'Users'}</h3>
            <div className="grid gap-12">
              {users.map((u) => (
                <div key={u.id} className="row-between soft-row">
                  <div>
                    <strong>{u.name}</strong>
                    <div className="muted-copy">{u.email} • {u.role}</div>
                  </div>
                  <button className="ghost-btn small danger" onClick={() => deleteUser(u.id)}>{lang === 'ar' ? 'حذف' : 'Delete'}</button>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {tab === 'bookings' ? (
          <section className="grid gap-12">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card card glow-on-hover">
                <div className="booking-main">
                  <strong>{booking.subject}</strong>
                  <div className="booking-meta">
                    <div>{lang === 'ar' ? 'الطالب:' : 'Student:'} {booking.student}</div>
                    <div>{lang === 'ar' ? 'المدرس:' : 'Teacher:'} {booking.teacher}</div>
                    <div>{booking.sessionDate} — {booking.sessionTime}</div>
                    <div className={`status ${booking.status}`}>{booking.status}</div>
                    {booking.cancelReason ? <div>{booking.cancelReason}</div> : null}
                  </div>
                </div>
                <div className="booking-actions vertical">
                  <button className="primary-btn small" onClick={() => approve(booking.id)}>{lang === 'ar' ? 'اعتماد' : 'Approve'}</button>
                </div>
              </div>
            ))}
          </section>
        ) : null}

        {tab === 'create' ? (
          <section className="card reveal reveal-up">
            <h3>{lang === 'ar' ? 'إضافة مستخدم جديد' : 'Create new user'}</h3>
            <div className="grid gap-12">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={lang === 'ar' ? 'الاسم' : 'Name'} />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={lang === 'ar' ? 'الإيميل' : 'Email'} />
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'} />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="student">student</option>
                <option value="teacher">teacher</option>
                <option value="admin">admin</option>
              </select>
              <select value={form.scholarshipStatus} onChange={(e) => setForm({ ...form, scholarshipStatus: e.target.value })}>
                <option value="regular">regular</option>
                <option value="scholarship">scholarship</option>
              </select>
              <input value={form.remainingSessions} onChange={(e) => setForm({ ...form, remainingSessions: e.target.value })} placeholder={lang === 'ar' ? 'الجلسات المتبقية' : 'Remaining sessions'} />
              <button className="primary-btn" onClick={createUser}>{lang === 'ar' ? 'إنشاء المستخدم' : 'Create user'}</button>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
