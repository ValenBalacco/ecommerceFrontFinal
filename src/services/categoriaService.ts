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

  public async getCategorias(incluirNoActivas = false): Promise<Categoria[]> {
    const url = incluirNoActivas
      ? `${this.baseURL}?incluirNoActivas=true`
      : this.baseURL;
    const response: AxiosResponse<Categoria[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async crearCategoria(data: Omit<Categoria, "id">): Promise<Categoria> {
    const response: AxiosResponse<Categoria> = await axios.post(
      this.baseURL,
      data,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  public async editarCategoria(id: number, data: Partial<Categoria>): Promise<Categoria> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<Categoria> = await axios.put(
      url,
      data,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  public async eliminarCategoria(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }

  public async habilitarCategoria(id: number): Promise<Categoria> {
    const url = `${this.baseURL}/${id}/enable`;
    const response: AxiosResponse<Categoria> = await axios.patch(
      url,
      {},
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }
}