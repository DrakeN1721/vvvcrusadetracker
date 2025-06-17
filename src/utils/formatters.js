import { format, formatDistanceToNow } from 'date-fns'

export const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM d, yyyy h:mm a')
}

export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatWeight = (weight, unit = 'kg') => {
  return `${weight}${unit}`
}

export const formatExerciseProgress = (exercise, weight, reps, unit = 'kg') => {
  if (exercise.type === 'weighted') {
    return `${weight}${unit} x ${reps}`
  }
  return `${reps} reps`
}

export const formatCalories = (calories) => {
  return `${calories} kcal`
}

export const formatMacros = (protein, carbs, fat) => {
  return `P: ${protein}g | C: ${carbs}g | F: ${fat}g`
}

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const generateXPostText = (type, data) => {
  const { exercise, previous_weight, previous_reps, current_weight, current_reps, unit, meal_type, calories, notes } = data
  
  if (type === 'fitness') {
    let text = `${exercise.name} challenge from @vvvdotnet fitness crusades. $V\n\n`
    
    // Add previous vs current comparison
    if (exercise.type === 'weighted') {
      if (previous_weight && previous_reps) {
        text += `Previous: ${previous_weight}${unit} x ${previous_reps}\n`
      }
      text += `Current: ${current_weight}${unit} x ${current_reps}`
      
      // Calculate improvement if we have previous data
      if (previous_weight && previous_reps) {
        const prevTotal = previous_weight * previous_reps
        const currTotal = current_weight * current_reps
        const improvement = ((currTotal - prevTotal) / prevTotal * 100).toFixed(1)
        if (improvement > 0) {
          text += ` (+${improvement}% 📈)`
        }
      }
    } else {
      // Bodyweight exercises
      if (previous_reps) {
        text += `Previous: ${previous_reps} reps\n`
      }
      text += `Current: ${current_reps} reps`
      
      if (previous_reps) {
        const improvement = ((current_reps - previous_reps) / previous_reps * 100).toFixed(1)
        if (improvement > 0) {
          text += ` (+${improvement}% 📈)`
        }
      }
    }
    
    if (notes) {
      text += `\n\n${notes}`
    }
    return text
  }
  
  if (type === 'meal') {
    let text = `${meal_type} accountability from @vvvdotnet meal crusades. $V\n\n`
    text += `${calories} kcal`
    if (notes) {
      text += `\n\n${notes}`
    }
    return text
  }
  
  return ''
}

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}