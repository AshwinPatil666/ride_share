import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { IS_DEMO_MODE, demoAuth } from '../lib/demo'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (IS_DEMO_MODE) {
      const result = demoAuth.signIn(email, password)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Login Successful!')
        navigate('/home')
        window.location.reload()
      }
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Welcome back!')
      navigate('/home')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md border">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">College RideShare</h1>
        <h2 className="text-xl font-semibold mb-2">Login</h2>
        <p className="text-gray-500 text-sm mb-6">Enter your email and password</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded mt-1"
              placeholder="student@college.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded mt-1"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          New user? <Link to="/signup" className="text-blue-600 font-bold underline">Sign Up here</Link>
        </p>
      </div>
      {IS_DEMO_MODE && (
        <p className="mt-4 text-xs text-gray-400">Demo Mode Active: Use any credentials</p>
      )}
    </div>
  )
}
