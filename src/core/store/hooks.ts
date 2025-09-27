import { useUserStore } from './userStore';

// Hook para obtener solo los datos del usuario
export const useUser = () => {
  const user = useUserStore((state) => state.user);
  return user;
};

// Hook para verificar si está autenticado
export const useIsAuthenticated = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  return isAuthenticated;
};

// Hook para obtener el estado de carga
export const useAuthLoading = () => {
  const isLoading = useUserStore((state) => state.isLoading);
  return isLoading;
};

// Hook para logout
export const useLogout = () => {
  const logout = useUserStore((state) => state.logout);
  return logout;
};
