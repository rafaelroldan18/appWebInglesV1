import { FaSun, FaMoon } from 'react-icons/fa'
import { useTheme } from '../../contexts/ThemeContext'
import { motion } from 'framer-motion'

function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80"
      aria-label="Toggle theme"
    >
      {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
    </motion.button>
  )
}

export default ThemeToggle