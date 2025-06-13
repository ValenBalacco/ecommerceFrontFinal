import { create } from "zustand";
import { Detalle } from "../types";

interface DetalleStore {
  detalle: Detalle[];
  detalleActivo: Detalle | null;
  setDetalle: (detalle: Detalle[]) => void;
  setDetalleActivo: (detalleActivo: Detalle | null) => void;
}

export const detalleStore = create<DetalleStore>((set) => ({
  detalle: [],
  detalleActivo: null,
  setDetalle: (detalle) => set({ detalle }),
  setDetalleActivo: (detalleActivo) => set({ detalleActivo }),
}));