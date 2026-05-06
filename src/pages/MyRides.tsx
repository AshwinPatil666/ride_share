import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { useRides } from '../hooks/useRides'
import { Ride, RideRequest } from '../types'
import BottomNav from '../components/BottomNav'

export default function MyRides() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { fetchMyRides, fetchRideRequests, updateRequestStatus } = useRides()

  const [rides, setRides] = useState<Ride[]>([])
  const [requestsMap, setRequestsMap] = useState<Record<string, RideRequest[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchMyRides(user.id).then(async (myRides) => {
      setRides(myRides)
      const map: Record<string, RideRequest[]> = {}
      await Promise.all(
        myRides.map(async (ride) => {
          map[ride.id] = await fetchRideRequests(ride.id)
        })
      )
      setRequestsMap(map)
      setLoading(false)
    })
  }, [user])

  const handleStatus = async (requestId: string, rideId: string, status: 'accepted' | 'rejected') => {
    const ok = await updateRequestStatus(requestId, status, rideId)
    if (ok) {
      toast.success(`Request ${status}!`)
      const updated = await fetchRideRequests(rideId)
      setRequestsMap((prev) => ({ ...prev, [rideId]: updated }))
      if (status === 'accepted') {
        setRides((prev) =>
          prev.map((r) =>
            r.id === rideId ? { ...r, seats_available: Math.max(0, r.seats_available - 1) } : r
          )
        )
      }
    } else {
      toast.error('Failed to update request')
    }
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Loading your rides...</div>

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">My Rides</h1>
        <button onClick={() => navigate('/post-ride')} className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
          + New Ride
        </button>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {rides.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border">
            <p className="text-gray-500">You haven't posted any rides yet.</p>
          </div>
        ) : (
          rides.map((ride) => (
            <div key={ride.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">{ride.source} → {ride.destination}</p>
                  <p className="text-xs text-gray-500">{ride.ride_date} at {ride.ride_time}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${ride.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                  {ride.status}
                </span>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Requests</p>
                {(requestsMap[ride.id] || []).length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No requests yet.</p>
                ) : (
                  (requestsMap[ride.id] || []).map((req) => (
                    <div key={req.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-dashed">
                      <div>
                        <p className="text-sm font-semibold">{req.passenger?.name}</p>
                        <p className="text-[10px] text-gray-500 capitalize">{req.status}</p>
                      </div>
                      {req.status === 'pending' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleStatus(req.id, ride.id, 'accepted')}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleStatus(req.id, ride.id, 'rejected')}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  )
}
