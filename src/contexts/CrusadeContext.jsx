import { createContext, useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext'
import api from '../services/api'

export const CrusadeContext = createContext()

export const CrusadeProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext)
  const [crusades, setCrusades] = useState([])
  const [enrolledCrusades, setEnrolledCrusades] = useState([])
  const [selectedCrusade, setSelectedCrusade] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCrusades()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnrolledCrusades()
    }
  }, [isAuthenticated])

  const fetchCrusades = async () => {
    try {
      setLoading(true)
      const response = await api.get('/crusades')
      setCrusades(response.data.crusades)
    } catch (err) {
      setError('Failed to fetch crusades')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchEnrolledCrusades = async () => {
    try {
      const response = await api.get('/crusades/my')
      setEnrolledCrusades(response.data.crusades)
    } catch (err) {
      console.error('Failed to fetch enrolled crusades:', err)
    }
  }

  const enrollInCrusade = async (crusadeId) => {
    try {
      await api.post(`/crusades/${crusadeId}/enroll`)
      await fetchEnrolledCrusades()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const unenrollFromCrusade = async (crusadeId) => {
    try {
      await api.delete(`/crusades/${crusadeId}/enroll`)
      await fetchEnrolledCrusades()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const isEnrolled = (crusadeId) => {
    return enrolledCrusades.some(c => c.id === crusadeId)
  }

  const getCrusadeById = (crusadeId) => {
    return crusades.find(c => c.id === crusadeId)
  }

  const value = {
    crusades,
    enrolledCrusades,
    selectedCrusade,
    setSelectedCrusade,
    loading,
    error,
    enrollInCrusade,
    unenrollFromCrusade,
    isEnrolled,
    getCrusadeById,
    refreshCrusades: fetchCrusades,
    refreshEnrolled: fetchEnrolledCrusades
  }

  return (
    <CrusadeContext.Provider value={value}>
      {children}
    </CrusadeContext.Provider>
  )
}