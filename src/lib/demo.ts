import { Profile, Ride, RideRequest, Rating } from '../types'

// Detect if running without real Supabase credentials
export const IS_DEMO_MODE =
  !import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL.includes('your-project-ref') ||
  import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

// ─── LocalStorage helpers ─────────────────────────────────────────────────────
function getStore<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : defaultValue
  } catch {
    return defaultValue
  }
}
function setStore<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

const KEYS = {
  SESSION: 'rs_session',
  PROFILES: 'rs_profiles',
  RIDES: 'rs_rides',
  REQUESTS: 'rs_requests',
  RATINGS: 'rs_ratings',
}

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_PROFILES: Profile[] = [
  {
    id: 'driver-1',
    name: 'Priya Sharma',
    email: 'priya@iit.edu',
    phone: '+91 9876543210',
    avatar_url: null,
    rating: 4.8,
    total_rides_driver: 12,
    total_rides_passenger: 5,
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'driver-2',
    name: 'Rahul Mehta',
    email: 'rahul@bits.edu',
    phone: '+91 9812345678',
    avatar_url: null,
    rating: 4.5,
    total_rides_driver: 8,
    total_rides_passenger: 15,
    created_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 'driver-3',
    name: 'Ananya Singh',
    email: 'ananya@nit.edu',
    phone: '+91 9998887770',
    avatar_url: null,
    rating: 5.0,
    total_rides_driver: 20,
    total_rides_passenger: 2,
    created_at: '2026-01-05T08:00:00Z',
  },
]

const today = new Date()
const d = (offset: number) => {
  const dt = new Date(today)
  dt.setDate(dt.getDate() + offset)
  return dt.toISOString().split('T')[0]
}

const SEED_RIDES: Ride[] = [
  {
    id: 'ride-1',
    driver_id: 'driver-1',
    source: 'IIT Main Gate',
    destination: 'Andheri Station',
    ride_date: d(1),
    ride_time: '08:30',
    seats_total: 3,
    seats_available: 2,
    price_per_seat: 80,
    notes: 'AC Sedan, please be on time',
    status: 'active',
    created_at: new Date().toISOString(),
    driver: SEED_PROFILES[0],
  },
  {
    id: 'ride-2',
    driver_id: 'driver-2',
    source: 'BITS Pilani Campus',
    destination: 'Jaipur Airport',
    ride_date: d(2),
    ride_time: '06:00',
    seats_total: 4,
    seats_available: 3,
    price_per_seat: 150,
    notes: 'Early morning, music allowed',
    status: 'active',
    created_at: new Date().toISOString(),
    driver: SEED_PROFILES[1],
  },
  {
    id: 'ride-3',
    driver_id: 'driver-3',
    source: 'NIT College Road',
    destination: 'Railway Station',
    ride_date: d(1),
    ride_time: '14:00',
    seats_total: 2,
    seats_available: 1,
    price_per_seat: null,
    notes: 'Girls only, free ride!',
    status: 'active',
    created_at: new Date().toISOString(),
    driver: SEED_PROFILES[2],
  },
  {
    id: 'ride-4',
    driver_id: 'driver-1',
    source: 'University Library',
    destination: 'City Mall',
    ride_date: d(3),
    ride_time: '17:30',
    seats_total: 4,
    seats_available: 4,
    price_per_seat: 40,
    notes: 'Evening ride, AC car',
    status: 'active',
    created_at: new Date().toISOString(),
    driver: SEED_PROFILES[0],
  },
]

// ─── Seed initializer ─────────────────────────────────────────────────────────
function initSeedData() {
  if (!localStorage.getItem('rs_seeded')) {
    setStore(KEYS.PROFILES, SEED_PROFILES)
    setStore(KEYS.RIDES, SEED_RIDES)
    setStore(KEYS.REQUESTS, [])
    setStore(KEYS.RATINGS, [])
    localStorage.setItem('rs_seeded', '1')
  }
}

// ─── Demo Auth ────────────────────────────────────────────────────────────────
export interface DemoSession {
  user: Profile
}

export const demoAuth = {
  init: initSeedData,

  getSession(): DemoSession | null {
    initSeedData()
    return getStore<DemoSession | null>(KEYS.SESSION, null)
  },

  signUp(name: string, email: string, phone: string, _password: string): { data: DemoSession; error: null } | { data: null; error: string } {
    initSeedData()
    const profiles = getStore<Profile[]>(KEYS.PROFILES, [])
    if (profiles.find((p) => p.email === email)) {
      return { data: null, error: 'Email already registered. Please log in.' }
    }
    const profile: Profile = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      avatar_url: null,
      rating: 0,
      total_rides_driver: 0,
      total_rides_passenger: 0,
      created_at: new Date().toISOString(),
    }
    setStore(KEYS.PROFILES, [...profiles, profile])
    const session: DemoSession = { user: profile }
    setStore(KEYS.SESSION, session)
    return { data: session, error: null }
  },

  signIn(email: string, password: string): { data: DemoSession; error: null } | { data: null; error: string } {
    initSeedData()
    if (!password || password.length < 1) {
      return { data: null, error: 'Please enter your password.' }
    }
    const profiles = getStore<Profile[]>(KEYS.PROFILES, [])
    const profile = profiles.find((p) => p.email === email)
    if (!profile) {
      return { data: null, error: 'Account not found. Please sign up first.' }
    }
    const session: DemoSession = { user: profile }
    setStore(KEYS.SESSION, session)
    return { data: session, error: null }
  },

  signOut() {
    localStorage.removeItem(KEYS.SESSION)
  },

  updateProfile(userId: string, updates: Partial<Profile>) {
    const profiles = getStore<Profile[]>(KEYS.PROFILES, [])
    const updated = profiles.map((p) => (p.id === userId ? { ...p, ...updates } : p))
    setStore(KEYS.PROFILES, updated)
    const session = getStore<DemoSession | null>(KEYS.SESSION, null)
    if (session && session.user.id === userId) {
      setStore(KEYS.SESSION, { user: { ...session.user, ...updates } })
    }
    return updated.find((p) => p.id === userId) || null
  },
}

// ─── Demo DB ──────────────────────────────────────────────────────────────────
export const demoDB = {
  // Profiles
  getProfile(id: string): Profile | null {
    const profiles = getStore<Profile[]>(KEYS.PROFILES, [])
    return profiles.find((p) => p.id === id) || null
  },

  // Rides
  getRides(filters?: { source?: string; destination?: string; date?: string }): Ride[] {
    let rides = getStore<Ride[]>(KEYS.RIDES, [])
    const profiles = getStore<Profile[]>(KEYS.PROFILES, [])
    rides = rides
      .filter((r) => r.status === 'active')
      .map((r) => ({ ...r, driver: profiles.find((p) => p.id === r.driver_id) }))
    if (filters?.date) rides = rides.filter((r) => r.ride_date === filters.date)
    if (filters?.source) rides = rides.filter((r) => r.source.toLowerCase().includes(filters.source!.toLowerCase()))
    if (filters?.destination) rides = rides.filter((r) => r.destination.toLowerCase().includes(filters.destination!.toLowerCase()))
    return rides.sort((a, b) => a.ride_date.localeCompare(b.ride_date))
  },

  getRideById(id: string): Ride | null {
    const rides = getStore<Ride[]>(KEYS.RIDES, [])
    const profiles = getStore<Profile[]>(KEYS.PROFILES, [])
    const ride = rides.find((r) => r.id === id)
    if (!ride) return null
    return { ...ride, driver: profiles.find((p) => p.id === ride.driver_id) }
  },

  getMyRides(driverId: string): Ride[] {
    const rides = getStore<Ride[]>(KEYS.RIDES, [])
    return rides.filter((r) => r.driver_id === driverId).sort((a, b) => b.ride_date.localeCompare(a.ride_date))
  },

  postRide(driverId: string, data: Omit<Ride, 'id' | 'created_at' | 'driver' | 'seats_available'>): Ride {
    const rides = getStore<Ride[]>(KEYS.RIDES, [])
    const profiles = getStore<Profile[]>(KEYS.PROFILES, [])
    const newRide: Ride = {
      ...data,
      id: `ride-${Date.now()}`,
      seats_available: data.seats_total,
      created_at: new Date().toISOString(),
      driver: profiles.find((p) => p.id === driverId),
    }
    setStore(KEYS.RIDES, [...rides, newRide])
    return newRide
  },

  cancelRide(rideId: string) {
    const rides = getStore<Ride[]>(KEYS.RIDES, [])
    setStore(KEYS.RIDES, rides.map((r) => (r.id === rideId ? { ...r, status: 'cancelled' } : r)))
  },

  decrementSeats(rideId: string) {
    const rides = getStore<Ride[]>(KEYS.RIDES, [])
    setStore(KEYS.RIDES, rides.map((r) => r.id === rideId ? { ...r, seats_available: Math.max(0, r.seats_available - 1) } : r))
  },

  // Ride Requests
  getRequests(rideId: string): RideRequest[] {
    const requests = getStore<RideRequest[]>(KEYS.REQUESTS, [])
    const profiles = getStore<Profile[]>(KEYS.PROFILES, [])
    return requests.filter((r) => r.ride_id === rideId).map((r) => ({
      ...r,
      passenger: profiles.find((p) => p.id === r.passenger_id),
    }))
  },

  getMyRequests(passengerId: string): RideRequest[] {
    const requests = getStore<RideRequest[]>(KEYS.REQUESTS, [])
    const rides = getStore<Ride[]>(KEYS.RIDES, [])
    const profiles = getStore<Profile[]>(KEYS.PROFILES, [])
    return requests
      .filter((r) => r.passenger_id === passengerId)
      .map((r) => {
        const ride = rides.find((ride) => ride.id === r.ride_id)
        return {
          ...r,
          ride: ride ? { ...ride, driver: profiles.find((p) => p.id === ride.driver_id) } : undefined,
        }
      })
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
  },

  addRequest(rideId: string, passengerId: string): { error: string | null } {
    const requests = getStore<RideRequest[]>(KEYS.REQUESTS, [])
    if (requests.find((r) => r.ride_id === rideId && r.passenger_id === passengerId)) {
      return { error: 'You have already requested this ride.' }
    }
    const newReq: RideRequest = {
      id: `req-${Date.now()}`,
      ride_id: rideId,
      passenger_id: passengerId,
      status: 'pending',
      created_at: new Date().toISOString(),
    }
    setStore(KEYS.REQUESTS, [...requests, newReq])
    return { error: null }
  },

  updateRequest(requestId: string, status: 'accepted' | 'rejected') {
    const requests = getStore<RideRequest[]>(KEYS.REQUESTS, [])
    setStore(KEYS.REQUESTS, requests.map((r) => (r.id === requestId ? { ...r, status } : r)))
  },

  // Ratings
  addRating(rating: Omit<Rating, 'id' | 'created_at'>): { error: string | null } {
    const ratings = getStore<Rating[]>(KEYS.RATINGS, [])
    if (ratings.find((r) => r.ride_id === rating.ride_id && r.rater_id === rating.rater_id)) {
      return { error: 'You have already rated this ride.' }
    }
    const newRating: Rating = { ...rating, id: `rating-${Date.now()}`, created_at: new Date().toISOString() }
    setStore(KEYS.RATINGS, [...ratings, newRating])
    // Recalculate average for ratee
    const allRatings = [...ratings, newRating]
    const rateeRatings = allRatings.filter((r) => r.ratee_id === rating.ratee_id)
    const avg = rateeRatings.reduce((sum, r) => sum + r.stars, 0) / rateeRatings.length
    const profiles = getStore<Profile[]>(KEYS.PROFILES, [])
    setStore(KEYS.PROFILES, profiles.map((p) => p.id === rating.ratee_id ? { ...p, rating: Math.round(avg * 10) / 10 } : p))
    return { error: null }
  },
}
