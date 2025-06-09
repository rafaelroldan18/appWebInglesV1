import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

// Pages
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ResetPassword from './pages/auth/ResetPassword'
import ProfileCompletion from './pages/auth/ProfileCompletion'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import StudentDashboard from './pages/student/StudentDashboard'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'

// Components
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoadingScreen from './components/ui/LoadingScreen'

function App() {
  const { user, loading, profile } = useAuth()

  useEffect(() => {
    document.title = 'PlayEnglish 27 - Learn English Through Games'
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#059669',
            },
          },
          error: {
            style: {
              background: '#dc2626',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="login" element={
            user ? (
              profile ? <Navigate to="/dashboard\" replace /> : <Navigate to="/complete-profile" replace />
            ) : <Login />
          } />
          <Route path="register" element={
            user ? (
              profile ? <Navigate to="/dashboard\" replace /> : <Navigate to="/complete-profile" replace />
            ) : <Register />
          } />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          
          {/* Profile completion route */}
          <Route path="complete-profile" element={
            !user ? <Navigate to="/login\" replace /> :
            profile ? <Navigate to="/dashboard" replace /> :
            <ProfileCompletion />
          } />
          
          {/* Protected student routes */}
          <Route element={
            <ProtectedRoute 
              allowedRoles={['estudiante']} 
              redirectTo={!profile ? '/complete-profile' : '/unauthorized'}
            />
          }>
            <Route path="student-dashboard" element={<StudentDashboard />} />
          </Route>

          {/* Protected teacher routes */}
          <Route element={
            <ProtectedRoute 
              allowedRoles={['profesor']} 
              redirectTo={!profile ? '/complete-profile' : '/unauthorized'}
            />
          }>
            <Route path="teacher-dashboard" element={<TeacherDashboard />} />
          </Route>
          
          {/* Default dashboard redirect */}
          <Route path="dashboard" element={
            !user ? <Navigate to="/login\" replace /> :
            !profile ? <Navigate to="/complete-profile" replace /> :
            profile.rol === 'profesor' ? <Navigate to="/teacher-dashboard" replace /> :
            <Navigate to="/student-dashboard" replace />
          } />
          
          {/* Not found */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

if (import.meta.hot) {
  import.meta.hot.accept()
}