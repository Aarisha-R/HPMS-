import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Billing() {
  const { user } = useAuth()
  const [patientId, setPatientId] = useState(user.role === 'PATIENT' ? user.id : '')
  const [bills, setBills] = useState([])
  const [searched, setSearched] = useState(false)
  const [payAmount, setPayAmount] = useState({})

  const canGenerate = ['RECEPTIONIST', 'ADMIN'].includes(user.role)
  const canRecordPayment = ['RECEPTIONIST', 'ADMIN'].includes(user.role)

  useEffect(() => {
    if (user.role === 'PATIENT') load()
  }, []) // eslint-disable-line

  const load = async (e) => {
    e?.preventDefault()
    if (!patientId) return
    const { data } = await api.get(`/billing/patient/${patientId}`)
    setBills(data)
    setSearched(true)
  }

  const generate = async () => {
    const totalAmount = prompt('Total bill amount (₹)')
    if (!totalAmount) return
    await api.post('/billing/generate', { patientId: Number(patientId), totalAmount: Number(totalAmount), status: 'PENDING' })
    load()
  }

  const pay = async (billId) => {
    const amount = payAmount[billId]
    if (!amount) return
    await api.put(`/billing/${billId}/payment`, null, { params: { amount } })
    setPayAmount({ ...payAmount, [billId]: '' })
    load()
  }

  const statusColor = {
    PAID: 'bg-green-100 text-green-700',
    PARTIAL: 'bg-yellow-100 text-yellow-700',
    PENDING: 'bg-slate-100 text-slate-600',
    OVERDUE: 'bg-red-100 text-red-700',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-clinical-navy mb-6">Billing</h1>

      {user.role !== 'PATIENT' && (
        <form onSubmit={load} className="flex gap-2 mb-6">
          <input className="input-field max-w-xs" placeholder="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
          <button className="btn-secondary">Load Bills</button>
          {canGenerate && patientId && <button type="button" className="btn-primary ml-auto" onClick={generate}>Generate Bill</button>}
        </form>
      )}

      <div className="space-y-3">
        {searched && bills.length === 0 && <p className="text-slate-400 text-sm">No bills found.</p>}
        {bills.map((b) => (
          <div key={b.id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Bill #{b.id}</p>
                <p className="text-sm text-slate-500">Total: ₹{b.totalAmount} · Paid: ₹{b.paidAmount} · Balance: ₹{b.balanceAmount}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColor[b.status] || 'bg-slate-100'}`}>{b.status}</span>
            </div>
            {canRecordPayment && b.status !== 'PAID' && (
              <div className="flex gap-2 mt-3">
                <input
                  className="input-field max-w-[140px]"
                  placeholder="Amount"
                  value={payAmount[b.id] || ''}
                  onChange={(e) => setPayAmount({ ...payAmount, [b.id]: e.target.value })}
                />
                <button className="btn-secondary" onClick={() => pay(b.id)}>Record Payment</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
