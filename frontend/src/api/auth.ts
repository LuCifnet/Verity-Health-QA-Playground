import type { ApiResult, LoginData, RegisterData } from '../types/auth'

// Use Vite's proxy in development so requests stay visible as /api calls in DevTools.
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export async function registerUser(data: RegisterData): Promise<ApiResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return (await response.json()) as ApiResult
  } catch {
    return {
      message: 'Could not connect to the authentication server. Please verify the backend server on port 3001 is running.'
    }
  }
}

export async function loginUser(data: LoginData): Promise<ApiResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return (await response.json()) as ApiResult
  } catch {
    return {
      message: 'Could not connect to the authentication server. Please verify the backend server on port 3001 is running.'
    }
  }
}

// GET /api/auth/register-status — registration availability check on Register page mount
export async function getRegisterStatus(): Promise<ApiResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register-status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return (await response.json()) as ApiResult
  } catch {
    return {
      message: 'Could not connect to the authentication server. Please verify the backend server on port 3001 is running.'
    }
  }
}

// GET /api/auth/home — Home API endpoint called on Home page mount
export async function getHome(token?: string | null): Promise<ApiResult> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/home`, {
      method: 'GET',
      headers
    })
    return (await response.json()) as ApiResult
  } catch {
    return {
      message: 'Could not connect to the API server. Please verify the backend server on port 3001 is running.'
    }
  }
}

// GET /api/auth/me — verify the stored JWT and fetch the latest user + profile data
export async function getMe(token?: string | null): Promise<ApiResult> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers
    })
    return (await response.json()) as ApiResult
  } catch {
    return {
      message: 'Could not verify session. Please sign in again.'
    }
  }
}
