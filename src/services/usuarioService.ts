import axios, { type AxiosResponse } from "axios";
import { type Usuario } from "../types";

const usuarioService = import.meta.env.VITE_URL_USUARIO;

export class ServiceUsuario {
  private baseURL: string;

  constructor() {
    this.baseURL = usuarioService;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : { "Content-Type": "application/json" };
  }

  public async getUsuarios(): Promise<Usuario[]> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<Usuario[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }


  public async getUsuarioById(id: string): Promise<Usuario> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<Usuario> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async crearUsuario(usuario: Omit<Usuario, "id">): Promise<Usuario> {
    const url = `${this.baseURL}`;
    // Elimina usuario.id, el backend lo genera
    const response: AxiosResponse<Usuario> = await axios.post(url, usuario, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async editarUsuario(id: string, usuario: Partial<Usuario>): Promise<Usuario> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<Usuario> = await axios.put(url, usuario, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async eliminarUsuario(id: string): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }
}