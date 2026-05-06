import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { IS_DEMO_MODE, demoDB } from '../lib/demo'
import { Ride, RideRequest, PostRideFormData } from '../types'

export function useRides() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchActiveRides = async (filters?: {
    source?: string
    destination?: string
    date?: string
  }): Promise<Ride[]> => {
    setLoading(true)
    setError(null)
    try {
      if (IS_DEMO_MODE) {
        await delay(300)
        return demoDB.getRides(filters)
      }

      let query = supabase
        .from('rides')
        .select(`*, driver:profiles!driver_id(*)`)
        .eq('status', 'active')
        .order('ride_date', { ascending: true })

      if (filters?.date) query = query.eq('ride_date', filters.date)

      const { data, error: err } = await query
      if (err) throw err

      let results = (data as Ride[]) || []
      if (filters?.source)
        results = results.filter((r) => r.source.toLowerCase().includes(filters.source!.toLowerCase()))
      if (filters?.destination)
        results = results.filter((r) => r.destination.toLowerCase().includes(filters.destination!.toLowerCase()))
      return results
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch rides'
      setError(msg)
      return []
    } finally {
      setLoading(false)
    }
  }

  const fetchRideById = async (id: string): Promise<Ride | null> => {
    setLoading(true)
    try {
      if (IS_DEMO_MODE) {
        await delay(200)
        return demoDB.getRideById(id)
      }
      const { data, error: err } = await supabase
        .from('rides')
        .select(`*, driver:profiles!driver_id(*)`)
        .eq('id', id)
        .single()
      if (err) throw err
      return data as Ride
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }

  const fetchMyRides = async (driverId: string): Promise<Ride[]> => {
    setLoading(true)
    try {
      if (IS_DEMO_MODE) {
        await delay(200)
        return demoDB.getMyRides(driverId)
      }
      const { data, error: err } = await supabase
        .from('rides')
        .select('*')
        .eq('driver_id', driverId)
        .order('ride_date', { ascending: false })
      if (err) throw err
      return (data as Ride[]) || []
    } catch {
      return []
    } finally {
      setLoading(false)
    }
  }

  const postRide = async (
    driverId: string,
    formData: PostRideFormData
  ): Promise<{ data: Ride | null; error: string | null }> => {
    try {
      if (IS_DEMO_MODE) {
        await delay(400)
        const ride = demoDB.postRide(driverId, {
          driver_id: driverId,
          source: formData.source,
          destination: formData.destination,
          ride_date: formData.ride_date,
          ride_time: formData.ride_time,
          seats_total: formData.seats_total,
          price_per_seat: formData.price_per_seat || null,
          notes: formData.notes || null,
          status: 'active',
        })
        return { data: ride, error: null }
      }

      const { data, error: err } = await supabase
        .from('rides')
        .insert({
          driver_id: driverId,
          source: formData.source,
          destination: formData.destination,
          ride_date: formData.ride_date,
          ride_time: formData.ride_time,
          seats_total: formData.seats_total,
          seats_available: formData.seats_total,
          price_per_seat: formData.price_per_seat || null,
          notes: formData.notes || null,
          status: 'active',
        })
        .select()
        .single()
      if (err) throw err
      return { data: data as Ride, error: null }
    } catch (err: unknown) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to post ride' }
    }
  }

  const cancelRide = async (rideId: string): Promise<boolean> => {
    try {
      if (IS_DEMO_MODE) {
        await delay(200)
        demoDB.cancelRide(rideId)
        return true
      }
      const { error: err } = await supabase
        .from('rides')
        .update({ status: 'cancelled' })
        .eq('id', rideId)
      if (err) throw err
      return true
    } catch {
      return false
    }
  }

  const fetchRideRequests = async (rideId: string): Promise<RideRequest[]> => {
    try {
      if (IS_DEMO_MODE) {
        await delay(100)
        return demoDB.getRequests(rideId)
      }
      const { data, error: err } = await supabase
        .from('ride_requests')
        .select(`*, passenger:profiles!passenger_id(*)`)
        .eq('ride_id', rideId)
        .order('created_at', { ascending: true })
      if (err) throw err
      return (data as RideRequest[]) || []
    } catch {
      return []
    }
  }

  const fetchMyRequests = async (passengerId: string): Promise<RideRequest[]> => {
    try {
      if (IS_DEMO_MODE) {
        await delay(200)
        return demoDB.getMyRequests(passengerId)
      }
      const { data, error: err } = await supabase
        .from('ride_requests')
        .select(`*, ride:rides(*, driver:profiles!driver_id(*))`)
        .eq('passenger_id', passengerId)
        .order('created_at', { ascending: false })
      if (err) throw err
      return (data as RideRequest[]) || []
    } catch {
      return []
    }
  }

  const requestToJoin = async (
    rideId: string,
    passengerId: string
  ): Promise<{ error: string | null }> => {
    try {
      if (IS_DEMO_MODE) {
        await delay(300)
        return demoDB.addRequest(rideId, passengerId)
      }
      const { error: err } = await supabase.from('ride_requests').insert({
        ride_id: rideId,
        passenger_id: passengerId,
        status: 'pending',
      })
      if (err) throw err
      return { error: null }
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Failed to send request' }
    }
  }

  const updateRequestStatus = async (
    requestId: string,
    status: 'accepted' | 'rejected',
    rideId?: string
  ): Promise<boolean> => {
    try {
      if (IS_DEMO_MODE) {
        await delay(300)
        demoDB.updateRequest(requestId, status)
        if (status === 'accepted' && rideId) {
          demoDB.decrementSeats(rideId)
        }
        return true
      }
      const { error: err } = await supabase
        .from('ride_requests')
        .update({ status })
        .eq('id', requestId)
      if (err) throw err
      if (status === 'accepted' && rideId) {
        const { data: ride } = await supabase
          .from('rides')
          .select('seats_available')
          .eq('id', rideId)
          .single()
        if (ride && ride.seats_available > 0) {
          await supabase
            .from('rides')
            .update({ seats_available: ride.seats_available - 1 })
            .eq('id', rideId)
        }
      }
      return true
    } catch {
      return false
    }
  }

  const submitRating = async (payload: {
    ride_id: string
    rater_id: string
    ratee_id: string
    stars: number
    comment?: string
  }): Promise<{ error: string | null }> => {
    try {
      if (IS_DEMO_MODE) {
        await delay(300)
        return demoDB.addRating({ ...payload, comment: payload.comment ?? null })
      }
      const { error: err } = await supabase.from('ratings').insert(payload)
      if (err) throw err
      await supabase.rpc('recalculate_rating', { user_id: payload.ratee_id })
      return { error: null }
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Failed to submit rating' }
    }
  }

  return {
    loading,
    error,
    fetchActiveRides,
    fetchRideById,
    fetchMyRides,
    postRide,
    cancelRide,
    fetchRideRequests,
    fetchMyRequests,
    requestToJoin,
    updateRequestStatus,
    submitRating,
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
