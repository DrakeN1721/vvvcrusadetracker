import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import UserProfile from '../auth/UserProfile'

const Header = () => {
  const location = useLocation()
  const { isAuthenticated, isDevMode } = useAuth()

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-black/80 backdrop-blur-xl border-b border-gray-900">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <span className="text-3xl font-black text-gradient-gold group-hover:animate-shimmer">vVv</span>
              <span className="text-xl font-bold text-white group-hover:text-vvv-gold transition-colors">Crusade Tracker</span>
              {isDevMode && (
                <span className="text-xs bg-black border border-vvv-gold/50 text-vvv-gold px-2 py-1 rounded-full font-bold shadow-gold-sm animate-pulse-gold">
                  DEV
                </span>
              )}
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/dashboard" 
                className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/progress" 
                className={`navbar-link ${isActive('/progress') ? 'active' : ''}`}
              >
                Progress
              </Link>
              <a 
                href="https://chips.vvv.net" 
                target="_blank"
                rel="noopener noreferrer"
                className="navbar-link"
              >
                Leaderboard
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <Link to="/" className="btn-primary text-sm shadow-gold">
                Connect Discord
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex space-x-4 overflow-x-auto scrollbar-hide">
          <Link 
            to="/dashboard" 
            className={`navbar-link text-sm whitespace-nowrap ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/progress" 
            className={`navbar-link text-sm whitespace-nowrap ${isActive('/progress') ? 'active' : ''}`}
          >
            Progress
          </Link>
          <a 
            href="https://chips.vvv.net" 
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-link text-sm whitespace-nowrap"
          >
            Leaderboard
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Header