import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

function Unauthorized() {
  const { profile } = useAuth()
  
  const getRoleText = (role) => {
    return role === 'estudiante' ? 'teachers' : 'students'
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full bg-card rounded-xl shadow-xl overflow-hidden text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-6 py-8 sm:p-10">
          <div className="mb-6">
            <span className="text-6xl">🚫</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            Sorry, you don't have permission to access this page. This area is restricted to {getRoleText(profile?.rol)}.
          </p>
          <Link to="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Unauthorized

if (import.meta.hot) {
  import.meta.hot.accept()
}