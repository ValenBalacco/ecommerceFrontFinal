import axios from "axios";
import Swal from "sweetalert2";
import { ItemCarrito } from "../types";

const API_URL = import.meta.env.VITE_URL_MERCADOPAGO;


function total(items: ItemCarrito[]): number {
  return items.reduce(
    (sum: number, item: ItemCarrito) =>
      sum + (item.unit_price || 0) * (item.quantity || 1),
    0
  );
}

export const handlePagar = async (itemsMP: ItemCarrito[], direccionSeleccionadaId: number): Promise<boolean> => {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const token = localStorage.getItem("token");


  for (const item of itemsMP) {
    if (
      typeof item.unit_price !== "number" ||
      isNaN(item.unit_price) ||
      item.unit_price <= 0
    ) {
      Swal.fire(
        "Error",
        `El producto "${item.title}" tiene un precio inválido. Corrige el precio antes de pagar.`,
        "error"
      );
      return false;
    }
  }

  try {
    const response = await axios.post(
      `${API_URL}/crear-preferencia`,
      {
        items: itemsMP.map(item => ({
          productoId: item.productoId,
          detalleId: item.detalleId,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: item.currency_id,
        })),
        email: usuario.email,
        usuarioId: usuario.id,
        direccionEnvioId: direccionSeleccionadaId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const initPoint = response.data.init_point;

    if (!initPoint) {
      throw new Error("init_point no recibido");
    }

    localStorage.setItem("checkout_data", JSON.stringify({
      items: itemsMP.map(item => ({
        productoId: item.productoId, 
        detalleId: item.detalleId,
        cantidad: item.quantity,
      })),
      direccionEnvioId: direccionSeleccionadaId,
      usuario: usuario,
    }));

   
    window.location.href = initPoint; 
    return true;
  } catch (error) {
    console.error("Error al iniciar pago:", error);
    Swal.fire("Error", "No se pudo iniciar el pago", "error");
    return false;
  }
}