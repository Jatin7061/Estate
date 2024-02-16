import React, { useEffect, useState } from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link,useNavigate } from 'react-router-dom'
import {  useSelector } from 'react-redux'

const Header = () => {
  const [searchTerm,setsearchTerm] = useState('')
  const {currentUser} = useSelector((state)=>state.user)
  const navigate = useNavigate();

  const handleSubmit =(e)=>{
  e.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('searchTerm',searchTerm);
  const searchQuery = urlParams.toString();
  navigate(`/search?${searchQuery}`)
  }


  useEffect(()=>{
  const urlParams = new URLSearchParams(location.search);
  const searchTermFormUrl = urlParams.get('searchTerm');
  if(searchTermFormUrl){
    setsearchTerm(searchTermFormUrl)
  }
  },[location.search])

  return (
<header className='bg-slate-300 shadow:md'>
    <div className='flex justify-between items-center max-w-6xl mx-auto p-2'>
    <Link to='/'>
    <h1 className='font-bold text-sm sm:text-xl'>
    <span className='text-slate-700'>SHARMA</span>
    <span className='text-slate-900'>Estate</span>
    </h1>
    </Link>
    <form onSubmit={handleSubmit} className='flex items-center bg-slate-100 p-2 rounded-lg'>
        <input type='text' value={searchTerm} onChange={(e)=>setsearchTerm(e.target.value)} placeholder='Search' className='bg-transparent focus:outline-none w-24 sm:w-60'/>
        <button >
        <FaSearch className='text-slate-700'/>
        </button>
    </form>
    <ul className='flex gap-4'>
        <Link to='/'>
        <li className='hidden sm:inline text-slate-900 hover:underline'>Home</li>
        </Link>
        <Link to='/about'>
        <li className='hidden sm:inline text-slate-900 hover:underline'>About</li>
        </Link>
        <Link to='/profile'>
          { currentUser ? (<img  className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='Profile' referrerPolicy="no-referrer"/>) :
        <li className='sm:inline text-slate-900 hover:underline'>Sign Up</li>
          }
        </Link>
    </ul>
    </div>
</header>
  )
}

export default Header
