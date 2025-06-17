import { useState } from 'react'
import { useCrusade } from '../../hooks/useCrusade'
import LoadingSpinner from '../common/LoadingSpinner'

const EnrollmentButton = ({ crusadeId, isEnrolled: initialEnrolled }) => {
  const { enrollInCrusade, unenrollFromCrusade } = useCrusade()
  const [isEnrolled, setIsEnrolled] = useState(initialEnrolled)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleToggleEnrollment = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = isEnrolled 
        ? await unenrollFromCrusade(crusadeId)
        : await enrollInCrusade(crusadeId)

      if (result.success) {
        setIsEnrolled(!isEnrolled)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleToggleEnrollment}
        disabled={loading}
        className={`${
          isEnrolled ? 'btn-secondary' : 'btn-primary'
        } min-w-[120px]`}
      >
        {loading ? (
          <LoadingSpinner size="small" />
        ) : (
          isEnrolled ? 'Leave' : 'Join'
        )}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}

export default EnrollmentButton