import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingScreen from '../ui/LoadingScreen'

function ProtectedRoute({ allowedRoles = [], redirectTo = '/unauthorized' }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login\" state={{ from: location }} replace />
  }

  if (!profile) {
    return <Navigate to="/complete-profile\" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(profile?.rol)) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}

export default ProtectedRoute

if (import.meta.hot) {
  import.meta.hot.accept()
}