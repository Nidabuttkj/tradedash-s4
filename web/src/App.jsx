import { Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import Home from './pages/Home.jsx'
import Pricing from './pages/Pricing.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        {/* Stub where "Start Free Trial" lands. Delete when Group 1's Dashboard is merged. */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
