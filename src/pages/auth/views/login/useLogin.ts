import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface LoginFormData {
  email: string
  password: string
  remember: boolean
}

export const useLogin = () => {
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
      console.log(data)
      navigate("/")

      toast.success('Login exitoso')
    } catch (error) {
      console.error('Error en el login:', error)
    }
  }

  return {
    handleSubmit, 
    register, 
    errors, 
    isSubmitting, 
    onSubmit
  }
}
