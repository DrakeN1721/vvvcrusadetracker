import { generateXPostText } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'

const XPostPreview = ({ type, data, photos }) => {
  const { user } = useAuth()
  const postText = generateXPostText(type, data)
  const charCount = postText.length
  const charLimit = 280
  const isOverLimit = charCount > charLimit

  return (
    <div className="card bg-vvv-black border-vvv-gold/30">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-vvv-grey flex items-center justify-center">
          <span className="text-vvv-gold">X</span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold">{user?.x_username || 'Your Name'}</span>
            <span className="text-gray-500 text-sm">@{user?.x_username || 'yourhandle'}</span>
          </div>
          
          <p className="whitespace-pre-wrap">{postText}</p>
          
          {photos.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {photos.slice(0, 2).map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    📷
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-3 flex items-center justify-between">
            <div className="flex space-x-4 text-gray-500">
              <button className="hover:text-vvv-gold">💬</button>
              <button className="hover:text-vvv-gold">🔁</button>
              <button className="hover:text-vvv-gold">❤️</button>
              <button className="hover:text-vvv-gold">📊</button>
            </div>
            
            <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount}/{charLimit}
            </span>
          </div>
        </div>
      </div>
      
      {!user?.x_username && (
        <div className="mt-4 p-3 bg-vvv-gold/10 border border-vvv-gold/30 rounded-lg">
          <p className="text-sm text-vvv-gold">
            Connect your X account in your profile to share posts
          </p>
        </div>
      )}
    </div>
  )
}

export default XPostPreview