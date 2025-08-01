# 🛍️ Ecommerce Frontend

Este repositorio contiene el **frontend** de un proyecto de **Ecommerce**, desarrollado con **Vite**, **React** y **TypeScript**. Esta aplicación consume una **API RESTful** para gestionar productos, usuarios, direcciones, órdenes de compra y más.

## 🚀 Tecnologías utilizadas

- ⚛️ React — Construcción de interfaces modernas
- ⚡ Vite — Empaquetador ultrarrápido para desarrollo moderno
- 🟦 TypeScript — Tipado estático para una mayor robustez
- 🔄 Axios — Cliente HTTP para consumir la API REST
- 🧠 Zustand / Redux — Gestión del estado global
- 🎨 CSS Modules — Estilado por componente
- 🧩 Componentes modulares reutilizables

## 📁 Estructura del proyecto
```bash
src/
├── components/
│ ├── ui/
│ ├── screens/
├── helpers/
├── routes/
├── services/
├── store/
├── types/
├── App.tsx
├── main.tsx
├── index.css
└── vite-env.d.ts
```
## 🧪 Funcionalidades clave

- ✅ Registro e inicio de sesión de usuarios
- ✅ Seguridad mediante autenticación con JSON Web Tokens (JWT)
- ✅ Gestión de direcciones del usuario
- ✅ Visualización y filtrado de productos
- ✅ Agregar y modificar productos en el carrito
- ✅ Checkout con diferentes estados (éxito, pendiente, error)
- ✅ Integración con Mercado Pago para pagos online
- ✅ Carga y almacenamiento de imágenes en Cloudinary
- ✅ Panel de administración (usuarios, productos, órdenes)
- ✅ Creación de productos con eliminado lógico
- ✅ Asociación de productos con categorías, talles y características
- ✅ Generación y gestión de descuentos
