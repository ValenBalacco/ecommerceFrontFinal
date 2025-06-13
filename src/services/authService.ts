import api from './api';
import type { Usuario } from '../types';

export const login = async (credentials: Pick<Usuario, 'email' | 'contraseña'>) => {
  const response = await api.post('/usuarios/login', credentials);
  return response.data;
};

export const register = async (userData: Omit<Usuario, 'id' | 'rol'>) => {
  const response = await api.post('/usuarios/register', userData);
  return response.data;
};