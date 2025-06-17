import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import PhotoPreview from './PhotoPreview'
import { PhotoIcon } from '../icons/Icons'
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '../../utils/constants'
import { formatFileSize } from '../../utils/formatters'

const PhotoUploader = ({ photos, onPhotosChange, maxPhotos = 2 }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(file => {
        const error = file.errors[0]
        if (error.code === 'file-too-large') {
          return `${file.file.name} is too large (max ${formatFileSize(MAX_FILE_SIZE)})`
        }
        if (error.code === 'file-invalid-type') {
          return `${file.file.name} is not a valid image type`
        }
        return `${file.file.name} was rejected`
      })
      alert(errors.join('\n'))
      return
    }

    const newPhotos = [...photos, ...acceptedFiles].slice(0, maxPhotos)
    onPhotosChange(newPhotos)
  }, [photos, onPhotosChange, maxPhotos])

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    onPhotosChange(newPhotos)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: maxPhotos - photos.length,
    disabled: photos.length >= maxPhotos
  })

  return (
    <div>
      {photos.length < maxPhotos && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-vvv-gold bg-vvv-gold/5' 
              : 'border-gray-800 hover:border-gray-700'
          }`}
        >
          <input {...getInputProps()} />
          <PhotoIcon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
          {isDragActive ? (
            <p className="text-vvv-gold">Drop photos here...</p>
          ) : (
            <>
              <p className="text-gray-300">
                Drag & drop photos here, or click to select
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Max {maxPhotos} photos, {formatFileSize(MAX_FILE_SIZE)} each
              </p>
            </>
          )}
        </div>
      )}

      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {photos.map((photo, index) => (
            <PhotoPreview
              key={index}
              photo={photo}
              onRemove={() => removePhoto(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PhotoUploader