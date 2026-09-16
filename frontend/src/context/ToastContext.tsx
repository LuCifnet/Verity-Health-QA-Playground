import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
}

interface ToastContextValue {
  toasts: ToastItem[]
  showToast: (toast: Omit<ToastItem, 'id'>) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    ({ type, title, message, duration = 4500 }: Omit<ToastItem, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const newToast: ToastItem = { id, type, title, message, duration }

      setToasts((prev) => [newToast, ...prev.slice(0, 4)]) // Keep max 5 active toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast]
  )

  const success = useCallback(
    (message: string, title = 'Success') => {
      showToast({ type: 'success', title, message })
    },
    [showToast]
  )

  const error = useCallback(
    (message: string, title = 'Error') => {
      showToast({ type: 'error', title, message })
    },
    [showToast]
  )

  const info = useCallback(
    (message: string, title = 'Information') => {
      showToast({ type: 'info', title, message })
    },
    [showToast]
  )

  const warning = useCallback(
    (message: string, title = 'Warning') => {
      showToast({ type: 'warning', title, message })
    },
    [showToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, showToast, success, error, info, warning, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast Container & Presentation Component
interface ToastContainerProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null

  return (
    <div
      data-testid="toast-container"
      aria-live="polite"
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  )
}

const ToastCard: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const isSuccess = toast.type === 'success'
  const isError = toast.type === 'error'
  const isWarning = toast.type === 'warning'

  const styles = isSuccess
    ? {
        container: 'bg-emerald-50/95 border-emerald-300 text-emerald-950 shadow-emerald-500/10',
        badge: 'bg-emerald-100 text-emerald-700',
        iconColor: 'text-emerald-600',
        progress: 'bg-emerald-500'
      }
    : isError
      ? {
          container: 'bg-rose-50/95 border-rose-300 text-rose-950 shadow-rose-500/10',
          badge: 'bg-rose-100 text-rose-700',
          iconColor: 'text-rose-600',
          progress: 'bg-rose-500'
        }
      : isWarning
        ? {
            container: 'bg-amber-50/95 border-amber-300 text-amber-950 shadow-amber-500/10',
            badge: 'bg-amber-100 text-amber-700',
            iconColor: 'text-amber-600',
            progress: 'bg-amber-500'
          }
        : {
            container: 'bg-sky-50/95 border-sky-300 text-sky-950 shadow-sky-500/10',
            badge: 'bg-sky-100 text-sky-700',
            iconColor: 'text-sky-600',
            progress: 'bg-sky-500'
          }

  return (
    <div
      data-testid={`toast-${toast.type}`}
      role="alert"
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-in-right ${styles.container}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`mt-0.5 grid h-6 w-6 place-items-center rounded-full shrink-0 ${styles.badge}`}>
          {isSuccess && (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {isError && (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {isWarning && (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {!isSuccess && !isError && !isWarning && (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pr-2">
          {toast.title && (
            <h4 data-testid="toast-title" className="text-xs font-bold uppercase tracking-wider opacity-90">
              {toast.title}
            </h4>
          )}
          <p data-testid="toast-message" className="text-sm font-semibold leading-snug mt-0.5">
            {toast.message}
          </p>
        </div>

        {/* Close button */}
        <button
          type="button"
          data-testid="toast-close-button"
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-700 transition p-1 rounded-lg hover:bg-black/5 shrink-0"
          aria-label="Close notification"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Subtle bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 opacity-70 ${styles.progress}`} />
    </div>
  )
}
