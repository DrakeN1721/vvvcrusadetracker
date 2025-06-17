import { EXERCISES, MEAL_TYPES } from '../../utils/constants'
import { formatDateTime, formatExerciseProgress, formatCalories, formatMacros } from '../../utils/formatters'

const ProgressCard = ({ entry, type }) => {
  const renderFitnessEntry = () => {
    const exercise = EXERCISES[entry.exercise_type]
    const unit = entry.current_weight_kg ? 'kg' : 'lbs'
    const weight = entry.current_weight_kg || entry.current_weight_lbs
    const prevWeight = entry.previous_weight_kg || entry.previous_weight_lbs
    
    return (
      <>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold flex items-center space-x-2">
            <span className="text-2xl animate-glow">{exercise?.icon}</span>
            <span className="text-lg">{exercise?.name}</span>
          </h4>
          {!entry.x_post_url && (
            <button className="group p-2 rounded-lg bg-black/50 border border-gray-800 hover:border-vvv-gold/50 hover:shadow-gold-sm transition-all duration-300">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-vvv-gold transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
          )}
        </div>
        
        <div className="space-y-2">
          {prevWeight && entry.previous_reps && (
            <div className="flex items-center space-x-2 text-gray-500">
              <span className="text-sm">Previous:</span>
              <span className="font-mono text-sm">
                {formatExerciseProgress(exercise, prevWeight, entry.previous_reps, unit)}
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-vvv-gold">Current:</span>
            <span className="font-mono text-lg glow-text">
              {formatExerciseProgress(exercise, weight, entry.current_reps, unit)}
            </span>
            {prevWeight && entry.previous_reps && (
              <span className="text-xs text-green-400 font-bold">
                +{(((weight * entry.current_reps) - (prevWeight * entry.previous_reps)) / (prevWeight * entry.previous_reps) * 100).toFixed(1)}% 📈
              </span>
            )}
          </div>
          
          {entry.sets > 1 && (
            <p className="text-sm text-gray-400">Sets: {entry.sets}</p>
          )}
        </div>
      </>
    )
  }

  const renderMealEntry = () => {
    const mealType = MEAL_TYPES[entry.meal_type]
    
    return (
      <>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold flex items-center space-x-2">
            <span className="text-2xl animate-glow">{mealType?.icon}</span>
            <span className="text-lg">{mealType?.name}</span>
          </h4>
          {!entry.x_post_url && (
            <button className="group p-2 rounded-lg bg-black/50 border border-gray-800 hover:border-vvv-gold/50 hover:shadow-gold-sm transition-all duration-300">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-vvv-gold transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
          )}
        </div>
        
        <div className="space-y-2">
          <span className="font-mono text-lg glow-text">
            {formatCalories(entry.calories)}
          </span>
          
          {(entry.protein_g || entry.carbs_g || entry.fat_g) && (
            <p className="text-sm text-gray-400">
              {formatMacros(entry.protein_g || 0, entry.carbs_g || 0, entry.fat_g || 0)}
            </p>
          )}
          
          {entry.food_items && (
            <p className="text-sm mt-1">{entry.food_items}</p>
          )}
        </div>
      </>
    )
  }

  return (
    <div className="card premium-border animate-fadeIn">
      {type === 'fitness' ? renderFitnessEntry() : renderMealEntry()}
      
      {entry.notes && (
        <p className="text-sm text-gray-300 mt-3 italic border-l-2 border-vvv-gold/30 pl-3">
          "{entry.notes}"
        </p>
      )}
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
        <span className="text-xs text-gray-600">
          {formatDateTime(entry.created_at)}
        </span>
        
        <div className="flex items-center space-x-3">
          {entry.x_post_url && (
            <a 
              href={entry.x_post_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-vvv-gold hover:text-white transition-colors flex items-center space-x-1"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>View Post</span>
            </a>
          )}
          
          {entry.photo_urls && JSON.parse(entry.photo_urls).length > 0 && (
            <span className="text-xs text-gray-500 flex items-center space-x-1">
              <span>📷</span>
              <span>{JSON.parse(entry.photo_urls).length}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProgressCard