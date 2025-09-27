import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from './types';

interface UserStore extends AuthState {
  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user: User) => 
        set({ 
          user, 
          isAuthenticated: true 
        }),

      clearUser: () => 
        set({ 
          user: null, 
          isAuthenticated: false 
        }),

      setLoading: (isLoading: boolean) => 
        set({ isLoading }),

      login: (user: User) => 
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        }),

      logout: () => 
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        }),
    }),
    {
      name: 'user-storage', // nombre único para localStorage
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }), // solo persistir user e isAuthenticated
    }
  )
);
