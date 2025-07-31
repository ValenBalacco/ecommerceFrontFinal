import axios, { type AxiosResponse } from "axios";
import { type Img } from "../types";
import { uploadToCloudinary } from "../helpers/uploadToCloudinary";

const imgService = import.meta.env.VITE_URL_IMG;
const cloudinaryPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const cloudinaryName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

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

  /**
   * Sube la imagen a Cloudinary y luego guarda la URL en tu backend.
   * @param file Archivo de imagen a subir.
   * @param detalleId ID del detalle al que pertenece la imagen.
   */
  public async crearImgConCloudinary(file: File, detalleId: number): Promise<Img> {
    // 1. Subir imagen a Cloudinary
    const cloudinaryRes = await uploadToCloudinary(
      file,
      cloudinaryPreset,
      cloudinaryName
    );
    // 2. Guardar la URL en tu backend
    const url = `${this.baseURL}`;
    const response: AxiosResponse<Img> = await axios.post(
      url,
      { url: cloudinaryRes.secure_url, detalleId },
      { headers: this.getAuthHeaders() }
    );
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