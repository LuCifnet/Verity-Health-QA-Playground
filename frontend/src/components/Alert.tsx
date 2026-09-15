import React from 'react'

interface AlertProps {
  type: 'success' | 'error' | 'info'
  message: string
}

export const Alert: React.FC<AlertProps> = ({ type, message }) => {
  if (!message) return null

  const isSuccess = type === 'success'
  const isError = type === 'error'

  const styles = isSuccess
    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
    : isError
      ? 'border-rose-200 bg-rose-50 text-rose-800'
      : 'border-slate-200 bg-slate-50 text-slate-800'

  const testId = isSuccess ? 'alert-success' : isError ? 'alert-error' : 'alert-info'

  return (
    <div
      role="status"
      data-testid={testId}
      data-status-type={type}
      className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all ${styles}`}
    >
      <div className="flex items-center gap-2">
        {isSuccess && (
          <svg className="h-5 w-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {isError && (
          <svg className="h-5 w-5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <span>{message}</span>
      </div>
    </div>
  )
}
