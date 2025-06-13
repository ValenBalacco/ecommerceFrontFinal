import Header from "../../../ui/Header/Navbar";
import Footer from "../../../ui/Footer/Footer";
import styles from "./ScreenHombre.module.css";
import CardProducts from "../../../ui/Cards/CardProducts/CardProducts";
import SidebarFilter from "../../../ui/SidebarFilter/SidebarFilter";
import { useEffect, useState } from "react";
import { ServiceDetalle } from "../../../../services";
import { Detalle } from "../../../../types";
import { useFilterStore } from "../../../../store/filterStore";

const ScreenHombre = () => {
  const [productosHombre, setProductosHombre] = useState<Detalle[]>([]);
  const { orden, categoria, tipoProducto, talle, minPrecio, maxPrecio } =
    useFilterStore();

  useEffect(() => {
    const detalleService = new ServiceDetalle();
    // Trae todos los detalles y filtra por género en el front
    detalleService
      .getDetalles()
      .then((detalles) => {
        const soloHombres = detalles.filter(
          (det) => det.producto?.sexo === "MASCULINO"
        );
        setProductosHombre(soloHombres);
      })
      .catch(() => setProductosHombre([]));
  }, []);

  const productosFiltrados = productosHombre.filter((producto) => {
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
    <div className={styles.screenMen}>
      <Header />

      <div className={styles.backgroundImage}></div>

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

export default ScreenHombre;