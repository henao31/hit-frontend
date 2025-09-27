import { api } from "../api/axios";



export const register = async (data: any) => {
    try {
        const response = await api.post('/auth/register', data);
        return response.data;
    } catch (error: any) {
        throw error.response.data.message;
    }
};

export const login = async (correo: string, contrasena: string) => {
    try {
        const response = await api.post('/auth/login', { correo, contrasena });
        return response.data;
    } catch (error: any) {
        throw error.response.data.message;
    }
};
