import { ICartItem } from "../store/useCartStore";
import { ItemCarrito } from "../types";
export function mapCartItemsToMercadoPago(items: ICartItem[]): ItemCarrito[] {
  return items.map((item) => ({
    title: item.nombre || "Producto",
    quantity: item.cantidad ?? 1,
    unit_price:
      typeof item.precio === "number" && !isNaN(item.precio) && item.precio > 0
        ? item.precio
        : 1, // Nunca null, pon un valor por defecto válido (ej: 1)
    category_id: "general",
    currency_id: "ARS",
  }));
}