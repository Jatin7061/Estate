import React,{useRef, useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase.js';
import { updateUserSuccess,updateUserStart,updateUserFailure,deleteUserFailure,deleteUserStart,deleteUserSuccess, signoutUserStart, signoutUserFailure, signInSuccess, signoutUserSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom'


const Profile = () => {
  const dispatch = useDispatch();
  const [file,setfile] = useState(undefined);
  const [filePerc,setfilePerc]=useState(0);
  const [fileUploaderror,setfileUploaderror]=useState(false);
  const [formData,setformData] = useState({})
  const [updateUser,setupdateUser] = useState(false);
  const [UserListing,setUserListing] = useState([])
  const [showListingError,setshowListingError] = useState(false)
  const fileRef = useRef("");
  const {currentUser,loading,error} = useSelector((state)=>state.user)
  console.log(formData)
  useEffect(()=>{
  if(file){
    handlefileUpload(file)
  }
  },[file])

  const handlefileUpload=(file)=>{
   const storage = getStorage(app);
   const fileName = new Date().getTime() + file.name;
   const storageRef = ref(storage,fileName);
   const uploadTask = uploadBytesResumable(storageRef,file);
   uploadTask.on('state_changed',
   (snapshot)=> {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setfilePerc(Math.round(progress));
   },
   (error)=>{
   setfileUploaderror(error)
   },
   ()=>{
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
    setformData({...formData,avatar: downloadURL})
    })
   }
   )
  }
  const handleOnChange = (e)=>{
    setformData({
      ...formData,
      [e.target.id]: e.target.value
    })
   }
   const handleSubmit =async(e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setupdateUser(true)

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
   }
   const handleDelete=async()=>{
    try {
     dispatch(deleteUserStart());
     const res = await fetch(`/api/user/delete/${currentUser._id}`,{
      method: "DELETE"
     })
     const data = await res.json();
     if(data.success === false){
      dispatch(deleteUserFailure(data.message));
      return;
     }
     dispatch(deleteUserSuccess(data)); 
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
   }

   const handleSignOut =async()=>{
    try {
      dispatch(signoutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success === false){
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data))
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
   }
   const handleShowListings =async()=>{
    try {
      setshowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json();
      if(data.success === false){
        setshowListingError(true)
        return
      }
      setUserListing(data);
    } catch (error) {
      setshowListingError(true)
    }
   }
   console.log(formData)
  return (
    <div className='p-3 max-w-lg mx-auto '>
    <h1 className='text-3xl text-center font-semibold my-4'>Profile</h1>
    <form  className='flex flex-col'>
      <input type="file" ref={fileRef} onChange={(e)=>setfile(e.target.files[0])} hidden accept='image/*' />
      <img onClick={()=>fileRef.current.click()} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center' src={formData.avatar || currentUser.avatar} alt='Profile'/>
      <p className='text-sm self-center'>
      {fileUploaderror ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
      </p>
      <input placeholder='Username' defaultValue={currentUser.username} onChange={handleOnChange} id="username" type='text' className='rounded-lg border-2 border-black-900 p-3 my-3'/>
      <input placeholder='Email' defaultValue={currentUser.email} onChange={handleOnChange} id="email" type='email' className='rounded-lg border p-3 my-3'/>
      <input placeholder='Password' id="password" onChange={handleOnChange} type='password' className='rounded-lg border p-3 my-3'/>
      <button onClick={handleSubmit} className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-80 disabled:opacity-80'>
       {loading? "Loading..." :"Update"}</button>
       <Link to="/create-listing" className='bg-red-700 text-white text-center p-3 my-3 rounded-lg uppercase hover:opacity-80 '>create listing</Link>
    </form>
    <div className='flex justify-between mt-5'>
      <span onClick={handleDelete} className='text-red-800 cursor-pointer'>Delete Account </span>
      <span onClick={handleSignOut} className='text-red-800 cursor-pointer'>Sign Out</span>
    </div> 
    <p className='text-red-700 mt-4'>{error ?error:""}</p>
    <p className='text-green-700 mt-4'>{updateUser ?"User Updated Succesfully":""}</p>
    <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listing</button>
    <p className='text-red-700 mt-4'>{showListingError ? "Error Showing List":""}</p>
    {UserListing && UserListing.length > 0 && 
    <div className='flex flex-col gap-4'>
      <h1 className='text-3xl text-center my-7'>Your Listings</h1>
    {UserListing.map((listing)=> 
   
    <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center '>
    <Link to={`/listing/${listing._id}`}>
    <img src={listing.imageUrls[0]} className='h-16 w-16 object-contain' />
    </Link>  
    <Link  className='text-slate-700 font-semibold flex-1 hover:underline' to={`/listing/${listing._id}`}> 
     <p>{listing.name}</p>
    </Link>
    <div className='flex flex-col'>
      <button className='text-red-700'>Delete</button>
      <button className='text-green-700'>Edit</button>

    </div>
    </div>

    


    
    )
    }
    </div>
}
    </div>
  )
}

export default Profile
