import React from 'react'

interface PhoneInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  testId?: string
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  required = false,
  testId
}) => {
  const inputTestId = testId ?? `${id}-input`
  const errorTestId = `${id}-error`

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow digits only, max 10 characters
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
    onChange(digits)
  }

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div
        className={`relative mt-1.5 flex items-stretch rounded-xl border bg-white transition ${
          error
            ? 'border-rose-400 ring-4 ring-rose-100'
            : 'border-slate-200 hover:border-slate-300 focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100'
        }`}
      >
        {/* NP Country Code Prefix */}
        <span className="inline-flex items-center gap-1 rounded-l-xl border-r border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 select-none whitespace-nowrap">
          <span className="font-bold text-sky-700">NP</span>
          <span className="text-slate-500">+977</span>
        </span>

        <input
          id={id}
          data-testid={inputTestId}
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          placeholder="98XXXXXXXX"
          maxLength={10}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorTestId : undefined}
          className="block w-full rounded-r-xl bg-transparent py-2.5 pl-3.5 pr-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>

      {error && (
        <p data-testid={errorTestId} role="alert" className="mt-1 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  )
}
