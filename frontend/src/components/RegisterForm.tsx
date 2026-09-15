import React from 'react'
import { DoctorRegisterForm } from './DoctorRegisterForm'
import { PatientRegisterForm } from './PatientRegisterForm'

interface RegisterFormProps {
  role?: 'patient' | 'doctor'
  onRoleChange?: (role: 'patient' | 'doctor') => void
  onRegisterSuccess?: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  role = 'patient',
  onRoleChange,
  onRegisterSuccess
}) => {
  const selectedRole = role

  const handleRoleSelect = (newRole: 'patient' | 'doctor') => {
    if (onRoleChange) {
      onRoleChange(newRole)
    }
  }

  return (
    <div className="space-y-6">
      {/* Segmented Role Switcher Tabs */}
      <div className="rounded-xl bg-slate-100/90 p-1 border border-slate-200/70" role="tablist">
        <div className="grid grid-cols-2 gap-1">
          {/* Patient Tab */}
          <button
            type="button"
            role="tab"
            aria-selected={selectedRole === 'patient'}
            data-testid="role-patient-tab"
            onClick={() => handleRoleSelect('patient')}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-xs sm:text-sm font-bold transition ${
              selectedRole === 'patient'
                ? 'bg-white text-sky-700 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40'
            }`}
          >
            <svg className="h-4 w-4 shrink-0 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Patient Registration</span>
          </button>

          {/* Doctor Tab */}
          <button
            type="button"
            role="tab"
            aria-selected={selectedRole === 'doctor'}
            data-testid="role-doctor-tab"
            onClick={() => handleRoleSelect('doctor')}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-xs sm:text-sm font-bold transition ${
              selectedRole === 'doctor'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40'
            }`}
          >
            <svg className="h-4 w-4 shrink-0 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Doctor Registration</span>
          </button>
        </div>
      </div>

      {/* Dynamic Form Render */}
      {selectedRole === 'patient' ? (
        <PatientRegisterForm onRegisterSuccess={onRegisterSuccess} />
      ) : (
        <DoctorRegisterForm onRegisterSuccess={onRegisterSuccess} />
      )}
    </div>
  )
}
