import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { DEFAULT_AVATAR } from '../utils/constants'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Profile = () => {
  const { user, connectX } = useAuth()
  const [connectingX, setConnectingX] = useState(false)

  const avatarUrl = user?.discord_avatar 
    ? `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.png`
    : DEFAULT_AVATAR

  const handleConnectX = async () => {
    setConnectingX(true)
    try {
      await connectX()
    } catch (err) {
      console.error('Failed to connect X:', err)
      setConnectingX(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      {/* User Info */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4 text-vvv-gold">Account Information</h2>
        
        <div className="flex items-center space-x-4 mb-6">
          <img 
            src={avatarUrl} 
            alt={user?.discord_username || 'User'} 
            className="w-20 h-20 rounded-full border-2 border-vvv-gold"
          />
          <div>
            <h3 className="text-lg font-semibold">{user?.discord_username}</h3>
            <p className="text-gray-400">Discord ID: {user?.discord_id}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Discord Account</label>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex-1 bg-vvv-grey-dark rounded-lg px-4 py-2">
                {user?.discord_username}
              </div>
              <span className="badge-success">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* X (Twitter) Connection */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4 text-vvv-gold">Social Connections</h2>
        
        <div className="space-y-4">
          <div>
            <label className="label">X (Twitter) Account</label>
            {user?.x_username ? (
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex-1 bg-vvv-grey-dark rounded-lg px-4 py-2">
                  @{user.x_username}
                </div>
                <span className="badge-success">Connected</span>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-gray-400 text-sm mb-3">
                  Connect your X account to share progress updates
                </p>
                <button
                  onClick={handleConnectX}
                  disabled={connectingX}
                  className="btn-secondary flex items-center space-x-2"
                >
                  {connectingX ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span>Connect X Account</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-vvv-gold">Your Stats</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card text-center">
            <div className="text-2xl font-bold text-vvv-gold">0</div>
            <div className="text-sm text-gray-400">Total Entries</div>
          </div>
          
          <div className="stat-card text-center">
            <div className="text-2xl font-bold text-vvv-gold">0</div>
            <div className="text-sm text-gray-400">Active Crusades</div>
          </div>
          
          <div className="stat-card text-center">
            <div className="text-2xl font-bold text-vvv-gold">0</div>
            <div className="text-sm text-gray-400">X Posts</div>
          </div>
          
          <div className="stat-card text-center">
            <div className="text-2xl font-bold text-vvv-gold">--</div>
            <div className="text-sm text-gray-400">Global Rank</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile