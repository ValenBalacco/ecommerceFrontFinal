import Navbar from "../../ui/Header/Navbar";
import Footer from "../../ui/Footer/Footer";
import styles from "./ScreenClothes.module.css";
import CardProducts from "../../ui/Cards/CardProducts/CardProducts";
import SidebarFilter from "../../ui/SidebarFilter/SidebarFilter";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Detalle } from "../../../types";
import { ServiceDetalle } from "../../../services";
import { useFilterStore } from "../../../store/filterStore";

const ScreenClothes = () => {
  const [productosRopa, setProductosRopa] = useState<Detalle[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const { orden, categoria, tipoProducto, talle, minPrecio, maxPrecio } =
    useFilterStore();

  useEffect(() => {
    const detalleService = new ServiceDetalle();
    // Trae todos los detalles y filtra por categoría "ROPA" en el front
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
    const nombre = producto.producto.nombre?.toLowerCase() ?? "";
    const coincideBusqueda = nombre.includes(inputText.toLowerCase());

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
      coincideBusqueda &&
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

  const handleChangeInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  return (
    <div className={styles.screenClothes}>
      <Navbar />

      <div className={styles.bannerImages}>
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
          alt="Banner Ropa 1"
        />
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80"
          alt="Banner Ropa 2"
        />
        <img
          src="https://images.unsplash.com/photo-1463107971871-fbac9ddb920f?auto=format&fit=crop&w=600&q=80"
          alt="Banner Ropa 3"
        />
      </div>

      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <SidebarFilter />
        </aside>
        <section className={styles.productsSection}>
          <div className={styles.searchBar}>
            <input
              value={inputText}
              onChange={handleChangeInputSearch}
              type="search"
              placeholder="Buscar producto"
            />
            <Search />
          </div>
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