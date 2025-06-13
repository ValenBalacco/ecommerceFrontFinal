import axios, { type AxiosResponse } from "axios";
import { type Talle } from "../types";
const talleService = import.meta.env.VITE_URL_TALLE;

export class ServiceTalle {
  private baseURL: string;

  constructor() {
    this.baseURL = talleService;
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

  public async getTalles(): Promise<Talle[]> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<Talle[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async getTalleById(id: number): Promise<Talle> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<Talle> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async crearTalle(talle: Omit<Talle, "id">): Promise<Talle> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<Talle> = await axios.post(url, talle, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async editarTalle(id: number, talle: Partial<Talle>): Promise<Talle> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<Talle> = await axios.put(url, talle, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async eliminarTalle(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }
}