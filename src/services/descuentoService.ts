import axios, { type AxiosResponse } from "axios";
import { type Descuento } from "../types";
const descuentoService = import.meta.env.VITE_URL_DESCUENTO;

export class ServiceDescuento {
  private baseURL: string;

  constructor() {
    this.baseURL = descuentoService;
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

  public async getDescuentos(): Promise<Descuento[]> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<Descuento[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async getDescuentoById(id: number): Promise<Descuento> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<Descuento> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async crearDescuento(descuento: Omit<Descuento, "id">): Promise<Descuento> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<Descuento> = await axios.post(url, descuento, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async editarDescuento(id: number, descuento: Partial<Descuento>): Promise<Descuento> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<Descuento> = await axios.put(url, descuento, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async eliminarDescuento(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }
}