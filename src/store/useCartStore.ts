import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ICartItem {
  productoId: number; // obligatorio
  detalleId: number;
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
  precioVenta?: number;
  descuento?: number;
  talle?: string;
}

interface ICartState {
  items: ICartItem[];
  agregar: (item: ICartItem) => void;
  cambiarCantidad: (detalleId: number, nuevaCantidad: number) => void;
  eliminar: (detalleId: number) => void;
  vaciar: () => void;
  total: () => number;
}

export const useCartStore = create<ICartState>()(
  persist(
    (set, get) => ({
      items: [],

      agregar: (item) => {
        // Validación extra: productoId y detalleId obligatorios
        if (
          typeof item.productoId !== "number" ||
          isNaN(item.productoId) ||
          typeof item.detalleId !== "number" ||
          isNaN(item.detalleId)
        ) {
          console.warn("Intento de agregar item sin productoId o detalleId válido:", item);
          return;
        }

        const currentItems = get().items;
        const index = currentItems.findIndex((i) => i.detalleId === item.detalleId);

        if (index === -1) {
          set({ items: [...currentItems, item] });
        } else {
          const updatedItems = currentItems.map((i, idx) => {
            if (idx !== index) return i;
            return { ...i, cantidad: i.cantidad + item.cantidad };
          });
          set({ items: updatedItems });
        }
      },

      cambiarCantidad: (detalleId, nuevaCantidad) => {
        const updatedItems = get().items.map((item) =>
          item.detalleId === detalleId ? { ...item, cantidad: nuevaCantidad } : item
        );
        set({ items: updatedItems });
      },

      eliminar: (detalleId) => {
        set({ items: get().items.filter((i) => i.detalleId !== detalleId) });
      },

      vaciar: () => set({ items: [] }),

      total: () => get().items.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    }),
    {
      name: "carrito",
    }
  )
);

// Ejemplo de cómo agregar un item correctamente
/*
agregar({
  productoId: producto.id, // obligatorio
  detalleId: detalle.id,
  nombre: producto.nombre,
  imagen: producto.imagen,
  precio: precio,
  cantidad: cantidad,
  // ...otros campos opcionales
});
*/