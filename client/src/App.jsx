import { useApp } from './context/AppContext'
import LoginPage from './pages/LoginPage'
import StudentLayout from './pages/StudentLayout'
import TeacherPage from './pages/TeacherPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  const { user } = useApp()

  if (!user) return <LoginPage />
  if (user.role === 'teacher') return <TeacherPage />
  if (user.role === 'admin') return <AdminPage />
  return <StudentLayout />
}
