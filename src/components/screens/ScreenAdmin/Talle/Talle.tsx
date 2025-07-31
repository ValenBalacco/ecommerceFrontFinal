import { useEffect, useState } from "react";
import styles from "./Talle.module.css";
import { ModalCrearTalle } from "../../../ui/Forms/ModalCrearTalle/ModalCrearTalle";
import { Talle } from "../../../../types";
import { AdminTable } from "../../../ui/Tables/AdminTable/AdminTable";
import { ServiceTalle } from "../../../../services/talleService";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react"; // Agrega este import arriba

export const Talles = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [talles, setTalles] = useState<Talle[]>([]);
  const [talleActivo, setTalleActivo] = useState<Talle | null>(null);

  const talleService = new ServiceTalle();

  useEffect(() => {
    fetchTalles();
  }, []);

  const fetchTalles = async () => {
    try {
      const data = await talleService.getTalles();
      setTalles(data);
    } catch (error) {
      console.error("Error al cargar talles", error);
    }
  };

  const handleAdd = () => {
    setTalleActivo(null);
    setModalOpen(true);
  };

  const handleDelete = async (talle: Talle) => {
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
        await talleService.eliminarTalle(talle.id);
        await fetchTalles();
        Swal.fire({
          title: "¡Eliminado!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al eliminar talle", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (talle: Talle) => {
    try {
      if (talle.id) {
        await talleService.editarTalle(talle.id, {
          talle: talle.talle,
        });
      } else {
        const { id, ...talleSinId } = talle;
        await talleService.crearTalle(talleSinId);
      }
      await fetchTalles(); // <-- actualiza la lista antes de cerrar el modal
      setModalOpen(false);
    } catch (error) {
      console.error("Error al guardar talle", error);
    }
  };

  return (
    <div className={styles.container}>
      <AdminTable<Talle>
        data={talles}
        onAdd={handleAdd}
        // Quitar onEdit para eliminar el botón de edición
        onDelete={handleDelete}
        renderItem={(t) => (
          <div className={styles.talleItem}>
            <span className={styles.talleLabel}>{t.talle}</span>
         
          </div>
        )}
      />

      {modalOpen && (
        <ModalCrearTalle
          closeModal={handleCloseModal}
          onSubmit={handleSubmit}
          talle={talleActivo}
        />
      )}
    </div>
  );
};