import { useState } from 'react'
import { useForm } from 'react-hook-form'


interface LoginFormData {
  email: string
  password: string
  remember: boolean
}


export const useLogin = () => {
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
    } catch (error) {
      console.error('Error en el login:', error)
    }
  }

  const login = async (email: string, password: string): Promise<void> => {
    setError(null)

    try {
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Aquí iría la lógica real de autenticación
      // Por ejemplo: const response = await api.post('/auth/login', { email, password })
      
      // Simular validación básica
      if (email === 'admin@test.com' && password === 'password') {
        // Simular almacenamiento del token
        localStorage.setItem('authToken', 'fake-jwt-token')
        localStorage.setItem('user', JSON.stringify({ email, name: 'Usuario Admin' }))
        
        // Redirigir o actualizar el estado de la aplicación
        window.location.href = '/'
      } else {
        throw new Error('Credenciales inválidas')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión'
      setError(errorMessage)
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const isAuthenticated = () => {
    return !!localStorage.getItem('authToken')
  }

  return {
    login,
    logout,
    isAuthenticated,
    error,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit
  }
}
