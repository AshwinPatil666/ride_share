import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useRides } from '../hooks/useRides'
import { Ride } from '../types'
import BottomNav from '../components/BottomNav'
import RideCard from '../components/RideCard'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { fetchActiveRides, loading } = useRides()
  const [rides, setRides] = useState<Ride[]>([])
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')

  const loadRides = async () => {
    const data = await fetchActiveRides({
      source: source || undefined,
      destination: destination || undefined,
    })
    setRides(data)
  }

  useEffect(() => {
    loadRides()
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">College RideShare</h1>
        <button 
          onClick={() => navigate('/profile')}
          className="bg-blue-700 p-2 rounded-full"
        >
          Profile
        </button>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Search for a Ride</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="From (e.g. Campus)"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="To (e.g. Mall)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <button
              onClick={loadRides}
              className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700"
            >
              Search Rides
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-700 mb-2">Available Rides</h3>
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : rides.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No rides found.</p>
              <button 
                onClick={() => navigate('/post-ride')}
                className="text-blue-600 font-bold mt-2 underline"
              >
                Post a Ride
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {rides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
