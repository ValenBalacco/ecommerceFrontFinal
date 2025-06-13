import { create } from "zustand";

type FiltroState = {
  orden: string[];
  categoria: string[];
  tipoProducto: string[];
  talle: string[];
  minPrecio: number | null;
  maxPrecio: number | null;
  setFiltro: (
    tipo: keyof Omit<FiltroState, "setFiltro" | "resetFiltros" | "setPrecio">,
    valor: string
  ) => void;
  setPrecio: (tipo: "minPrecio" | "maxPrecio", valor: number | null) => void;
  resetFiltros: () => void;
};

export const useFilterStore = create<FiltroState>((set) => ({
  orden: [],
  categoria: [],
  tipoProducto: [],
  talle: [],
  minPrecio: null,
  maxPrecio: null,

  setFiltro: (tipo, valor) =>
    set((state) => {
      const lista = state[tipo] as string[];
      return {
        ...state,
        [tipo]: lista.includes(valor)
          ? lista.filter((v) => v !== valor)
          : [...lista, valor],
      };
    }),

  setPrecio: (tipo, valor) =>
    set(() => ({
      [tipo]: valor,
    })),

  resetFiltros: () =>
    set({
      orden: [],
      categoria: [],
      tipoProducto: [],
      talle: [],
      minPrecio: null,
      maxPrecio: null,
    }),
}));