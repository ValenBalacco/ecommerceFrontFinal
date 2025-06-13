import styles from "./SidebarFilter.module.css";
import { useFilterStore } from "../../../store/filterStore";
import { ServiceCategoria } from "../../../services/categoriaService";
import { Categoria } from "../../../types";
import { Talle } from "../../../types";
import { ServiceTalle } from "../../../services/talleService";
import { useEffect, useState } from "react";

const SidebarFilter = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [talles, setTalles] = useState<Talle[]>([]);

  const {
    orden,
    categoria,
    tipoProducto,
    talle,
    minPrecio,
    maxPrecio,
    setFiltro,
    resetFiltros,
    setPrecio,
  } = useFilterStore();

  useEffect(() => {
    const categoriaService = new ServiceCategoria();
    categoriaService.getCategorias().then(setCategorias);
  }, []);

  useEffect(() => {
    const talleService = new ServiceTalle();
    talleService.getTalles().then(setTalles);
  }, []);

  const handleCheckboxChange = (
    tipo: "orden" | "categoria" | "tipoProducto" | "talle",
    valor: string
  ) => {
    setFiltro(tipo, valor);
  };

  const handlePrecioChange = (
    tipo: "minPrecio" | "maxPrecio",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const valor = e.target.value === "" ? null : Number(e.target.value);
    setPrecio(tipo, valor);
  };

  return (
    <div className={styles.sidebarFilterContainer}>
      <div className={styles.filterButtonContainer}>
        <button onClick={resetFiltros}>Resetear Filtros</button>
      </div>

      <div className={styles.priceFilterSection}>
        <h3>Filtrar por precio:</h3>
        <label htmlFor="minPrecio">Mínimo:</label>
        <input
          type="number"
          id="minPrecio"
          min={0}
          value={minPrecio ?? ""}
          onChange={(e) => handlePrecioChange("minPrecio", e)}
          placeholder="Min"
        />
        <label htmlFor="maxPrecio">Máximo:</label>
        <input
          type="number"
          id="maxPrecio"
          min={0}
          value={maxPrecio ?? ""}
          onChange={(e) => handlePrecioChange("maxPrecio", e)}
          placeholder="Max"
        />
      </div>

      <div className={styles.sortSection}>
        <h3>Ordenar por:</h3>
        {["ascendente", "descendente"].map((ordenItem) => (
          <div key={ordenItem} className={styles.checkboxItem}>
            <input
              type="checkbox"
              id={ordenItem}
              checked={orden.includes(ordenItem)}
              onChange={() => handleCheckboxChange("orden", ordenItem)}
            />
            <label htmlFor={ordenItem}>
              {ordenItem === "masVendidos"
                ? "Más vendidos"
                : ordenItem.charAt(0).toUpperCase() + ordenItem.slice(1)}
            </label>
          </div>
        ))}
      </div>

      <div className={styles.categorySection}>
        <h3>Categoría:</h3>
        {categorias.map((cat) => (
          <div key={cat.id} className={styles.checkboxItem}>
            <input
              type="checkbox"
              id={cat.nombre}
              checked={categoria.includes(cat.nombre.toLowerCase())}
              onChange={() =>
                handleCheckboxChange("categoria", cat.nombre.toLowerCase())
              }
            />
            <label htmlFor={cat.nombre}>
              {cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1)}
            </label>
          </div>
        ))}
      </div>

      <div className={styles.productTypeSection}>
        <h3>Tipo Producto:</h3>
        {["ZAPATILLAS", "REMERA", "BUZO", "PANTALON", "CAMPERA"].map((tipo) => (
          <div key={tipo} className={styles.checkboxItem}>
            <input
              type="checkbox"
              id={tipo}
              checked={tipoProducto.includes(tipo)}
              onChange={() => handleCheckboxChange("tipoProducto", tipo)}
            />
            <label htmlFor={tipo}>
              {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
            </label>
          </div>
        ))}
      </div>

      <div className={styles.sizeSection}>
        <h3>Talle:</h3>
        {talles.map((t) => (
          <div key={t.id} className={styles.checkboxItem}>
            <input
              type="checkbox"
              id={t.talle}
              checked={talle.includes(t.talle.toLowerCase())}
              onChange={() => handleCheckboxChange("talle", t.talle.toLowerCase())}
            />
            <label htmlFor={t.talle}>{t.talle}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarFilter;