import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!token) {
      setError('This password reset link is missing its token.')
      return
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character.')
      return
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      await resetPassword(token, password)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'This reset link is invalid or has expired.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-16 bg-slate-100">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl md:p-8">
        {success ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-clinical-teal" aria-hidden="true">✓</div>
            <h1 className="mb-2 text-2xl font-bold text-clinical-navy">Password updated</h1>
            <p className="mb-6 text-sm text-slate-600">Your password has been changed. You can now sign in with your new password.</p>
            <button type="button" className="btn-primary w-full" onClick={() => navigate('/login')}>Return to login</button>
          </div>
        ) : (
          <>
            <h1 className="mb-1 text-2xl font-bold text-clinical-navy">Set a new password</h1>
            <p className="mb-6 text-sm text-slate-500">Choose a strong password for your HPMS account.</p>
            {error && <p className="error-text mb-4" role="alert">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label" htmlFor="new-password">New password</label>
                <input id="new-password" className="input-field" type="password" minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </div>
              <div>
                <label className="label" htmlFor="confirm-password">Confirm new password</label>
                <input id="confirm-password" className="input-field" type="password" minLength="8" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? 'Updating password…' : 'Update password'}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500"><Link to="/login" className="font-medium text-clinical-teal">Back to login</Link></p>
          </>
        )}
      </div>
    </div>
  )
}
