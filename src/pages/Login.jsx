import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const getSubmitLabel = (forgotMode, submitting) => {
  if (submitting) return forgotMode ? 'Sending instructions…' : 'Signing in…'
  return forgotMode ? 'Send reset instructions' : 'Login'
}

export default function Login() {
  const { login, requestPasswordReset } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isStaffPortal = searchParams.get('portal') === 'staff'
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetLink, setResetLink] = useState('')
  const heading = forgotMode ? 'Reset your password' : 'Login'
  const description = forgotMode
    ? 'Enter your email or username and we’ll send reset instructions.'
    : (isStaffPortal ? 'Sign in with your staff ID, email, or username' : 'Sign in with your email or username')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(identifier, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password')
    } finally {
      setSubmitting(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const response = await requestPasswordReset(identifier)
      if (response.resetToken) {
        setResetLink(`${window.location.origin}/reset-password?token=${encodeURIComponent(response.resetToken)}`)
      }
      setResetSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'We could not process that request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-layout">
        <div className="login-visual">
          <img
            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=85"
            alt="Bright modern hospital corridor"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/15 to-teal-950/10" />
          <div className="relative z-10 flex h-full flex-col justify-between p-7 text-white sm:p-10">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] backdrop-blur">Aarisha's Hospital</span>
              <span className="flex items-center gap-2 text-xs text-white/80"><span className="status-dot status-dot-light" /> Secure access</span>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-teal-200">Connected care, wherever you are</p>
              <h1 className="max-w-md text-4xl font-semibold leading-tight sm:text-5xl">Welcome back to better care.</h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">Your care journey, appointments, and hospital services in one trusted place.</p>
            </div>
          </div>
        </div>

        <div className="login-panel">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-clinical-teal">{forgotMode ? 'Account recovery' : isStaffPortal ? 'Staff portal' : 'Patient portal'}</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-clinical-navy">{heading}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          </div>

          {error && <p className="error-text mb-4" role="alert">{error}</p>}
          {resetSent && <output className="mb-4 block rounded-md bg-teal-50 p-3 text-sm text-teal-800">
            If an account matches, reset instructions have been sent.
            {resetLink && <Link className="mt-2 block break-all font-medium text-clinical-teal" to={resetLink.replace(window.location.origin, '')}>Open password reset page</Link>}
          </output>}

          <form onSubmit={forgotMode ? handleForgotPassword : handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="login-identifier">{isStaffPortal && !forgotMode ? 'Staff ID / Email / Username' : 'Email / Username'}</label>
              <input id="login-identifier" className="input-field bg-slate-50/70 py-3" value={identifier}
                     onChange={(e) => setIdentifier(e.target.value)} required />
            </div>
            {!forgotMode && <div>
              <div className="flex items-center justify-between">
                <label className="label" htmlFor="login-password">Password</label>
                <button type="button" className="text-xs font-semibold text-clinical-teal hover:text-teal-700" onClick={() => { setForgotMode(true); setError('') }}>Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  className="input-field bg-slate-50/70 py-3 pr-11"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>}
            <button type="submit" className="btn-primary w-full py-3 shadow-lg shadow-teal-900/10" disabled={submitting}>
              {getSubmitLabel(forgotMode, submitting)}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            {forgotMode ? <button type="button" className="font-medium text-clinical-teal" onClick={() => { setForgotMode(false); setResetSent(false); setError('') }}>Back to login</button> : <>New to Aarisha's Hospital? <Link to="/register" className="font-semibold text-clinical-teal">Create an account</Link></>}
          </p>
          <p className="mt-10 border-t border-slate-200 pt-5 text-center text-xs leading-5 text-slate-400">Protected access for patients and authorized hospital staff.</p>
        </div>
      </div>
    </div>
  )
}
