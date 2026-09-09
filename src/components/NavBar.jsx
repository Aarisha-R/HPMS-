import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useRef, useState } from 'react'
import api from '../api/axios'

const roleLinks = {
  ADMIN: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/patients', label: 'Patients' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/medical-records', label: 'Records' },
    { to: '/billing', label: 'Billing' },
    { to: '/pharmacy', label: 'Pharmacy' },
    { to: '/lab', label: 'Laboratory' },
    { to: '/doctor-specialties', label: 'Doctor Specialties' },
  ],
  DOCTOR: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/patients', label: 'Patients' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/medical-records', label: 'Records' },
    { to: '/lab', label: 'Laboratory' },
  ],
  NURSE: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/patients', label: 'Patients' },
    { to: '/appointments', label: 'Appointments' },
  ],
  RECEPTIONIST: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/patients', label: 'Patients' },
    { to: '/register-patient', label: 'Register Patient' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/billing', label: 'Billing' },
  ],
  PHARMACIST: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/pharmacy', label: 'Pharmacy' },
  ],
  LAB_TECHNICIAN: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/lab', label: 'Laboratory' },
  ],
  PATIENT: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/register-patient', label: 'Complete Profile' },
    { to: '/appointments', label: 'My Appointments' },
    { to: '/billing', label: 'My Bills' },
  ],
}

export default function NavBar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [notifError, setNotifError] = useState('')
  const notificationRef = useRef(null)

  const parseUnread = (data) => data?.unread ?? data?.count ?? data?.unreadCount ?? 0
  const parseNotifications = (data) => Array.isArray(data) ? data : data?.notifications ?? data?.items ?? []

  const loadNotifications = async () => {
    if (!user) return
    setNotifError('')
    try {
      const { data } = await api.get(`/notifications/user/${user.id}`)
      setUnread(parseUnread(data))
      setNotifications(parseNotifications(data))
    } catch (error) {
      if (error.response?.status === 404) {
        setNotifError('Notification feed not available')
      } else {
        setNotifError('Unable to load notifications')
      }
      setNotifications([])
    }
  }

  useEffect(() => {
    if (user) {
      api.get(`/notifications/user/${user.id}/unread-count`)
        .then(({ data }) => setUnread(parseUnread(data)))
        .catch(() => setUnread(0))
    }
  }, [user, location])

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const handleToggleDropdown = () => {
    setShowDropdown((open) => {
      const nextOpen = !open
      if (nextOpen) {
        loadNotifications()
      }
      return nextOpen
    })
  }

  const markAllRead = async () => {
    if (!user) return
    try {
      await api.post(`/notifications/user/${user.id}/mark-all-read`)
    } catch {
      // ignore backend errors, keep UI consistent
    }
    setUnread(0)
    setNotifications([])
  }

  const links = user ? (roleLinks[user.role] || []) : []

  return (
    <nav className="bg-clinical-navy px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to={user ? '/dashboard' : '/'} className="text-white font-bold text-lg">
          Hospital Patient Management System
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${location.pathname === l.to ? 'nav-active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <span ref={notificationRef} className="nav-notification ml-2 text-slate-200 relative">
              <button
                type="button"
                onClick={handleToggleDropdown}
                className="relative inline-flex items-center justify-center rounded-full p-2 hover:bg-slate-700 transition-colors"
                aria-label={showDropdown ? 'Close notifications' : 'Open notifications'}
                aria-expanded={showDropdown}
              >
                🔔
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-slate-900 rounded-lg shadow-lg border border-slate-200 z-20 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">Notifications</span>
                    <button
                      type="button"
                      className="text-xs text-clinical-teal hover:underline"
                      onClick={loadNotifications}
                    >
                      Refresh
                    </button>
                  </div>
                  {notifError && <p className="text-xs text-red-600 mb-2">{notifError}</p>}
                  {notifications.length === 0 ? (
                    <p className="text-sm text-slate-500 mb-3">No new notifications.</p>
                  ) : (
                    <ul className="space-y-2 mb-3">
                      {notifications.map((note, index) => (
                        <li key={note.id ?? index} className="rounded-md bg-slate-50 p-3 text-sm">
                          <div className="font-medium text-slate-800">
                            {note.title ?? note.message ?? note.text ?? 'Notification'}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {note.time ?? note.createdAt ?? 'Just now'}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    className="w-full btn-secondary"
                    onClick={markAllRead}
                  >
                    Mark all read
                  </button>
                </div>
              )}
            </span>
          )}
          {user ? (
            <button
              type="button"
              onClick={() => { logout(); navigate('/login') }}
              className="ml-3 text-sm text-slate-200 hover:text-white border border-slate-600 rounded-md px-3 py-1.5"
            >
              Logout ({user.username})
            </button>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
