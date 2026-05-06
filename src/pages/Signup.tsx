import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { IS_DEMO_MODE, demoAuth } from '../lib/demo'

export default function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (IS_DEMO_MODE) {
      const result = demoAuth.signUp(formData.name, formData.email, formData.phone, formData.password)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Account created!')
        navigate('/home')
        window.location.reload()
      }
      setLoading(false)
      return
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { name: formData.name } },
    })

    if (error) {
      toast.error(error.message)
    } else if (authData.user) {
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      })
      toast.success('Welcome to RideShare!')
      navigate('/home')
    }
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md border">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">College RideShare</h1>
        <h2 className="text-xl font-semibold mb-2">Sign Up</h2>
        <p className="text-gray-500 text-sm mb-6">Create your student account</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              placeholder="student@college.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              placeholder="1234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold underline">Login here</Link>
        </p>
      </div>
    </div>
  )
}
