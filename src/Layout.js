import React from 'react'
import Navbar from './Navbar/nabvbar'
import Footer from './Footer/footer'
import { Outlet, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
function Layout() {
  const location=useLocation();
  return (
    <div className="site-shell">
      <Navbar />
      <main className="site-main">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}/>
          <Outlet />
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
