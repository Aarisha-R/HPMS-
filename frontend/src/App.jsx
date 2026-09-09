import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import PrivateRoute, { PublicRoute } from './components/PrivateRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import Legal from './pages/Legal'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PatientRegistration from './pages/PatientRegistration'
import PatientList from './pages/PatientList'
import PatientDetail from './pages/PatientDetail'
import Appointments from './pages/Appointments'
import MedicalRecords from './pages/MedicalRecords'
import Billing from './pages/Billing'
import Pharmacy from './pages/Pharmacy'
import Laboratory from './pages/Laboratory'
import DoctorSpecialties from './pages/DoctorSpecialties'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/doctor-specialties" element={<PrivateRoute allowedRoles={['ADMIN']}><DoctorSpecialties /></PrivateRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          <Route path="/register-patient" element={
            <PrivateRoute allowedRoles={['PATIENT', 'RECEPTIONIST', 'NURSE', 'DOCTOR', 'ADMIN']}>
              <PatientRegistration />
            </PrivateRoute>
          } />

          <Route path="/patients" element={
            <PrivateRoute allowedRoles={['LAB_TECHNICIAN', 'RECEPTIONIST', 'NURSE', 'PHARMACIST', 'DOCTOR', 'ADMIN']}>
              <PatientList />
            </PrivateRoute>
          } />

          <Route path="/patients/:id" element={
            <PrivateRoute allowedRoles={['LAB_TECHNICIAN', 'RECEPTIONIST', 'NURSE', 'PHARMACIST', 'DOCTOR', 'ADMIN', 'PATIENT']}>
              <PatientDetail />
            </PrivateRoute>
          } />

          <Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />

          <Route path="/medical-records" element={
            <PrivateRoute allowedRoles={['PATIENT', 'DOCTOR', 'NURSE', 'ADMIN']}>
              <MedicalRecords />
            </PrivateRoute>
          } />

          <Route path="/billing" element={
            <PrivateRoute allowedRoles={['PATIENT', 'RECEPTIONIST', 'ADMIN']}>
              <Billing />
            </PrivateRoute>
          } />

          <Route path="/pharmacy" element={
            <PrivateRoute allowedRoles={['PHARMACIST', 'ADMIN']}>
              <Pharmacy />
            </PrivateRoute>
          } />

          <Route path="/lab" element={
            <PrivateRoute allowedRoles={['LAB_TECHNICIAN', 'DOCTOR', 'ADMIN']}>
              <Laboratory />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
