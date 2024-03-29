import React, { useState } from 'react'
import {getStorage,ref,uploadBytesResumable,getDownloadURL} from 'firebase/storage'
import {app} from '../firebase.js'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
const CreateListing = () => {
  const {currentUser} = useSelector(state => state.user)
  const navigate = useNavigate()
  const [files,setfiles] = useState([]);

  const [formdata,setformdata] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: '',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false
  })
  const [UploadImageError,setUploadImageError] = useState(false);
  const [Uploading,setUploading] = useState(false);
  const [error,seterror] = useState(false);
  const [loading,setloading] = useState(false)
  const handleSubmitImage = ()=>{
   if(files.length > 0 && files.length + formdata.imageUrls.length < 7){
    setUploading(true)
    setUploadImageError(false)
    const promises = [];
    for(let i=0;i<files.length;i++){
    promises.push(storeImage(files[i]));
    }
    Promise.all(promises).then((urls)=>{
    setformdata({...formdata,imageUrls: formdata.imageUrls.concat(urls)})
    setUploadImageError(false);
    setUploading(false)
    
    }).catch((error)=>{
    setUploadImageError('Image Upload Failed (2mb maximum per Image)')
    setUploading(false)
    })
   }
   else{
    setUploadImageError("You can Upload only 6 Images per Listing")
    setUploading(false)
   }
  }
  
  const handleRemoveImage = (index) => {
    setformdata({
      ...formdata,
      imageUrls: formdata.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleChange =(e)=>{
    if(e.target.id === 'rent' || e.target.id === 'sale'){
      setformdata({
        ...formdata,
        type: e.target.id
      })
    }
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setformdata({
        ...formdata,
        [e.target.id]: e.target.checked
      })
    }
    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setformdata({
        ...formdata,
        [e.target.id]: e.target.value
      })
    }
  }

  const storeImage =async(file)=>{
   return new Promise((resolve,reject)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime + file.name;
    const storageref = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageref,file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
   })
  }

  const handleSubmit = async (e)=>{
  e.preventDefault()
  try {
    if(formdata.imageUrls.length < 1) return seterror('You must upload at least one image')
    if(+formdata.regularPrice < +formdata.discountPrice) return seterror('Discount Price will be lower than Regular Price')
    setloading(true)
    seterror(false)
    const res = await fetch('/api/listing/create',{
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formdata,
        userRef: currentUser._id
      })
    })
    const data = await res.json();
    setloading(false)
    if(data.success === false){
      seterror(error.message)

    }
    navigate(`/listing/${data._id}`);
  } catch (error) {
    seterror(error.message)
    setloading(false)
  }
  }
  console.log(formdata)
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-xl text-center my-5'>Create Listing</h1>
      <form  className='flex flex-col sm:flex-row gap-6'>
        <div className='flex flex-col gap-4 flex-1'>
          <input type='text' placeholder='Name' id='name' className='border p-2 rounded-lg' value={formdata.name} 
          onChange={handleChange}
          maxLength='62' required/>
          <input type='text' placeholder='Description' id='description' className='border p-2 rounded-lg' value={formdata.description} onChange={handleChange} required/>
          <input type='text' placeholder='Address' id='address' className='border p-2 rounded-lg' value={formdata.address}
          onChange={handleChange} required/>
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
             <input type='checkbox' id='sale' onChange={handleChange}  checked={formdata.type === 'sale'} className='w-5' />
             <span>Sell</span>
            </div>
            <div className='flex gap-2'>
             <input type='checkbox' id='rent' onChange={handleChange} checked={formdata.type === 'rent'} className='w-5' />
             <span>Rent</span>
            </div>
            <div className='flex gap-2'>
             <input type='checkbox' id='parking' onChange={handleChange} checked={formdata.parking} className='w-5' />
             <span>Parking Slot</span>
            </div>
            <div className='flex gap-2'>
             <input type='checkbox' id='furnished' onChange={handleChange} checked={formdata.furnished} className='w-5' />
             <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
             <input type='checkbox' id='offer' onChange={handleChange} checked={formdata.offer} className='w-5' />
             <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input type='number' id='bedrooms' min='1' max='10' onChange={handleChange} value={formdata.bedrooms} required className='border p-3 rounded-lg'/>
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type='number' id='bathrooms' min='1' max='10'  onChange={handleChange} value={formdata.bathrooms} required className='border p-3 rounded-lg'/>
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type='number' id='regularPrice' min='10' max='100000'  onChange={handleChange} value={formdata.regularPrice} required className='border p-3 rounded-lg'/>
              <div className='flex flex-col items-center'>
              <p>Regular Price</p>
              <span>($ / Month)</span>
              </div>
            </div>
            {formdata.offer &&   <div className='flex items-center gap-2'>
              <input type='number' id='discountPrice' min='0' max='100000'  onChange={handleChange} value={formdata.discountPrice} required className='border p-3 rounded-lg'/>
              <div className='flex flex-col items-center'>
              <p>Discount Price</p>
              <span>($ / Month)</span>
              </div>
            </div>}
          

          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
        <p className='font-semibold'>Images:
        <span className='font-normal text-gray-600'>The first image will be the cover</span></p>
        <div className='flex gap-4'>
          <input className='p-3 border rounded w-full' onChange={(e)=>setfiles(e.target.files)} type='file' id='images' accept='images/*' multiple/>
          <button type='button'  onClick={handleSubmitImage} disabled={Uploading} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg diabled:opacity-80'>{Uploading ? 'Uploading': 'Upload'}</button>
        </div>
        <p className='text-red-700 text-sm'>{UploadImageError && UploadImageError}</p>
        {formdata.imageUrls.length > 0 &&
            formdata.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
        <button 
        onClick={handleSubmit || Uploading} disabled={loading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Listing':'Create listing'}</button>
        {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
    
      </form>
    </main>
  )
}

export default CreateListing
