import React, { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import type { LoginData } from '../types/auth'
import { FormInput } from './FormInput'
import { InjectionLoader } from './InjectionLoader'

const initialForm: LoginData = {
  email: '',
  password: ''
}

export const LoginForm: React.FC = () => {
  const [form, setForm] = useState<LoginData>(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const toast = useToast()
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
    setErrors({})

    const clientErrors: Record<string, string> = {}
    if (!form.email.trim()) clientErrors.email = 'Email address is required'
    if (!form.password) clientErrors.password = 'Password is required'

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      setLoading(false)
      return
    }

    const result = await loginUser(form)

    if (result.errors) {
      setErrors(result.errors)
      toast.error('Please resolve the highlighted validation errors.', 'Validation Failed')
    } else if (result.token && result.user) {
      login(result.user, result.token)
      toast.success('Welcome back to Verity Health!', 'Login Successful')
      // Brief pause for QA automation assertions, then navigate to /home
      setTimeout(() => {
        navigate('/home')
      }, 500)
    } else {
      toast.error('Invalid email or password. Please try again.', 'Authentication Failed')
    }

    setLoading(false)
  }

  return (
    <form data-testid="login-form" onSubmit={handleSubmit} className="space-y-4" noValidate>

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
        {loading && <InjectionLoader className="text-white" size="sm" />}
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
