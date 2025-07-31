import axios, { type AxiosResponse } from "axios";
import { type OrdenCompra } from "../types";
const ordenService = import.meta.env.VITE_URL_ORDEN;

export class ServiceOrdenCompra {
  private baseURL: string;

  constructor() {
    this.baseURL = ordenService;
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

  public async getOrdenes(): Promise<OrdenCompra[]> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<OrdenCompra[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async getOrdenById(id: number): Promise<OrdenCompra> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<OrdenCompra> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }


  public async crearOrden(orden: Omit<OrdenCompra, "id">): Promise<OrdenCompra> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<OrdenCompra> = await axios.post(url, orden, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }


  public async editarOrden(id: number, orden: Partial<OrdenCompra>): Promise<OrdenCompra> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<OrdenCompra> = await axios.put(url, orden, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async eliminarOrden(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }

  public async getOrdenesPorUsuario(usuarioId: string): Promise<OrdenCompra[]> {
    const url = `${this.baseURL}/usuario/${usuarioId}`;
    const response: AxiosResponse<OrdenCompra[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}