import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRegisterStatus } from '../api/auth'
import { AuthLayout } from '../components/AuthLayout'
import { RegisterForm } from '../components/RegisterForm'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState<'patient' | 'doctor'>('patient')

  useEffect(() => {
    void getRegisterStatus()
  }, [])

  return (
    <AuthLayout
      title={role === 'doctor' ? 'Doctor Registration' : 'Patient Registration'}
      subtitle={
        role === 'doctor'
          ? 'Join our verified medical network to manage appointments and clinical cases.'
          : 'Create your personal account to schedule appointments and view health records.'
      }
      activeRole={role}
    >
      <RegisterForm
        role={role}
        onRoleChange={setRole}
        onRegisterSuccess={() => {
          setTimeout(() => {
            navigate('/login')
          }, 1500)
        }}
      />
    </AuthLayout>
  )
}
