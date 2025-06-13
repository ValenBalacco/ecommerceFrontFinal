import axios, { AxiosResponse } from "axios";
import { Detalle } from "../types";

const detalleService = import.meta.env.VITE_URL_DETALLE;

export class ServiceDetalle {
  private baseURL: string;

  constructor() {
    this.baseURL = detalleService;
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

  public async crearDetalle(detalle: {
    color: string;
    estado: string;
    stock: number;
    productoId: number;
    talleId: number;
  }): Promise<Detalle> {
    const url = `${this.baseURL}`;
    // Log del payload antes de enviar
    console.log("Enviando a backend (crearDetalle):", detalle);
    const response: AxiosResponse<Detalle> = await axios.post(url, detalle, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async editarDetalle(
    id: number,
    detalle: {
      color?: string;
      estado?: string;
      stock?: number;
      productoId?: number;
      talleId?: number;
    }
  ): Promise<Detalle> {
    const url = `${this.baseURL}/${id}`;
    console.log("Enviando a backend (editarDetalle):", detalle);
    const response: AxiosResponse<Detalle> = await axios.put(url, detalle, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async eliminarDetalle(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }

  public async getDetalles(): Promise<Detalle[]> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<Detalle[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async getDetalleById(id: number): Promise<Detalle> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<Detalle> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // MÉTODO FALTANTE: Buscar detalles por género del producto
  public async getDetallesGeneroProduct(genero: string): Promise<Detalle[]> {
    // Ajusta el endpoint según tu backend
    const url = `${this.baseURL}/genero/${encodeURIComponent(genero)}`;
    const response: AxiosResponse<Detalle[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}