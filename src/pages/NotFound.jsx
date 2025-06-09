import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function NotFound() {
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
            <span className="text-9xl font-bold text-primary">404</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            Oops! The page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn-primary">
            Go to Home Page
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound

if (import.meta.hot) {
  import.meta.hot.accept()
}