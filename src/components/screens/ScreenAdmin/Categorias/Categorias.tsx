import { CheckCircle2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./Categorias.module.css";
import { ModalCrearEditarCategoria } from "../../../ui/Forms/ModalCrearEditarCategoria/ModalCrearEditarCategoria";
import { Categoria } from "../../../../types";
import { AdminTable } from "../../../ui/Tables/AdminTable/AdminTable";
import { ServiceCategoria } from "../../../../services/categoriaService";
import Swal from "sweetalert2";

export const Categorias = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria | null>(null);
  const [mostrarNoActivas, setMostrarNoActivas] = useState(false);

  const categoriaService = new ServiceCategoria();

  const fetchCategorias = async () => {
    try {
      const data = await categoriaService.getCategorias(mostrarNoActivas);
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorias", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, [mostrarNoActivas]);

  const handleAdd = () => {
    setCategoriaActiva(null);
    setModalOpen(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setCategoriaActiva(categoria);
    setModalOpen(true);
  };

  const handleDelete = async (categoria: Categoria) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede revertir",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
      });

      if (result.isConfirmed) {
        await categoriaService.eliminarCategoria(categoria.id);
        await fetchCategorias();
        Swal.fire({
          title: "¡Eliminado!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al eliminar categoría", error);
    }
  };

  const handleEnable = async (categoria: Categoria) => {
    try {
      await categoriaService.habilitarCategoria(categoria.id);
      await fetchCategorias();
      Swal.fire({
        title: "¡Categoría activada!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error al activar categoría", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo activar la categoría.",
        icon: "error",
      });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCategoriaActiva(null);
  };

  const handleSubmit = async (categoria: Categoria) => {
    try {
      if (categoria.id) {
        await categoriaService.editarCategoria(categoria.id, {
          nombre: categoria.nombre,
          activo: categoria.activo,
        });
      } else {
        const { id, ...categoriaSinId } = categoria;
        await categoriaService.crearCategoria(categoriaSinId);
      }
      await fetchCategorias();
      setModalOpen(false);
    } catch (error) {
      console.error("Error al guardar categoría", error);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.toggleButton}
        onClick={() => setMostrarNoActivas((prev) => !prev)}
      >
        {mostrarNoActivas ? " Solo ver categorías activas" : "Ver categorías no activas"}
      </button>
      <AdminTable<Categoria>
        data={categorias}
        onAdd={handleAdd}
        onEdit={handleEdit}
        renderItem={(cat) => (
          <div className={styles.categoriaItem}>
            <p>
              <strong>Nombre:</strong> {cat.nombre}
            </p>
            <div className={styles.containerButtons}>
              {cat.activo ? (
                <span
                  onClick={() => handleDelete(cat)}
                  title="Eliminar categoría"
                  style={{ cursor: "pointer" }}
                >
                  <Trash2 size={22} />
                </span>
              ) : (
                <span
                  onClick={() => handleEnable(cat)}
                  title="Activar categoría"
                  style={{ cursor: "pointer", color: "#28a745" }}
                >
                  <CheckCircle2 size={22} />
                </span>
              )}
            </div>
          </div>
        )}
      />

      {modalOpen && (
        <ModalCrearEditarCategoria
          closeModal={handleCloseModal}
          onSubmit={handleSubmit}
          categoria={categoriaActiva}
        />
      )}
    </div>
  );
};