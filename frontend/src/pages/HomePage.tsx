import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getHome } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { HomePageSkeleton } from '../components/Skeleton'

export const HomePage: React.FC = () => {
  const { user, token, isAuthenticated, login, logout } = useAuth()
  const navigate = useNavigate()
  const [sessionStatus, setSessionStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('checking')
  const [apiConnected, setApiConnected] = useState<boolean | null>(null)

  // GET /api/auth/home on mount — always visible in the browser's Network tab
  useEffect(() => {
    let cancelled = false
    setSessionStatus('checking')

    getHome(token).then((result) => {
      if (cancelled) return
      const isOnline = Boolean(result.message && !result.message.includes('Could not connect'))
      setApiConnected(isOnline)

      if (token && result.user && result.user.id) {
        login(result.user, token)
        setSessionStatus('valid')
      } else if (token && !result.user) {
        setSessionStatus('invalid')
      } else {
        setSessionStatus('idle')
      }
    }).catch(() => {
      if (cancelled) return
      setApiConnected(false)
      setSessionStatus(token ? 'invalid' : 'idle')
    })

    // Cleanup: cancel stale responses from React StrictMode double-invoke
    return () => { cancelled = true }
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col font-sans text-slate-800">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/home"
              data-testid="nav-brand"
              className="flex items-center gap-2.5 text-lg font-bold text-slate-900 hover:opacity-95 transition"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-sm shadow-sky-600/30 font-black text-sm">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <span className="font-extrabold tracking-tight">Verity Health</span>
            </Link>

            {/* API Status Badge */}
            {apiConnected !== null ? (
              <span
                data-testid="api-status-badge"
                className={`hidden md:inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  apiConnected
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${apiConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {apiConnected ? 'API Connected' : 'API Offline'}
              </span>
            ) : (
              <span
                data-testid="api-status-badge"
                className="hidden md:inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-ping" />
                Connecting API…
              </span>
            )}
          </div>

          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/home"
              data-testid="nav-home"
              className="text-sm font-semibold text-sky-700 hover:text-sky-900"
            >
              Dashboard
            </Link>

            {/* Swagger Documentation Link */}
            <a
              href="/api-docs"
              target="_blank"
              rel="noreferrer"
              data-testid="swagger-link"
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-xs"
              title="Open Swagger API documentation in a new tab"
            >
              <span className="text-emerald-600 font-bold">Swagger</span> Docs ↗
            </a>

            {sessionStatus === 'checking' && !user ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-16 bg-slate-200 rounded-lg animate-shimmer" />
                <div className="h-8 w-20 bg-slate-200 rounded-lg animate-shimmer" />
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <span
                  data-testid="nav-user-email"
                  className="hidden sm:inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {user.email}
                </span>
                <button
                  type="button"
                  data-testid="logout-button"
                  onClick={handleLogout}
                  className="rounded-lg bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition border border-rose-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  data-testid="nav-login"
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  data-testid="nav-register"
                  className="rounded-lg bg-sky-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
        {sessionStatus === 'checking' ? (
          <HomePageSkeleton />
        ) : isAuthenticated && user ? (
          /* Authenticated Dashboard View */
          <div className="space-y-8">
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5">
                      Active Medical Session
                    </span>
                    <span
                      data-testid="user-role-badge"
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                        user.role === 'doctor'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : 'bg-sky-100 text-sky-800 border border-sky-200'
                      }`}
                    >
                      {user.role === 'doctor' ? '🩺 Practitioner / Doctor' : '👤 Patient Account'}
                    </span>
                    {sessionStatus === 'valid' && (
                      <span
                        data-testid="session-valid-badge"
                        className="inline-block rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold px-2.5 py-0.5"
                      >
                        ✓ Verified (/api/auth/home)
                      </span>
                    )}
                  </div>
                  <h1 data-testid="home-heading" className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome back{user.firstName ? `, ${user.role === 'doctor' ? 'Dr. ' : ''}${user.firstName}` : ''}!
                  </h1>
                  <p data-testid="home-subtitle" className="mt-1 text-sm text-slate-500">
                    Signed in as <strong className="font-semibold text-slate-800 capitalize">{user.role || 'patient'}</strong>. Profile telemetry synced via <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">GET /api/auth/home</code>.
                  </p>
                </div>
                <button
                  type="button"
                  data-testid="home-logout-button"
                  onClick={handleLogout}
                  className="self-start rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-rose-700 transition"
                >
                  Sign Out
                </button>
              </div>

              {/* User Details Grid */}
              <div data-testid="user-profile-card" className="mt-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Healthcare Profile Details (For QA Assertion)
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
                    <dt className="text-xs font-medium text-slate-500">Account Role</dt>
                    <dd data-testid="user-role-value" className="mt-1 text-sm font-bold text-slate-900 capitalize">
                      {user.role || 'patient'}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
                    <dt className="text-xs font-medium text-slate-500">User Email</dt>
                    <dd data-testid="user-email-value" className="mt-1 text-sm font-bold text-slate-900 break-all">
                      {user.email}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
                    <dt className="text-xs font-medium text-slate-500">User ID (Supabase Auth)</dt>
                    <dd data-testid="user-id-value" className="mt-1 text-xs font-mono text-slate-700 break-all">
                      {user.id}
                    </dd>
                  </div>
                  {user.firstName && (
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
                      <dt className="text-xs font-medium text-slate-500">Full Name</dt>
                      <dd data-testid="user-name-value" className="mt-1 text-sm font-semibold text-slate-900">
                        {user.firstName} {user.lastName}
                      </dd>
                    </div>
                  )}
                  {user.phoneNumber && (
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
                      <dt className="text-xs font-medium text-slate-500">Phone Number</dt>
                      <dd data-testid="user-phone-value" className="mt-1 text-sm font-semibold text-slate-900">
                        {user.phoneNumber}
                      </dd>
                    </div>
                  )}
                  {/* Patient Specific Fields */}
                  {user.dateOfBirth && (
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
                      <dt className="text-xs font-medium text-slate-500">Date of Birth</dt>
                      <dd data-testid="user-dob-value" className="mt-1 text-sm font-semibold text-slate-900">
                        {user.dateOfBirth}
                      </dd>
                    </div>
                  )}
                  {user.gender && (
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
                      <dt className="text-xs font-medium text-slate-500">Gender</dt>
                      <dd data-testid="user-gender-value" className="mt-1 text-sm font-semibold capitalize text-slate-900">
                        {user.gender.replace(/_/g, ' ')}
                      </dd>
                    </div>
                  )}
                  {/* Doctor Specific Fields */}
                  {user.medicalLicenseNumber && (
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
                      <dt className="text-xs font-medium text-slate-500">Medical License Number</dt>
                      <dd data-testid="user-license-number-value" className="mt-1 text-sm font-mono font-bold text-indigo-900">
                        {user.medicalLicenseNumber}
                      </dd>
                    </div>
                  )}
                  {user.specialization && (
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
                      <dt className="text-xs font-medium text-slate-500">Specialization</dt>
                      <dd data-testid="user-specialization-value" className="mt-1 text-sm font-semibold text-slate-900">
                        {user.specialization}
                      </dd>
                    </div>
                  )}
                  {user.department && (
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
                      <dt className="text-xs font-medium text-slate-500">Department</dt>
                      <dd data-testid="user-department-value" className="mt-1 text-sm font-semibold text-slate-900">
                        {user.department}
                      </dd>
                    </div>
                  )}
                  {user.qualification && (
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
                      <dt className="text-xs font-medium text-slate-500">Qualification</dt>
                      <dd data-testid="user-qualification-value" className="mt-1 text-sm font-semibold text-slate-900">
                        {user.qualification}
                      </dd>
                    </div>
                  )}
                  {user.yearsOfExperience !== undefined && user.yearsOfExperience !== null && (
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
                      <dt className="text-xs font-medium text-slate-500">Years of Experience</dt>
                      <dd data-testid="user-experience-value" className="mt-1 text-sm font-semibold text-slate-900">
                        {user.yearsOfExperience} {user.yearsOfExperience === 1 ? 'Year' : 'Years'}
                      </dd>
                    </div>
                  )}
                  {user.licenseDocument && (
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
                      <dt className="text-xs font-medium text-slate-500">License Document</dt>
                      <dd data-testid="user-license-doc-value" className="mt-1 text-sm font-medium text-indigo-700 truncate">
                        📄 {user.licenseDocument}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        ) : (
          /* Guest Hero View */
          <div className="space-y-10 text-center sm:text-left">
            <div className="rounded-2xl bg-slate-900 p-8 sm:p-12 text-white shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block rounded-full bg-sky-950 text-sky-300 border border-sky-800 text-xs font-semibold px-3 py-1 uppercase tracking-wider">
                    Healthcare QA Testing Lab
                  </span>
                  <span
                    data-testid="api-network-badge"
                    className="inline-block rounded-full bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 border border-slate-700"
                  >
                    📡 Live API Synced
                  </span>
                </div>

                <h1 data-testid="home-heading" className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  Healthcare System Test Playground
                </h1>
                <p data-testid="home-subtitle" className="mt-4 max-w-2xl text-base sm:text-lg text-slate-300">
                  A realistic clinical management testground for automated testing with Playwright, Cypress, Selenium, and Postman/Swagger.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
                  <Link
                    to="/register"
                    data-testid="home-register-link"
                    className="rounded-xl bg-sky-600 px-6 py-3.5 text-center text-sm font-bold text-white shadow-sm hover:bg-sky-500 transition"
                  >
                    Test Registration (/register)
                  </Link>
                  <Link
                    to="/login"
                    data-testid="home-login-link"
                    className="rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-center text-sm font-semibold text-white hover:bg-slate-800 transition"
                  >
                    Test Sign In (/login)
                  </Link>
                  <a
                    href="/api-docs"
                    target="_blank"
                    rel="noreferrer"
                    data-testid="home-swagger-btn"
                    className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-6 py-3.5 text-center text-sm font-semibold text-emerald-300 hover:bg-emerald-900/50 transition"
                  >
                    Open Swagger API Docs ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Feature Testing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl bg-white p-6 border border-slate-200 shadow-xs">
                <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4 border border-sky-100">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900">Patient & Doctor Roles</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Simulate separate patient signups and licensed medical doctor onboarding with document upload verification.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 border border-slate-200 shadow-xs">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-100">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900">Interactive Swagger UI</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Test <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">/register</code>, <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">/login</code>, and <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">/home</code> directly via Swagger at <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">/api-docs</code>.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 border border-slate-200 shadow-xs">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4 border border-indigo-100">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900">Deterministic Locators</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Target elements with consistent <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">data-testid</code> attributes across all pages and components.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer data-testid="home-footer" className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        Verity Health Clinical System • Built for automated & manual QA testing
      </footer>
    </div>
  )
}
