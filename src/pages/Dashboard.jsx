import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { FaTrophy, FaChartLine, FaBook, FaCrown, FaGamepad } from 'react-icons/fa'
import GameCard from '../components/games/GameCard'

function Dashboard() {
  const { user } = useAuth()
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 75,
    nextLevelXp: 100,
    streak: 3,
    wordsLearned: 48,
    badges: 5,
  })

  // Dummy game data - in a real app, this would come from your Supabase database
  const games = [
    {
      id: 1,
      title: "Word Match",
      description: "Match English words with their meanings",
      category: "Vocabulary",
      difficulty: "Easy",
      icon: "🎮",
      xpReward: 20,
      completionRate: 0,
    },
    {
      id: 2,
      title: "Sentence Builder",
      description: "Create correct sentences from scrambled words",
      category: "Grammar",
      difficulty: "Medium",
      icon: "🔤",
      xpReward: 30,
      completionRate: 0,
    },
    {
      id: 3,
      title: "Pronunciation Challenge",
      description: "Practice your pronunciation with fun exercises",
      category: "Speaking",
      difficulty: "Medium",
      icon: "🎤",
      xpReward: 25,
      completionRate: 0,
    },
    {
      id: 4,
      title: "Reading Quest",
      description: "Read passages and answer comprehension questions",
      category: "Reading",
      difficulty: "Hard",
      icon: "📚",
      xpReward: 35,
      completionRate: 0,
    },
  ]

  // Top performers - in a real app, this would come from your Supabase database
  const leaderboard = [
    { id: 1, name: "Maria", points: 1250, avatar: "👧" },
    { id: 2, name: "Carlos", points: 1180, avatar: "👦" },
    { id: 3, name: "Sofia", points: 1120, avatar: "👩" },
    { id: 4, name: "Juan", points: 1050, avatar: "🧑" },
    { id: 5, name: "Ana", points: 980, avatar: "👱‍♀️" },
  ]

  useEffect(() => {
    // In a real app, you would fetch user data from Supabase here
    document.title = "Dashboard | EnglishQuest"
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.email.split('@')[0]}!</h1>
          <p className="text-gray-600">Track your progress and continue learning English</p>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Your Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Level and XP */}
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaCrown className="text-primary-500 mr-2" />
                    <h3 className="font-semibold text-primary-900">Level {userStats.level}</h3>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">{userStats.xp}/{userStats.nextLevelXp} XP to next level</p>
                </div>

                {/* Learning Streak */}
                <div className="bg-accent-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaChartLine className="text-accent-500 mr-2" />
                    <h3 className="font-semibold text-accent-900">Learning Streak</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-accent-700">{userStats.streak}</span>
                    <span className="ml-2 text-gray-600">days in a row</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Keep going to maintain your streak!</p>
                </div>

                {/* Words Learned */}
                <div className="bg-secondary-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaBook className="text-secondary-500 mr-2" />
                    <h3 className="font-semibold text-secondary-900">Words Learned</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-secondary-700">{userStats.wordsLearned}</span>
                    <span className="ml-2 text-gray-600">words mastered</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Learn 2 more words to level up</p>
                </div>

                {/* Badges Earned */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaTrophy className="text-yellow-500 mr-2" />
                    <h3 className="font-semibold text-yellow-900">Badges Earned</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-yellow-700">{userStats.badges}</span>
                    <span className="ml-2 text-gray-600">achievement badges</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Earn more by completing challenges</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Games */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FaGamepad className="text-primary-500 mr-2" />
                    Available Games
                  </h2>
                  <span className="badge-primary">{games.length} games</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                  <FaTrophy className="text-yellow-500 mr-2" />
                  Top Performers
                </h2>
                <div className="space-y-4">
                  {leaderboard.map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                          index === 1 ? 'bg-gray-100 text-gray-800' : 
                          index === 2 ? 'bg-amber-100 text-amber-800' : 
                          'bg-gray-50 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{student.avatar}</span>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </div>
                      <div className="badge-accent">{student.points} pts</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-3">
                        ?
                      </div>
                      <span className="font-medium">Your Rank</span>
                    </div>
                    <div className="badge-primary">750 pts</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard