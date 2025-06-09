import { Link } from 'react-router-dom'
import { FaGlobe, FaBook, FaGamepad } from 'react-icons/fa'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card text-card-foreground pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <FaGlobe className="mr-2 text-primary" /> PlayEnglish 27
            </h4>
            <p className="text-muted-foreground mb-4">
              Making English learning fun and engaging for students at UEMGL "27 de Febrero".
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <FaBook className="mr-2 text-primary" /> Learning Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition">
                  {/* Vocabulary Games */}
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition">
                  {/* Grammar Exercises */}
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition">
                  {/* Pronunciation Practice */}
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition">
                  {/* Reading Comprehension */}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <FaGamepad className="mr-2 text-primary" /> Games
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition">
                  {/* Word Match */}
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition">
                  {/* Sentence Builder */}
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition">
                  {/* Vocabulary Challenge */}
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition">
                  {/* Grammar Quest */}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            &copy; {currentYear} PlayEnglish 27. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

if (import.meta.hot) {
  import.meta.hot.accept()
}