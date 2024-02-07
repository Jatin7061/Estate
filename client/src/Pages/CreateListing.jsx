import React from 'react'

const CreateListing = () => {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-xl text-center my-5'>Create Listing</h1>
      <form className='flex flex-col sm:flex-row gap-6'>
        <div className='flex flex-col gap-4 flex-1'>
          <input type='text' placeholder='Name' id='name' className='border p-2 rounded-lg' maxLength='62' required/>
          <input type='text' placeholder='Description' id='description' className='border p-2 rounded-lg' required/>
          <input type='text' placeholder='Address' id='address' className='border p-2 rounded-lg'  required/>
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
             <input type='checkbox' id='sale' className='w-5' />
             <span>Sell</span>
            </div>
            <div className='flex gap-2'>
             <input type='checkbox' id='rent' className='w-5' />
             <span>Rent</span>
            </div>
            <div className='flex gap-2'>
             <input type='checkbox' id='parking' className='w-5' />
             <span>Parking Slot</span>
            </div>
            <div className='flex gap-2'>
             <input type='checkbox' id='furnished' className='w-5' />
             <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
             <input type='checkbox' id='offer' className='w-5' />
             <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input type='number' id='bedrooms' min='1' max='10' required className='border p-3 rounded-lg'/>
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type='number' id='bathrooms' min='1' max='10' required className='border p-3 rounded-lg'/>
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type='number' id='regularprice' min='10' max='100000' required className='border p-3 rounded-lg'/>
              <div className='flex flex-col items-center'>
              <p>Regular Price</p>
              <span>($ / Month)</span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input type='number' id='discountprice' min='100' max='100000' required className='border p-3 rounded-lg'/>
              <div className='flex flex-col items-center'>
              <p>Discount Price</p>
              <span>($ / Month)</span>
              </div>
            </div>

          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
        <p className='font-semibold'>Images:
        <span className='font-normal text-gray-600'>The first image will be the cover</span></p>
        <div className='flex gap-4'>
          <input className='p-3 border rounded w-full' type='file' id='images' accept='images/*' multiple/>
          <button type='button' className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg diabled:opacity-80'>Upload</button>
        </div>
        <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create listing</button>
        </div>
     
      </form>
    </main>
  )
}

export default CreateListing
