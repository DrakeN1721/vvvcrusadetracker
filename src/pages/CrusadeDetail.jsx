import { useParams, useNavigate } from 'react-router-dom'
import { useCrusade } from '../hooks/useCrusade'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EnrollmentButton from '../components/crusades/EnrollmentButton'

const CrusadeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { getCrusadeById, isEnrolled } = useCrusade()
  
  const crusade = getCrusadeById(id)
  const enrolled = isEnrolled(id)

  if (!crusade) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Crusade not found</h2>
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn-secondary"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card-gold mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-4xl">{crusade.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{crusade.name}</h1>
              <p className="text-gray-400">{crusade.type}</p>
            </div>
          </div>
          
          {isAuthenticated && (
            <EnrollmentButton 
              crusadeId={crusade.id} 
              isEnrolled={enrolled}
            />
          )}
        </div>

        <p className="text-lg mb-6">{crusade.description}</p>

        {crusade.type === 'fitness' && (
          <div className="bg-vvv-grey-dark rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-vvv-gold">Available Exercises:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div className="badge-gold">🏋️ Bench Press</div>
              <div className="badge-gold">🏋️ Deadlift</div>
              <div className="badge-gold">🏋️ Squat</div>
              <div className="badge-gold">🏋️ Overhead Press</div>
              <div className="badge-gold">💪 Push-ups</div>
              <div className="badge-gold">💪 Pull-ups</div>
            </div>
          </div>
        )}

        {crusade.type === 'meal' && (
          <div className="bg-vvv-grey-dark rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-vvv-gold">Track your meals:</h3>
            <ul className="space-y-1 text-gray-300">
              <li>• Log calories and macros</li>
              <li>• Upload meal photos</li>
              <li>• Share accountability on X</li>
              <li>• Track daily, weekly, and monthly progress</li>
            </ul>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {enrolled && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate('/progress')}
            className="card hover:shadow-gold-sm transition-shadow text-left"
          >
            <h3 className="font-semibold mb-1">Log Progress</h3>
            <p className="text-sm text-gray-400">Track your latest workout or meal</p>
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            className="card hover:shadow-gold-sm transition-shadow text-left"
          >
            <h3 className="font-semibold mb-1">View Leaderboard</h3>
            <p className="text-sm text-gray-400">See how you rank against others</p>
          </button>
        </div>
      )}

      {/* Recent Activity Placeholder */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-400 text-center py-8">
          No recent activity in this crusade
        </p>
      </div>
    </div>
  )
}

export default CrusadeDetail