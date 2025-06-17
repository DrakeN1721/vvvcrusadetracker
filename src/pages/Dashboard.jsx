import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCrusade } from '../hooks/useCrusade'
import CrusadeCard from '../components/crusades/CrusadeCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { ChartIcon, TargetIcon, TrophyIcon } from '../components/icons/Icons'

const Dashboard = () => {
  const { user } = useAuth()
  const { enrolledCrusades, loading, error, refreshEnrolled } = useCrusade()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.discord_username}!
        </h1>
        <p className="text-gray-400">
          Track your progress and compete in vVv crusades
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link to="/progress" className="card hover:border-gray-700 transition-all">
          <div className="flex items-center space-x-3">
            <ChartIcon className="w-8 h-8 text-vvv-gold" />
            <div>
              <h3 className="font-semibold">Log Progress</h3>
              <p className="text-sm text-gray-400">Track your workouts</p>
            </div>
          </div>
        </Link>

        <Link to="/crusades" className="card hover:border-gray-700 transition-all">
          <div className="flex items-center space-x-3">
            <TargetIcon className="w-8 h-8 text-vvv-gold" />
            <div>
              <h3 className="font-semibold">Browse Crusades</h3>
              <p className="text-sm text-gray-400">Join new challenges</p>
            </div>
          </div>
        </Link>

        <a 
          href="https://chips.vvv.net" 
          target="_blank" 
          rel="noopener noreferrer"
          className="card hover:border-gray-700 transition-all"
        >
          <div className="flex items-center space-x-3">
            <TrophyIcon className="w-8 h-8 text-vvv-gold" />
            <div>
              <h3 className="font-semibold">Leaderboard</h3>
              <p className="text-sm text-gray-400">View on chips.vvv.net</p>
            </div>
          </div>
        </a>
      </div>

      {/* Enrolled Crusades */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Your Crusades</h2>
          <Link to="/crusades" className="text-vvv-gold hover:text-vvv-gold-dark">
            Browse all →
          </Link>
        </div>

        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={refreshEnrolled}
            className="mb-4"
          />
        )}

        {enrolledCrusades.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 mb-4">
              You haven't joined any crusades yet
            </p>
            <Link to="/crusades" className="btn-primary">
              Browse Crusades
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {enrolledCrusades.map(crusade => {
              // Show coming soon overlay for meal crusades
              if (crusade.type === 'meal') {
                return (
                  <div key={crusade.id} className="relative">
                    <div className="opacity-50 pointer-events-none">
                      <CrusadeCard crusade={crusade} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-vvv-grey-dark px-4 py-2 rounded-full text-gray-400 font-semibold">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                )
              }
              return <CrusadeCard key={crusade.id} crusade={crusade} />
            })}
          </div>
        )}
      </div>

      {/* Recent Activity - Placeholder */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="card">
            <p className="text-gray-400 text-center py-8">
              No recent activity to show
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard