import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { login } from "../../../core/services/auth.service"
import { useUserStore } from "../../../core/store"

interface LoginFormData {
  correo: string
  contrasena: string
}

export const useLogin = () => {
  const navigate = useNavigate() // ✅ usar navegación de React Router
  const { setLoading, login: loginUser } = useUserStore()
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
      setLoading(true)
      const response = await login(data.correo, data.contrasena)
      console.log(response)
      // Guardar datos del usuario en el store
      if (response.data.user) {
        loginUser(response.data.user)
        navigate("/")
        toast.success('Login exitoso')
      } else {
        throw new Error('No se recibieron datos del usuario')
      }
    } catch (error) {
      console.error('Error en el login:', error)
      toast.error(error as string)
    } finally {
      setLoading(false)
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
