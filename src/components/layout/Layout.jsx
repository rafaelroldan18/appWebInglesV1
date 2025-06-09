import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

function Layout() {
  const location = useLocation()
  const isAuthPage = ['/login', '/register', '/reset-password', '/complete-profile'].includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}

export default Layout

if (import.meta.hot) {
  import.meta.hot.accept()
}