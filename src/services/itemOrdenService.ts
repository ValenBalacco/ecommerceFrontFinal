import axios, { type AxiosResponse } from "axios";
import { type ItemOrden } from "../types";
const itemOrdenService = import.meta.env.VITE_URL_ITEM_ORDEN;

export class ServiceItemOrden {
  private baseURL: string;

  constructor() {
    this.baseURL = itemOrdenService;
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

  public async getItemsOrden(): Promise<ItemOrden[]> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<ItemOrden[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async getItemOrdenById(id: number): Promise<ItemOrden> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<ItemOrden> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // No envíes 'id' al crear; el backend lo genera
  public async crearItemOrden(itemOrden: Omit<ItemOrden, "id">): Promise<ItemOrden> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<ItemOrden> = await axios.post(url, itemOrden, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Permite edición parcial
  public async editarItemOrden(id: number, itemOrden: Partial<ItemOrden>): Promise<ItemOrden> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<ItemOrden> = await axios.put(url, itemOrden, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async eliminarItemOrden(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }
}