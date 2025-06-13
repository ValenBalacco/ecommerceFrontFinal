import { FC, useState } from "react";
import styles from "./ModalCrearTalle.module.css";
import { ServiceTalle } from "../../../../services/talleService";
import Swal from "sweetalert2";

interface IProps {
  closeModal: () => void;
}

export const ModalCrearTalle: FC<IProps> = ({ closeModal }) => {
  const [formState, setFormState] = useState<{ talle: string }>({
    talle: "",
  });

  const serviceTalle = new ServiceTalle();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await serviceTalle.crearTalle(formState);
      Swal.fire({
        title: "Talle creado!",
        icon: "success",
      });
      closeModal();
    } catch (error) {
      console.error("Error al crear Talle", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar el talle.",
        icon: "error",
      });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.titulo}>Crear Talle</h2>
        <form onSubmit={handleSubmit} className={styles.formulario}>
          <input
            className={styles.formInput}
            onChange={handleChange}
            type="text"
            name="talle"
            value={formState.talle}
            placeholder="Ingrese el talle"
            required
          />
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