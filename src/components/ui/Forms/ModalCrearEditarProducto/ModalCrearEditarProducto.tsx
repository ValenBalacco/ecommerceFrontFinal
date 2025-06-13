import { FC, useEffect, useState } from "react";
import { Producto, Categoria } from "../../../../types";
import styles from "./ModalCrearEditarProducto.module.css";
import { ServiceCategoria } from "../../../../services/categoriaService";
import Swal from "sweetalert2";


const tipoProductos: Producto["tipoProducto"][] = ["REMERA", "PANTALON", "ZAPATILLA", "OTRO"];
const sexos = ["MASCULINO", "FEMENINO", "INFANTIL"];

interface IProps {
  closeModal: () => void;
  producto?: Producto | null;
  onSubmit?: (producto: Omit<Producto, "id" | "detalles" | "itemsOrden" | "categoria">) => void;
}

const ModalCrearEditarProducto: FC<IProps> = ({
  closeModal,
  producto,
  onSubmit,
}) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [formState, setFormState] = useState({
    nombre: producto?.nombre || "",
    categoriaId: producto?.categoriaId || 0,
    tipoProducto: producto?.tipoProducto || "REMERA",
    sexo: producto?.sexo || "MASCULINO",
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const serviceCategoria = new ServiceCategoria();
        const categoriasData = await serviceCategoria.getCategorias();
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al cargar categorías", error);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    setFormState({
      nombre: producto?.nombre || "",
      categoriaId: producto?.categoriaId || 0,
      tipoProducto: producto?.tipoProducto || "REMERA",
      sexo: producto?.sexo || "MASCULINO",
    });
  }, [producto]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const categoria = categorias.find((cat) => cat.id === Number(formState.categoriaId));
      if (!categoria) {
        Swal.fire({ title: "Categoría inválida", icon: "error" });
        return;
      }
      // Solo los campos simples, NO enviar categoria ni detalles ni itemsOrden
      const newProducto = {
        nombre: formState.nombre,
        categoriaId: categoria.id,
        tipoProducto: formState.tipoProducto,
        sexo: formState.sexo,
      };
      await onSubmit?.(newProducto);
      Swal.fire({
        title: producto?.id ? "Producto editado!" : "Producto creado!",
        icon: "success",
      });
      closeModal();
    } catch (error) {
      console.error("Error al guardar el producto", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar el producto.",
        icon: "error",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "categoriaId" ? Number(value) : value,
    }));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{producto ? "Editar producto" : "Crear producto"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nombre</label>
            <input
              placeholder="Ingrese el nombre"
              type="text"
              name="nombre"
              value={formState.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Categoría</label>
            <select
              name="categoriaId"
              value={formState.categoriaId}
              onChange={handleChange}
              required
            >
              <option disabled value={0}>
                Selecciona una categoría
              </option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Tipo</label>
            <select
              name="tipoProducto"
              value={formState.tipoProducto}
              onChange={handleChange}
              required
            >
              {tipoProductos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Sexo</label>
            <select
              name="sexo"
              value={formState.sexo}
              onChange={handleChange}
              required
            >
              {sexos.map((sexo) => (
                <option key={sexo} value={sexo}>
                  {sexo.charAt(0) + sexo.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={closeModal}
            >
              Cancelar
            </button>
            <button className={styles.submitButton} type="submit">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearEditarProducto;