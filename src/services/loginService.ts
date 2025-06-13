import axios from "axios";
import { Usuario } from "../types";

const API = import.meta.env.VITE_URL_LOGIN;

interface ILoginRequest {
  email: string;
  contraseña: string; // con ñ
}
interface ILoginResponse {
  usuario: Usuario;
  token: string;
}

export const loginService = async (data: ILoginRequest): Promise<ILoginResponse> => {
  try {
    const res = await axios.post<ILoginResponse>(API, data);
    return res.data;
  } catch (error: any) {
    console.error("Error en loginService:", error.response?.data || error.message);
    throw error;
  }
};