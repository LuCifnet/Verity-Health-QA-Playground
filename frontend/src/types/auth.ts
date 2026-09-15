export type Role = 'patient' | 'doctor' | 'admin'

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say' | ''

export interface PatientRegisterData {
  role: 'patient'
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: Gender
  phoneNumber: string
  email: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
}

export interface DoctorRegisterData {
  role: 'doctor'
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  medicalLicenseNumber: string
  specialization: string
  department: string
  yearsOfExperience: string
  qualification: string
  licenseDocument: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
}

export type RegisterData = PatientRegisterData | DoctorRegisterData

export interface LoginData {
  email: string
  password: string
}

export interface UserData {
  id: string
  email: string
  role?: Role
  firstName?: string | null
  lastName?: string | null
  phoneNumber?: string | null
  // Patient fields
  dateOfBirth?: string | null
  gender?: string | null
  // Doctor fields
  medicalLicenseNumber?: string | null
  specialization?: string | null
  department?: string | null
  yearsOfExperience?: number | null
  qualification?: string | null
  licenseDocument?: string | null
  termsAccepted?: boolean
}

export interface ApiResult {
  message: string
  errors?: Record<string, string>
  user?: UserData
  token?: string
  expiresAt?: number
}
