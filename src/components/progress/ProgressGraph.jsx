import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { format } from 'date-fns'
import { EXERCISES } from '../../utils/constants'

const ProgressGraph = ({ data, exerciseType }) => {
  const exercise = EXERCISES[exerciseType]
  
  // Transform data for the chart
  const chartData = data
    .filter(entry => entry.exercise_type === exerciseType)
    .map(entry => ({
      date: format(new Date(entry.created_at), 'MMM d'),
      fullDate: entry.created_at,
      weight: entry.current_weight_kg || 0,
      reps: entry.current_reps,
      totalVolume: (entry.current_weight_kg || 0) * entry.current_reps * (entry.sets || 1),
      sets: entry.sets || 1
    }))
    .reverse() // Show oldest to newest

  if (chartData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No data available for {exercise?.name || 'this exercise'}
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-black/90 border border-vvv-gold/50 rounded-lg p-3 shadow-gold">
          <p className="text-vvv-gold font-bold mb-1">{label}</p>
          <div className="space-y-1 text-sm">
            {exercise?.type === 'weighted' && (
              <p className="text-white">Weight: {data.weight}kg</p>
            )}
            <p className="text-white">Reps: {data.reps}</p>
            <p className="text-white">Sets: {data.sets}</p>
            <p className="text-vvv-gold font-bold">
              Volume: {data.totalVolume.toFixed(0)}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Total Volume Chart */}
      <div>
        <h3 className="text-sm font-bold text-vvv-gold uppercase tracking-wider mb-4">
          Total Volume Progress
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="totalVolume"
                stroke="#FFD700"
                strokeWidth={2}
                fill="url(#goldGradient)"
                filter="drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weight Progress (for weighted exercises) */}
      {exercise?.type === 'weighted' && (
        <div>
          <h3 className="text-sm font-bold text-vvv-gold uppercase tracking-wider mb-4">
            Weight Progress
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#FFD700"
                  strokeWidth={3}
                  dot={{ fill: '#FFD700', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))' }}
                  filter="drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card text-center">
          <div className="text-2xl font-bold glow-text">
            {chartData.length}
          </div>
          <div className="text-xs text-gray-500 uppercase">Sessions</div>
        </div>
        
        <div className="stat-card text-center">
          <div className="text-2xl font-bold glow-text">
            {Math.max(...chartData.map(d => d.weight))}kg
          </div>
          <div className="text-xs text-gray-500 uppercase">Max Weight</div>
        </div>
        
        <div className="stat-card text-center">
          <div className="text-2xl font-bold glow-text">
            {Math.max(...chartData.map(d => d.totalVolume)).toFixed(0)}
          </div>
          <div className="text-xs text-gray-500 uppercase">Peak Volume</div>
        </div>
      </div>
    </div>
  )
}

export default ProgressGraph