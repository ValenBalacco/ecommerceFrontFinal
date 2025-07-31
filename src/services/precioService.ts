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
    detalleId: number;
    descuentoId: number | null; // Permitir null si no hay descuento vigente
    descuentoPorcentaje: number;
  }): Promise<Precio> {
    const url = `${this.baseURL}`;

    const precioVenta =
      precio.precioCompra -
      (precio.precioCompra * (precio.descuentoPorcentaje || 0)) / 100;

    const payload = {
      precioCompra: precio.precioCompra,
      precioVenta: isNaN(precioVenta) ? precio.precioCompra : precioVenta,
      detalleId: precio.detalleId,
      descuentoId: precio.descuentoId,
    };

    console.log("Enviando a backend (crearPrecio):", payload);
    const response: AxiosResponse<Precio> = await axios.post(url, payload, {
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
      descuentoId?: number | null;
      descuentoPorcentaje?: number;
    }
  ): Promise<Precio> {
    const url = `${this.baseURL}/${id}`;
    let payload = { ...precio };

    // Recalcula precioVenta si tienes precioCompra y descuentoPorcentaje
    if (
      typeof precio.precioCompra === "number" &&
      typeof precio.descuentoPorcentaje === "number"
    ) {
      const precioVenta =
        precio.precioCompra -
        (precio.precioCompra * (precio.descuentoPorcentaje || 0)) / 100;
      payload.precioVenta = isNaN(precioVenta)
        ? precio.precioCompra
        : precioVenta;
    }

    // Si no hay descuento vigente, asegúrate de enviar null
    if (payload.descuentoId === undefined) {
      payload.descuentoId = null;
    }

    console.log("Enviando a backend (editarPrecio):", payload);
    const response: AxiosResponse<Precio> = await axios.put(url, payload, {
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