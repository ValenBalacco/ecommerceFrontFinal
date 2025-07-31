import { FC, useState } from "react";
import styles from "./ModalDataImagen.module.css";
import { ServiceImg } from "../../../../services";
import { Detalle } from "../../../../types";
import Swal from "sweetalert2";

interface IProps {
  closeModal: () => void;
  detalle: Detalle;
  onImagenCreada: () => void;
}

export const ModalDataImagen: FC<IProps> = ({
  closeModal,
  detalle,
  onImagenCreada,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const imgService = new ServiceImg();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      await imgService.crearImgConCloudinary(file, detalle.id);
      Swal.fire({
        title: "Imagen Añadida!",
        icon: "success",
      });
      closeModal();
      onImagenCreada();
    } catch (error: any) {
      console.error("Error al crear imagen", error);
      Swal.fire({
        title: "Error",
        text:
          error?.response?.data?.error ||
          "Hubo un problema al guardar Imagen.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.titulo}>Agregar Imagen</h2>
        <form onSubmit={handleSubmit} className={styles.formulario}>
          <input
            className={styles.formInput}
            onChange={handleChange}
            type="file"
            name="file"
            accept="image/*"
            required
          />
          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={closeModal}
              disabled={loading}
            >
              Cancelar
            </button>
            <button className={styles.submitButton} type="submit" disabled={loading}>
              {loading ? "Subiendo..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};