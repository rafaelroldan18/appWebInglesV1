import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'
import { FaEnvelope, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa'
import ThemeToggle from '../../components/ui/ThemeToggle'

function ResetPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }
    
    try {
      setError('')
      setMessage('')
      setIsSubmitting(true)
      await resetPassword(email)
      setMessage('Password reset link sent! Please check your email.')
    } catch (error) {
      console.error('Reset password error:', error)
      setError('Failed to reset password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full bg-card rounded-xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-6 py-8 sm:p-10">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <div className="text-center mb-10">
            <Link to="/" className="inline-block">
              <h2 className="font-heading font-bold text-3xl text-primary">Play<span className="text-accent-500">English 27</span></h2>
            </Link>
            <h1 className="mt-4 text-3xl font-bold text-foreground">Reset Your Password</h1>
            <p className="mt-2 text-muted-foreground">We'll send you a link to reset your password</p>
          </div>
          
          {error && (
            <motion.div 
              className="mb-6 p-4 bg-destructive/10 rounded-lg flex items-center text-destructive"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FaExclamationCircle className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          
          {message && (
            <motion.div 
              className="mb-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg flex items-center text-green-800 dark:text-green-100"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FaCheckCircle className="mr-2 flex-shrink-0" />
              <span>{message}</span>
            </motion.div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn-primary py-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/90">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ResetPassword

if (import.meta.hot) {
  import.meta.hot.accept()
}