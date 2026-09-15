import React, { useState, useRef, useEffect } from 'react'

interface DatePickerProps {
  id: string
  label: string
  value: string // YYYY-MM-DD
  onChange: (value: string) => void
  error?: string
  hint?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  min?: string // YYYY-MM-DD
  max?: string // YYYY-MM-DD
  testId?: string
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export const DatePicker: React.FC<DatePickerProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  placeholder = 'YYYY-MM-DD',
  required = false,
  disabled = false,
  min,
  max,
  testId
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const inputTestId = testId ?? `${id}-input`
  const errorTestId = `${id}-error`
  const hintTestId = `${id}-hint`

  // Parse current value or default to current date / selected year
  const parsedDate = value ? new Date(value + 'T00:00:00') : null
  const isValidDate = parsedDate && !isNaN(parsedDate.getTime())

  const [viewYear, setViewYear] = useState<number>(
    isValidDate ? parsedDate.getFullYear() : new Date().getFullYear() - 20
  )
  const [viewMonth, setViewMonth] = useState<number>(
    isValidDate ? parsedDate.getMonth() : 0
  )

  // Sync view when value changes externally
  useEffect(() => {
    if (isValidDate) {
      setViewYear(parsedDate.getFullYear())
      setViewMonth(parsedDate.getMonth())
    }
  }, [value])

  // Close on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Year choices for birthdate (1900 to current year)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)

  // Calendar calculations
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay()

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((prev) => prev - 1)
    } else {
      setViewMonth((prev) => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((prev) => prev + 1)
    } else {
      setViewMonth((prev) => prev + 1)
    }
  }

  const handleSelectDay = (day: number) => {
    const monthStr = String(viewMonth + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    const dateString = `${viewYear}-${monthStr}-${dayStr}`
    onChange(dateString)
    setIsOpen(false)
  }

  const isDateDisabled = (day: number) => {
    const checkDateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    if (max && checkDateStr > max) return true
    if (min && checkDateStr < min) return true
    return false
  }

  const formatDisplayDate = (val: string) => {
    if (!val) return ''
    const d = new Date(val + 'T00:00:00')
    if (isNaN(d.getTime())) return val
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="block text-xs font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      {/* Hidden input for test automation compatibility */}
      <input
        type="hidden"
        id={id}
        data-testid={inputTestId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="relative mt-1.5">
        <button
          type="button"
          id={`${id}-button`}
          data-testid={`${id}-trigger`}
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex w-full items-center justify-between rounded-xl border bg-white py-2.5 pl-3.5 pr-3 text-left text-sm outline-none transition ${
            !value ? 'text-slate-400' : 'text-slate-900 font-medium'
          } ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
              : isOpen
              ? 'border-sky-500 ring-4 ring-sky-100'
              : 'border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100'
          } ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
        >
          <span>{value ? formatDisplayDate(value) : placeholder}</span>
          <div className="flex items-center text-sky-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </button>

        {/* Custom Themed Calendar Popup */}
        {isOpen && (
          <div className="absolute left-0 right-0 z-50 mt-1.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-150 sm:w-80">
            {/* Calendar Header with Selectors & Nav */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex items-center gap-1.5">
                {/* Month Dropdown */}
                <select
                  value={viewMonth}
                  onChange={(e) => setViewMonth(Number(e.target.value))}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-1 pl-2 pr-6 text-xs font-bold text-slate-800 outline-none hover:bg-slate-100 focus:border-sky-500 cursor-pointer"
                >
                  {MONTH_NAMES.map((m, idx) => (
                    <option key={m} value={idx}>
                      {m}
                    </option>
                  ))}
                </select>

                {/* Year Dropdown */}
                <select
                  value={viewYear}
                  onChange={(e) => setViewYear(Number(e.target.value))}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-1 pl-2 pr-6 text-xs font-bold text-slate-800 outline-none hover:bg-slate-100 focus:border-sky-500 cursor-pointer"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next Month"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="mt-3 grid grid-cols-7 text-center text-xs font-semibold text-slate-400">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="mt-1 grid grid-cols-7 gap-1 text-center text-sm">
              {/* Empty leading slots */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8 w-8" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const monthStr = String(viewMonth + 1).padStart(2, '0')
                const dayStr = String(day).padStart(2, '0')
                const dateStr = `${viewYear}-${monthStr}-${dayStr}`
                const isSelected = value === dateStr
                const disabledDay = isDateDisabled(day)

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={disabledDay}
                    onClick={() => handleSelectDay(day)}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-medium transition ${
                      isSelected
                        ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30 ring-2 ring-sky-600 ring-offset-1'
                        : disabledDay
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-700 hover:bg-sky-50 hover:text-sky-700'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  onChange('')
                  setIsOpen(false)
                }}
                className="font-semibold text-slate-500 hover:text-rose-600 transition"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date()
                  const y = today.getFullYear()
                  const m = String(today.getMonth() + 1).padStart(2, '0')
                  const d = String(today.getDate()).padStart(2, '0')
                  const todayStr = `${y}-${m}-${d}`
                  if (!max || todayStr <= max) {
                    onChange(todayStr)
                    setViewYear(y)
                    setViewMonth(today.getMonth())
                    setIsOpen(false)
                  }
                }}
                className="font-bold text-sky-600 hover:text-sky-700 transition"
              >
                Today
              </button>
            </div>
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
