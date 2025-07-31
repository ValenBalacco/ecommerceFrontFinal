import { FC, useState } from "react";
import styles from "./ModalAgregarImagen.module.css";
import { Detalle, Img } from "../../../../types";
import { Plus, Trash2 } from "lucide-react";
import { ModalDataImagen } from "../ModalDataImagen/ModalDataImagen";
import { ServiceImg } from "../../../../services";
import Swal from "sweetalert2";

interface IProps {
  closeModal: () => void;
  detalle: Detalle;
}

export const ModalAgregarImagen: FC<IProps> = ({ closeModal, detalle }) => {
  const [modal, setModal] = useState<boolean>(false);
  const [imagenes, setImagenes] = useState<Img[]>(detalle.imgs ?? []);
  const imgService = new ServiceImg();

  const handleDeleteImg = async (id: number) => {
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
        await imgService.eliminarImg(id);

        setImagenes((prev) => prev.filter((img) => img.id !== id));
        Swal.fire({
          title: "¡Eliminado!",
          icon: "success",
        });
      }
    } catch (error) {
      console.log("Error al eliminar imagen", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al eliminar la imagen.",
        icon: "error",
      });
    }
  };

  const cargarImagenes = async () => {
    try {
      const imgs = await imgService.obtenerImagenPorDetalle(detalle.id);
      setImagenes(imgs);
    } catch (error) {
      console.error("Error cargando imágenes", error);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Agregar Imagen</h2>
        <div className={styles.containerImagen}>
          {imagenes.map((imagen) => (
            <div key={imagen.id} className={styles.cuadroImagen}>
              <span
                onClick={() => handleDeleteImg(imagen.id)}
                className={styles.buttonDelete}
              >
                <Trash2 />
              </span>
            
              <img src={imagen.url} alt={imagen.url} />
            </div>
          ))}
          <div
            className={styles.cuadroImagen}
            onClick={() => setModal(true)}
            style={{ cursor: "pointer" }}
          >
            <span className={styles.addImg}>
              <Plus size={32} />
            </span>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={closeModal}
          >
            Cancelar
          </button>
        </div>
      </div>
      {modal && (
        <ModalDataImagen
          onImagenCreada={cargarImagenes}
          detalle={detalle}
          closeModal={() => setModal(false)}
        />
      )}
    </div>
  );
};