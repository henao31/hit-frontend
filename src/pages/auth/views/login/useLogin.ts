import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface LoginFormData {
  email: string
  password: string
  remember: boolean
}

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate() // ✅ usar navegación de React Router
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
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Validación simulada
      if (email === 'admin@test.com' && password === 'password') {
        localStorage.setItem('authToken', 'fake-jwt-token')
        localStorage.setItem('user', JSON.stringify({ email, name: 'Usuario Admin' }))
        
        // ✅ Navegación interna (sin recargar la app)
        navigate("/")
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
    navigate("/login")
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
