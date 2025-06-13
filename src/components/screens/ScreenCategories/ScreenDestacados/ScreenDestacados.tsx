import { Search } from "lucide-react";
import Header from "../../../ui/Header/Navbar";
import SidebarFilter from "../../../ui/SidebarFilter/SidebarFilter";
import styles from "./ScreenDestacados.module.css";
import CardProducts from "../../../ui/Cards/CardProducts/CardProducts";
import Footer from "../../../ui/Footer/Footer";
import { ServiceDetalle } from "../../../../services";
import { useEffect, useState } from "react";
import { Detalle } from "../../../../types";
import { useFilterStore } from "../../../../store/filterStore";

export const ScreenDestacados = () => {
  const [productosDestacados, setProductosDestacados] = useState<Detalle[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const { orden, categoria, tipoProducto, talle, minPrecio, maxPrecio } = useFilterStore();
  const detalleService = new ServiceDetalle();

  const getProducts = async () => {
    try {
      const destacados = await detalleService.getProductosDestacados();
      setProductosDestacados(destacados);
    } catch (err) {
      // Manejo de error opcional
      setProductosDestacados([]);
    }
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const productosFiltrados = productosDestacados.filter((producto: Detalle) => {
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

    // accede al precioVenta desde precios[0]
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
    <div className={styles.screenDestacados}>
      <Header />
      <div className={styles.mainContent}>
        <div className={styles.sidebar}>
          <SidebarFilter />
        </div>
        <div className={styles.productsSection}>
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