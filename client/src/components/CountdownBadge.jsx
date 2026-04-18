import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'

function getTarget(targetDate, targetTime) {
  const target = new Date(`${targetDate}T${targetTime}:00`)
  return Number.isNaN(target.getTime()) ? null : target
}

function getDiff(targetDate, targetTime) {
  const target = getTarget(targetDate, targetTime)
  if (!target) return null
  return target.getTime() - Date.now()
}

export default function CountdownBadge({ date, time, compact = false, smart = true }) {
  const { lang } = useApp()
  const [diff, setDiff] = useState(() => getDiff(date, time))

  useEffect(() => {
    const tick = () => setDiff(getDiff(date, time))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [date, time])

  const meta = useMemo(() => {
    const target = getTarget(date, time)
    if (!target || diff == null) {
      return {
        label: lang === 'ar' ? 'يبدأ خلال' : 'Starts in',
        value: '--:--:--',
        helper: lang === 'ar' ? 'موعد غير محدد' : 'No time available'
      }
    }

    if (diff <= 0) {
      return {
        label: lang === 'ar' ? 'الحالة' : 'Status',
        value: lang === 'ar' ? 'مباشر الآن' : 'Live now',
        helper: lang === 'ar' ? 'يمكنك الانضمام فورًا' : 'You can join right away'
      }
    }

    const total = Math.floor(diff / 1000)
    const days = Math.floor(total / 86400)
    const hours = Math.floor((total % 86400) / 3600)
    const mins = Math.floor((total % 3600) / 60)
    const secs = total % 60
    const clock = [hours, mins, secs].map((v) => String(v).padStart(2, '0')).join(':')

    const today = new Date()
    const sameDay = target.toDateString() === today.toDateString()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const isTomorrow = target.toDateString() === tomorrow.toDateString()

    const helper = smart
      ? sameDay
        ? (lang === 'ar' ? `اليوم • ${time}` : `Today • ${time}`)
        : isTomorrow
          ? (lang === 'ar' ? `غدًا • ${time}` : `Tomorrow • ${time}`)
          : target.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', {
              day: 'numeric',
              month: 'short'
            }) + ` • ${time}`
      : `${date} • ${time}`

    if (days > 0) {
      return {
        label: lang === 'ar' ? 'الموعد القادم' : 'Next session',
        value: lang === 'ar' ? `${days} يوم • ${clock}` : `${days}d • ${clock}`,
        helper
      }
    }

    return {
      label: lang === 'ar' ? 'يبدأ خلال' : 'Starts in',
      value: clock,
      helper
    }
  }, [date, time, diff, lang, smart])

  return (
    <div className={`countdown-badge ${compact ? 'compact' : ''}`}>
      <span className="countdown-label">{meta.label}</span>
      <strong>{meta.value}</strong>
      <span className="countdown-helper">{meta.helper}</span>
    </div>
  )
}
