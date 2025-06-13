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
  const [url, setUrl] = useState<string>("");
  const imgService = new ServiceImg();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Solo enviar url y detalleId, no enviar detalle
      const payload = {
        url,
        detalleId: detalle.id,
      };

      await imgService.crearImg(payload);
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
            type="text"
            name="url"
            value={url}
            placeholder="Ingrese la URL de la imagen"
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