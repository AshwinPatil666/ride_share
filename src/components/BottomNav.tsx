import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  return (
    <nav className="bg-white fixed bottom-0 w-full border-t flex justify-around items-center h-16 shadow-lg">
      <NavLink to="/home" className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
        <span className="text-xs font-bold">Home</span>
      </NavLink>
      <NavLink to="/my-rides" className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
        <span className="text-xs font-bold">My Rides</span>
      </NavLink>
      <NavLink to="/post-ride" className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
        <span className="text-xs font-bold font-bold">Post Ride</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
        <span className="text-xs font-bold">Profile</span>
      </NavLink>
    </nav>
  )
}
