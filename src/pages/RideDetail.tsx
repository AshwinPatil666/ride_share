import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { useRides } from '../hooks/useRides'
import { Ride, RideRequest } from '../types'
import BottomNav from '../components/BottomNav'

export default function RideDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { fetchRideById, fetchRideRequests, requestToJoin } = useRides()

  const [ride, setRide] = useState<Ride | null>(null)
  const [requests, setRequests] = useState<RideRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([fetchRideById(id), fetchRideRequests(id)]).then(([rideData, reqData]) => {
      setRide(rideData)
      setRequests(reqData)
      setLoading(false)
    })
  }, [id])

  const isDriver = ride?.driver_id === user?.id
  const myRequest = requests.find((r) => r.passenger_id === user?.id)
  const acceptedPassengers = requests.filter((r) => r.status === 'accepted')

  const handleJoin = async () => {
    if (!user || !ride) return
    setJoining(true)
    const { error } = await requestToJoin(ride.id, user.id)
    if (error) {
      toast.error(error)
    } else {
      toast.success('Request sent!')
      const reqData = await fetchRideRequests(ride.id)
      setRequests(reqData)
    }
    setJoining(false)
  }

  if (loading) return <div className="p-10 text-center">Loading details...</div>
  if (!ride) return <div className="p-10 text-center">Ride not found</div>

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <header className="bg-blue-600 text-white p-4 flex items-center gap-4 shadow-md">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h1 className="text-xl font-bold">Ride Details</h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* Route Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="border-b pb-4 mb-4">
            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Route</p>
            <h2 className="text-2xl font-bold text-gray-800">{ride.source} → {ride.destination}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-semibold">{ride.ride_date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Time</p>
              <p className="font-semibold">{ride.ride_time}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Price</p>
              <p className="font-semibold text-green-600">₹{ride.price_per_seat || 'Free'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Seats Available</p>
              <p className="font-semibold">{ride.seats_available} / {ride.seats_total}</p>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
            {ride.driver?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Driver</p>
            <p className="font-bold text-lg">{ride.driver?.name}</p>
            <p className="text-sm text-gray-600">{ride.driver?.rating} ★ Rating</p>
          </div>
        </div>

        {/* Notes */}
        {ride.notes && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-xs font-bold text-yellow-700 uppercase">Driver's Notes</p>
            <p className="text-sm text-yellow-800 mt-1">{ride.notes}</p>
          </div>
        )}

        {/* Passengers */}
        {acceptedPassengers.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm font-bold text-gray-500 uppercase mb-2">Confirmed Passengers</p>
            <div className="flex gap-2 flex-wrap">
              {acceptedPassengers.map((req) => (
                <div key={req.id} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {req.passenger?.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        {!isDriver && (
          <div className="pt-4">
            {myRequest ? (
              <div className="w-full text-center p-3 rounded-lg border-2 font-bold bg-white">
                {myRequest.status === 'pending' ? '⏳ Request Pending' : 
                 myRequest.status === 'accepted' ? '✅ Request Accepted' : '❌ Request Rejected'}
              </div>
            ) : (
              <button
                onClick={handleJoin}
                disabled={joining || ride.seats_available === 0}
                className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {joining ? 'Sending...' : ride.seats_available === 0 ? 'Ride Full' : 'Request to Join'}
              </button>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
