import styles from "./SidebarFilter.module.css";
import { useFilterStore } from "../../../store/filterStore";
import { ServiceCategoria } from "../../../services/categoriaService";
import { ServiceTalle } from "../../../services/talleService";
import { useEffect, useState } from "react";
import { Categoria, Talle } from "../../../types";

const CheckboxGroup = ({
  title,
  options,
  selected,
  onChange,
}: {
  title: string;
  options: { label: string; value: string; id?: string | number }[];
  selected: string[];
  onChange: (value: string) => void;
}) => (
  <section className={styles.section}>
    <h3>{title}</h3>
    {options.map(({ label, value, id }) => (
      <div key={id ?? value} className={styles.checkboxItem}>
        <input
          type="checkbox"
          id={value}
          checked={selected.includes(value)}
          onChange={() => onChange(value)}
        />
        <label htmlFor={value}>{label}</label>
      </div>
    ))}
  </section>
);

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
    new ServiceCategoria().getCategorias().then(setCategorias);
    new ServiceTalle().getTalles().then(setTalles);
  }, []);

  const handleCheckboxChange = (
    tipo: "orden" | "categoria" | "tipoProducto" | "talle"
  ) => (valor: string) => setFiltro(tipo, valor);

  const handlePrecioChange = (
    tipo: "minPrecio" | "maxPrecio",
    e: React.ChangeEvent<HTMLInputElement>
  ) => setPrecio(tipo, e.target.value === "" ? null : Number(e.target.value));

  return (
    <aside className={styles.sidebarFilterContainer}>
      <div className={styles.filterButtonContainer}>
        <button onClick={resetFiltros}>Resetear Filtros</button>
      </div>

      <section className={styles.section}>
        <h3>Filtrar por precio:</h3>
        <label>
          Mínimo:
          <input
            type="number"
            min={0}
            value={minPrecio ?? ""}
            onChange={(e) => handlePrecioChange("minPrecio", e)}
            placeholder="Min"
          />
        </label>
        <label>
          Máximo:
          <input
            type="number"
            min={0}
            value={maxPrecio ?? ""}
            onChange={(e) => handlePrecioChange("maxPrecio", e)}
            placeholder="Max"
          />
        </label>
      </section>

      <CheckboxGroup
        title="Ordenar por:"
        options={[
          { label: "Ascendente", value: "ascendente" },
          { label: "Descendente", value: "descendente" },
        ]}
        selected={orden}
        onChange={handleCheckboxChange("orden")}
      />

      <CheckboxGroup
        title="Categoría:"
        options={categorias.map((cat) => ({
          label: cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1),
          value: cat.nombre.toLowerCase(),
          id: cat.id,
        }))}
        selected={categoria}
        onChange={handleCheckboxChange("categoria")}
      />

      <CheckboxGroup
        title="Tipo Producto:"
        options={[
   "REMERA", "PANTALON", "ZAPATILLA", "OTRO"
        ].map((tipo) => ({
          label: tipo.charAt(0) + tipo.slice(1).toLowerCase(),
          value: tipo,
        }))}
        selected={tipoProducto}
        onChange={handleCheckboxChange("tipoProducto")}
      />

      <CheckboxGroup
        title="Talle:"
        options={talles.map((t) => ({
          label: t.talle,
          value: t.talle.toLowerCase(),
          id: t.id,
        }))}
        selected={talle}
        onChange={handleCheckboxChange("talle")}
      />
    </aside>
  );
};

export default SidebarFilter;