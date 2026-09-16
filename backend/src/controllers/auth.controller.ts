import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { query, checkDbConfig } from '../config/db.js'
import {
  extractBearerToken,
  signToken,
  verifyToken
} from '../config/jwt.js'
import {
  formatZodErrors,
  loginSchema,
  registerSchema
} from '../schemas/auth.schema.js'

// Helper to format PostgreSQL user row to client user object
function mapUserRowToResponse(row: any) {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    firstName: row.first_name,
    lastName: row.last_name,
    phoneNumber: row.phone_number,
    // Patient fields
    dateOfBirth: row.date_of_birth
      ? typeof row.date_of_birth === 'string'
        ? row.date_of_birth.split('T')[0]
        : new Date(row.date_of_birth).toISOString().split('T')[0]
      : null,
    gender: row.gender ?? null,
    // Doctor fields
    medicalLicenseNumber: row.medical_license_number ?? null,
    specialization: row.specialization ?? null,
    department: row.department ?? null,
    yearsOfExperience: row.years_of_experience ?? null,
    qualification: row.qualification ?? null,
    licenseDocument: row.license_document_url ?? null,
    // Consent
    termsAccepted: row.terms_accepted ?? true
  }
}

// GET /api/auth/register-status — called on /register page mount/refresh
export async function registerStatusHandler(_req: Request, res: Response): Promise<void> {
  const config = checkDbConfig()
  res.status(200).json({
    status: 'available',
    message: 'Healthcare Registration Service is online and ready.',
    supportedRoles: ['patient', 'doctor'],
    databaseConnected: config.isConfigured
  })
}

// GET /api/auth/home — called on /home page mount/refresh
export async function homeHandler(req: Request, res: Response): Promise<void> {
  const token = extractBearerToken(req.headers.authorization)

  if (!token) {
    res.status(200).json({
      message: 'Welcome to Healthcare QA Playground Auth API',
      status: 'online',
      authenticated: false,
      user: null
    })
    return
  }

  try {
    const decoded = verifyToken(token)
    const result = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [decoded.id])

    if (result.rowCount === 0) {
      res.status(200).json({
        message: 'Session expired or user not found. Please sign in.',
        status: 'online',
        authenticated: false,
        user: null
      })
      return
    }

    const user = result.rows[0]
    res.status(200).json({
      message: 'Welcome back! Healthcare QA Playground API active.',
      status: 'online',
      authenticated: true,
      user: mapUserRowToResponse(user)
    })
  } catch (err) {
    res.status(200).json({
      message: 'Healthcare QA Playground API active',
      status: 'online',
      authenticated: false,
      user: null
    })
  }
}

// GET /api/auth/me — verify session token
export async function meHandler(req: Request, res: Response): Promise<void> {
  const token = extractBearerToken(req.headers.authorization)
  if (!token) {
    res.status(401).json({ message: 'Authorization token is missing or invalid.' })
    return
  }

  try {
    const decoded = verifyToken(token)
    const result = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [decoded.id])

    if (result.rowCount === 0) {
      res.status(401).json({ message: 'Session is invalid or has expired. Please sign in again.' })
      return
    }

    const user = result.rows[0]
    res.status(200).json({
      message: 'Session is valid.',
      user: mapUserRowToResponse(user)
    })
  } catch (err) {
    res.status(401).json({ message: 'Session is invalid or has expired. Please sign in again.' })
  }
}

// POST /api/auth/register
export async function registerHandler(req: Request, res: Response): Promise<void> {
  // Default role to 'patient' if not explicitly provided
  const payload = {
    role: 'patient',
    ...req.body
  }

  const parsed = registerSchema.safeParse(payload)
  if (!parsed.success) {
    res.status(400).json({
      message: 'Please correct the highlighted fields.',
      errors: formatZodErrors(parsed.error)
    })
    return
  }

  const data = parsed.data
  const { email, password, firstName, lastName, phoneNumber, role, termsAccepted } = data

  try {
    // 1. Check if email already exists
    const existing = await query('SELECT id FROM users WHERE email = $1 LIMIT 1', [email.toLowerCase().trim()])
    if (existing.rowCount && existing.rowCount > 0) {
      res.status(409).json({
        message: 'An account with this email address already exists.'
      })
      return
    }

    // 2. Hash password securely
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // 3. Extract role-specific fields
    const dateOfBirth = data.role === 'patient' ? data.dateOfBirth : null
    const gender = data.role === 'patient' ? data.gender || null : null

    const medicalLicenseNumber = data.role === 'doctor' ? data.medicalLicenseNumber : null
    const specialization = data.role === 'doctor' ? data.specialization : null
    const department = data.role === 'doctor' ? data.department : null
    const yearsOfExperience = data.role === 'doctor' ? String(data.yearsOfExperience ?? '') : null
    const qualification = data.role === 'doctor' ? data.qualification : null
    const licenseDocument = data.role === 'doctor' ? data.licenseDocument : null

    // 4. Insert user record into PostgreSQL
    const insertSql = `
      INSERT INTO users (
        email, password_hash, role, first_name, last_name, phone_number, terms_accepted,
        date_of_birth, gender,
        medical_license_number, specialization, department, years_of_experience, qualification, license_document_url
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9,
        $10, $11, $12, $13, $14, $15
      )
      RETURNING *;
    `

    const insertValues = [
      email.toLowerCase().trim(),
      passwordHash,
      role,
      firstName.trim(),
      lastName.trim(),
      phoneNumber.trim(),
      termsAccepted,
      dateOfBirth,
      gender,
      medicalLicenseNumber,
      specialization,
      department,
      yearsOfExperience,
      qualification,
      licenseDocument
    ]

    const insertResult = await query(insertSql, insertValues)
    const newUser = insertResult.rows[0]

    console.log(`[PostgreSQL] ✅ New user created: ID #${newUser.id} | Email: ${newUser.email} | Role: ${newUser.role}`)

    res.status(201).json({
      message: `${role === 'doctor' ? 'Doctor' : 'Patient'} account created successfully! You can now sign in.`,
      user: mapUserRowToResponse(newUser)
    })
  } catch (err: any) {
    console.error('[PostgreSQL] ❌ Registration error:', err)
    res.status(500).json({
      message: err.message || 'An unexpected database error occurred during registration.'
    })
  }
}

// POST /api/auth/login
export async function loginHandler(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      message: 'Please provide a valid email and password.',
      errors: formatZodErrors(parsed.error)
    })
    return
  }

  const { email, password } = parsed.data

  try {
    // 1. Fetch user by email
    const result = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email.toLowerCase().trim()])

    if (result.rowCount === 0) {
      res.status(401).json({ message: 'Invalid email or password.' })
      return
    }

    const user = result.rows[0]

    // 2. Compare password hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password.' })
      return
    }

    // 3. Issue JWT Token with exact decoded expiresAt timestamp
    const { token, expiresAt } = signToken({
      id: user.id,
      email: user.email,
      role: user.role
    })

    res.status(200).json({
      message: 'Welcome back! Login successful.',
      user: mapUserRowToResponse(user),
      token,
      expiresAt
    })
  } catch (err: any) {
    console.error('Login error:', err)
    res.status(500).json({
      message: err.message || 'An unexpected database error occurred during login.'
    })
  }
}
