import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import ThemeToggle from '../../components/ui/ThemeToggle'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    
    try {
      setError('')
      setIsSubmitting(true)
      await signIn(email, password)
      toast.success('Successfully logged in!')
      navigate(from, { replace: true })
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message)
      toast.error(error.message)
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
        transition={{ duration: 0.3 }}
      >
        <div className="px-6 py-8 sm:p-10">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <div className="text-center mb-10">
            <Link to="/" className="inline-block">
              <h2 className="font-heading font-bold text-3xl text-primary">Play<span className="text-accent-500">English 27</span></h2>
            </Link>
            <h1 className="mt-4 text-3xl font-bold text-foreground">Welcome Back!</h1>
            <p className="mt-2 text-muted-foreground">Log in to continue your English learning journey</p>
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                  Password
                </label>
                <Link to="/reset-password" className="text-sm text-primary hover:text-primary/90">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn-primary py-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Logging in...' : 'Log In'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary/90">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login

if (import.meta.hot) {
  import.meta.hot.accept()
}