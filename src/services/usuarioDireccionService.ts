import axios, { type AxiosResponse } from "axios";
import { type UsuarioDireccion } from "../types";
const usuarioDireccionService = import.meta.env.VITE_URL_USUARIO_DIRECCION;

export class ServiceUsuarioDireccion {
  private baseURL: string;

  constructor() {
    this.baseURL = usuarioDireccionService;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  public async getUsuarioDirecciones(): Promise<UsuarioDireccion[]> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<UsuarioDireccion[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async getUsuarioDireccionById(id: number): Promise<UsuarioDireccion> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<UsuarioDireccion> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async crearUsuarioDireccion(usuarioDireccion: UsuarioDireccion): Promise<UsuarioDireccion> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<UsuarioDireccion> = await axios.post(url, usuarioDireccion, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async editarUsuarioDireccion(id: number, usuarioDireccion: UsuarioDireccion): Promise<UsuarioDireccion> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<UsuarioDireccion> = await axios.put(url, usuarioDireccion, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async eliminarUsuarioDireccion(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }
}
