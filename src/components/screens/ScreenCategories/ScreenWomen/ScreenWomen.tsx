import Header from "../../../ui/Header/Navbar";
import Footer from "../../../ui/Footer/Footer";
import styles from "./ScreenWomen.module.css";
import CardProducts from "../../../ui/Cards/CardProducts/CardProducts";
import SidebarFilter from "../../../ui/SidebarFilter/SidebarFilter";
import { useEffect, useState } from "react";
import { Detalle } from "../../../../types";
import { ServiceDetalle } from "../../../../services";
import { useFilterStore } from "../../../../store/filterStore";

const ScreenWomen = () => {
  const [productosMujer, setProductosMujer] = useState<Detalle[]>([]);
  const { orden, categoria, tipoProducto, talle, minPrecio, maxPrecio } =
    useFilterStore();

  useEffect(() => {
    const detalleService = new ServiceDetalle();
    // Trae todos los detalles y filtra por género en el front
    detalleService
      .getDetalles()
      .then((detalles) => {
        const soloMujeres = detalles.filter(
          (det) => det.producto?.sexo === "FEMENINO"
        );
        setProductosMujer(soloMujeres);
      })
      .catch(() => setProductosMujer([]));
  }, []);

  const productosFiltrados = productosMujer.filter((producto) => {
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

    // CAMBIO: precio ahora es producto.precios?.[0]?.precioVenta
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
    <div className={styles.screenWomen}>
      <Header />

      <div className={styles.backgroundImage}></div>

      <div className={styles.mainContent}>
        <div className={styles.sidebar}>
          <SidebarFilter />
        </div>
        <div className={styles.productsSection}>
          <div className={styles.productCards}>
            {productosOrdenados.map((producto: Detalle) => (
              <CardProducts key={producto.id} products={producto} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ScreenWomen;