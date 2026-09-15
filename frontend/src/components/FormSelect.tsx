import React, { useState, useRef, useEffect } from 'react'

interface Option {
  value: string
  label: string
}

interface FormSelectProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  required?: boolean
  error?: string
  hint?: string
  testId?: string
}

export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false,
  error,
  hint,
  testId
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectTestId = testId ?? `${id}-select`
  const errorTestId = `${id}-error`
  const hintTestId = `${id}-hint`

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="block text-xs font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      {/* Hidden native select for form accessibility and automation compatibility */}
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="relative mt-1.5">
        <button
          type="button"
          id={`${id}-button`}
          data-testid={selectTestId}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex w-full items-center justify-between rounded-xl border bg-white py-2.5 pl-3.5 pr-3 text-left text-sm outline-none transition ${
            !selectedOption ? 'text-slate-400' : 'text-slate-900 font-medium'
          } ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
              : isOpen
              ? 'border-sky-500 ring-4 ring-sky-100'
              : 'border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100'
          }`}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <svg
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-sky-600' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Custom Modern Dropdown Menu */}
        {isOpen && (
          <div
            role="listbox"
            aria-labelledby={id}
            className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl transition-all"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  data-testid={`${id}-option-${opt.value}`}
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                    isSelected
                      ? 'bg-sky-50 font-semibold text-sky-900'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <svg className="h-4 w-4 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
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
