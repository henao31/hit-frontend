import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { login } from "../../../core/services/auth.service"

interface LoginFormData {
  correo: string
  contrasena: string
}

export const useLogin = () => {
  const navigate = useNavigate() // ✅ usar navegación de React Router
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    defaultValues: {
      correo: '',
      contrasena: '',
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log(data)
      await login(data.correo, data.contrasena)
      toast.success('Login exitoso')
      navigate("/")
    } catch (error) {
      console.error('Error en el login:', error)
      toast.error(error as string)
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
