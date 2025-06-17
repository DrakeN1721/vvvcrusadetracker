import LeaderboardRow from './LeaderboardRow'

const LeaderboardTable = ({ data, crusadeType }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-400">No leaderboard data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.map((entry, index) => (
        <LeaderboardRow 
          key={entry.user_id} 
          entry={entry} 
          rank={index + 1}
          crusadeType={crusadeType}
        />
      ))}
    </div>
  )
}

export default LeaderboardTable