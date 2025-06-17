import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { DEFAULT_AVATAR } from '../../utils/constants'

const UserProfile = () => {
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const avatarUrl = user?.discord_avatar 
    ? `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.png`
    : DEFAULT_AVATAR

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
      >
        <img 
          src={avatarUrl} 
          alt={user?.discord_username || 'User'} 
          className="w-8 h-8 rounded-full border-2 border-vvv-gold"
        />
        <span className="text-sm font-medium hidden sm:block">
          {user?.discord_username}
        </span>
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-vvv-grey-dark border border-vvv-grey rounded-lg shadow-lg z-20">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm hover:bg-vvv-grey transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              Profile
            </Link>
            <div className="border-t border-vvv-grey">
              <button
                onClick={() => {
                  setShowDropdown(false)
                  logout()
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-vvv-grey transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default UserProfile