import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { useRides } from '../hooks/useRides'
import BottomNav from '../components/BottomNav'

export default function PostRide() {
  const { user } = useAuth()
  const { postRide } = useRides()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    ride_date: '',
    ride_time: '',
    seats_total: 2,
    price_per_seat: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (formData.source.length < 3 || formData.destination.length < 3) {
      toast.error('Please enter valid locations')
      return
    }

    const { error } = await postRide(user.id, {
      ...formData,
      seats_total: Number(formData.seats_total),
      price_per_seat: formData.price_per_seat ? Number(formData.price_per_seat) : undefined,
    })

    if (error) {
      toast.error(error)
    } else {
      toast.success('Ride posted successfully!')
      navigate('/home')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <header className="bg-blue-600 text-white p-4 flex items-center gap-4 shadow-md">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h1 className="text-xl font-bold">Post a Ride</h1>
      </header>

      <main className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From (Source)</label>
            <input
              name="source"
              type="text"
              required
              value={formData.source}
              onChange={handleChange}
              placeholder="e.g. Campus Main Gate"
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">To (Destination)</label>
            <input
              name="destination"
              type="text"
              required
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g. City Market"
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                name="ride_date"
                type="date"
                required
                value={formData.ride_date}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                name="ride_time"
                type="time"
                required
                value={formData.ride_time}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Available Seats</label>
            <select
              name="seats_total"
              value={formData.seats_total}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} Seats</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price per Seat (₹)</label>
            <input
              name="price_per_seat"
              type="number"
              value={formData.price_per_seat}
              onChange={handleChange}
              placeholder="0 for free"
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any instructions..."
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Post Ride Now
          </button>
        </form>
      </main>

      <BottomNav />
    </div>
  )
}
