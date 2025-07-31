import { useEffect, useState } from "react";
import styles from "./Descuentos.module.css";
import { Descuento } from "../../../../types";
import { AdminTable } from "../../../ui/Tables/AdminTable/AdminTable";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
// Suponiendo que tienes un servicio para descuentos:
import { ServiceDescuento } from "../../../../services/descuentoService";
import ModalCrearEditarDescuento from "../../../ui/Forms/ModalCrearEditarDescuento/ModalCrearEditarDescuento";

export const Descuentos = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);
  const [descuentoActivo, setDescuentoActivo] = useState<Descuento | null>(null);
  const [mostrarNoVigentes, setMostrarNoVigentes] = useState(false);

  const descuentoService = new ServiceDescuento();

  const fetchDescuentos = async () => {
    try {
      const data = await descuentoService.getDescuentos();
      setDescuentos(data);
    } catch (error) {
      console.error("Error al cargar descuentos", error);
    }
  };

  useEffect(() => {
    fetchDescuentos();
  }, []);

  const handleAdd = () => {
    setDescuentoActivo(null);
    setModalOpen(true);
  };

  const handleEdit = (descuento: Descuento) => {
    setDescuentoActivo(descuento);
    setModalOpen(true);
  };

  const handleDelete = async (descuento: Descuento) => {
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
        await descuentoService.eliminarDescuento(descuento.id);
        await fetchDescuentos();
        Swal.fire({
          title: "¡Eliminado!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al eliminar descuento", error);
    }
  };

  // Filtrar descuentos según vigencia
  const hoy = new Date();
  const descuentosFiltrados = descuentos.filter((d) => {
    if (mostrarNoVigentes) {
      return hoy < new Date(d.fechaInicio) || hoy > new Date(d.fechaFin);
    }
    return hoy >= new Date(d.fechaInicio) && hoy <= new Date(d.fechaFin);
  });

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button
          className={styles.toggleButton}
          onClick={() => setMostrarNoVigentes((prev) => !prev)}
        >
          {mostrarNoVigentes ? "Ver descuentos vigentes" : "Ver descuentos no vigentes"}
        </button>
      </div>
      <AdminTable<Descuento>
        data={descuentosFiltrados}
        onAdd={handleAdd}
        onEdit={handleEdit}
        renderItem={(descuento) => (
          <div key={descuento.id} className={styles.item}>
            <div>
              <p>
                <strong>{descuento.porcentaje}%</strong>
              </p>
              <p>
                <span>Desde: <b>{new Date(descuento.fechaInicio).toLocaleDateString()}</b></span><br />
                <span>Hasta: <b>{new Date(descuento.fechaFin).toLocaleDateString()}</b></span>
              </p>
              {hoy < new Date(descuento.fechaInicio) && (
                <span className={styles.inactiveLabel}>No vigente (futuro)</span>
              )}
              {hoy > new Date(descuento.fechaFin) && (
                <span className={styles.inactiveLabel}>No vigente (finalizado)</span>
              )}
            </div>
            <div className={styles.containerButtons}>
             
              <span
                onClick={() => handleDelete(descuento)}
                title="Eliminar descuento"
                style={{ cursor: "pointer" }}
              >
                <Trash2 size={22} />
              </span>
            </div>
          </div>
        )}
      />
      {modalOpen && (
        <ModalCrearEditarDescuento
          closeModal={() => setModalOpen(false)}
          onSubmit={fetchDescuentos}
          descuento={descuentoActivo}
        />
      )}
    </div>
  );
};