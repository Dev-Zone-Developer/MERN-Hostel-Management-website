import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import HomePage from './pages/HomePage'
import Booking from './pages/Booking'
import Login from './pages/Login'
import PassApply from './pages/PassApply'

import AdminHome from './admin/layout/Home'
import AdminBooking from './admin/layout/Booking'
import AdminApplyPass from './admin/layout/ApplyPass'
import AdminUsers from './admin/layout/Users'
import AdminSettings from './admin/layout/Settings'

import { ToastContainer } from 'react-toastify'
import DashboardLayout from './admin/Dashboard'
import AdminRooms from './admin/layout/Rooms'

const App = () => {
  return (
    <Router>
      <ToastContainer />

      <Routes>

        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/apply-pass" element={<PassApply />} />

        {/* Admin routes with sidebar layout */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="dashboard" element={<AdminHome />} />
          <Route path="booking" element={<AdminBooking />} />
          <Route path="apply-pass" element={<AdminApplyPass />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="manage-rooms" element={<AdminRooms />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

      </Routes>
    </Router>
  )
}

export default App
