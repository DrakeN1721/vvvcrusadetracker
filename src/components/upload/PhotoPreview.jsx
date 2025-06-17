import { useState, useEffect } from 'react'
import { formatFileSize } from '../../utils/formatters'

const PhotoPreview = ({ photo, onRemove }) => {
  const [preview, setPreview] = useState('')

  useEffect(() => {
    const url = URL.createObjectURL(photo)
    setPreview(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [photo])

  return (
    <div className="relative group">
      <img
        src={preview}
        alt={photo.name}
        className="w-full h-32 object-cover rounded-lg border border-vvv-grey"
      />
      
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
        <button
          type="button"
          onClick={onRemove}
          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs text-white p-1 rounded-b-lg">
        <p className="truncate">{photo.name}</p>
        <p className="text-gray-300">{formatFileSize(photo.size)}</p>
      </div>
    </div>
  )
}

export default PhotoPreview