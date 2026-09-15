import React, { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { registerUser } from '../api/auth'
import type { PatientRegisterData } from '../types/auth'
import { Alert } from './Alert'
import { DatePicker } from './DatePicker'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { PhoneInput } from './PhoneInput'

const initialForm: PatientRegisterData = {
  role: 'patient',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' }
]

interface PatientRegisterFormProps {
  onRegisterSuccess?: () => void
}

export const PatientRegisterForm: React.FC<PatientRegisterFormProps> = ({ onRegisterSuccess }) => {
  const [form, setForm] = useState<PatientRegisterData>(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const updateField = (field: keyof PatientRegisterData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    setErrors({})

    const clientErrors: Record<string, string> = {}

    // Name
    if (!form.firstName.trim()) clientErrors.firstName = 'First name is required'
    else if (form.firstName.trim().length < 2) clientErrors.firstName = 'First name must be at least 2 characters'
    else if (!/^[a-zA-Z\s'-]+$/.test(form.firstName.trim())) clientErrors.firstName = 'First name can only contain letters'

    if (!form.lastName.trim()) clientErrors.lastName = 'Last name is required'
    else if (form.lastName.trim().length < 2) clientErrors.lastName = 'Last name must be at least 2 characters'
    else if (!/^[a-zA-Z\s'-]+$/.test(form.lastName.trim())) clientErrors.lastName = 'Last name can only contain letters'

    // Date of Birth
    if (!form.dateOfBirth.trim()) {
      clientErrors.dateOfBirth = 'Date of birth is required'
    } else {
      const dob = new Date(form.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - dob.getFullYear()
      if (isNaN(dob.getTime())) clientErrors.dateOfBirth = 'Invalid date of birth'
      else if (dob >= today) clientErrors.dateOfBirth = 'Date of birth must be in the past'
      else if (age < 1 || age > 120) clientErrors.dateOfBirth = 'Please enter a valid date of birth'
    }

    // Nepal phone: 10 digits starting with 97 or 98
    if (!form.phoneNumber.trim()) {
      clientErrors.phoneNumber = 'Phone number is required'
    } else if (!/^(97|98)\d{8}$/.test(form.phoneNumber)) {
      clientErrors.phoneNumber = 'Enter a valid Nepali number (e.g. 98XXXXXXXX)'
    }

    // Email
    if (!form.email.trim()) clientErrors.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) clientErrors.email = 'Enter a valid email address'

    // Password
    if (!form.password) clientErrors.password = 'Password is required'
    else if (form.password.length < 12) clientErrors.password = 'Password must be at least 12 characters'
    else if (!/[A-Z]/.test(form.password)) clientErrors.password = 'Password must contain at least one uppercase letter'
    else if (!/[0-9]/.test(form.password)) clientErrors.password = 'Password must contain at least one number'
    else if (!/[^a-zA-Z0-9]/.test(form.password)) clientErrors.password = 'Password must contain at least one special character'

    if (form.password && form.password !== form.confirmPassword) clientErrors.confirmPassword = 'Passwords do not match'

    if (!form.termsAccepted) clientErrors.termsAccepted = 'You must agree to the Terms & Privacy Policy'

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

  const today = new Date().toISOString().split('T')[0]

  return (
    <form data-testid="patient-register-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
      {status && <Alert type={status.type} message={status.message} />}

      {/* Row 1: Name */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          id="firstName"
          label="First Name"
          value={form.firstName}
          onChange={(val) => updateField('firstName', val)}
          error={errors.firstName}
          required
          autoComplete="given-name"
          placeholder="Jane"
          testId="patient-first-name-input"
        />
        <FormInput
          id="lastName"
          label="Last Name"
          value={form.lastName}
          onChange={(val) => updateField('lastName', val)}
          error={errors.lastName}
          required
          autoComplete="family-name"
          placeholder="Doe"
          testId="patient-last-name-input"
        />
      </div>

      {/* Row 2: DOB & Gender */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DatePicker
          id="dateOfBirth"
          label="Date of Birth"
          max={today}
          value={form.dateOfBirth}
          onChange={(val) => updateField('dateOfBirth', val)}
          error={errors.dateOfBirth}
          required
          testId="patient-dob-input"
        />

        <FormSelect
          id="gender"
          label="Gender"
          placeholder="Select Gender"
          value={form.gender}
          onChange={(val) => updateField('gender', val)}
          options={GENDER_OPTIONS}
          error={errors.gender}
          testId="patient-gender-select"
        />
      </div>

      {/* Row 3: Phone & Email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PhoneInput
          id="phoneNumber"
          label="Phone Number"
          value={form.phoneNumber}
          onChange={(val) => updateField('phoneNumber', val)}
          error={errors.phoneNumber}
          required
          testId="patient-phone-input"
        />

        <FormInput
          id="email"
          label="Email Address"
          type="email"
          value={form.email}
          onChange={(val) => updateField('email', val)}
          error={errors.email}
          required
          autoComplete="email"
          placeholder="patient@example.com"
          testId="patient-email-input"
        />
      </div>

      {/* Row 4: Password & Confirm Password */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FormInput
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={(val) => updateField('password', val)}
            error={errors.password}
            required
            autoComplete="new-password"
            placeholder="••••••••••••"
            testId="patient-password-input"
          />
          <PasswordStrengthMeter password={form.password} />
        </div>

        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={(val) => updateField('confirmPassword', val)}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
          placeholder="••••••••••••"
          testId="patient-confirm-password-input"
        />
      </div>

      {/* Row 5: Terms & Privacy Policy Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-slate-600 select-none">
          <input
            id="termsAccepted"
            data-testid="patient-terms-checkbox"
            type="checkbox"
            checked={form.termsAccepted}
            onChange={(e) => updateField('termsAccepted', e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <span>
            I agree to the{' '}
            <span className="font-semibold text-sky-700 hover:underline">Terms of Service & Privacy Policy</span>{' '}
            <span className="text-rose-500">*</span>
          </span>
        </label>
        {errors.termsAccepted && (
          <p data-testid="patient-terms-error" role="alert" className="mt-1 text-xs font-medium text-rose-600">
            {errors.termsAccepted}
          </p>
        )}
      </div>

      <button
        type="submit"
        data-testid="patient-submit-button"
        disabled={loading}
        className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 px-4 text-sm font-bold text-white shadow-sm shadow-sky-600/20 transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        <span>{loading ? 'Creating Account...' : 'Create Patient Account'}</span>
      </button>

      <p className="pt-2 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" data-testid="patient-login-link" className="font-semibold text-sky-700 hover:text-sky-900">
          Sign In
        </Link>
      </p>
    </form>
  )
}
