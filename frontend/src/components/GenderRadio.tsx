import React from 'react'
import type { Gender } from '../types/auth'

interface GenderRadioProps {
  value: Gender
  onChange: (gender: Gender) => void
  error?: string
}

const GENDER_OPTIONS: { id: Gender; label: string }[] = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
  { id: 'other', label: 'Other' }
]

export const GenderRadio: React.FC<GenderRadioProps> = ({ value, onChange, error }) => {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-slate-700">Gender</legend>
      <div className="mt-2.5 flex flex-wrap gap-5">
        {GENDER_OPTIONS.map((option) => (
          <label
            key={option.id}
            htmlFor={`gender-${option.id}`}
            className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 select-none hover:text-indigo-600"
          >
            <input
              type="radio"
              id={`gender-${option.id}`}
              name="gender"
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              data-testid={`gender-${option.id}`}
              className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p data-testid="gender-error" role="alert" className="mt-1 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </fieldset>
  )
}
