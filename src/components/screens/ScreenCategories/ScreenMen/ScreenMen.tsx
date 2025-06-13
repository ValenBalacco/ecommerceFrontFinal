import Header from "../../../ui/Header/Navbar";
import Footer from "../../../ui/Footer/Footer";
import styles from "./ScreenMen.module.css";
import CardProducts from "../../../ui/Cards/CardProducts/CardProducts";
import SidebarFilter from "../../../ui/SidebarFilter/SidebarFilter";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ServiceDetalle } from "../../../../services";
import { Detalle } from "../../../../types";
import { useFilterStore } from "../../../../store/filterStore";

const ScreenMen = () => {
  const [productosHombre, setProductosHombre] = useState<Detalle[]>([]);
  const [inputText, setInputText] = useState<string>("");
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

    // CAMBIO: precio ahora es producto.precios?.[0]?.precioVenta
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
    <div className={styles.screenMen}>
      <Header />

      <div className={styles.bannerImages}>
        <img
          src="https://static.nike.com/a/images/f_auto,cs_srgb/w_1536,c_limit/a005c6ee-8d75-4115-a42c-6bdd89239a09/zapatillas-ropa-y-accesorios-nike-para-hombre.jpg"
          alt="Banner 1"
        />
        <img
          src="https://imgmedia.larepublica.pe/640x640/larepublica/original/2024/11/22/6740fd797891720ab81487d8.webp"
          alt="Banner 2"
        />
        <img
          src="https://nikearprod.vtexassets.com/assets/vtex.file-manager-graphql/images/5d225ba6-7e2e-4b24-87d9-988a28290263___07adcb35a4533ee56ef1b5f0aa7a262f.jpg"
          alt="Banner 3"
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

export default ScreenMen;