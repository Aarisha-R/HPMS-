import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const BLOOD_GROUPS = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG']
const BLOOD_LABELS = { A_POS: 'A+', A_NEG: 'A-', B_POS: 'B+', B_NEG: 'B-', AB_POS: 'AB+', AB_NEG: 'AB-', O_POS: 'O+', O_NEG: 'O-' }

export default function PatientRegistration() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', dateOfBirth: '', gender: 'MALE', bloodGroup: '', phoneNumber: '',
    address: '', emergencyContactName: '', emergencyContactPhone: '', insuranceId: ''
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSubmitting(true)
    try {
      const payload = { ...form, bloodGroup: form.bloodGroup || null }
      const { data } = await api.post(user.role === 'PATIENT' ? '/patients/me' : '/patients/register', payload)
      setSuccess(true)
      setTimeout(() => navigate(`/patients/${data.id}`), 1200)
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
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-clinical-navy">Patient Registration</h1>
          <button onClick={() => navigate('/')} className="btn-secondary text-sm">Back</button>
        </div>

        {success && (
          <p className="bg-green-50 text-green-700 text-sm rounded-md px-4 py-3 mb-4">
            Patient registered successfully!
          </p>
        )}
        {errors.general && <p className="error-text mb-4">{errors.general}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Full Name</label>
            <input className="input-field" value={form.name} onChange={update('name')} required />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
          <div>
            <label className="label">Date of Birth</label>
            <input className="input-field" type="date" value={form.dateOfBirth} onChange={update('dateOfBirth')} required />
            {errors.dateOfBirth && <p className="error-text">{errors.dateOfBirth}</p>}
          </div>
          <div>
            <label className="label">Gender</label>
            <select className="input-field" value={form.gender} onChange={update('gender')}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="label">Blood Group</label>
            <select className="input-field" value={form.bloodGroup} onChange={update('bloodGroup')}>
              <option value="">Unknown</option>
              {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{BLOOD_LABELS[bg]}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input className="input-field" value={form.phoneNumber} onChange={update('phoneNumber')} required maxLength={10} />
            {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label">Address</label>
            <textarea className="input-field" rows={2} value={form.address} onChange={update('address')} />
          </div>
          <div>
            <label className="label">Emergency Contact Name</label>
            <input className="input-field" value={form.emergencyContactName} onChange={update('emergencyContactName')} />
          </div>
          <div>
            <label className="label">Emergency Contact Phone</label>
            <input className="input-field" value={form.emergencyContactPhone} onChange={update('emergencyContactPhone')} maxLength={10} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Insurance ID (optional)</label>
            <input className="input-field" value={form.insuranceId} onChange={update('insuranceId')} />
            {errors.insuranceId && <p className="error-text">{errors.insuranceId}</p>}
          </div>
          <div className="sm:col-span-2">
            <button className="btn-primary w-full" disabled={submitting}>
              {submitting ? 'Registering…' : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
