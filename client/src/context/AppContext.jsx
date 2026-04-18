import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AppContext = createContext(null)

const messages = {
  ar: {
    welcome: 'مرحباً',
    signIn: 'تسجيل الدخول',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    rememberMe: 'تذكرني',
    login: 'دخول',
    logout: 'تسجيل الخروج',
    forgotPassword: 'نسيت كلمة المرور؟',
    dashboard: 'الرئيسية',
    booking: 'احجز',
    sessions: 'حصصي',
    recordings: 'التسجيلات',
    account: 'حسابي',
    upcomingSessions: 'الجلسات القادمة',
    chooseSubject: 'اختر المادة',
    chooseTeacher: 'اختر المدرس',
    chooseDate: 'اختر التاريخ',
    chooseTime: 'اختر الوقت',
    note: 'ماذا تحتاج أن تتعلم؟',
    submitBooking: 'تأكيد الحجز',
    scholarship: 'منحة',
    regular: 'عادي',
    notifications: 'الإشعارات',
    role: 'الدور',
    teacherPanel: 'واجهة المعلم',
    adminPanel: 'واجهة الإدارة'
  },
  en: {
    welcome: 'Welcome',
    signIn: 'Sign In',
    email: 'Email',
    password: 'Password',
    rememberMe: 'Remember me',
    login: 'Login',
    logout: 'Logout',
    forgotPassword: 'Forgot password?',
    dashboard: 'Home',
    booking: 'Book',
    sessions: 'My Sessions',
    recordings: 'Recordings',
    account: 'My Account',
    upcomingSessions: 'Upcoming Sessions',
    chooseSubject: 'Choose Subject',
    chooseTeacher: 'Choose Teacher',
    chooseDate: 'Choose Date',
    chooseTime: 'Choose Time',
    note: 'What do you need to learn?',
    submitBooking: 'Confirm Booking',
    scholarship: 'Scholarship',
    regular: 'Regular',
    notifications: 'Notifications',
    role: 'Role',
    teacherPanel: 'Teacher Panel',
    adminPanel: 'Admin Panel'
  }
}

export function AppProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('gm-lang') || 'ar')
  const [dark, setDark] = useState(localStorage.getItem('gm-dark') === 'true')
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('gm-user')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    localStorage.setItem('gm-lang', lang)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    localStorage.setItem('gm-dark', String(dark))
    document.body.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  useEffect(() => {
    if (user) localStorage.setItem('gm-user', JSON.stringify(user))
    else localStorage.removeItem('gm-user')
  }, [user])

  const value = useMemo(() => ({
    lang,
    setLang,
    dark,
    setDark,
    user,
    setUser,
    t: messages[lang]
  }), [lang, dark, user])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
