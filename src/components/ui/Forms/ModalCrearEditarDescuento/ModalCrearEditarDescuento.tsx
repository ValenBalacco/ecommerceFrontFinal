import { FC, useState, useEffect } from "react";
import styles from "./ModalCrearEditarDescuento.module.css";
import { Descuento } from "../../../../types";
import { ServiceDescuento } from "../../../../services/descuentoService";
import Swal from "sweetalert2";

interface IProps {
  closeModal: () => void;
  onSubmit: () => void;
  descuento?: Descuento | null;
}

export const ModalCrearEditarDescuento: FC<IProps> = ({
  closeModal,
  onSubmit,
  descuento,
}) => {
  const [formState, setFormState] = useState({
    porcentaje: descuento?.porcentaje ?? 0,
    fechaInicio: descuento
      ? new Date(descuento.fechaInicio).toISOString().slice(0, 10)
      : "",
    fechaFin: descuento
      ? new Date(descuento.fechaFin).toISOString().slice(0, 10)
      : "",
  });

  const serviceDescuento = new ServiceDescuento();

  useEffect(() => {
    if (descuento) {
      setFormState({
        porcentaje: descuento.porcentaje,
        fechaInicio: new Date(descuento.fechaInicio).toISOString().slice(0, 10),
        fechaFin: new Date(descuento.fechaFin).toISOString().slice(0, 10),
      });
    }
  }, [descuento]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "porcentaje" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
    
      !formState.fechaInicio ||
      !formState.fechaFin
    ) {
      Swal.fire("Error", "Completa todos los campos", "error");
      return;
    }
    if (new Date(formState.fechaFin) < new Date(formState.fechaInicio)) {
      Swal.fire("Error", "La fecha de fin debe ser posterior a la de inicio", "error");
      return;
    }
    try {
      if (descuento && descuento.id) {
        await serviceDescuento.editarDescuento(descuento.id, {
          porcentaje: formState.porcentaje,
          fechaInicio: new Date(formState.fechaInicio).toISOString(),
          fechaFin: new Date(formState.fechaFin).toISOString(),
        });
        Swal.fire("Editado", "Descuento editado correctamente", "success");
      } else {
        await serviceDescuento.crearDescuento({
          porcentaje: formState.porcentaje,
          fechaInicio: new Date(formState.fechaInicio).toISOString(),
          fechaFin: new Date(formState.fechaFin).toISOString(),
        });
        Swal.fire("Creado", "Descuento creado correctamente", "success");
      }
      onSubmit();
      closeModal();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el descuento", "error");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{descuento ? "Editar Descuento" : "Crear Descuento"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Porcentaje (%)</label>
            <input
              type="number"
              name="porcentaje"
              value={formState.porcentaje}
              onChange={handleChange}
              min={0}
              max={100}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Fecha de inicio</label>
            <input
              type="date"
              name="fechaInicio"
              value={formState.fechaInicio}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Fecha de fin</label>
            <input
              type="date"
              name="fechaFin"
              value={formState.fechaFin}
              onChange={handleChange}
              required
            />
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

export default ModalCrearEditarDescuento;