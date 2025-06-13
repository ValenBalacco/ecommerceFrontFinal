import Header from "../../../ui/Header/Navbar";
import Footer from "../../../ui/Footer/Footer";
import styles from "./ScreenKids.module.css";
import CardProducts from "../../../ui/Cards/CardProducts/CardProducts";
import SidebarFilter from "../../../ui/SidebarFilter/SidebarFilter";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Detalle } from "../../../../types";
import { ServiceDetalle } from "../../../../services";
import { useFilterStore } from "../../../../store/filterStore";

const ScreenKids = () => {
  const [productosInfantil, setProductosInfantil] = useState<Detalle[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const { orden, categoria, tipoProducto, talle, minPrecio, maxPrecio } =
    useFilterStore();

  useEffect(() => {
    const detalleService = new ServiceDetalle();
    // Trae todos los detalles y filtra por género en el front
    detalleService
      .getDetalles()
      .then((detalles) => {
        const soloInfantil = detalles.filter(
          (det) => det.producto?.sexo === "INFANTIL"
        );
        setProductosInfantil(soloInfantil);
      })
      .catch(() => setProductosInfantil([]));
  }, []);

  const productosFiltrados = productosInfantil.filter((producto) => {
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
    <div className={styles.screenKids}>
      <Header />

      <div className={styles.bannerImages}>
        <img
          src="https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_1110,c_limit/17783f55-98a7-4483-b0eb-c3a44d2261b4/el-mejor-calzado-nike-para-ni%C3%B1os.jpg"
          alt=""
        />
        <img
          src="https://static.nike.com/a/images/f_auto,cs_srgb/w_1536,c_limit/494ab9f8-072f-49f7-a2c7-05772993c1a2/nike-para-ni%C3%B1os.jpg"
          alt=""
        />
        <img
          src="https://static.nike.com/a/images/f_auto/dpr_3.0,cs_srgb/h_484,c_limit/4906ab21-937a-4a9a-997a-ae95ec24bd70/los-mejores-calcetines-de-nike-para-ni%C3%B1os.jpg"
          alt=""
        />
      </div>

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

export default ScreenKids;