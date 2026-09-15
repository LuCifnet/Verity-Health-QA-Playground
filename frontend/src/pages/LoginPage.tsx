import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { AuthLayout } from '../components/AuthLayout'
import { LoginForm } from '../components/LoginForm'
import { FormSkeleton } from '../components/Skeleton'

export const LoginPage: React.FC = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [isVerifying, setIsVerifying] = useState<boolean>(Boolean(token))

  // GET /api/auth/me on mount — only if a session token exists, redirect to /home if still valid
  useEffect(() => {
    if (!token) {
      setIsVerifying(false)
      return
    }
    let cancelled = false
    setIsVerifying(true)
    getMe(token).then((result) => {
      if (cancelled) return
      if (result.user) {
        navigate('/home')
      } else {
        setIsVerifying(false)
      }
    }).catch(() => {
      if (!cancelled) setIsVerifying(false)
    })
    return () => { cancelled = true }
  }, [token, navigate])

  return (
    <AuthLayout
      title="Healthcare Portal Sign In"
      subtitle="Sign in with your registered Patient or Doctor account credentials."
    >
      {isVerifying ? <FormSkeleton /> : <LoginForm />}
    </AuthLayout>
  )
}
