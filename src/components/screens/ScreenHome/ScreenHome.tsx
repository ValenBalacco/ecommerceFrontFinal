import { useEffect, useState } from "react";
import Footer from "../../ui/Footer/Footer";
import Header from "../../ui/Header/Navbar";
import styles from "./ScreenHome.module.css";
import { Detalle } from "../../../types";
import ProductCarousel from "../../ui/Carousel/ProductCarousel/ProductCarousel";
import { ServiceDetalle } from "../../../services";
import { FaChild, FaMale, FaFemale, FaShoePrints, FaTshirt, FaPercent } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ScreenHome = () => {
  const [productos, setProductos] = useState<Detalle[]>([]);
  const detalleService = new ServiceDetalle();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetalles();

  }, []);

  const fetchDetalles = async () => {
    try {
      const result = await detalleService.getDetalles();
      setProductos(result);
    } catch (error) {
      console.error("Error al hacer fetch:", error);
    }
  };

 
  const goToCategory = (category: string) => {
    navigate(`/${category}`);
  };

  const handlePromoClick = () => {
    Swal.fire({
      title: "¡Próximamente!",
      text: "Las promociones estarán disponibles muy pronto.",
      icon: "info",
      confirmButtonText: "Ok",
      confirmButtonColor: "#175992"
    });
  };

  return (
    <div className={styles.screenHome}>
      <Header />
      <div className={styles.heroSection}>
        <img
          src="https://www.hogarmania.com/archivos/201105/ropa-calidad-1280x720x80xX.jpg"
          className={styles.heroImg}
        />
      </div>
      <div className={styles.categoryRow}>
        <div
          className={styles.categoryCard}
          onClick={() => goToCategory("niño")}
          style={{ cursor: "pointer" }}
        >
          <FaChild />
          <span>Niños</span>
        </div>
        <div
          className={styles.categoryCard}
          onClick={() => goToCategory("hombre")}
          style={{ cursor: "pointer" }}
        >
          <FaMale />
          <span>Hombres</span>
        </div>
        <div
          className={styles.categoryCard}
          onClick={() => goToCategory("mujer")}
          style={{ cursor: "pointer" }}
        >
          <FaFemale />
          <span>Mujeres</span>
        </div>
        <div className={styles.categoryCard}
          onClick={() => goToCategory("zapatillas")}
          style={{ cursor: "pointer" }}>
          <FaShoePrints />
          <span>Zapatillas</span>
        </div>
        <div
          className={styles.categoryCard}
          onClick={() => goToCategory("clothes")}
          style={{ cursor: "pointer" }}
        >
          <FaTshirt />
          <span>Ropa</span>
        </div>
        <div
          className={styles.categoryCard}
          onClick={handlePromoClick}
          style={{ cursor: "pointer" }}
        >
          <FaPercent />
          <span>PROMO</span>
        </div>
      </div>
      <div className={styles.featuredSection}>
        <h3 className={styles.featuredTitle}>Todos los Productos:</h3>
        <ProductCarousel products={productos} />
      </div>
      <Footer />
    </div>
  );
};

export default ScreenHome;