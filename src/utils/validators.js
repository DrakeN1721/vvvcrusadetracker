export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validateWeight = (weight) => {
  const num = parseFloat(weight)
  return !isNaN(num) && num > 0 && num < 1000
}

export const validateReps = (reps) => {
  const num = parseInt(reps)
  return !isNaN(num) && num > 0 && num < 1000
}

export const validateCalories = (calories) => {
  const num = parseInt(calories)
  return !isNaN(num) && num > 0 && num < 10000
}

export const validateMacros = (value) => {
  const num = parseFloat(value)
  return !isNaN(num) && num >= 0 && num < 1000
}

export const validateImageFile = (file) => {
  const errors = []
  
  if (!file) {
    errors.push('No file selected')
    return errors
  }
  
  if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
    errors.push('File must be JPEG or PNG')
  }
  
  if (file.size > 5 * 1024 * 1024) {
    errors.push('File size must be less than 5MB')
  }
  
  return errors
}

export const validateXPostText = (text) => {
  if (!text || text.trim().length === 0) {
    return 'Post text is required'
  }
  
  if (text.length > 280) {
    return 'Post text must be less than 280 characters'
  }
  
  return null
}

export const validateProgressForm = (type, data) => {
  const errors = {}
  
  if (type === 'fitness') {
    if (!data.exercise_type) {
      errors.exercise_type = 'Exercise type is required'
    }
    
    if (data.exercise?.type === 'weighted') {
      if (!data.current_weight || !validateWeight(data.current_weight)) {
        errors.current_weight = 'Valid weight is required'
      }
    }
    
    if (!data.current_reps || !validateReps(data.current_reps)) {
      errors.current_reps = 'Valid reps count is required'
    }
  }
  
  if (type === 'meal') {
    if (!data.meal_type) {
      errors.meal_type = 'Meal type is required'
    }
    
    if (!data.calories || !validateCalories(data.calories)) {
      errors.calories = 'Valid calorie count is required'
    }
    
    if (data.protein && !validateMacros(data.protein)) {
      errors.protein = 'Invalid protein value'
    }
    
    if (data.carbs && !validateMacros(data.carbs)) {
      errors.carbs = 'Invalid carbs value'
    }
    
    if (data.fat && !validateMacros(data.fat)) {
      errors.fat = 'Invalid fat value'
    }
  }
  
  return Object.keys(errors).length > 0 ? errors : null
}