import React, { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { registerUser } from '../api/auth'
import type { DoctorRegisterData } from '../types/auth'
import { Alert } from './Alert'
import { FileUploadInput } from './FileUploadInput'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { PhoneInput } from './PhoneInput'

const initialForm: DoctorRegisterData = {
  role: 'doctor',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  medicalLicenseNumber: '',
  specialization: 'Cardiology',
  department: 'Cardiology',
  yearsOfExperience: '',
  qualification: '',
  licenseDocument: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false
}

const SPECIALIZATION_OPTIONS = [
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Dermatology', label: 'Dermatology' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: 'Orthopedics', label: 'Orthopedics' },
  { value: 'General Medicine', label: 'General Medicine' },
  { value: 'Psychiatry', label: 'Psychiatry' },
  { value: 'Oncology', label: 'Oncology' },
  { value: 'Obstetrics & Gynecology', label: 'Obstetrics & Gynecology' },
  { value: 'Emergency Medicine', label: 'Emergency Medicine' },
  { value: 'General Surgery', label: 'General Surgery' }
]

const DEPARTMENT_OPTIONS = [
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Emergency', label: 'Emergency' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: 'Surgery', label: 'Surgery' },
  { value: 'Internal Medicine', label: 'Internal Medicine' },
  { value: 'Radiology', label: 'Radiology' },
  { value: 'Intensive Care (ICU)', label: 'Intensive Care (ICU)' },
  { value: 'Outpatient Clinic', label: 'Outpatient Clinic' }
]

interface DoctorRegisterFormProps {
  onRegisterSuccess?: () => void
}

export const DoctorRegisterForm: React.FC<DoctorRegisterFormProps> = ({ onRegisterSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState<DoctorRegisterData>(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const updateField = (field: keyof DoctorRegisterData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }

  // Validate Step 1 (Personal Info)
  const validateStep1 = () => {
    const stepErrors: Record<string, string> = {}

    if (!form.firstName.trim()) stepErrors.firstName = 'First name is required'
    else if (form.firstName.trim().length < 2) stepErrors.firstName = 'First name must be at least 2 characters'
    else if (!/^[a-zA-Z\s'-]+$/.test(form.firstName.trim())) stepErrors.firstName = 'First name can only contain letters'

    if (!form.lastName.trim()) stepErrors.lastName = 'Last name is required'
    else if (form.lastName.trim().length < 2) stepErrors.lastName = 'Last name must be at least 2 characters'
    else if (!/^[a-zA-Z\s'-]+$/.test(form.lastName.trim())) stepErrors.lastName = 'Last name can only contain letters'

    if (!form.email.trim()) stepErrors.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) stepErrors.email = 'Enter a valid email address'

    if (!form.phoneNumber.trim()) {
      stepErrors.phoneNumber = 'Phone number is required'
    } else if (!/^(97|98)\d{8}$/.test(form.phoneNumber)) {
      stepErrors.phoneNumber = 'Enter a valid Nepali number (e.g. 98XXXXXXXX)'
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      setStatus(null)
      return false
    }
    setErrors({})
    setStatus(null)
    return true
  }

  // Validate Step 2 (Professional Credentials)
  const validateStep2 = () => {
    const stepErrors: Record<string, string> = {}
    if (!form.medicalLicenseNumber.trim()) stepErrors.medicalLicenseNumber = 'Medical license number is required'
    if (!form.specialization.trim()) stepErrors.specialization = 'Specialization is required'
    if (!form.department.trim()) stepErrors.department = 'Department is required'
    if (!form.qualification.trim()) stepErrors.qualification = 'Qualification is required'
    if (!form.licenseDocument.trim()) stepErrors.licenseDocument = 'License document is required'

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      setStatus(null)
      return false
    }
    setErrors({})
    setStatus(null)
    return true
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handlePrevStep = () => {
    setStatus(null)
    setErrors({})
    if (step === 2) setStep(1)
    if (step === 3) setStep(2)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    setErrors({})

    const clientErrors: Record<string, string> = {}

    if (!form.password) clientErrors.password = 'Password is required'
    else if (form.password.length < 12) clientErrors.password = 'Password must be at least 12 characters'
    else if (!/[A-Z]/.test(form.password)) clientErrors.password = 'Password must contain at least one uppercase letter'
    else if (!/[0-9]/.test(form.password)) clientErrors.password = 'Password must contain at least one number'
    else if (!/[^a-zA-Z0-9]/.test(form.password)) clientErrors.password = 'Password must contain at least one special character'

    if (form.password && form.password !== form.confirmPassword) clientErrors.confirmPassword = 'Passwords do not match'

    if (!form.termsAccepted) clientErrors.termsAccepted = 'You must agree to the Terms & Medical Privacy Policy'

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      setStatus(null)
      setLoading(false)
      return
    }

    const result = await registerUser(form)

    if (result.errors) {
      setErrors(result.errors)
      setStatus(null)
    } else if (result.user || result.message.toLowerCase().includes('success')) {
      setStatus({ type: 'success', message: result.message })
      setForm(initialForm)
      if (onRegisterSuccess) onRegisterSuccess()
    } else {
      setStatus({ type: 'error', message: result.message })
    }

    setLoading(false)
  }

  return (
    <form data-testid="doctor-register-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* 3-Step Visual Progress Stepper */}
      <div className="rounded-xl bg-slate-100/80 p-1.5 border border-slate-200/70">
        <div className="grid grid-cols-3 gap-1">
          {/* Step 1 Indicator */}
          <button
            type="button"
            data-testid="doctor-step-1-indicator"
            onClick={() => setStep(1)}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 px-2 text-xs font-bold transition ${
              step === 1
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                : step > 1
                  ? 'text-emerald-700 bg-emerald-50/70 hover:bg-white'
                  : 'text-slate-400'
            }`}
          >
            <span
              className={`grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold ${
                step === 1
                  ? 'bg-indigo-600 text-white'
                  : step > 1
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
              }`}
            >
              {step > 1 ? '✓' : '1'}
            </span>
            <span className="truncate">1. Personal</span>
          </button>

          {/* Step 2 Indicator */}
          <button
            type="button"
            data-testid="doctor-step-2-indicator"
            onClick={() => {
              if (validateStep1()) setStep(2)
            }}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 px-2 text-xs font-bold transition ${
              step === 2
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                : step > 2
                  ? 'text-emerald-700 bg-emerald-50/70 hover:bg-white'
                  : 'text-slate-400'
            }`}
          >
            <span
              className={`grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold ${
                step === 2
                  ? 'bg-indigo-600 text-white'
                  : step > 2
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
              }`}
            >
              {step > 2 ? '✓' : '2'}
            </span>
            <span className="truncate">2. Credentials</span>
          </button>

          {/* Step 3 Indicator */}
          <button
            type="button"
            data-testid="doctor-step-3-indicator"
            onClick={() => {
              if (validateStep1() && validateStep2()) setStep(3)
            }}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 px-2 text-xs font-bold transition ${
              step === 3
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                : 'text-slate-400'
            }`}
          >
            <span
              className={`grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold ${
                step === 3
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span className="truncate">3. Security</span>
          </button>
        </div>
      </div>

      {status && <Alert type={status.type} message={status.message} />}

      {/* ================= STEP 1: Personal Information ================= */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              id="doctorFirstName"
              label="First Name"
              value={form.firstName}
              onChange={(val) => updateField('firstName', val)}
              error={errors.firstName}
              required
              autoComplete="given-name"
              placeholder="Sarah"
              testId="doctor-first-name-input"
            />
            <FormInput
              id="doctorLastName"
              label="Last Name"
              value={form.lastName}
              onChange={(val) => updateField('lastName', val)}
              error={errors.lastName}
              required
              autoComplete="family-name"
              placeholder="Smith"
              testId="doctor-last-name-input"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              id="doctorEmail"
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(val) => updateField('email', val)}
              error={errors.email}
              required
              autoComplete="email"
              placeholder="dr.smith@hospital.org"
              testId="doctor-email-input"
            />

            <PhoneInput
              id="doctorPhone"
              label="Phone Number"
              value={form.phoneNumber}
              onChange={(val) => updateField('phoneNumber', val)}
              error={errors.phoneNumber}
              required
              testId="doctor-phone-input"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Already registered?{' '}
              <Link to="/login" data-testid="doctor-login-link" className="font-semibold text-indigo-700 hover:text-indigo-900">
                Sign In
              </Link>
            </div>

            <button
              type="button"
              data-testid="doctor-next-step-1"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <span>Next: Professional Credentials</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: Professional Credentials ================= */}
      {step === 2 && (
        <div className="space-y-4">
          <FormInput
            id="medicalLicenseNumber"
            label="Medical License Number"
            value={form.medicalLicenseNumber}
            onChange={(val) => updateField('medicalLicenseNumber', val)}
            error={errors.medicalLicenseNumber}
            required
            placeholder="e.g. MED-894721-TX"
            hint="Official state medical license registration"
            testId="doctor-license-number-input"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormSelect
              id="specialization"
              label="Specialization"
              value={form.specialization}
              onChange={(val) => updateField('specialization', val)}
              options={SPECIALIZATION_OPTIONS}
              required
              error={errors.specialization}
              testId="doctor-specialization-select"
            />

            <FormSelect
              id="department"
              label="Department"
              value={form.department}
              onChange={(val) => updateField('department', val)}
              options={DEPARTMENT_OPTIONS}
              required
              error={errors.department}
              testId="doctor-department-select"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              id="qualification"
              label="Qualification"
              value={form.qualification}
              onChange={(val) => updateField('qualification', val)}
              error={errors.qualification}
              required
              placeholder="e.g. MBBS, MD"
              testId="doctor-qualification-input"
            />

            <FormInput
              id="yearsOfExperience"
              label="Years of Experience"
              type="number"
              min="0"
              max="70"
              value={form.yearsOfExperience}
              onChange={(val) => updateField('yearsOfExperience', val)}
              error={errors.yearsOfExperience}
              placeholder="e.g. 8"
              hint="Optional"
              testId="doctor-experience-input"
            />
          </div>

          <FileUploadInput
            id="licenseDocument"
            label="License Document"
            fileName={form.licenseDocument}
            onChange={(val) => updateField('licenseDocument', val)}
            required
            error={errors.licenseDocument}
            hint="Upload verified medical license document (PDF or Image)"
            testId="doctor-license-document"
          />

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              data-testid="doctor-prev-step-2"
              onClick={handlePrevStep}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <span>←</span>
              <span>Back</span>
            </button>

            <button
              type="button"
              data-testid="doctor-next-step-2"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <span>Next: Account Security</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: Account Security & Agreement ================= */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FormInput
                id="doctorPassword"
                label="Password"
                type="password"
                value={form.password}
                onChange={(val) => updateField('password', val)}
                error={errors.password}
                required
                hint="Must be at least 12 characters"
                autoComplete="new-password"
                placeholder="••••••••••••"
                testId="doctor-password-input"
              />
              <PasswordStrengthMeter password={form.password} />
            </div>

            <FormInput
              id="doctorConfirmPassword"
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(val) => updateField('confirmPassword', val)}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
              placeholder="••••••••••••"
              testId="doctor-confirm-password-input"
            />
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-slate-600 select-none">
              <input
                id="doctorTermsAccepted"
                data-testid="doctor-terms-checkbox"
                type="checkbox"
                checked={form.termsAccepted}
                onChange={(e) => updateField('termsAccepted', e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>
                I agree to the{' '}
                <span className="font-semibold text-indigo-700 hover:underline">Medical Terms of Practice & Privacy Policy</span>{' '}
                <span className="text-rose-500">*</span>
              </span>
            </label>
            {errors.termsAccepted && (
              <p data-testid="doctor-terms-error" role="alert" className="mt-1 text-xs font-medium text-rose-600">
                {errors.termsAccepted}
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              data-testid="doctor-prev-step-3"
              onClick={handlePrevStep}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <span>←</span>
              <span>Back</span>
            </button>

            <button
              type="submit"
              data-testid="doctor-submit-button"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              <span>{loading ? 'Submitting Registration...' : 'Submit Doctor Registration'}</span>
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
