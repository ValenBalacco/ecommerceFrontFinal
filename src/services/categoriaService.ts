import axios, { AxiosResponse } from "axios";
import { Categoria } from "../types";
const categoriaService = import.meta.env.VITE_URL_CATEGORIA;

export class ServiceCategoria {
  private baseURL: string;

  constructor() {
    this.baseURL = categoriaService;
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

  public async getCategorias(): Promise<Categoria[]> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<Categoria[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async getCategoriaById(id: number): Promise<Categoria> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<Categoria> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // No envíes 'id', el backend lo genera
  public async crearCategoria(
    categoria: Omit<Categoria, "id">
  ): Promise<Categoria> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<Categoria> = await axios.post(url, categoria, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Permite edición parcial
  public async editarCategoria(
    id: number,
    categoria: Partial<Categoria>
  ): Promise<Categoria> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<Categoria> = await axios.put(
      url,
      categoria,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  public async eliminarCategoria(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }
}