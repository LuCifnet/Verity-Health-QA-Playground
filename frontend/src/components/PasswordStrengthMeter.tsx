import React from 'react'

interface PasswordStrengthMeterProps {
  password: string
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const isVisible = Boolean(password)

  // Normal, straightforward strength evaluation
  let strength: 'Weak' | 'Medium' | 'Strong' = 'Weak'
  let color = 'bg-rose-500'
  let textColor = 'text-rose-600'
  let width = 'w-1/3'
  let score = 1

  const hasLength = password.length >= 8
  const hasStrongLength = password.length >= 12
  const hasNumbers = /\d/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  if (hasStrongLength && (hasNumbers || hasSpecial)) {
    strength = 'Strong'
    color = 'bg-emerald-500'
    textColor = 'text-emerald-600'
    width = 'w-full'
    score = 3
  } else if (hasLength && (hasNumbers || hasSpecial)) {
    strength = 'Medium'
    color = 'bg-amber-500'
    textColor = 'text-amber-600'
    width = 'w-2/3'
    score = 2
  }

  return (
    <div
      className={`mt-1 h-[26px] space-y-0.5 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400">Strength:</span>
        <span
          data-testid="password-strength-label"
          data-strength-score={isVisible ? score : 0}
          className={`font-semibold ${textColor}`}
        >
          {strength}
        </span>
      </div>

      <div
        data-testid="password-strength-meter"
        className="h-1 w-full overflow-hidden rounded-full bg-slate-200"
      >
        <div className={`h-full ${width} ${color} transition-all duration-300`} />
      </div>
    </div>
  )
}
