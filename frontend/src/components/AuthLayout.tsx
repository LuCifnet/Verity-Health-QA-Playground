import React from 'react'
import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  activeRole?: 'patient' | 'doctor'
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  activeRole = 'patient'
}) => {
  const isDoctor = activeRole === 'doctor'

  const bannerConfig = isDoctor
    ? {
      image: '/doctor-banner.jpg',
      alt: 'Licensed Medical Doctor',
      badge: 'Clinical Practitioner Portal',
      title: 'Verified Medical Practice & Scheduling',
      desc: 'Dedicated clinical workspace for verified medical practitioners, specialists, and hospital departments.'
    }
    : {
      image: '/patient-banner.jpg',
      alt: 'Caring Medical Consultation',
      badge: 'Patient Health Portal',
      title: 'Your Health Journey, Simplified & Connected',
      desc: 'Access your personal health records, consult specialists, and manage clinical care history with ease.'
    }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-100 p-4 sm:p-6 lg:p-10 flex flex-col justify-center items-center font-sans">
      {/* Main 2-Column Split Card */}
      <section className="w-full max-w-5xl rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-[420px_1fr]">
        {/* Left Visual Panel with Overlay Branding and Home Navigation */}
        <aside className="relative hidden lg:flex flex-col justify-between bg-slate-950 overflow-hidden self-stretch min-h-[640px] p-7">
          {/* Background Image - Fixed height inside overflow-hidden prevents any scale/zoom on container resize */}
          <img
            key={bannerConfig.image}
            src={bannerConfig.image}
            alt={bannerConfig.alt}
            className="absolute top-0 left-0 h-[900px] w-full object-cover object-top filter brightness-95 pointer-events-none select-none"
          />
          {/* Dual Soft Gradient Overlays (Top & Bottom for text readability) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-slate-950/70 pointer-events-none" />

          {/* Top Branding & Home Button Inside Image */}
          <div className="relative z-10 flex items-center justify-between">
            <Link
              to="/home"
              data-testid="brand"
              className="inline-flex items-center gap-2.5 text-white hover:opacity-95 transition group"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white shadow-md shadow-sky-900/40 group-hover:scale-105 transition-transform">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <div>
                <span className="block font-extrabold tracking-tight text-white text-base leading-tight">
                  Verity Health
                </span>
                <span className="block text-[10px] font-medium text-sky-200 uppercase tracking-wider">
                  Clinical Portal
                </span>
              </div>
            </Link>

            <Link
              to="/home"
              data-testid="back-to-home-link"
              className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black/60 border border-white/25 transition shadow-sm"
              title="Return to Home Dashboard"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Home</span>
            </Link>
          </div>

          {/* Bottom Inspiring Caption */}
          <div className="relative z-10 space-y-2.5 pt-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-semibold text-sky-200 border border-white/20 shadow-xs">
              <span>{bannerConfig.badge}</span>
            </div>
            <h2 className="text-xl font-bold leading-snug text-white">
              {bannerConfig.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {bannerConfig.desc}
            </p>
          </div>
        </aside>

        {/* Right Form Container */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          {/* Mobile-Only Header */}
          <div className="flex items-center justify-between lg:hidden mb-6 pb-4 border-b border-slate-100">
            <Link to="/home" data-testid="mobile-brand" className="inline-flex items-center gap-2 text-slate-900 font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-600 text-white font-bold text-sm">
                +
              </span>
              <span className="font-extrabold text-base">Verity Health</span>
            </Link>
            <Link
              to="/home"
              data-testid="mobile-home-link"
              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900 rounded-lg px-2.5 py-1 bg-sky-50"
            >
              ← Home
            </Link>
          </div>

          {/* Card Form Header */}
          <div className="mb-5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">{subtitle}</p>
          </div>

          {/* Form Content */}
          {children}
        </div>
      </section>

      {/* Subtle Bottom Note */}
      <div className="text-center pt-4 text-[11px] text-slate-400">
        Verity Health Clinical System • HIPAA Compliant QA Protocol
      </div>
    </div>
  )
}
