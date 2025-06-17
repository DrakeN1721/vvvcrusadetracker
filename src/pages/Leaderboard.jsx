import { useEffect } from 'react'

const Leaderboard = () => {
  useEffect(() => {
    // Redirect to chips.vvv.net
    window.location.href = 'https://chips.vvv.net/'
  }, [])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="loading-spinner w-12 h-12 border-4 mb-4 mx-auto" />
        <p className="text-gray-400">Redirecting to chips.vvv.net...</p>
      </div>
    </div>
  )
}

export default Leaderboard