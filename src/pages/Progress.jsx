import { useState } from 'react'
import { useCrusade } from '../hooks/useCrusade'
import FitnessForm from '../components/progress/FitnessForm'
import MealForm from '../components/progress/MealForm'
import ProgressHistory from '../components/progress/ProgressHistory'
import ProgressGraph from '../components/progress/ProgressGraph'
import CrusadeSelector from '../components/crusades/CrusadeSelector'
import { FitnessIcon, MealIcon, ChartIcon } from '../components/icons/Icons'
import { EXERCISES } from '../utils/constants'

const Progress = () => {
  const { enrolledCrusades, selectedCrusade, setSelectedCrusade } = useCrusade()
  const [activeTab, setActiveTab] = useState('fitness')
  const [showHistory, setShowHistory] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState('bench_press')

  const fitnessCrusades = enrolledCrusades.filter(c => c.type === 'fitness')
  const mealCrusades = enrolledCrusades.filter(c => c.type === 'meal')

  // Mock data for graph (in production, this would come from API)
  const mockGraphData = [
    { exercise_type: 'bench_press', current_weight_kg: 60, current_reps: 10, sets: 3, created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
    { exercise_type: 'bench_press', current_weight_kg: 65, current_reps: 10, sets: 3, created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
    { exercise_type: 'bench_press', current_weight_kg: 67.5, current_reps: 10, sets: 3, created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
    { exercise_type: 'bench_press', current_weight_kg: 70, current_reps: 8, sets: 3, created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
    { exercise_type: 'bench_press', current_weight_kg: 72.5, current_reps: 8, sets: 3, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    { exercise_type: 'bench_press', current_weight_kg: 75, current_reps: 8, sets: 3, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { exercise_type: 'bench_press', current_weight_kg: 80, current_reps: 6, sets: 3, created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gradient-gold">Log Progress</h1>
        <p className="text-gray-400">
          Track your fitness achievements and meal accountability
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-black rounded-lg p-1 border border-gray-800">
        <button
          onClick={() => setActiveTab('fitness')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-bold transition-all duration-300 ${
            activeTab === 'fitness'
              ? 'bg-vvv-gold text-black'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <FitnessIcon className="w-5 h-5" />
          <span>Fitness</span>
        </button>
        <button
          onClick={() => {}}
          disabled={true}
          className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-bold transition-colors relative text-gray-600 cursor-not-allowed"
        >
          <MealIcon className="w-5 h-5" />
          <span>Meals</span>
          <span className="ml-2 text-xs font-normal">(Coming Soon)</span>
        </button>
      </div>

      {/* Crusade Selection */}
      {activeTab === 'fitness' && fitnessCrusades.length > 0 && (
        <div className="mb-6">
          <CrusadeSelector
            crusades={fitnessCrusades}
            selectedCrusade={selectedCrusade}
            onSelect={setSelectedCrusade}
          />
        </div>
      )}

      {/* Forms */}
      <div className="card-gold mb-6">
        {activeTab === 'fitness' ? (
          fitnessCrusades.length > 0 ? (
            <FitnessForm crusadeId={selectedCrusade || fitnessCrusades[0]?.id} />
          ) : (
            <p className="text-center text-gray-400 py-8">
              Join a fitness crusade to start logging progress
            </p>
          )
        ) : (
          <div className="text-center py-12">
            <MealIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">Meal Tracking Coming Soon</h3>
            <p className="text-gray-600">
              We're cooking up something special for meal accountability tracking!
            </p>
          </div>
        )}
      </div>

      {/* Progress Visualization - Only show for fitness tab */}
      {activeTab === 'fitness' && (
        <>
          {/* Graph Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowGraph(!showGraph)}
              className="text-vvv-gold hover:text-white transition-colors font-bold flex items-center space-x-2"
            >
              <ChartIcon className="w-5 h-5" />
              <span>{showGraph ? 'Hide' : 'Show'} Progress Graph</span>
              <span className="text-xl">→</span>
            </button>
          </div>

          {showGraph && (
            <div className="card premium-border mb-6 animate-fadeIn">
              <div className="mb-4">
                <label className="label mb-2 block">Select Exercise to Visualize</label>
                <select
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  className="w-full"
                >
                  {Object.entries(EXERCISES).map(([key, ex]) => (
                    <option key={key} value={key}>
                      {ex.icon} {ex.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <ProgressGraph 
                data={mockGraphData} 
                exerciseType={selectedExercise}
              />
            </div>
          )}

          {/* History Section */}
          <div className="text-center mb-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-vvv-gold hover:text-white transition-colors font-bold"
            >
              {showHistory ? 'Hide' : 'Show'} Progress History →
            </button>
          </div>

          {/* Progress History */}
          {showHistory && <ProgressHistory type={activeTab} />}
        </>
      )}
    </div>
  )
}

export default Progress