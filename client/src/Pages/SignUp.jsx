import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';


const SignUp = () => {
  const [formData,setformData] = useState({});
  const [error,seterror] = useState(null);
  const [loading,setloading] = useState(false);
  const navigate = useNavigate();

  const handlerChange=(e)=>{
    setformData({
      ...formData,
      [e.target.id]:e.target.value
    })
  }
  const SubmitHandler=async(e)=>{
   e.preventDefault();
   try{
   setloading(true);
   const res = await fetch('http://localhost:5000/signup',{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
   })
   const data = await res.json();
   console.log(data);
   if(data.success === false){
    setloading(false);
    seterror(data.message);
    return;
   }
   setloading(false);
   seterror(null);
   navigate('/sign-in');
 } catch (error) {
   setloading(false);
   seterror(error.message);
 }
  }
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-center my-7 font-semibold '>Sign-Up</h1>
    <form className='flex flex-col gap-4'>
      <input onChange={handlerChange} type="text" placeholder='Username' className='border p-3 rounded-lg' id="username" name="username"/> 
      <input onChange={handlerChange} type="email" placeholder='Email' className='border p-3 rounded-lg' id="email" name="email"/>
      <input onChange={handlerChange} type="password" placeholder='Password' className='border p-3 rounded-lg' id="password" name="password"/>
      <button onClick={SubmitHandler} className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-80'>
        {loading ? 'Loading' : 'SignUp'}</button>
        <OAuth/>
    </form>
    <div className='flex gap-2 mt-5'>
      <p>Don't Have an account?</p>
      <Link to="/sign-in"><span className='text-blue-600'>Sign in</span></Link>
    </div>
    {error && <p className='text-red-500 mt-5'>{error}</p>}
  </div>
  )
}

export default SignUp
