import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Laboratory() {
  const { user } = useAuth()
  const [pending, setPending] = useState([])
  const [resultForms, setResultForms] = useState({})

  const canOrder = ['DOCTOR', 'ADMIN'].includes(user.role)
  const canEnterResult = ['LAB_TECHNICIAN', 'ADMIN'].includes(user.role)

  const [orderForm, setOrderForm] = useState({ patientId: '', testName: '', testCode: '', specimenType: '' })
  const [showOrderForm, setShowOrderForm] = useState(false)

const load = () => {
  api.get('/lab/results/pending')
    .then(({ data }) => setPending(data))
    .catch((error) => {
      console.error('Failed to load pending lab orders:', error)
      setPending([])
    })
}

  useEffect(() => { load() }, [])

  const submitOrder = async (e) => {
    e.preventDefault()
    await api.post('/lab/orders', { ...orderForm, patientId: Number(orderForm.patientId), doctorId: user.id })
    setShowOrderForm(false)
    setOrderForm({ patientId: '', testName: '', testCode: '', specimenType: '' })
    load()
  }

  const submitResult = async (orderId) => {
    const result = resultForms[orderId]
    if (!result?.resultValue) return
    await api.put(`/lab/results/${orderId}`, {
      resultValue: result.resultValue,
      referenceRange: result.referenceRange || '',
      unit: result.unit || '',
      flag: result.flag || 'NORMAL',
      verifiedBy: user.id,
    })
    setResultForms({ ...resultForms, [orderId]: {} })
    load()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-clinical-navy">Laboratory</h1>
        {canOrder && (
          <button className="btn-primary" onClick={() => setShowOrderForm(!showOrderForm)}>
            {showOrderForm ? 'Cancel' : 'New Lab Order'}
          </button>
        )}
      </div>

      {showOrderForm && (
        <form onSubmit={submitOrder} className="card mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="label">Patient ID</label>
            <input className="input-field" value={orderForm.patientId} onChange={(e) => setOrderForm({ ...orderForm, patientId: e.target.value })} required />
          </div>
          <div>
            <label className="label">Test Name</label>
            <input className="input-field" value={orderForm.testName} onChange={(e) => setOrderForm({ ...orderForm, testName: e.target.value })} required />
          </div>
          <div>
            <label className="label">Test Code</label>
            <input className="input-field" value={orderForm.testCode} onChange={(e) => setOrderForm({ ...orderForm, testCode: e.target.value })} />
          </div>
          <div>
            <label className="label">Specimen Type</label>
            <input className="input-field" value={orderForm.specimenType} onChange={(e) => setOrderForm({ ...orderForm, specimenType: e.target.value })} />
          </div>
          <div className="col-span-2">
            <button className="btn-primary w-full">Submit Order</button>
          </div>
        </form>
      )}

      <h2 className="font-medium mb-3">Pending / In-Progress Orders</h2>
      <div className="space-y-3">
        {pending.length === 0 && <p className="text-slate-400 text-sm">No pending lab orders.</p>}
        {pending.map((o) => (
          <div key={o.id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{o.testName} — Patient #{o.patientId}</p>
                <p className="text-sm text-slate-500">Specimen: {o.specimenType || '—'} · Ordered: {o.orderedDate}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100">{o.status}</span>
            </div>

            {canEnterResult && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                <input
                  className="input-field"
                  placeholder="Result value"
                  value={resultForms[o.id]?.resultValue || ''}
                  onChange={(e) => setResultForms({ ...resultForms, [o.id]: { ...resultForms[o.id], resultValue: e.target.value } })}
                />
                <input
                  className="input-field"
                  placeholder="Reference range"
                  value={resultForms[o.id]?.referenceRange || ''}
                  onChange={(e) => setResultForms({ ...resultForms, [o.id]: { ...resultForms[o.id], referenceRange: e.target.value } })}
                />
                <select
                  className="input-field"
                  value={resultForms[o.id]?.flag || 'NORMAL'}
                  onChange={(e) => setResultForms({ ...resultForms, [o.id]: { ...resultForms[o.id], flag: e.target.value } })}
                >
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="LOW">Low</option>
                  <option value="CRITICAL">Critical</option>
                </select>
                <button className="btn-secondary" onClick={() => submitResult(o.id)}>Save Result</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
