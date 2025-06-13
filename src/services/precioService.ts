import axios, { AxiosResponse } from "axios";
import { Precio } from "../types";

const precioService = import.meta.env.VITE_URL_PRECIO;

export class ServicePrecio {
  private baseURL: string;

  constructor() {
    this.baseURL = precioService;
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

  public async crearPrecio(precio: {
    precioCompra: number;
    precioVenta: number;
    detalleId: number;
    descuentoId: number; // Descuento obligatorio
  }): Promise<Precio> {
    const url = `${this.baseURL}`;
    console.log("Enviando a backend (crearPrecio):", precio);
    const response: AxiosResponse<Precio> = await axios.post(url, precio, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async editarPrecio(
    id: number,
    precio: {
      precioCompra?: number;
      precioVenta?: number;
      detalleId?: number;
      descuentoId?: number;
    }
  ): Promise<Precio> {
    const url = `${this.baseURL}/${id}`;
    console.log("Enviando a backend (editarPrecio):", precio);
    const response: AxiosResponse<Precio> = await axios.put(url, precio, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async eliminarPrecio(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }

  public async getPrecios(): Promise<Precio[]> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<Precio[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async getPrecioById(id: number): Promise<Precio> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<Precio> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}