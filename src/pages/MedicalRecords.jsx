import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function MedicalRecords() {
  const { user } = useAuth()
  const [patientId, setPatientId] = useState('')
  const [records, setRecords] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searched, setSearched] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ chiefComplaint: '', diagnosis: '', icdCode: '', treatmentPlan: '', notes: '' })

  const canCreate = user.role === 'DOCTOR' || user.role === 'ADMIN'

  const loadRecords = async (e) => {
    e?.preventDefault()
    setError('')
    setSuccess('')
    if (!patientId) return
    const { data } = await api.get(`/records/patient/${patientId}`)
    setRecords(data)
    setSearched(true)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!patientId) {
      setError('Patient ID is required before saving a record.')
      return
    }
    await api.post('/records', { patientId: Number(patientId), doctorId: user.id, ...form })
    setShowForm(false)
    setForm({ chiefComplaint: '', diagnosis: '', icdCode: '', treatmentPlan: '', notes: '' })
    await loadRecords()
    setSuccess('Medical record saved successfully.')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-clinical-navy mb-6">Medical Records</h1>

      <form onSubmit={loadRecords} className="flex gap-2 mb-6">
        <input className="input-field max-w-xs" placeholder="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
        <button className="btn-secondary">Load Records</button>
        {canCreate && patientId && (
          <button type="button" className="btn-primary ml-auto" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Record'}
          </button>
        )}
      </form>

      {error && <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 space-y-4">
          <div>
            <label className="label">Chief Complaint</label>
            <textarea className="input-field" rows={2} value={form.chiefComplaint} onChange={(e) => setForm({ ...form, chiefComplaint: e.target.value })} required />
          </div>
          <div>
            <label className="label">Diagnosis</label>
            <textarea className="input-field" rows={2} value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">ICD-10 Code</label>
              <input className="input-field" value={form.icdCode} onChange={(e) => setForm({ ...form, icdCode: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Treatment Plan</label>
            <textarea className="input-field" rows={2} value={form.treatmentPlan} onChange={(e) => setForm({ ...form, treatmentPlan: e.target.value })} />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input-field" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button className="btn-primary w-full">Save Record</button>
        </form>
      )}

      {searched && (
        <div className="space-y-3">
          {records.length === 0 && <p className="text-slate-400 text-sm">No records found for this patient.</p>}
          {records.map((r) => (
            <div key={r.id} className="card">
              <div className="flex justify-between">
                <p className="font-medium">{r.diagnosis}</p>
                <span className="text-xs text-slate-400">{r.visitDate}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{r.chiefComplaint}</p>
              {r.treatmentPlan && <p className="text-sm text-slate-500 mt-2"><strong>Plan:</strong> {r.treatmentPlan}</p>}
              {r.icdCode && <p className="text-xs text-slate-400 mt-1">ICD-10: {r.icdCode}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
