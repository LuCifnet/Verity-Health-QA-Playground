import React, { createContext, useContext, useEffect, useState } from 'react'
import { getMe } from '../api/auth'
import type { UserData } from '../types/auth'

interface AuthContextType {
  user: UserData | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: UserData, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USER_STORAGE_KEY = 'qa_auth_user'
const TOKEN_STORAGE_KEY = 'qa_auth_token'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  })

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(TOKEN_STORAGE_KEY))
  })

  // Validate session on mount if token is stored in localStorage
  useEffect(() => {
    let cancelled = false
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (savedToken) {
      getMe(savedToken).then((result) => {
        if (cancelled) return
        if (result.user && result.user.id) {
          setUser(result.user)
        } else {
          // Stored token is expired or invalid — clear everything
          setUser(null)
          setToken(null)
          localStorage.removeItem(USER_STORAGE_KEY)
          localStorage.removeItem(TOKEN_STORAGE_KEY)
        }
      }).catch(() => {
        // Network or server error — retain cached session
      }).finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
    return () => { cancelled = true }
  }, [])


  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(USER_STORAGE_KEY)
      }

      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token)
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
      }
    } catch (e) {
      console.error('Failed to sync auth state to localStorage', e)
    }
  }, [user, token])

  const login = (newUser: UserData, newToken: string) => {
    setUser(newUser)
    setToken(newToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
