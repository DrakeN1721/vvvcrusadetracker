import { Link } from 'react-router-dom'
import { CRUSADE_TYPES } from '../../utils/constants'

const CrusadeCard = ({ crusade }) => {
  const typeInfo = CRUSADE_TYPES[crusade.type]

  return (
    <Link 
      to={`/crusade/${crusade.id}`}
      className="card hover:shadow-gold-sm transition-all duration-200 block"
    >
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{crusade.icon || typeInfo?.icon || '🎯'}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{crusade.name}</h3>
          <p className="text-sm text-gray-400 mb-2">{typeInfo?.name}</p>
          <p className="text-sm text-gray-300">{crusade.description}</p>
        </div>
      </div>
    </Link>
  )
}

export default CrusadeCard