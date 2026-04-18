import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api'
import { useApp } from '../../context/AppContext'

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Arabic', 'English', 'French', 'Religion']
const slots = ['16:00', '17:00', '18:00', '19:00']

export default function BookingPage() {
  const { user, t, lang } = useApp()
  const [teachers, setTeachers] = useState([])
  const [subject, setSubject] = useState('Mathematics')
  const [teacherId, setTeacherId] = useState('')
  const [sessionDate, setSessionDate] = useState('2026-04-25')
  const [sessionTime, setSessionTime] = useState('18:00')
  const [sessionsCount, setSessionsCount] = useState(1)
  const [note, setNote] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.getTeachers().then((data) => {
      setTeachers(data)
      if (data[0]) setTeacherId(data[0].id)
    }).catch(console.error)
  }, [])

  const selectedTeacher = useMemo(() => teachers.find((t) => t.id === teacherId), [teachers, teacherId])

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    try {
      await api.createBooking({
        studentId: user.id,
        teacherId,
        subject,
        sessionDate,
        sessionTime,
        sessionsCount,
        note,
        type: 'individual'
      })
      setMessage(lang === 'ar' ? 'تم إرسال الطلب إلى المدرس بانتظار الموافقة.' : 'Booking sent to teacher for approval.')
      setNote('')
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <form className="card form-grid reveal reveal-up glow-on-hover" onSubmit={handleSubmit}>
      <div className="section-title">
        <h3>{t.booking}</h3>
        <div className="status-chip">{user.scholarshipStatus === 'scholarship' ? '🎓 ' + t.scholarship : '💳 ' + t.regular}</div>
      </div>

      <label>{t.chooseSubject}</label>
      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        {subjects.map((item) => <option key={item}>{item}</option>)}
      </select>

      <label>{t.chooseTeacher}</label>
      <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>{teacher.name} - {teacher.subject}</option>
        ))}
      </select>

      {selectedTeacher ? (
        <div className="teacher-box reveal reveal-right delay-2">
          <strong>{selectedTeacher.name}</strong>
          <div>{selectedTeacher.bio}</div>
          <div>⭐ {selectedTeacher.rating}</div>
        </div>
      ) : null}

      <div className="input-grid-2">
        <div>
          <label>{t.chooseDate}</label>
          <input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} />
        </div>
        <div>
          <label>{t.chooseTime}</label>
          <select value={sessionTime} onChange={(e) => setSessionTime(e.target.value)}>
            {slots.map((slot) => <option key={slot}>{slot}</option>)}
          </select>
        </div>
      </div>

      <label>{lang === 'ar' ? 'عدد الجلسات' : 'Sessions Count'}</label>
      <select value={sessionsCount} onChange={(e) => setSessionsCount(Number(e.target.value))}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
      </select>

      <label>{t.note}</label>
      <textarea rows="4" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.note} />

      <div className="summary-box sweep-light">
        <strong>{lang === 'ar' ? 'ملخص الحجز' : 'Booking Summary'}</strong>
        <div>{lang === 'ar' ? 'المادة:' : 'Subject:'} {subject}</div>
        <div>{lang === 'ar' ? 'المدرس:' : 'Teacher:'} {selectedTeacher?.name || '-'}</div>
        <div>{lang === 'ar' ? 'التاريخ:' : 'Date:'} {sessionDate}</div>
        <div>{lang === 'ar' ? 'الوقت:' : 'Time:'} {sessionTime}</div>
        <div>{lang === 'ar' ? 'العدد:' : 'Count:'} {sessionsCount}</div>
      </div>

      {message ? <div className="success-box">{message}</div> : null}
      <button className="primary-btn">{t.submitBooking}</button>
    </form>
  )
}
