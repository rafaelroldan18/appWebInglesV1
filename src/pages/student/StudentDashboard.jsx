import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { FaStar, FaCalendarCheck, FaBook, FaTrophy, FaGamepad } from 'react-icons/fa'
import GameCard from '../../components/games/GameCard'
import { getUserProgress, getAvailableGames, getUserAchievements } from '../../supabase/queries'

function StudentDashboard() {
  const { profile } = useAuth()
  const [progress, setProgress] = useState({
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    streak: 0,
    wordsLearned: 0,
    achievements: []
  })
  const [games, setGames] = useState([])

  useEffect(() => {
    loadStudentData()
  }, [profile?.id])

  const loadStudentData = async () => {
    if (!profile?.id) return;
    
    try {
      const [progressData, gamesData, achievementsData] = await Promise.all([
        getUserProgress(profile.id),
        getAvailableGames(),
        getUserAchievements(profile.id)
      ])
      
      setProgress({
        level: progressData.current_level,
        xp: progressData.total_xp,
        nextLevelXp: (progressData.current_level + 1) * 100,
        streak: progressData.daily_streak,
        wordsLearned: progressData.vocabulary_mastered,
        achievements: achievementsData
      })
      setGames(gamesData)
    } catch (error) {
      console.error('Error loading student data:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.first_name} {profile?.last_name}!</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-lg shadow p-6"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <FaStar className="text-yellow-500 text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Level</h3>
                <p className="text-2xl font-bold text-primary-600">{progress.level}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary-600 h-2.5 rounded-full"
                  style={{ width: `${(progress.xp / progress.nextLevelXp) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {progress.xp}/{progress.nextLevelXp} XP
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow p-6"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <FaCalendarCheck className="text-green-500 text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Daily Streak</h3>
                <p className="text-2xl font-bold text-green-600">{progress.streak} days</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow p-6"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <FaBook className="text-blue-500 text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Words Learned</h3>
                <p className="text-2xl font-bold text-blue-600">{progress.wordsLearned}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow p-6"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <FaTrophy className="text-purple-500 text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {progress.achievements.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Available Games */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FaGamepad className="text-primary-500 mr-2" />
                Available Games
              </h2>
              <span className="badge-primary">{games.length} games</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {progress.achievements.slice(0, 4).map((achievement) => (
                <motion.div
                  key={achievement.id}
                  className="p-4 border rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl mb-2">{achievement.badge_url}</div>
                  <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <div className="mt-2">
                    <span className="text-xs font-medium text-primary-600">
                      +{achievement.xp_reward} XP
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard

if (import.meta.hot) {
  import.meta.hot.accept()
}