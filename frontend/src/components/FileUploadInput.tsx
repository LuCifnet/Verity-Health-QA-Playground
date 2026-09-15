import React, { useRef } from 'react'

interface FileUploadInputProps {
  id: string
  label: string
  fileName?: string
  onChange: (fileName: string) => void
  required?: boolean
  error?: string
  hint?: string
  accept?: string
  testId?: string
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  id,
  label,
  fileName,
  onChange,
  required = false,
  error,
  hint = 'PDF or Image up to 10MB',
  accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg',
  testId
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputTestId = testId ?? `${id}-input`
  const chooseBtnTestId = `${id}-choose-btn`
  const errorTestId = `${id}-error`
  const hintTestId = `${id}-hint`
  const previewTestId = `${id}-preview`

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange(file.name)
    }
  }

  const handleClear = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="mt-1.5">
        <input
          ref={fileInputRef}
          id={id}
          data-testid={inputTestId}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorTestId : hint ? hintTestId : undefined}
        />

        {fileName ? (
          <div
            data-testid={previewTestId}
            className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/60 px-3.5 py-2 text-sm"
          >
            <div className="flex items-center gap-2 overflow-hidden text-indigo-900">
              <svg className="h-4 w-4 shrink-0 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate font-medium text-xs sm:text-sm">{fileName}</span>
            </div>
            <button
              type="button"
              data-testid={`${id}-remove-btn`}
              onClick={handleClear}
              className="ml-2 text-xs font-semibold text-rose-600 hover:text-rose-800"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-testid={chooseBtnTestId}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition focus:outline-none focus:ring-4 focus:ring-sky-100"
            >
              <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Choose Document File
            </button>
            <span className="text-xs text-slate-400">No file chosen</span>
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
