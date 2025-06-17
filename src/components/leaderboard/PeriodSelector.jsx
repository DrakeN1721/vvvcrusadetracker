import { LEADERBOARD_PERIODS } from '../../utils/constants'

const PeriodSelector = ({ period, onChange }) => {
  return (
    <select
      value={period}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    >
      {Object.entries(LEADERBOARD_PERIODS).map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  )
}

export default PeriodSelector