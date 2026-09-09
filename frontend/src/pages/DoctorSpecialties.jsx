import { useEffect, useState } from 'react'
import api from '../api/axios'

const SPECIALISTS = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
  'Orthopedist', 'Pediatrician', 'Gynecologist', 'Psychiatrist',
  'Ophthalmologist', 'ENT Specialist', 'Dentist', 'Physiotherapist',
]

export default function DoctorSpecialties() {
  const [doctors, setDoctors] = useState([])
  const [savingId, setSavingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/admin/users')
      .then(({ data }) => setDoctors(data.filter((user) => user.role === 'DOCTOR')))
      .catch(() => setError('Unable to load doctors.'))
  }, [])

  const updateSpecialization = async (doctorId, specialization) => {
    setSavingId(doctorId)
    setMessage('')
    setError('')
    try {
      await api.put(`/admin/users/${doctorId}/specialization`, { specialization })
      setDoctors((current) => current.map((doctor) => doctor.id === doctorId ? { ...doctor, specialization } : doctor))
      setMessage('Doctor specialty updated. Patients can now find this doctor when booking.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update doctor specialty.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-clinical-navy">Doctor Specialties</h1>
      <p className="mb-6 text-sm text-slate-500">Assign a specialty to existing doctors so patients can find them by need.</p>
      {message && <p className="mb-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mb-4 error-text">{error}</p>}
      <div className="space-y-3">
        {doctors.length === 0 && <p className="text-sm text-slate-500">No doctors found.</p>}
        {doctors.map((doctor) => (
          <div key={doctor.id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{doctor.username}</p>
              <p className="text-sm text-slate-500">{doctor.email} {doctor.staffId && `· ${doctor.staffId}`}</p>
            </div>
            <select
              className="input-field sm:max-w-xs"
              value={doctor.specialization || ''}
              onChange={(event) => updateSpecialization(doctor.id, event.target.value)}
              disabled={savingId === doctor.id}
            >
              <option value="">Select specialty</option>
              {SPECIALISTS.map((specialist) => <option key={specialist} value={specialist}>{specialist}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
