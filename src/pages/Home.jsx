import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoginButton from '../components/auth/LoginButton'

const Home = () => {
  const { isAuthenticated, isDevMode } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative">
      {/* Background glowing orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-vvv-gold/10 rounded-full blur-3xl animate-pulse-gold" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-vvv-gold/5 rounded-full blur-3xl animate-pulse-gold" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-7xl font-black mb-4">
            <span className="text-gradient-gold inline-block animate-shimmer">vVv</span>
            <span className="text-white ml-4">Crusade Tracker</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Track your fitness progress and meal accountability with the vVv community
          </p>
        </div>

        {isDevMode && (
          <div className="mb-6 p-4 glass-effect border border-vvv-gold/30 rounded-lg shadow-gold animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <p className="text-vvv-gold text-sm font-bold">
              🚀 Development Mode Active - Click below to auto-login with mock data
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card premium-border hover:scale-105 transition-transform duration-300 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="text-5xl mb-4 animate-glow">💪</div>
            <h3 className="text-lg font-bold text-vvv-gold mb-2">Fitness Tracking</h3>
            <p className="text-gray-400 text-sm">
              Log your bench press, deadlifts, squats, and more
            </p>
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Previous → Current</span>
                <span className="text-green-400">+15% 📈</span>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-vvv-gold-dark to-vvv-gold animate-shimmer" style={{ width: '75%' }} />
              </div>
            </div>
          </div>

          <div className="card premium-border hover:scale-105 transition-transform duration-300 animate-fadeIn relative" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
              <span className="bg-black px-4 py-2 rounded-full border border-vvv-gold/50 text-vvv-gold font-bold shadow-gold">
                Coming Soon
              </span>
            </div>
            <div className="text-5xl mb-4 opacity-50">🍽️</div>
            <h3 className="text-lg font-bold text-gray-500 mb-2">Meal Accountability</h3>
            <p className="text-gray-600 text-sm">
              Track calories and share your meal progress
            </p>
          </div>

          <div className="card premium-border hover:scale-105 transition-transform duration-300 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <div className="text-5xl mb-4 animate-glow">🏆</div>
            <h3 className="text-lg font-bold text-vvv-gold mb-2">Leaderboards</h3>
            <p className="text-gray-400 text-sm">
              Compete with the community and earn $V
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <span className="text-2xl">🥇</span>
              <span className="text-2xl">🥈</span>
              <span className="text-2xl">🥉</span>
            </div>
          </div>
        </div>

        <div className="animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <LoginButton size="large" className="shadow-gold hover:shadow-gold-lg" />
        </div>

        <p className="mt-6 text-sm text-gray-500 animate-fadeIn" style={{ animationDelay: '0.7s' }}>
          {isDevMode ? 'Click to start with mock data' : 'Connect with Discord to start tracking your crusades'}
        </p>

        {/* Powered by vVv */}
        <div className="mt-12 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
          <a 
            href="https://vvv.net" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-gray-500 hover:text-vvv-gold transition-colors"
          >
            <span className="text-sm">Powered by</span>
            <span className="font-bold text-gradient-gold">vVv Gaming</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home