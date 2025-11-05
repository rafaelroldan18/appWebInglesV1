import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { FaStar, FaCalendarCheck, FaBook, FaTrophy, FaGamepad, FaCoins, FaFire } from 'react-icons/fa'
import GameCard from '../../components/games/GameCard'
import MissionCard from '../../components/missions/MissionCard'
import {
  getUserProgress,
  getAvailableGames,
  getUserAchievements,
  getMissionsByType,
  getUserMissionProgress,
  getUnits,
  createUserProgress
} from '../../supabase/queries'
import toast from 'react-hot-toast'

function StudentDashboard() {
  const { profile } = useAuth()
  const [progress, setProgress] = useState({
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    streak: 0,
    wordsLearned: 0,
    coins: 0,
    achievements: []
  })
  const [games, setGames] = useState([])
  const [dailyMissions, setDailyMissions] = useState([])
  const [weeklyMissions, setWeeklyMissions] = useState([])
  const [unitMissions, setUnitMissions] = useState([])
  const [missionProgress, setMissionProgress] = useState([])
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStudentData()
  }, [profile?.id])

  const loadStudentData = async () => {
    if (!profile?.id) return;

    try {
      setLoading(true)

      let progressData = await getUserProgress(profile.id)

      if (!progressData.id) {
        progressData = await createUserProgress(profile.id)
      }

      const [gamesData, achievementsData, daily, weekly, unit, missionProg, unitsData] = await Promise.all([
        getAvailableGames(),
        getUserAchievements(profile.id),
        getMissionsByType('diaria'),
        getMissionsByType('semanal'),
        getMissionsByType('unidad'),
        getUserMissionProgress(profile.id),
        getUnits()
      ])

      setProgress({
        level: progressData.nivel_actual || 1,
        xp: progressData.experiencia_total || 0,
        nextLevelXp: ((progressData.nivel_actual || 1) + 1) * 100,
        streak: progressData.racha_diaria || 0,
        wordsLearned: progressData.vocabulario_dominado || 0,
        coins: progressData.monedas || 0,
        achievements: achievementsData
      })
      setGames(gamesData)
      setDailyMissions(daily)
      setWeeklyMissions(weekly)
      setUnitMissions(unit)
      setMissionProgress(missionProg)
      setUnits(unitsData)
    } catch (error) {
      console.error('Error loading student data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getMissionProgress = (missionId) => {
    return missionProgress.find(p => p.id_mision === missionId)
  }

  const handleStartMission = (mission) => {
    toast.info('Activity selection coming soon!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.nombre} {profile?.apellido}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-card rounded-lg shadow p-6"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <FaStar className="text-yellow-500 text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Level</h3>
                <p className="text-2xl font-bold text-primary">{progress.level}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${(progress.xp / progress.nextLevelXp) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {progress.xp}/{progress.nextLevelXp} XP
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-card rounded-lg shadow p-6"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <FaFire className="text-orange-500 text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Daily Streak</h3>
                <p className="text-2xl font-bold text-orange-600">{progress.streak} days</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-card rounded-lg shadow p-6"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <FaBook className="text-blue-500 text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Words Learned</h3>
                <p className="text-2xl font-bold text-blue-600">{progress.wordsLearned}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-card rounded-lg shadow p-6"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center">
              <FaCoins className="text-accent text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Coins</h3>
                <p className="text-2xl font-bold text-accent">{progress.coins}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                  <FaGamepad className="text-primary mr-2" />
                  Available Activities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {games.slice(0, 6).map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Unit Missions</h2>
                <div className="grid grid-cols-1 gap-4">
                  {unitMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      progress={getMissionProgress(mission.id)}
                      onStart={handleStartMission}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Daily Missions</h2>
                <div className="space-y-3">
                  {dailyMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      progress={getMissionProgress(mission.id)}
                      onStart={handleStartMission}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Weekly Missions</h2>
                <div className="space-y-3">
                  {weeklyMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      progress={getMissionProgress(mission.id)}
                      onStart={handleStartMission}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                  <FaTrophy className="text-accent mr-2" />
                  Recent Achievements
                </h2>
                <div className="space-y-3">
                  {progress.achievements.slice(0, 3).map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      className="p-3 border border-border rounded-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{achievement.url_insignia}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-sm">{achievement.nombre}</h3>
                          <p className="text-xs text-muted-foreground">{achievement.descripcion}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-primary">+{achievement.recompensa_exp} XP</span>
                            <span className="text-xs text-accent">+{achievement.recompensa_monedas} coins</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
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
