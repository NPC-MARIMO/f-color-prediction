import React from 'react'
import Navigation from '../components/user/Navigation'
import { Outlet } from 'react-router-dom'
import Footer from '../components/user/Footer'
const UserLayout =() => {
  return (
    <div>
      <Navigation />
      <div style={{ background: "#111", }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default UserLayout