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

const App = () => {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/sign-in' element={<Signin/>}/>
      <Route path='/sign-up' element={<SignUp/>}/>
      <Route element={<PrivateRoute/>}>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/create-listing' element={<CreateListing/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
