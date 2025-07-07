import React from 'react'
import Navigation from '../components/user/Navigation'
import { Outlet } from 'react-router-dom'
import Footer from '../components/user/Footer'

export default function UserLayout() {
  return (
    <div>
        <Navigation/>
        <Outlet/>
        <Footer/>
      
    </div>
  )
}
