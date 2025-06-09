import { motion } from 'framer-motion'

function GameCard({ game }) {
  const difficultyColors = {
    Easy: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
    Medium: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
    Hard: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
  }

  return (
    <motion.div 
      className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ y: -5 }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">{game.title}</h3>
            <div className="flex space-x-2">
              <span className="badge-secondary text-xs">{game.category}</span>
              <span className={`badge text-xs ${difficultyColors[game.difficulty]}`}>
                {game.difficulty}
              </span>
            </div>
          </div>
          <div className="text-3xl">{game.icon}</div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">{game.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-primary">+{game.xpReward} XP</span>
          <motion.button 
            className="btn-primary text-sm py-1.5"
            whileTap={{ scale: 0.95 }}
          >
            Play Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default GameCard

if (import.meta.hot) {
  import.meta.hot.accept()
}