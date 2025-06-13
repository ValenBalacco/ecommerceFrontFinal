import axios, { type AxiosResponse } from "axios";
import { type Img } from "../types";
const imgService = import.meta.env.VITE_URL_IMG;

export class ServiceImg {
  private baseURL: string;

  constructor() {
    this.baseURL = imgService;
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

  public async getImgs(): Promise<Img[]> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<Img[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async getImgById(id: number): Promise<Img> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<Img> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Solo acepta { url, detalleId }
  public async crearImg(img: { url: string; detalleId: number }): Promise<Img> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<Img> = await axios.post(url, img, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async editarImg(id: number, img: Partial<Img>): Promise<Img> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<Img> = await axios.put(url, img, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async eliminarImg(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }

  public async obtenerImagenPorDetalle(detalleId: number): Promise<Img[]> {
    const url = `${this.baseURL}/detalle/${detalleId}`;
    const response: AxiosResponse<Img[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}