import axios from "axios";
import Swal from "sweetalert2";
import { ItemCarrito } from "../types";

const API_URL = import.meta.env.VITE_URL_MERCADOPAGO;

export const handlePagar = async (itemsMP: ItemCarrito[]): Promise<boolean> => {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const token = localStorage.getItem("token");

  // Valida antes de enviar
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
        items: itemsMP,
        email: usuario.email,
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

    window.location.href = initPoint;
    return true;
  } catch (error) {
    console.error("Error al iniciar pago:", error);
    Swal.fire("Error", "No se pudo iniciar el pago", "error");
    return false;
  }
};