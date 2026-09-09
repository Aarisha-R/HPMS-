import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function calcAge(dob) {
  if (!dob) return '—'
  const birth = new Date(dob)
  const diff = Date.now() - birth.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

export default function PatientList() {
  const [patients, setPatients] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const load = () => {
    setLoading(true)
    const request = query
      ? api.get('/patients/search', { params: { query } })
      : api.get('/patients')
    request.then(({ data }) => setPatients(data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, []) // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    load()
  }

  const paged = patients.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.max(1, Math.ceil(patients.length / pageSize))

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-clinical-navy">Registered Patients</h1>
        <Link to="/register-patient" className="btn-primary">Register Patient</Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          className="input-field max-w-xs"
          placeholder="Search by name, patient number, or phone"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn-secondary">Search</button>
      </form>

      <div className="card overflow-x-auto">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-4">Patient ID</th>
                <th className="py-2 pr-4">Patient Number</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Age</th>
                <th className="py-2 pr-4">Gender</th>
                <th className="py-2 pr-4">Blood Group</th>
                <th className="py-2 pr-4">Phone Number</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium">{p.id}</td>
                  <td className="py-2 pr-4">{p.patientNumber}</td>
                  <td className="py-2 pr-4">{p.name}</td>
                  <td className="py-2 pr-4">{calcAge(p.dateOfBirth)}</td>
                  <td className="py-2 pr-4">{p.gender}</td>
                  <td className="py-2 pr-4">{p.bloodGroup?.replace('_POS', '+').replace('_NEG', '-') ?? '—'}</td>
                  <td className="py-2 pr-4">{p.phoneNumber}</td>
                  <td className="py-2 pr-4">{p.status}</td>
                  <td className="py-2 pr-4">
                    <Link to={`/patients/${p.id}`} className="text-clinical-teal font-medium">View</Link>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={9} className="py-6 text-center text-slate-400">No patients found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded-md text-sm ${p === page ? 'bg-clinical-teal text-white' : 'bg-white border border-slate-200'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
