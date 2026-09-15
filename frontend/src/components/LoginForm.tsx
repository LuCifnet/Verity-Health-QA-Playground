import React, { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import type { LoginData } from '../types/auth'
import { Alert } from './Alert'
import { FormInput } from './FormInput'

const initialForm: LoginData = {
  email: '',
  password: ''
}

export const LoginForm: React.FC = () => {
  const [form, setForm] = useState<LoginData>(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const updateField = (field: keyof LoginData, value: string) => {
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
    if (!form.email.trim()) clientErrors.email = 'Email address is required'
    if (!form.password) clientErrors.password = 'Password is required'

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      setStatus(null)
      setLoading(false)
      return
    }

    const result = await loginUser(form)

    if (result.errors) {
      setErrors(result.errors)
      setStatus(null)
    } else if (result.token && result.user) {
      login(result.user, result.token)
      setStatus({ type: 'success', message: result.message || 'Login successful! Redirecting to dashboard...' })
      // Brief pause for QA automation assertions, then navigate to /home
      setTimeout(() => {
        navigate('/home')
      }, 500)
    } else {
      setStatus({ type: 'error', message: result.message })
    }

    setLoading(false)
  }

  return (
    <form data-testid="login-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
      {status && <Alert type={status.type} message={status.message} />}

      <FormInput
        id="loginEmail"
        label="Email Address"
        type="email"
        value={form.email}
        onChange={(val) => updateField('email', val)}
        error={errors.email}
        required
        testId="login-email-input"
        autoComplete="email"
        placeholder="doctor@hospital.org or patient@example.com"
      />

      <FormInput
        id="loginPassword"
        label="Password"
        type="password"
        value={form.password}
        onChange={(val) => updateField('password', val)}
        error={errors.password}
        required
        testId="login-password-input"
        autoComplete="current-password"
        placeholder="••••••••••••"
      />

      <button
        type="submit"
        data-testid="login-button"
        disabled={loading}
        className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-sky-600/20 transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        <span>{loading ? 'Signing in...' : 'Sign in to Healthcare Portal'}</span>
      </button>

      <p className="pt-2 text-center text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" data-testid="login-register-link" className="font-semibold text-sky-700 hover:text-sky-900">
          Create Patient or Doctor Account
        </Link>
      </p>
    </form>
  )
}
