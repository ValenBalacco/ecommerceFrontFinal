import { useEffect, useState } from "react";
import Footer from "../../ui/Footer/Footer";
import Header from "../../ui/Header/Navbar";
import styles from "./ScreenHome.module.css";
import { Detalle } from "../../../types";
import ProductCarousel from "../../ui/Carousel/ProductCarousel/ProductCarousel";
import { ServiceDetalle } from "../../../services";
import { FaChild, FaMale, FaFemale, FaShoePrints, FaTshirt, FaPercent } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ScreenHome = () => {
  const [productos, setProductos] = useState<Detalle[]>([]);
  const detalleService = new ServiceDetalle();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetalles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDetalles = async () => {
    try {
      const result = await detalleService.getDetalles();
      setProductos(result);
    } catch (error) {
      console.error("Error al hacer fetch:", error);
    }
  };

  // Función de navegación
  const goToCategory = (category: string) => {
    navigate(`/${category}`);
  };

  return (
    <div className={styles.screenHome}>
      <Header />
      <div className={styles.heroSection}>
        <img
          src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80"
          alt="Hero"
          className={styles.heroImg}
        />
      </div>
      <div className={styles.quickAccessSection}>
        <div className={styles.quickAccessRow}>
          <div>
            <span className={styles.quickAccessTitle}>Novedades</span>
            <div className={styles.quickAccessIcons}>
              <img src="https://imgur.com/7Qe2qQ9.png" alt="Novedad 1" />
              <img src="https://imgur.com/g8it2w4.png" alt="Novedad 2" />
              <img src="https://imgur.com/8Uj8Q5g.png" alt="Novedad 3" />
            </div>
          </div>
          <div>
            <span className={styles.quickAccessTitle}>Destacados</span>
            <div className={styles.quickAccessIcons}>
              <img src="https://imgur.com/7G6vF7O.png" alt="Destacado 1" />
              <img src="https://imgur.com/9fBKZjF.png" alt="Destacado 2" />
            </div>
          </div>
          <div>
            <span className={styles.quickAccessTitle}>Marcas</span>
            <div className={styles.quickAccessIcons}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Puma_AG.svg" alt="Puma" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/11/Vans_logo.svg" alt="Vans" />
            </div>
          </div>
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
          <div className={styles.categoryCard}>
            <FaShoePrints />
            <span>Zapatillas</span>
          </div>
          <div className={styles.categoryCard}>
            <FaTshirt />
            <span>Ropa</span>
          </div>
          <div className={styles.categoryCard}>
            <FaPercent />
            <span>PROMO</span>
          </div>
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