import axios, { AxiosResponse } from "axios";
import { Producto } from "../types";

const productoService = import.meta.env.VITE_URL_PRODUCTOS;

export class ServiceProducto {
  private baseURL: string;

  constructor() {
    this.baseURL = productoService;
    console.log("ServiceProducto baseURL:", this.baseURL); // LOG INICIAL
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

  public async getProductos(): Promise<Producto[]> {
    const url = `${this.baseURL}`;
    console.log("Llamando GET a:", url); // LOG URL
    try {
      const response: AxiosResponse<Producto[]> = await axios.get(url, {
        headers: this.getAuthHeaders(),
      });
      console.log("Respuesta backend productos:", response.data); // LOG RESPONSE
      return response.data;
    } catch (error) {
      console.error("Error en getProductos:", error); // LOG ERROR
      throw error;
    }
  }

  public async getProductosPaginado(page: number) {
    const url = `${this.baseURL}/paginado?page=${page}&size=10`;
    console.log("Llamando GET paginado a:", url);
    try {
      const res = await axios.get(url, {
        headers: this.getAuthHeaders(),
      });
      console.log("Respuesta backend productos paginados:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error en getProductosPaginado:", error);
      throw error;
    }
  }

  public async getProductoById(id: number): Promise<Producto> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<Producto> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Solo enviar { nombre, categoriaId, tipoProducto, sexo }
  public async crearProducto(producto: {
    nombre: string;
    categoriaId: number;
    tipoProducto: string;
    sexo: string;
  }): Promise<Producto> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<Producto> = await axios.post(url, producto, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async editarProducto(
    id: number,
    producto: Partial<Producto>
  ): Promise<Producto> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<Producto> = await axios.put(url, producto, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async eliminarProducto(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }
}