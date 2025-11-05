import { motion } from 'framer-motion'
import { FaClock, FaCoins, FaStar } from 'react-icons/fa'

function MissionCard({ mission, progress, onStart }) {
  const isActive = progress?.estado === 'en_progreso'
  const isCompleted = progress?.estado === 'completada'

  const getTypeColor = (type) => {
    const colors = {
      diaria: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100',
      semanal: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
      unidad: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100',
      especial: 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-100'
    }
    return colors[type] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100'
  }

  const calculateProgress = () => {
    if (!progress || !mission.objetivos || mission.objetivos.length === 0) return 0
    const objetivo = mission.objetivos[0]
    const actual = progress.progreso_actual?.actual || 0
    const total = objetivo.cantidad || 1
    return Math.min((actual / total) * 100, 100)
  }

  const progressPercentage = calculateProgress()

  return (
    <motion.div
      className={`bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-4 ${
        isCompleted ? 'opacity-75' : ''
      }`}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-3xl">{mission.icono}</span>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{mission.titulo}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(mission.tipo)}`}>
              {mission.tipo.charAt(0).toUpperCase() + mission.tipo.slice(1)}
            </span>
          </div>
        </div>
        {isCompleted && (
          <div className="text-2xl">✅</div>
        )}
      </div>

      <p className="text-muted-foreground text-sm mb-4">{mission.descripcion}</p>

      {(isActive || isCompleted) && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progreso</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isCompleted ? 'bg-green-500' : 'bg-primary'
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center text-primary">
            <FaStar className="mr-1" />
            <span>{mission.recompensa_exp} XP</span>
          </div>
          <div className="flex items-center text-accent">
            <FaCoins className="mr-1" />
            <span>{mission.recompensa_monedas}</span>
          </div>
        </div>

        {!isCompleted && (
          <motion.button
            className={`btn-${isActive ? 'accent' : 'primary'} text-sm py-1.5`}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStart(mission)}
            disabled={isCompleted}
          >
            {isActive ? 'Continuar' : 'Iniciar'}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default MissionCard

if (import.meta.hot) {
  import.meta.hot.accept()
}
