import { useState } from 'react'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import DashboardPage from './student/DashboardPage'
import BookingPage from './student/BookingPage'
import SessionsPage from './student/SessionsPage'
import AccountPage from './student/AccountPage'
import RecordedLessonsPage from './student/RecordedLessonsPage'

export default function StudentLayout() {
  const [active, setActive] = useState('dashboard')

  const map = {
    dashboard: <DashboardPage />,
    booking: <BookingPage />,
    sessions: <SessionsPage />,
    recordings: <RecordedLessonsPage />,
    account: <AccountPage />
  }

  const titles = {
    dashboard: 'Dashboard',
    booking: 'Booking',
    sessions: 'My Sessions',
    recordings: 'Recorded Lessons',
    account: 'My Account'
  }

  return (
    <div className="app-shell">
      <Header title={titles[active]} />
      <main className="page-area page-transition" key={active}>{map[active]}</main>
      <BottomNav active={active} onChange={setActive} />
    </div>
  )
}
