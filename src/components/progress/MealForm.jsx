import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MEAL_TYPES } from '../../utils/constants'
import { validateProgressForm } from '../../utils/validators'
import PhotoUploader from '../upload/PhotoUploader'
import XPostPreview from '../social/XPostPreview'
import LoadingSpinner from '../common/LoadingSpinner'
import api from '../../services/api'

const MealForm = ({ crusadeId }) => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const meal_type = watch('meal_type')
  const calories = watch('calories')
  const notes = watch('food_items')

  const onSubmit = async (data) => {
    const validationErrors = validateProgressForm('meal', data)
    if (validationErrors) {
      return
    }

    setLoading(true)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('crusade_id', crusadeId)
      formData.append('meal_type', data.meal_type)
      formData.append('calories', data.calories)
      
      if (data.protein) formData.append('protein_g', data.protein)
      if (data.carbs) formData.append('carbs_g', data.carbs)
      if (data.fat) formData.append('fat_g', data.fat)
      if (data.food_items) formData.append('food_items', data.food_items)
      if (data.notes) formData.append('notes', data.notes)

      photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo)
      })

      await api.post('/progress/meal', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setSuccess(true)
      reset()
      setPhotos([])
      setShowPreview(false)
    } catch (error) {
      console.error('Failed to submit meal:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Meal Type */}
      <div className="input-group">
        <label className="label">Meal Type</label>
        <select {...register('meal_type', { required: 'Meal type is required' })}>
          <option value="">Select meal type...</option>
          {Object.entries(MEAL_TYPES).map(([key, meal]) => (
            <option key={key} value={key}>
              {meal.icon} {meal.name}
            </option>
          ))}
        </select>
        {errors.meal_type && (
          <p className="error-message">{errors.meal_type.message}</p>
        )}
      </div>

      {/* Calories */}
      <div className="input-group">
        <label className="label">Calories</label>
        <input
          type="number"
          {...register('calories', { 
            required: 'Calories is required',
            min: { value: 1, message: 'Calories must be positive' }
          })}
          placeholder="450"
        />
        {errors.calories && (
          <p className="error-message">{errors.calories.message}</p>
        )}
      </div>

      {/* Macros (Optional) */}
      <div>
        <h3 className="label mb-3">Macros (optional)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="input-group">
            <label className="text-xs text-gray-400">Protein (g)</label>
            <input
              type="number"
              step="0.1"
              {...register('protein', {
                min: { value: 0, message: 'Must be positive' }
              })}
              placeholder="0"
            />
            {errors.protein && (
              <p className="error-message">{errors.protein.message}</p>
            )}
          </div>

          <div className="input-group">
            <label className="text-xs text-gray-400">Carbs (g)</label>
            <input
              type="number"
              step="0.1"
              {...register('carbs', {
                min: { value: 0, message: 'Must be positive' }
              })}
              placeholder="0"
            />
            {errors.carbs && (
              <p className="error-message">{errors.carbs.message}</p>
            )}
          </div>

          <div className="input-group">
            <label className="text-xs text-gray-400">Fat (g)</label>
            <input
              type="number"
              step="0.1"
              {...register('fat', {
                min: { value: 0, message: 'Must be positive' }
              })}
              placeholder="0"
            />
            {errors.fat && (
              <p className="error-message">{errors.fat.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Food Items */}
      <div className="input-group">
        <label className="label">Food Items</label>
        <textarea
          {...register('food_items')}
          rows="3"
          placeholder="Eggs with bacon, zucchini, coffee..."
          className="resize-none"
        />
      </div>

      {/* Notes */}
      <div className="input-group">
        <label className="label">Notes (optional)</label>
        <textarea
          {...register('notes')}
          rows="2"
          placeholder="Meal prep Sunday!"
          className="resize-none"
        />
      </div>

      {/* Photo Upload */}
      <div className="input-group">
        <label className="label">Photos (optional)</label>
        <PhotoUploader
          photos={photos}
          onPhotosChange={setPhotos}
          maxPhotos={2}
        />
      </div>

      {/* X Post Preview */}
      {meal_type && calories && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-vvv-gold hover:text-vvv-gold-dark text-sm"
          >
            {showPreview ? 'Hide' : 'Preview'} X Post →
          </button>
          
          {showPreview && (
            <div className="mt-4">
              <XPostPreview
                type="meal"
                data={{
                  meal_type: MEAL_TYPES[meal_type]?.name,
                  calories,
                  notes: notes || watch('notes')
                }}
                photos={photos}
              />
            </div>
          )}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-500">Meal logged successfully!</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? <LoadingSpinner size="small" /> : 'Log Meal'}
      </button>
    </form>
  )
}

export default MealForm