import jwt, { type SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'
import path from 'path'

// Ensure .env is loaded
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export interface AuthUserPayload {
  id: string
  email: string
  role: string
}

export interface DecodedTokenPayload extends AuthUserPayload {
  iat: number
  exp: number
}

const JWT_SECRET: string =
  process.env.JWT_SECRET?.trim() ||
  'verity_health_qa_playground_jwt_super_secret_key_2026_dev'

const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN?.trim() || '7d'

/**
 * Generate and sign a new JWT token for an authenticated user.
 */
export function signToken(user: AuthUserPayload): { token: string; expiresAt: number } {
  const signOptions: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn']
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    signOptions
  )

  // Extract exact exp from signed token
  const decoded = jwt.decode(token) as DecodedTokenPayload | null
  const expiresAt = decoded?.exp ?? Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60

  return { token, expiresAt }
}

/**
 * Verify and decode an incoming JWT Bearer token.
 * Throws an error if invalid or expired.
 */
export function verifyToken(token: string): AuthUserPayload {
  const decoded = jwt.verify(token, JWT_SECRET) as DecodedTokenPayload
  return {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role
  }
}

/**
 * Safely extracts the token from Authorization header ('Bearer <token>').
 */
export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()
  return token || null
}
