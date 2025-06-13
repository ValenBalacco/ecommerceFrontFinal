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

  const categoriaService = new ServiceCategoria();

  useEffect(() => {
    fetchCategorias();
   
  }, []);

  const fetchCategorias = async () => {
    try {
      const data = await categoriaService.getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorias", error);
    }
  };

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

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (categoria: Categoria) => {
    try {
      if (categoria.id) {
        await categoriaService.editarCategoria(categoria.id, {
          nombre: categoria.nombre,
        });
      } else {
        const { id, ...categoriaSinId } = categoria;
        await categoriaService.crearCategoria(categoriaSinId);
      }
      fetchCategorias();
      setModalOpen(false);
    } catch (error) {
      console.error("Error al guardar categoría", error);
    }
  };

  return (
    <div className={styles.container}>
      <AdminTable<Categoria>
        data={categorias}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderItem={(cat) => (
          <p>
            <strong>Nombre:</strong> {cat.nombre}
          </p>
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