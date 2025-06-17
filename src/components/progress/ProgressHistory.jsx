import { useState, useEffect } from 'react'
import ProgressCard from './ProgressCard'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import api from '../../services/api'

const ProgressHistory = ({ type }) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchHistory()
  }, [type])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.get('/progress/history', {
        params: { type }
      })
      
      setHistory(response.data.entries)
    } catch (err) {
      setError('Failed to load progress history')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={fetchHistory}
        className="mb-4"
      />
    )
  }

  if (history.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-400">
          No progress entries yet. Start tracking to see your history!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Your Progress History</h3>
      {history.map(entry => (
        <ProgressCard 
          key={entry.id} 
          entry={entry} 
          type={type}
        />
      ))}
    </div>
  )
}

export default ProgressHistory