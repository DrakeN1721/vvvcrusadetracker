import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { EXERCISES } from '../../utils/constants'
import { validateProgressForm } from '../../utils/validators'
import PhotoUploader from '../upload/PhotoUploader'
import XPostPreview from '../social/XPostPreview'
import LoadingSpinner from '../common/LoadingSpinner'
import { WeightIcon } from '../icons/Icons'
import api from '../../services/api'

const FitnessForm = ({ crusadeId }) => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const selectedExercise = watch('exercise_type')
  const exercise = EXERCISES[selectedExercise]
  
  // Watch all fields for X preview
  const watchedFields = watch()

  const onSubmit = async (data) => {
    const validationErrors = validateProgressForm('fitness', { ...data, exercise })
    if (validationErrors) {
      return
    }

    setLoading(true)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('crusade_id', crusadeId)
      formData.append('exercise_type', data.exercise_type)
      formData.append('current_reps', data.current_reps)
      formData.append('sets', data.sets || 1)
      
      if (exercise?.type === 'weighted') {
        // Previous weights
        if (data.previous_weight) {
          formData.append('previous_weight_kg', data.unit === 'kg' ? data.previous_weight : data.previous_weight * 0.453592)
          formData.append('previous_weight_lbs', data.unit === 'lbs' ? data.previous_weight : data.previous_weight * 2.20462)
        }
        if (data.previous_reps) {
          formData.append('previous_reps', data.previous_reps)
        }
        
        // Current weights
        formData.append('current_weight_kg', data.unit === 'kg' ? data.current_weight : data.current_weight * 0.453592)
        formData.append('current_weight_lbs', data.unit === 'lbs' ? data.current_weight : data.current_weight * 2.20462)
      } else {
        // For bodyweight exercises
        if (data.previous_reps) {
          formData.append('previous_reps', data.previous_reps)
        }
      }
      
      if (data.notes) {
        formData.append('notes', data.notes)
      }

      photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo)
      })

      await api.post('/progress/fitness', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setSuccess(true)
      reset()
      setPhotos([])
      setShowPreview(false)
    } catch (error) {
      console.error('Failed to submit progress:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Exercise Selection */}
      <div className="input-group">
        <label className="label flex items-center space-x-2">
          <WeightIcon className="w-4 h-4" />
          <span>Exercise</span>
        </label>
        <select 
          {...register('exercise_type', { required: 'Exercise is required' })}
          className="form-control"
        >
          <option value="">Select exercise...</option>
          {Object.entries(EXERCISES).map(([key, ex]) => (
            <option key={key} value={key}>
              {ex.name}
            </option>
          ))}
        </select>
        {errors.exercise_type && (
          <p className="error-message">{errors.exercise_type.message}</p>
        )}
      </div>

      {selectedExercise && (
        <>
          {/* Previous Performance Section */}
          <div className="card-section">
            <h3 className="label mb-4">Previous Performance</h3>
            
            <div className="form-row">
              {exercise?.type === 'weighted' && (
                <div className="input-group">
                  <label className="text-xs text-gray-400">Previous Weight</label>
                  <input
                    type="number"
                    step="0.5"
                    {...register('previous_weight', { 
                      min: { value: 0, message: 'Weight must be positive' }
                    })}
                    placeholder="0"
                    className="form-control"
                  />
                  {errors.previous_weight && (
                    <p className="error-message">{errors.previous_weight.message}</p>
                  )}
                </div>
              )}

              <div className="input-group">
                <label className="text-xs text-gray-400">Previous Reps</label>
                <input
                  type="number"
                  {...register('previous_reps', { 
                    min: { value: 0, message: 'Reps must be positive' }
                  })}
                  placeholder="0"
                  className="form-control"
                />
                {errors.previous_reps && (
                  <p className="error-message">{errors.previous_reps.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Current Performance Section */}
          <div className="border border-vvv-gold/20 rounded-lg p-4 space-y-4">
            <h3 className="label mb-4">Current Performance</h3>
            
            <div className="space-y-4">
              {exercise?.type === 'weighted' && (
                <div className="form-row">
                  <div className="input-group">
                    <label className="text-xs text-gray-400">Current Weight</label>
                    <input
                      type="number"
                      step="0.5"
                      {...register('current_weight', { 
                        required: 'Weight is required',
                        min: { value: 0, message: 'Weight must be positive' }
                      })}
                      placeholder="0"
                      className="form-control"
                    />
                    {errors.current_weight && (
                      <p className="error-message">{errors.current_weight.message}</p>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="text-xs text-gray-400">Unit</label>
                    <select 
                      {...register('unit')} 
                      defaultValue={exercise.defaultUnit}
                      className="form-control"
                    >
                      {exercise.units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Current Reps and Sets */}
              <div className="form-row">
                <div className="input-group">
                  <label className="text-xs text-gray-400">Current Reps</label>
                  <input
                    type="number"
                    {...register('current_reps', { 
                      required: 'Reps is required',
                      min: { value: 1, message: 'Reps must be at least 1' }
                    })}
                    placeholder="0"
                    className="form-control"
                  />
                  {errors.current_reps && (
                    <p className="error-message">{errors.current_reps.message}</p>
                  )}
                </div>

                <div className="input-group">
                  <label className="text-xs text-gray-400">Sets</label>
                  <input
                    type="number"
                    {...register('sets')}
                    defaultValue="1"
                    placeholder="1"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="input-group">
            <label className="label">Notes (optional)</label>
            <textarea
              {...register('notes')}
              rows="3"
              placeholder="Form felt smooth, new PR!"
              className="form-control resize-none"
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
          {watchedFields.current_reps && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-vvv-gold hover:text-vvv-gold-dark text-sm font-medium"
              >
                {showPreview ? 'Hide' : 'Preview'} X Post →
              </button>
              
              {showPreview && (
                <div className="mt-4">
                  <XPostPreview
                    type="fitness"
                    data={{
                      exercise,
                      previous_weight: watchedFields.previous_weight,
                      previous_reps: watchedFields.previous_reps,
                      current_weight: watchedFields.current_weight,
                      current_reps: watchedFields.current_reps,
                      unit: watchedFields.unit,
                      notes: watchedFields.notes
                    }}
                    photos={photos}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-500">Progress logged successfully!</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !selectedExercise}
        className="btn-primary w-full"
      >
        {loading ? <LoadingSpinner size="small" /> : 'Log Progress'}
      </button>
    </form>
  )
}

export default FitnessForm