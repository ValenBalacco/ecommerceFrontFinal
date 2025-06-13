import React, { FC, useState } from "react";
import styles from "./ModalCrearEditarCategoria.module.css";
import { Categoria } from "../../../../types";
import Swal from "sweetalert2";

interface IProps {
  categoria?: Categoria | null;
  closeModal: () => void;
  onSubmit?: (categoria: Categoria) => void;
}

export const ModalCrearEditarCategoria: FC<IProps> = ({
  closeModal,
  categoria,
  onSubmit,
}) => {
  const [formState, setFormState] = useState<Omit<Categoria, "id">>({
    nombre: categoria?.nombre || "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (categoria?.id) {
        onSubmit?.({ ...formState, id: categoria.id });
        Swal.fire({
          title: "Categoría editada!",
          icon: "success",
        });
      } else {
        const newCategoria = { ...formState };
        onSubmit?.(newCategoria as Categoria);
        Swal.fire({
          title: "Categoría creada!",
          icon: "success",
        });
      }
      closeModal();
    } catch (error) {
      console.error("Error al guardar la categoria", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar la categoria.",
        icon: "error",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.titulo}>
          {categoria ? "Editar Categoria" : "Crear Categoria"}
        </h2>

        <form onSubmit={handleSubmit} className={styles.formulario}>
          <input
            className={styles.formInput}
            onChange={handleChange}
            type="text"
            name="nombre"
            value={formState.nombre}
            placeholder="Ingrese el nombre"
            required
          />
          <div className={styles.buttonContainer}>
            <button
              className={styles.cancelButton}
              type="button"
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