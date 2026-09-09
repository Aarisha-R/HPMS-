import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const SPECIALISTS = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Orthopedist',
  'Pediatrician',
  'Gynecologist',
  'Psychiatrist',
  'Ophthalmologist',
  'ENT Specialist',
  'Dentist',
  'Physiotherapist',
]

const initialSpecialist = SPECIALISTS[0]

export default function Appointments() {
  const { user } = useAuth()
  const isPatient = user.role === 'PATIENT'
  const isDoctor = user.role === 'DOCTOR'
  const canChooseSpecialist = isPatient || user.role === 'RECEPTIONIST'
  const [appointments, setAppointments] = useState([])
  const [slots, setSlots] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [patientRecord, setPatientRecord] = useState(null)
  const [patientProfileLoading, setPatientProfileLoading] = useState(isPatient)
  const [patientProfileError, setPatientProfileError] = useState('')
  const [form, setForm] = useState({ patientId: '', doctorId: '', specialist: canChooseSpecialist ? initialSpecialist : '', appointmentDate: '', timeSlot: '', appointmentType: isDoctor ? 'FOLLOW_UP' : 'OPD', chiefComplaint: '' })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [bookingError, setBookingError] = useState('')

  const appointmentActionLabel = isDoctor ? 'Create Follow-up' : 'Book Appointment'
  let bookingLabel = isDoctor ? 'Create Appointment' : 'Confirm Booking'
  if (saving) bookingLabel = 'Confirming...'
  const filteredDoctors = doctors.filter((doctor) => {
    if (!canChooseSpecialist || !form.specialist) return true
    const specialization = doctor.specialization || doctor.specialist || doctor.department || ''
    return specialization.trim().toLowerCase() === form.specialist.trim().toLowerCase()
  })

  const load = () => {
    let endpoint = null

    if (isPatient) {
      if (!patientRecord?.id) return
      endpoint = `/appointments/patient/${patientRecord.id}`
    } else if (isDoctor) {
      endpoint = `/appointments/doctor/${user.id}`
    }

    if (endpoint) {
      api.get(endpoint).then(({ data }) => setAppointments(data)).catch(() => {})
    }
  }

  useEffect(() => {
    api.get('/appointments/available-slots').then(({ data }) => setSlots(data)).catch(() => {})
    api.get('/doctors').then(({ data }) => setDoctors(data)).catch(() => {})
    if (isPatient) {
      api.get('/patients/me')
        .then(({ data }) => {
          setPatientRecord(data)
          setPatientProfileError('')
        })
        .catch(() => setPatientProfileError('Your patient profile is not registered yet.'))
        .finally(() => setPatientProfileLoading(false))
    } else {
      api.get('/patients').then(({ data }) => setPatients(data)).catch(() => {})
      load()
    }
  }, [isPatient, user.id])

  useEffect(() => {
    if (patientRecord?.id) load()
  }, [patientRecord?.id])

  const handleBook = async (e) => {
    e.preventDefault()

    if (saving) {
      return
    }

    if (isPatient && !patientRecord?.id) {
      setBookingError('Complete your patient registration before booking an appointment.')
      return
    }

    const chosenDoctorId = isDoctor ? user.id : Number(form.doctorId)
    if (!isDoctor && (!Number.isInteger(chosenDoctorId) || chosenDoctorId <= 0)) {
      setBookingError('Select an available doctor before confirming the booking.')
      return
    }

    const payload = {
      patientId: isPatient ? patientRecord.id : Number(form.patientId),
      doctorId: chosenDoctorId,
      appointmentDate: form.appointmentDate,
      timeSlot: form.timeSlot,
      appointmentType: form.appointmentType,
      chiefComplaint: form.chiefComplaint,
    }

    try {
      setSaving(true)
      setBookingError('')
      await api.post('/appointments', payload)
      setShowForm(false)
      setForm({ patientId: '', doctorId: '', specialist: canChooseSpecialist ? initialSpecialist : '', appointmentDate: '', timeSlot: '', appointmentType: isDoctor ? 'FOLLOW_UP' : 'OPD', chiefComplaint: '' })
      load()
    } catch (error) {
      console.error('Failed to create appointment:', error)
      const responseData = error.response?.data
      setBookingError(
        typeof responseData === 'string'
          ? responseData
          : responseData?.message || 'Unable to confirm booking. Please check the form and try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const cancel = async (id) => {
    await api.delete(`/appointments/${id}`)
    load()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-clinical-navy">Appointments</h1>
        <button type="button" className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : appointmentActionLabel}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleBook} className="card mb-6 grid grid-cols-2 gap-4">
          {bookingError && <div className="col-span-2">
            <p className="error-text">{bookingError}</p>
            {isPatient && bookingError.toLowerCase().includes('registration') && (
              <Link to="/register-patient" className="mt-2 inline-block font-medium text-clinical-teal">Complete patient registration</Link>
            )}
          </div>}
          {isPatient && patientProfileLoading && <p className="col-span-2 text-sm text-slate-500">Loading your patient profile...</p>}
          {isPatient && !patientProfileLoading && patientProfileError && <div className="col-span-2">
            <p className="error-text">{patientProfileError}</p>
            <Link to="/register-patient" className="mt-2 inline-block font-medium text-clinical-teal">Complete patient registration</Link>
          </div>}
          {!isPatient && (
            <div>
              <label htmlFor="patientId" className="label">Patient ID</label>
              <select
                id="patientId"
                name="patientId"
                className="input-field"
                value={form.patientId}
                onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                required
              >
                <option value="">Select a registered patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.patientNumber || `Patient #${patient.id}`} - {patient.name} (ID: {patient.id})
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">Only registered patients appear here. Use Patient List to search for a patient.</p>
            </div>
          )}
          {!isDoctor && (
            <div>
              <label htmlFor="doctorId" className="label">Select Doctor</label>
              <select
                id="doctorId"
                name="doctorId"
                className="input-field"
                value={form.doctorId}
                onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                disabled={canChooseSpecialist && !form.specialist}
                required
              >
                {filteredDoctors.length === 0 && canChooseSpecialist && form.specialist && <option value="">No doctors available for this specialty</option>}
                {filteredDoctors.map((doctor) => {
                  const label = doctor.username || doctor.email || doctor.staffId || `Doctor #${doctor.id}`
                  const details = doctor.staffId ? `${doctor.staffId} - ${label}` : label
                  const specialization = doctor.specialization || doctor.specialist || doctor.department || form.specialist
                  return <option key={doctor.id} value={doctor.id}>{details} - {specialization}</option>
                })}
              </select>
            </div>
          )}
          {canChooseSpecialist && (
            <div>
              <label htmlFor="specialist" className="label">Specialist</label>
              <select
                id="specialist"
                name="specialist"
                className="input-field"
                value={form.specialist}
                onChange={(e) => setForm({ ...form, specialist: e.target.value, doctorId: '' })}
                required
              >
                {SPECIALISTS.map((specialist) => <option key={specialist} value={specialist}>{specialist}</option>)}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="appointmentDate" className="label">Date</label>
            <input
              id="appointmentDate"
              name="appointmentDate"
              type="date"
              className="input-field"
              value={form.appointmentDate}
              onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="timeSlot" className="label">Time Slot</label>
            <select
              id="timeSlot"
              name="timeSlot"
              className="input-field"
              value={form.timeSlot}
              onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
              required
            >
              <option value="">Select a slot</option>
              {slots.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="appointmentType" className="label">Type</label>
            <select
              id="appointmentType"
              name="appointmentType"
              className="input-field"
              value={form.appointmentType}
              onChange={(e) => setForm({ ...form, appointmentType: e.target.value })}
            >
              {isDoctor ? (
                <>
                  <option value="FOLLOW_UP">Follow-up</option>
                  <option value="SPECIALIST">Specialist referral</option>
                </>
              ) : (
                <>
                  <option value="OPD">OPD</option>
                  <option value="FOLLOW_UP">Follow-up</option>
                  <option value="SPECIALIST">Specialist</option>
                  <option value="PROCEDURE">Procedure</option>
                </>
              )}
            </select>
          </div>
          <div className="col-span-2">
            <label htmlFor="chiefComplaint" className="label">Chief Complaint</label>
            <textarea
              id="chiefComplaint"
              name="chiefComplaint"
              className="input-field"
              rows={2}
              value={form.chiefComplaint}
              onChange={(e) => setForm({ ...form, chiefComplaint: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <button type="submit" className="btn-primary w-full" disabled={saving || (isPatient && patientProfileLoading)}>
              {bookingLabel}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {appointments.length === 0 && <p className="text-slate-400 text-sm">No appointments found.</p>}
        {appointments.map((a) => (
          <div key={a.id} className="card flex justify-between items-center">
            <div>
              <p className="font-medium">{a.appointmentType} — {a.chiefComplaint || 'No complaint noted'}</p>
              <p className="text-sm text-slate-500">{a.appointmentDate} at {a.timeSlot}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100">{a.status}</span>
              {a.status === 'SCHEDULED' && (
                <button type="button" onClick={() => cancel(a.id)} className="text-sm text-red-600">Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
