import type { Request, Response } from 'express'
import {
  checkSupabaseConfig,
  supabaseAdmin,
  supabaseAuth
} from '../config/supabase.js'
import {
  formatZodErrors,
  loginSchema,
  registerSchema
} from '../schemas/auth.schema.js'

// Helper to format profile database row to API user object
function mapProfileToUser(userAuth: { id: string; email?: string | null }, profile?: any) {
  return {
    id: userAuth.id,
    email: userAuth.email ?? profile?.email ?? '',
    role: profile?.role ?? 'patient',
    firstName: profile?.first_name ?? null,
    lastName: profile?.last_name ?? null,
    phoneNumber: profile?.phone_number ?? null,
    // Patient fields
    dateOfBirth: profile?.date_of_birth ?? null,
    gender: profile?.gender ?? null,
    // Doctor fields
    medicalLicenseNumber: profile?.medical_license_number ?? null,
    specialization: profile?.specialization ?? null,
    department: profile?.department ?? null,
    yearsOfExperience: profile?.years_of_experience ?? null,
    qualification: profile?.qualification ?? null,
    licenseDocument: profile?.license_document_url ?? null,
    // Consent
    termsAccepted: profile?.terms_accepted ?? true
  }
}

// GET /api/auth/register-status — called on /register page mount/refresh
export async function registerStatusHandler(_req: Request, res: Response): Promise<void> {
  const config = checkSupabaseConfig()
  res.status(200).json({
    status: 'available',
    message: 'Healthcare Registration Service is online and ready.',
    supportedRoles: ['patient', 'doctor'],
    supabaseConnected: config.isConfigured
  })
}

// GET /api/auth/home — called on /home page mount/refresh
export async function homeHandler(req: Request, res: Response): Promise<void> {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.replace('Bearer ', '').trim() : null

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
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token)
    if (userError || !userData.user) {
      res.status(200).json({
        message: 'Session expired or invalid. Please sign in.',
        status: 'online',
        authenticated: false,
        user: null
      })
      return
    }

    const user = userData.user
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    res.status(200).json({
      message: 'Welcome back! Healthcare QA Playground API active.',
      status: 'online',
      authenticated: true,
      user: mapProfileToUser(user, profile)
    })
  } catch (err) {
    console.error('Home handler error:', err)
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
  const config = checkSupabaseConfig()
  if (!config.isConfigured) {
    res.status(500).json({
      message: `Supabase credentials incomplete in .env. Missing: ${config.missingKeys.join(', ')}.`
    })
    return
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization token is missing or invalid.' })
    return
  }

  const token = authHeader.replace('Bearer ', '').trim()

  try {
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token)

    if (userError || !userData.user) {
      res.status(401).json({ message: 'Session is invalid or has expired. Please sign in again.' })
      return
    }

    const user = userData.user

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    res.status(200).json({
      message: 'Session is valid.',
      user: mapProfileToUser(user, profile)
    })
  } catch (err) {
    console.error('Me handler error:', err)
    res.status(500).json({ message: 'An unexpected server error occurred.' })
  }
}

// POST /api/auth/register
export async function registerHandler(req: Request, res: Response): Promise<void> {
  const config = checkSupabaseConfig()
  if (!config.isConfigured) {
    res.status(500).json({
      message: `Supabase credentials incomplete in .env. Missing: ${config.missingKeys.join(', ')}.`
    })
    return
  }

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
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { firstName, lastName, role }
      })

    if (authError || !authData.user) {
      const statusCode = authError?.status === 422 ? 409 : 400
      res.status(statusCode).json({
        message: authError?.message ?? 'Could not create account.'
      })
      return
    }

    // Build profile record according to role
    const profileData: Record<string, any> = {
      id: authData.user.id,
      role,
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phoneNumber,
      terms_accepted: termsAccepted
    }

    if (data.role === 'patient') {
      profileData.date_of_birth = data.dateOfBirth
      profileData.gender = data.gender || null
    } else if (data.role === 'doctor') {
      profileData.medical_license_number = data.medicalLicenseNumber
      profileData.specialization = data.specialization
      profileData.department = data.department
      profileData.years_of_experience = data.yearsOfExperience ?? null
      profileData.qualification = data.qualification
      profileData.license_document_url = data.licenseDocument
    }

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert(profileData)

    if (profileError) {
      // Rollback user creation in auth if profile insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      console.error('Profile insertion error:', profileError)
      res.status(500).json({
        message: `Could not save profile details: ${profileError.message}`
      })
      return
    }

    res.status(201).json({
      message: `${role === 'doctor' ? 'Doctor' : 'Patient'} account created successfully! You can now sign in.`,
      user: mapProfileToUser(authData.user, profileData)
    })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ message: 'An unexpected server error occurred.' })
  }
}

// POST /api/auth/login
export async function loginHandler(req: Request, res: Response): Promise<void> {
  const config = checkSupabaseConfig()
  if (!config.isConfigured) {
    res.status(500).json({
      message: `Supabase credentials incomplete in .env. Missing: ${config.missingKeys.join(', ')}.`
    })
    return
  }

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
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password
    })

    if (error || !data.user || !data.session) {
      res.status(401).json({ message: error?.message || 'Email or password is incorrect.' })
      return
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    res.status(200).json({
      message: 'Welcome back! Login successful.',
      user: mapProfileToUser(data.user, profile),
      token: data.session.access_token,
      expiresAt: data.session.expires_at
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'An unexpected server error occurred.' })
  }
}
