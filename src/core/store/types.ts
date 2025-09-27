export interface User {
  id_gimnasio: number;
  correo: string;
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
