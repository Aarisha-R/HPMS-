import { useState } from 'react'
import api from '../api/axios'

export default function Pharmacy() {
  const [patientId, setPatientId] = useState('')
  const [prescriptions, setPrescriptions] = useState([])
  const [searched, setSearched] = useState(false)

  const load = async (e) => {
    e?.preventDefault()
    if (!patientId) return
    const { data } = await api.get(`/prescriptions/patient/${patientId}`)
    setPrescriptions(data)
    setSearched(true)
  }

  const dispense = async (id, status) => {
    await api.put(`/prescriptions/${id}/dispense`, null, { params: { status } })
    load()
  }

  const statusColor = {
    DISPENSED: 'bg-green-100 text-green-700',
    PARTIALLY_DISPENSED: 'bg-yellow-100 text-yellow-700',
    PENDING: 'bg-slate-100 text-slate-600',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-clinical-navy mb-6">Pharmacy — Prescription Dispensing</h1>

      <form onSubmit={load} className="flex gap-2 mb-6">
        <input className="input-field max-w-xs" placeholder="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
        <button className="btn-secondary">Load Prescriptions</button>
      </form>

      <div className="space-y-3">
        {searched && prescriptions.length === 0 && <p className="text-slate-400 text-sm">No prescriptions found.</p>}
        {prescriptions.map((p) => (
          <div key={p.id} className="card flex justify-between items-center">
            <div>
              <p className="font-medium">{p.medicationName}</p>
              <p className="text-sm text-slate-500">{p.dosage} · {p.frequency} · {p.duration} · {p.route}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full ${statusColor[p.dispensingStatus] || 'bg-slate-100'}`}>{p.dispensingStatus}</span>
              {p.dispensingStatus === 'PENDING' && (
                <>
                  <button onClick={() => dispense(p.id, 'DISPENSED')} className="text-sm text-clinical-teal font-medium">Dispense</button>
                  <button onClick={() => dispense(p.id, 'PARTIALLY_DISPENSED')} className="text-sm text-yellow-700">Partial</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
