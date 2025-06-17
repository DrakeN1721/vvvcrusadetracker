import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CrusadeProvider } from './contexts/CrusadeContext'
import Layout from './components/common/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import CrusadeDetail from './pages/CrusadeDetail'
import Progress from './pages/Progress'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import AuthGuard from './components/auth/AuthGuard'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CrusadeProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              } />
              <Route path="/crusade/:id" element={
                <AuthGuard>
                  <CrusadeDetail />
                </AuthGuard>
              } />
              <Route path="/progress" element={
                <AuthGuard>
                  <Progress />
                </AuthGuard>
              } />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } />
            </Routes>
          </Layout>
        </CrusadeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App