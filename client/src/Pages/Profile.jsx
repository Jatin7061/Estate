import React,{useRef, useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase.js';
import { updateUserSuccess,updateUserStart,updateUserFailure,deleteUserFailure,deleteUserStart,deleteUserSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';


const Profile = () => {
  const dispatch = useDispatch();
  const [file,setfile] = useState(undefined);
  const [filePerc,setfilePerc]=useState(0);
  const [fileUploaderror,setfileUploaderror]=useState(false);
  const [formData,setformData] = useState({})
  const [updateUser,setupdateUser] = useState(false);
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
   console.log(formData)
  return (
    <div className='p-3 max-w-lg mx-auto '>
    <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
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
    </form>
    <div className='flex justify-between mt-5'>
      <span onClick={handleDelete} className='text-red-800 cursor-pointer'>Delete Account </span>
      <span className='text-red-800 cursor-pointer'>Sign Out</span>
    </div> 
    <p className='text-red-700 mt-5'>{error ?error:""}</p>
    <p className='text-green-700 mt-5'>{updateUser ?"User Updated Succesfully":""}</p>
    </div>
  )
}

export default Profile
