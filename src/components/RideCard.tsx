import { useNavigate } from 'react-router-dom'
import { Ride } from '../types'

interface Props {
  ride: Ride
}

export default function RideCard({ ride }: Props) {
  const navigate = useNavigate()
  const driver = ride.driver

  return (
    <div
      className="bg-white rounded-lg border p-4 shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
      onClick={() => navigate(`/rides/${ride.id}`)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {driver?.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-bold text-gray-800">{driver?.name || 'Driver'}</p>
            <p className="text-xs text-gray-500">Rating: {driver?.rating || '0'} ★</p>
          </div>
        </div>
        <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
          {ride.price_per_seat ? `₹${ride.price_per_seat}` : 'FREE'}
        </div>
      </div>

      <div className="space-y-1 mb-3">
        <p className="text-sm">
          <span className="text-gray-400">From:</span> <span className="font-medium">{ride.source}</span>
        </p>
        <p className="text-sm">
          <span className="text-gray-400">To:</span> <span className="font-medium">{ride.destination}</span>
        </p>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2">
        <span>{ride.ride_date} • {ride.ride_time}</span>
        <span className="text-blue-600 font-semibold">{ride.seats_available} seats left</span>
      </div>
    </div>
  )
}
