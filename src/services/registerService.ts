import axios from "axios";
import { Usuario } from "../types";

export interface IRegisterRequest {
  nombre: string;
  email: string;
  contraseña: string;
  dni: string;
}

export interface IRegisterResponse {
  usuario: Usuario;
  token: string;
}

export const registerService = async (
  data: IRegisterRequest
): Promise<IRegisterResponse> => {
  const response = await axios.post<IRegisterResponse>(
    import.meta.env.VITE_URL_REGISTRO,
    data
  );
  return response.data;
};