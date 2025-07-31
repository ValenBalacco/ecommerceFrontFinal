import { ICartItem } from "../store/useCartStore";
import { ItemCarrito } from "../types";

export function mapCartItemsToMercadoPago(items: ICartItem[]): ItemCarrito[] {
  return items.map((item) => ({
    productoId: item.productoId, 
    detalleId: item.detalleId,
    title: item.nombre || "Producto",
    quantity: item.cantidad ?? 1,
    unit_price: typeof item.precio === "number" && !isNaN(item.precio) && item.precio > 0
      ? item.precio
      : 1,
    currency_id: "ARS",
  }));
}