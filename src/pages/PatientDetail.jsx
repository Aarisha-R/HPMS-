import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'

export default function PatientDetail() {
  const { id } = useParams()
  const [patient, setPatient] = useState(null)
  const [records, setRecords] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [appointments, setAppointments] = useState([])
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    api.get(`/patients/${id}`).then(({ data }) => setPatient(data)).catch(() => {})
    api.get(`/records/patient/${id}`).then(({ data }) => setRecords(data)).catch(() => {})
    api.get(`/prescriptions/patient/${id}`).then(({ data }) => setPrescriptions(data)).catch(() => {})
    api.get(`/appointments/patient/${id}`).then(({ data }) => setAppointments(data)).catch(() => {})
  }, [id])

  if (!patient) return <div className="max-w-4xl mx-auto px-4 py-10 text-slate-500">Loading patient…</div>

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'records', label: 'Medical Records' },
    { key: 'prescriptions', label: 'Prescriptions' },
    { key: 'appointments', label: 'Appointments' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-clinical-navy">{patient.name}</h1>
          <p className="text-sm text-slate-500">{patient.patientNumber} · {patient.status}</p>
        </div>
        <Link to="/patients" className="btn-secondary">Back to List</Link>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === t.key ? 'border-clinical-teal text-clinical-teal' : 'border-transparent text-slate-500'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="card grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-slate-500">Date of Birth</p><p className="font-medium">{patient.dateOfBirth}</p></div>
          <div><p className="text-slate-500">Gender</p><p className="font-medium">{patient.gender}</p></div>
          <div><p className="text-slate-500">Blood Group</p><p className="font-medium">{patient.bloodGroup ?? '—'}</p></div>
          <div><p className="text-slate-500">Phone</p><p className="font-medium">{patient.phoneNumber}</p></div>
          <div className="col-span-2"><p className="text-slate-500">Address</p><p className="font-medium">{patient.address || '—'}</p></div>
          <div><p className="text-slate-500">Emergency Contact</p><p className="font-medium">{patient.emergencyContactName || '—'} ({patient.emergencyContactPhone || '—'})</p></div>
          <div><p className="text-slate-500">Insurance ID</p><p className="font-medium">{patient.insuranceId || '—'}</p></div>
        </div>
      )}

      {tab === 'records' && (
        <div className="space-y-3">
          {records.length === 0 && <p className="text-slate-400 text-sm">No medical records yet.</p>}
          {records.map((r) => (
            <div key={r.id} className="card">
              <p className="font-medium">{r.diagnosis}</p>
              <p className="text-sm text-slate-500">{r.chiefComplaint}</p>
              <p className="text-xs text-slate-400 mt-1">Visit: {r.visitDate} · ICD: {r.icdCode || '—'}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'prescriptions' && (
        <div className="space-y-3">
          {prescriptions.length === 0 && <p className="text-slate-400 text-sm">No prescriptions yet.</p>}
          {prescriptions.map((p) => (
            <div key={p.id} className="card flex justify-between">
              <div>
                <p className="font-medium">{p.medicationName}</p>
                <p className="text-sm text-slate-500">{p.dosage} · {p.frequency} · {p.duration}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 h-fit">{p.dispensingStatus}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'appointments' && (
        <div className="space-y-3">
          {appointments.length === 0 && <p className="text-slate-400 text-sm">No appointments yet.</p>}
          {appointments.map((a) => (
            <div key={a.id} className="card flex justify-between">
              <div>
                <p className="font-medium">{a.appointmentType}</p>
                <p className="text-sm text-slate-500">{a.appointmentDate} at {a.timeSlot}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 h-fit">{a.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
