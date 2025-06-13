import axios, { type AxiosResponse } from "axios";
import { Direccion, UsuarioDireccion } from "../types";

export class ServiceDireccion {
  private baseURLUsuariosDireccion = "/usuarios-direccion";
  private baseURL = "/direcciones";

  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
  }

  public async crearDireccion(direccion: Omit<Direccion, "id">): Promise<Direccion> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<Direccion> = await axios.post(url, direccion, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async crearUsuarioDireccion(data: { usuarioId: string; direccionId: number }) {
    const url = `${this.baseURLUsuariosDireccion}`;
    const response = await axios.post(url, data, { headers: this.getAuthHeaders() });
    return response.data;
  }

  public async getUsuarioDirecciones(usuarioId: string): Promise<UsuarioDireccion[]> {
    const url = `${this.baseURLUsuariosDireccion}/${usuarioId}`;
    const response = await axios.get(url, { headers: this.getAuthHeaders() });
    return response.data;
  }
}