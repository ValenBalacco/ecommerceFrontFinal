import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ["phoenix-remain-stocks-lite.trycloudflare.com"],
    proxy: {
      "/usuarios-direccion": "http://localhost:3000",
      "/direcciones": "http://localhost:3000",
      // Agrega aquí otros endpoints de tu backend si los usas
    },
  },
});