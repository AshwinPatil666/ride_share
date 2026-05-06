import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { IS_DEMO_MODE, demoDB } from '../lib/demo'
import { Profile } from '../types'
import BottomNav from '../components/BottomNav'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const userId = (user as Profile)?.id ?? (user as { id: string })?.id

  useEffect(() => {
    if (!userId) return

    if (IS_DEMO_MODE) {
      setProfile(demoDB.getProfile(userId))
      setLoading(false)
      return
    }

    supabase.from('profiles').select('*').eq('id', userId).single().then(({ data }) => {
      setProfile(data as Profile)
      setLoading(false)
    })
  }, [userId])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    window.location.reload()
  }

  if (loading) return <div className="p-10 text-center">Loading profile...</div>

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">My Profile</h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4">
            {profile?.name?.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold">{profile?.name}</h2>
          <p className="text-gray-500">{profile?.email}</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex justify-between">
            <span className="text-gray-500">Phone</span>
            <span className="font-semibold">{profile?.phone || 'Not provided'}</span>
          </div>
          <div className="p-4 border-b flex justify-between">
            <span className="text-gray-500">Rating</span>
            <span className="font-semibold">{profile?.rating} ★</span>
          </div>
          <div className="p-4 border-b flex justify-between">
            <span className="text-gray-500">Total Rides</span>
            <span className="font-semibold">{(profile?.total_rides_driver || 0) + (profile?.total_rides_passenger || 0)}</span>
          </div>
        </div>

        <button 
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white p-3 rounded-lg font-bold hover:bg-red-600"
        >
          Logout
        </button>
      </main>

      <BottomNav />
    </div>
  )
}
