import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const [activeFocus, setActiveFocus] = useState('patient')
  const [stats, setStats] = useState({
    bedOccupancyRate: 84,
    opdToday: 146,
    appointments: 63,
  })

  useEffect(() => {
    let isMounted = true

    const loadStats = async () => {
      try {
        const { data } = await api.get('/admin/analytics')
        if (!isMounted) return

        setStats({
          bedOccupancyRate: data?.bedOccupancyRate ?? data?.bedOccupancy ?? data?.bedOccupancyRatePercent ?? null,
          opdToday: data?.opdToday ?? data?.todayOpd ?? data?.opdCount ?? data?.totalOPD ?? null,
          appointments: data?.totalAppointments ?? data?.appointmentsToday ?? data?.todayAppointments ?? data?.appointments ?? null,
        })
      } catch {
        if (isMounted) {
          setStats({ bedOccupancyRate: 84, opdToday: 146, appointments: 63 })
        }
      }
    }

    loadStats()
    const interval = setInterval(loadStats, 30000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const formatValue = (value, suffix = '') => {
    if (value === null || value === undefined || value === '') return '—'
    return `${value}${suffix}`
  }

  const focusContent = {
    patient: {
      label: 'Patient care',
      title: 'Care that feels connected.',
      description: 'Keep appointments, records, prescriptions, and billing in one calm place.',
      action: user ? 'View my care' : 'Enter patient portal',
      path: user ? '/dashboard' : '/login?portal=patient',
    },
    staff: {
      label: 'Staff operations',
      title: 'A clearer shift starts here.',
      description: 'Coordinate clinical work, patient flow, laboratory requests, and pharmacy tasks.',
      action: user ? 'Open workspace' : 'Staff sign in',
      path: user ? '/dashboard' : '/login?portal=staff',
    },
  }
  const selectedFocus = focusContent[activeFocus]

  return (
    <div className="hospital-home">
      <div className="hospital-grid-pattern" />
      <main className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 lg:pt-16">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="home-reveal">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-clinical-teal shadow-sm">
              <span className="status-dot" /> Aarisha's Hospital · Connected care
            </div>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05] tracking-tight text-clinical-navy sm:text-6xl">
              Better care begins with a clearer view.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              A modern home for the people, workflows, and decisions that keep your hospital moving.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={selectedFocus.path} className="btn-primary inline-flex items-center gap-2 px-5 py-3 shadow-lg shadow-teal-900/10">
                {selectedFocus.action} <span aria-hidden="true">→</span>
              </Link>
              <Link to="/appointments" className="btn-secondary inline-flex items-center gap-2 border border-slate-200 bg-white px-5 py-3">
                Check appointments <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="mt-12 flex max-w-md gap-2 rounded-xl border border-slate-200 bg-white/75 p-1.5 shadow-sm" role="tablist" aria-label="Care focus">
              {Object.entries(focusContent).map(([key, content]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={activeFocus === key}
                  onClick={() => setActiveFocus(key)}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${activeFocus === key ? 'bg-clinical-navy text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
                >
                  {content.label}
                </button>
              ))}
            </div>
            <div className="mt-5 max-w-lg">
              <h2 className="text-xl font-semibold text-clinical-navy">{selectedFocus.title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">{selectedFocus.description}</p>
            </div>
          </div>

          <div className="home-visual home-reveal-delay relative min-h-[460px] overflow-hidden rounded-[2rem] bg-clinical-navy shadow-2xl shadow-slate-900/20">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85"
              alt="Healthcare professional reviewing patient information"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/10 to-transparent" />
            <div className="absolute left-6 right-6 top-6 flex items-center justify-between text-white">
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">Hospital pulse</span>
              <span className="flex items-center gap-2 text-xs text-white/80"><span className="status-dot status-dot-light" /> Live overview</span>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-sm font-medium text-teal-200">Today at a glance</p>
              <p className="mt-1 text-2xl font-semibold text-white">Every detail, closer to care.</p>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="pulse-stat"><strong>{formatValue(stats.bedOccupancyRate, '%')}</strong><span>Beds in use</span></div>
                <div className="pulse-stat"><strong>{formatValue(stats.opdToday)}</strong><span>OPD visits</span></div>
                <div className="pulse-stat"><strong>{formatValue(stats.appointments)}</strong><span>Appointments</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 border-t border-slate-200/80 pt-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clinical-teal">Quick access</p>
              <h2 className="mt-2 text-2xl font-semibold text-clinical-navy">The right next step, ready.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-500">Move from overview to action without searching through menus.</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { title: 'Appointments', detail: 'Book or review a visit', path: '/appointments', mark: '01' },
              { title: 'Medical records', detail: 'Find the latest care notes', path: '/medical-records', mark: '02' },
              { title: 'Patient services', detail: 'Explore billing and pharmacy', path: '/dashboard', mark: '03' },
            ].map((item) => (
              <Link key={item.title} to={item.path} className="quick-action group">
                <span className="text-xs font-bold text-clinical-teal">{item.mark}</span>
                <span className="mt-8 block text-lg font-semibold text-clinical-navy">{item.title}</span>
                <span className="mt-1 block text-sm text-slate-500">{item.detail}</span>
                <span className="mt-5 block text-xl text-clinical-teal transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
