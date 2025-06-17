import { DEFAULT_AVATAR } from '../../utils/constants'
import { formatNumber } from '../../utils/formatters'

const LeaderboardRow = ({ entry, rank, crusadeType }) => {
  const isTopThree = rank <= 3
  const medals = ['🥇', '🥈', '🥉']
  
  const avatarUrl = entry.discord_avatar 
    ? `https://cdn.discordapp.com/avatars/${entry.discord_id}/${entry.discord_avatar}.png`
    : DEFAULT_AVATAR

  const getStatDisplay = () => {
    if (crusadeType === 'fitness') {
      return (
        <div className="text-right">
          <div className="text-lg font-semibold">{formatNumber(entry.total_reps)} reps</div>
          <div className="text-sm text-gray-400">{entry.workouts} workouts</div>
        </div>
      )
    } else if (crusadeType === 'meal') {
      return (
        <div className="text-right">
          <div className="text-lg font-semibold">{formatNumber(entry.total_calories)} kcal</div>
          <div className="text-sm text-gray-400">{entry.meals} meals</div>
        </div>
      )
    } else {
      return (
        <div className="text-right">
          <div className="text-lg font-semibold">{formatNumber(entry.score)} pts</div>
          <div className="text-sm text-gray-400">{entry.entries} entries</div>
        </div>
      )
    }
  }

  return (
    <div className={`leaderboard-row ${isTopThree ? 'gold' : ''} flex items-center`}>
      <div className="flex items-center flex-1 space-x-4">
        {/* Rank */}
        <div className="w-12 text-center">
          {isTopThree ? (
            <span className="text-2xl">{medals[rank - 1]}</span>
          ) : (
            <span className="text-lg font-semibold text-gray-400">#{rank}</span>
          )}
        </div>

        {/* User Info */}
        <img 
          src={avatarUrl} 
          alt={entry.discord_username} 
          className="w-10 h-10 rounded-full border-2 border-vvv-gold/50"
        />
        <div className="flex-1">
          <div className="font-semibold">{entry.discord_username}</div>
          {entry.x_username && (
            <div className="text-sm text-gray-400">@{entry.x_username}</div>
          )}
        </div>
      </div>

      {/* Stats */}
      {getStatDisplay()}
    </div>
  )
}

export default LeaderboardRow