import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'
import { FaBars, FaTimes, FaUserCircle, FaChevronDown } from 'react-icons/fa'
import toast from 'react-hot-toast'
import ThemeToggle from '../ui/ThemeToggle'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Successfully signed out!')
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error.message)
      toast.error('Failed to sign out')
    }
  }

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen)

  const getRoleDisplay = (rol) => {
    return rol === 'estudiante' ? 'Student' : 'Teacher'
  }

  return (
    <nav className="bg-card text-card-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-heading font-bold text-2xl text-primary">Play<span className="text-accent-500">English 27</span></span>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent/10 transition">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent/10 transition">
                  Dashboard
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleProfile}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent/10 transition"
                  >
                    {profile?.url_avatar ? (
                      <img 
                        src={profile.url_avatar} 
                        alt="Profile" 
                        className="w-6 h-6 rounded-full mr-2 object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-xl mr-2 text-primary" />
                    )}
                    <span>{profile?.nombre} {profile?.apellido}</span>
                    <FaChevronDown className="ml-2" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu">
                        <div className="px-4 py-2 text-sm text-foreground border-b border-border">
                          Role: {getRoleDisplay(profile?.rol)}
                        </div>
                        <div className="px-4 py-2 flex items-center justify-between">
                          <span className="text-sm text-foreground">Theme</span>
                          <ThemeToggle />
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent/10"
                          role="menuitem"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link to="/login" className="btn-outline text-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-accent/10 transition"
            >
              {isOpen ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent/10 transition"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent/10 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-accent/10 transition"
                >
                  Sign Out
                </button>
                <div className="px-3 py-2 rounded-md text-base font-medium text-foreground flex items-center">
                  {profile?.url_avatar ? (
                    <img 
                      src={profile.url_avatar} 
                      alt="Profile" 
                      className="w-6 h-6 rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-xl mr-2 text-primary" />
                  )}
                  <span className="truncate">{profile?.nombre} {profile?.apellido}</span>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent/10 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-primary-600 hover:bg-accent/10 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

if (import.meta.hot) {
  import.meta.hot.accept()
}