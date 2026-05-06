export interface Profile {
  id: string
  name: string
  email: string
  phone: string
  avatar_url: string | null
  rating: number
  total_rides_driver: number
  total_rides_passenger: number
  created_at: string
}

export interface Ride {
  id: string
  driver_id: string
  source: string
  destination: string
  ride_date: string
  ride_time: string
  seats_total: number
  seats_available: number
  price_per_seat: number | null
  notes: string | null
  status: 'active' | 'completed' | 'cancelled'
  created_at: string
  driver?: Profile
}

export interface RideRequest {
  id: string
  ride_id: string
  passenger_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  passenger?: Profile
  ride?: Ride
}

export interface Rating {
  id: string
  ride_id: string
  rater_id: string
  ratee_id: string
  stars: number
  comment: string | null
  created_at: string
}

export interface PostRideFormData {
  source: string
  destination: string
  ride_date: string
  ride_time: string
  seats_total: number
  price_per_seat?: number
  notes?: string
}
