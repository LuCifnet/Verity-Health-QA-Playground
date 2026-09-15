import React, { useState } from 'react'

interface FormInputProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  autoComplete?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  min?: string
  max?: string
  testId?: string
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  autoComplete,
  placeholder,
  required = false,
  disabled = false,
  min,
  max,
  testId
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password'
  const isDateField = type === 'date'
  const effectiveType = isPasswordField ? (showPassword ? 'text' : 'password') : type

  const inputTestId = testId ?? `${id}-input`
  const errorTestId = `${id}-error`
  const hintTestId = `${id}-hint`
  const toggleTestId = `${id}-toggle-password`

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative mt-1.5">
        <input
          id={id}
          data-testid={inputTestId}
          type={effectiveType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorTestId : hint ? hintTestId : undefined}
          className={`block w-full rounded-xl border bg-white py-2.5 pl-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
            isPasswordField ? 'pr-10' : 'pr-3.5'
          } ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
              : 'border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100'
          } ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-75' : ''}`}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            data-testid={toggleTestId}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-sky-600"
          >
            {showPassword ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {hint && !error && (
        <p data-testid={hintTestId} className="mt-1 text-xs text-slate-400">
          {hint}
        </p>
      )}

      {error && (
        <p data-testid={errorTestId} role="alert" className="mt-1 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  )
}
