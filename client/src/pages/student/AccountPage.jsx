import { useApp } from '../../context/AppContext'

export default function AccountPage() {
  const { user, lang } = useApp()

  const labels = {
    email: lang === 'ar' ? 'البريد الإلكتروني' : 'Email',
    status: lang === 'ar' ? 'الحالة' : 'Status',
    sponsor: lang === 'ar' ? 'الجهة الداعمة' : 'Sponsor',
    phone: lang === 'ar' ? 'رقم الهاتف' : 'Phone',
    guardianPhone: lang === 'ar' ? 'رقم ولي الأمر' : 'Guardian Phone',
    track: lang === 'ar' ? 'المسار' : 'Track',
    remainingSessions: lang === 'ar' ? 'الجلسات المتبقية' : 'Remaining Sessions'
  }

  const items = [
    [labels.email, user.email],
    [labels.status, user.scholarshipStatus],
    [labels.sponsor, user.sponsor || '-'],
    [labels.phone, user.phone || '-'],
    [labels.guardianPhone, user.guardianPhone || '-'],
    [labels.track, user.track || '-'],
    [labels.remainingSessions, user.remainingSessions ?? 0]
  ]

  return (
    <div className="card profile-grid reveal reveal-up glow-on-hover">
      {items.map(([label, value]) => (
        <div className="profile-item sweep-light" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  )
}
