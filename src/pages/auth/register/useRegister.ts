import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface RegisterFormData {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    acceptTerms: boolean
  }
  

export const useRegister = () => {
  const [error, setError] = useState<string | null>(null)
    
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
  })

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await onSubmitRegister({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      })
    } catch (error) {
      console.error('Error en el registro:', error)
    }
  }


  const onSubmitRegister = async (data: RegisterData): Promise<void> => {
    setError(null)
    console.log(data)

    try {
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aquí iría la lógica real de registro
      // Por ejemplo: const response = await api.post('/auth/register', data)
      
      // Simular validación básica
      if (data.email === 'test@test.com') {
        throw new Error('Este correo electrónico ya está registrado')
      }
      
      // Simular almacenamiento del usuario
      const userData = {
        id: Date.now().toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        createdAt: new Date().toISOString()
      }
      
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('authToken', 'fake-jwt-token')
      
      // Redirigir al dashboard
      window.location.href = '/'
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la cuenta'
      setError(errorMessage)
      throw err
    }
  }

  return {
    onSubmitRegister,
    error,
    handleSubmit,
    watch,
    errors,
    isSubmitting,
    onSubmit,
    register,
    password
  }
}
