import styles from "./ScreenAdmin.module.css";
import { useEffect, useState } from "react";
import { detalleStore } from "../../../store/detalleStore";
import { HeaderAdmin } from "../../ui/HeaderAdmin/HeaderAdmin";
import { Productos } from "./Productos/Productos";
import Footer from "../../ui/Footer/Footer";
import { Categorias } from "./Categorias/Categorias";
import { Usuarios } from "./Usuarios/Usuarios";
import { Ordenes } from "./Ordenes/Ordenes";
import { Talles } from "./Talle/Talle";
import { ServiceDetalle } from "../../../services";

type Tab = "productos" | "categorias" | "talles" | "usuarios" | "ordenes";

const ScreenAdmin = () => {
  const setDetalle = detalleStore((state) => state.setDetalle);
  const [activeTab, setActiveTab] = useState<Tab>("productos");

  const cargarContenido = () => {
    switch (activeTab) {
      case "productos":
        return <Productos />;
      case "categorias":
        return <Categorias />;
      case "talles":
        return <Talles />;
      case "usuarios":
        return <Usuarios />;
      case "ordenes":
        return <Ordenes />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const detalleService = new ServiceDetalle();
        const data = await detalleService.getDetalles();
        setDetalle(data);
      } catch (error) {
        console.error("Error al cargar detalles para el store:", error);
      }
    };
    fetchPedido();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HeaderAdmin />
      <div className={styles.adminContainer}>
        <div className={styles.adminContent}>
          <nav className={styles.adminTabs}>
            <button
              className={`${activeTab === "productos" ? styles.active : ""}`}
              onClick={() => setActiveTab("productos")}
            >
              Productos
            </button>
            <button
              className={`${activeTab === "categorias" ? styles.active : ""}`}
              onClick={() => setActiveTab("categorias")}
            >
              Categorías
            </button>
            <button
              className={`${activeTab === "talles" ? styles.active : ""}`}
              onClick={() => setActiveTab("talles")}
            >
              Talles
            </button>
            <button
              className={`${activeTab === "usuarios" ? styles.active : ""}`}
              onClick={() => setActiveTab("usuarios")}
            >
              Usuarios
            </button>
            <button
              className={`${activeTab === "ordenes" ? styles.active : ""}`}
              onClick={() => setActiveTab("ordenes")}
            >
              Ordenes
            </button>
          </nav>
          <div className={styles.tabContent}>{cargarContenido()}</div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ScreenAdmin;