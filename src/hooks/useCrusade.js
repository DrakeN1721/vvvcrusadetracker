import { useContext } from 'react'
import { CrusadeContext } from '../contexts/CrusadeContext'

export const useCrusade = () => {
  const context = useContext(CrusadeContext)
  if (!context) {
    throw new Error('useCrusade must be used within a CrusadeProvider')
  }
  return context
}