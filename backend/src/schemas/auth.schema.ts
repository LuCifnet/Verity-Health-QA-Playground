import { z } from 'zod'

const baseUserSchema = {
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters'),
  email: z
    .string()
    .trim()
    .email('Enter a valid email address')
    .max(254, 'Email cannot exceed 254 characters')
    .transform((val) => val.toLowerCase()),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]{7,20}$/, 'Enter a valid phone number (7-20 digits)'),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password cannot exceed 128 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the Terms & Privacy Policy')
}

export const patientRegisterSchema = z
  .object({
    role: z.literal('patient').default('patient'),
    ...baseUserSchema,
    dateOfBirth: z
      .string()
      .trim()
      .min(1, 'Date of birth is required')
      .refine((val) => !isNaN(Date.parse(val)), 'Enter a valid date of birth')
      .refine((val) => new Date(val) < new Date(), 'Date of birth must be in the past'),
    gender: z
      .enum(['male', 'female', 'other', 'prefer_not_to_say', ''])
      .optional()
      .transform((val) => (val === '' ? undefined : val))
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export const doctorRegisterSchema = z
  .object({
    role: z.literal('doctor'),
    ...baseUserSchema,
    medicalLicenseNumber: z
      .string()
      .trim()
      .min(1, 'Medical license number is required')
      .max(50, 'Medical license number cannot exceed 50 characters'),
    specialization: z
      .string()
      .trim()
      .min(1, 'Specialization is required')
      .max(100, 'Specialization cannot exceed 100 characters'),
    department: z
      .string()
      .trim()
      .min(1, 'Department is required')
      .max(100, 'Department cannot exceed 100 characters'),
    yearsOfExperience: z
      .union([z.number().min(0), z.string().trim()])
      .optional()
      .transform((val) => {
        if (val === undefined || val === '') return undefined
        const num = Number(val)
        return isNaN(num) ? undefined : num
      }),
    qualification: z
      .string()
      .trim()
      .min(1, 'Qualification is required (e.g. MBBS, MD, MS)')
      .max(100, 'Qualification cannot exceed 100 characters'),
    licenseDocument: z
      .string()
      .trim()
      .min(1, 'Medical license document is required')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export const registerSchema = z.discriminatedUnion('role', [
  patientRegisterSchema,
  doctorRegisterSchema
])

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Enter a valid email address')
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password cannot exceed 128 characters')
})

export type PatientRegisterInput = z.infer<typeof patientRegisterSchema>
export type DoctorRegisterInput = z.infer<typeof doctorRegisterSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[issue.path.length - 1]) : 'form'
    if (!result[key]) {
      result[key] = issue.message
    }
  }
  return result
}
