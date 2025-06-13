import { create } from "zustand";
import { Usuario } from "../types";

interface IAuthStore {
  usuario: Usuario | null;
  token: string | null;
  login: (usuario: Usuario, token: string) => void;
  logout: VoidFunction;
  loadFromStorage: VoidFunction;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  usuario: null,
  token: null,

  login: (usuario, token) => {
    if (!usuario || !usuario.id) {
      console.error("Usuario inválido al guardar:", usuario);
      return;
    }
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    set({ usuario, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    set({ usuario: null, token: null });
  },

  loadFromStorage: () => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("usuario");
    if (token && rawUser && rawUser !== "undefined" && rawUser.trim() !== "") {
      try {
        const usuario = JSON.parse(rawUser);
        if (usuario && usuario.id) {
          set({ token, usuario });
        } else {
          set({ usuario: null, token: null });
          localStorage.removeItem("usuario");
        }
      } catch (e) {
        console.error("Error al parsear usuario guardado:", e);
        localStorage.removeItem("usuario");
        set({ usuario: null, token: null });
      }
    } else {
      set({ usuario: null, token: null });
    }
  },
}));