import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { FaGamepad, FaTrophy, FaChartLine, FaUsers } from 'react-icons/fa'

function Home() {
  const { user } = useAuth()

  const features = [
    {
      icon: <FaGamepad className="h-6 w-6 text-primary" />,
      title: "Fun Learning Games",
      description: "Practice English with interactive games designed specifically for high school students.",
    },
    {
      icon: <FaTrophy className="h-6 w-6 text-primary" />,
      title: "Achievement System",
      description: "Earn badges and rewards as you improve your English skills and complete challenges.",
    },
    {
      icon: <FaChartLine className="h-6 w-6 text-primary" />,
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed statistics and skill assessments.",
    },
    {
      icon: <FaUsers className="h-6 w-6 text-primary" />,
      title: "Compete & Collaborate",
      description: "Challenge classmates on leaderboards or team up to solve complex language puzzles.",
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/90 to-secondary/90 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Learn English Through <span className="text-accent">Fun</span> & <span className="text-accent">Games</span>
              </h1>
              <p className="text-xl mb-8 text-muted">
                An interactive platform designed for UEMGL "27 de Febrero" students to master English while having fun!
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link to="/dashboard\" className="btn bg-background text-foreground hover:bg-background/90">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn bg-accent text-accent-foreground hover:bg-accent/90">
                      Get Started
                    </Link>
                    <Link to="/login" className="btn bg-background text-foreground hover:bg-background/90">
                      Log In
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="bg-card p-6 rounded-xl shadow-xl transform rotate-3">
                  <img 
                    src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                    alt="Students learning English" 
                    className="rounded-lg w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-4 rounded-lg shadow-lg transform -rotate-6">
                  <div className="font-bold">Level Up Your English Skills!</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Learn with PlayEnglish 27?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform makes English learning engaging and effective through gamification.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-card rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-accent text-accent-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your English Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-accent-foreground/90">
            Join your classmates and begin improving your English skills through fun, interactive games and activities.
          </p>
          {!user && (
            <Link to="/register" className="btn bg-background text-foreground hover:bg-background/90">
              Create Your Free Account
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home

if (import.meta.hot) {
  import.meta.hot.accept()
}