import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './Pages/Home'
import About from './Pages/About'
import Signin from './Pages/Signin'

import Profile from './Pages/Profile'
import Header from './components/Header'
import SignUp from './Pages/SignUp'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './Pages/CreateListing'
import UpdateListing from './Pages/UpdateListing'
import Listing from './Pages/Listing'
import Search from './Pages/Search'

const App = () => {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/sign-in' element={<Signin/>}/>
      <Route path='/sign-up' element={<SignUp/>}/>
      <Route path='/search' element={<Search/>}/>
      <Route path='/listing/:listingId' element={<Listing/>}/>
      <Route element={<PrivateRoute/>}>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/create-listing' element={<CreateListing/>}/>
      <Route path='/update-listing/:listingId' element={<UpdateListing/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
