import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLES = ['PATIENT', 'DOCTOR', 'NURSE', 'PHARMACIST', 'RECEPTIONIST', 'LAB_TECHNICIAN', 'ADMIN']
const SPECIALISTS = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
  'Orthopedist', 'Pediatrician', 'Gynecologist', 'Psychiatrist',
  'Ophthalmologist', 'ENT Specialist', 'Dentist', 'Physiotherapist',
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '', email: '', password: '', role: 'PATIENT', staffId: '', specialization: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const updateRole = (e) => setForm({ ...form, role: e.target.value, specialization: e.target.value === 'DOCTOR' ? form.specialization : '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSubmitting(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object' && !data.message) {
        setErrors(data)
      } else {
        setErrors({ general: data?.message || 'Registration failed' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card">
        <h1 className="text-2xl font-bold text-clinical-navy mb-6">Create Account</h1>

        {errors.general && <p className="error-text mb-4">{errors.general}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Username</label>
            <input className="input-field" value={form.username} onChange={update('username')} required />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input-field" type="email" value={form.email} onChange={update('email')} required />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                className="input-field pr-11"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.5 10.5A2.5 2.5 0 0113.5 13.5M9.88 5.08A11.05 11.05 0 0112 5c4.42 0 8.18 2.57 10 7-1.28 2.76-3.74 4.93-6.74 6.1M6.61 6.61A16.67 16.67 0 002 12c1.24 2.7 3.77 4.92 6.78 6.09" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">Min 8 chars, upper/lowercase, number, special character.</p>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input-field" value={form.role} onChange={updateRole}>
              {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
          </div>
          {form.role !== 'PATIENT' && (
            <div>
              <label className="label">Staff ID</label>
              <input className="input-field" value={form.staffId} onChange={update('staffId')} required />
              {errors.staffId && <p className="error-text">{errors.staffId}</p>}
            </div>
          )}
          {form.role === 'DOCTOR' && (
            <div>
              <label className="label" htmlFor="specialization">Specialization</label>
              <select id="specialization" className="input-field" value={form.specialization} onChange={update('specialization')} required>
                <option value="">Select specialization</option>
                {SPECIALISTS.map((specialist) => <option key={specialist} value={specialist}>{specialist}</option>)}
              </select>
              {errors.specialization && <p className="error-text">{errors.specialization}</p>}
            </div>
          )}
          <button className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-4 text-center">
          Already have an account? <a href="/login" className="text-clinical-teal font-medium">Login</a>
        </p>
      </div>
    </div>
  )
}
