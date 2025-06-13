import Navbar from "../../ui/Header/Navbar";
import Footer from "../../ui/Footer/Footer";
import styles from "./ScreenClothes.module.css";
import CardProducts from "../../ui/Cards/CardProducts/CardProducts";
import SidebarFilter from "../../ui/SidebarFilter/SidebarFilter";
import { useEffect, useState } from "react";
import { Detalle } from "../../../types";
import { ServiceDetalle } from "../../../services";
import { useFilterStore } from "../../../store/filterStore";

const ScreenClothes = () => {
  const [productosRopa, setProductosRopa] = useState<Detalle[]>([]);
  const { orden, categoria, tipoProducto, talle, minPrecio, maxPrecio } =
    useFilterStore();

  useEffect(() => {
    const detalleService = new ServiceDetalle();

    detalleService
      .getDetalles()
      .then((detalles) => {
        const soloRopa = detalles.filter(
          (det) =>
            det.producto?.categoria?.nombre?.toLowerCase() === "ropa"
        );
        setProductosRopa(soloRopa);
      })
      .catch(() => setProductosRopa([]));
  }, []);

  const productosFiltrados = productosRopa.filter((producto) => {
    const coincideCategoria =
      categoria.length === 0 ||
      categoria.includes(producto.producto.categoria?.nombre?.toLowerCase() ?? "");

    const coincideTipo =
      tipoProducto.length === 0 ||
      tipoProducto.includes(producto.producto.tipoProducto);

    const coincideTalle =
      talle.length === 0 ||
      (producto.talle
        ? talle.includes(producto.talle.talle.toLowerCase())
        : true);

    const precioVenta = producto.precios?.[0]?.precioVenta ?? 0;

    const coincideMinPrecio = minPrecio === null || precioVenta >= minPrecio;
    const coincideMaxPrecio = maxPrecio === null || precioVenta <= maxPrecio;

    return (
      coincideCategoria &&
      coincideTipo &&
      coincideTalle &&
      coincideMinPrecio &&
      coincideMaxPrecio
    );
  });

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    const precioA = a.precios?.[0]?.precioVenta ?? 0;
    const precioB = b.precios?.[0]?.precioVenta ?? 0;
    if (orden.includes("ascendente")) {
      return precioA - precioB;
    }
    if (orden.includes("descendente")) {
      return precioB - precioA;
    }
    return 0;
  });

  return (
    <div className={styles.screenClothes}>
      <div className={styles.backgroundImage}></div>
      <Navbar />

      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <SidebarFilter />
        </aside>
        <section className={styles.productsSection}>
          <div className={styles.productCards}>
            {productosOrdenados.map((producto) => (
              <CardProducts key={producto.id} products={producto} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ScreenClothes;