import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({ user, setUser }) => {
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
   if(!user) return;
   const delay = setTimeout(() => {
    navigate(search.trim() ? `/?search=${encodeURIComponent
      (search) }` : "/")
   }, 500)
   return () => clearTimeout(delay);
  }, [search, navigate, user]);

  useEffect(() => {
    setSearch("");

  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
   navigate("/login");
  }
  return (
    <nav className='bg-blue-400 p-4 text-white shadow-lg'>
        <div className="container mx-auto flex items-center justify-between">
       <Link to="/">Notes App</Link>
       {user && (
        <> 
        <div>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search notes here..' 
          className='w-full px-4 py-2 bg-purple-500 text-white border border-gray-800 rounded-md outline-none focus:ring-2 focus:ring-blue-500 '/>
        </div>
           <div className='flex items-center space-x-4'> 
               <span className='text-green-200 font-medium'>{user.username}</span>
               <button onClick={handleLogout} className='bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-500 text-gray-500'>
                Logout
               </button>
           </div>
        
        </>
       )}
        </div>
    </nav>
  )
}

export default Navbar