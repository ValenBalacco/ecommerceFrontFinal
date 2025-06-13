import { useEffect, useState } from "react";
import styles from "./Usuarios.module.css";
import { Usuario } from "../../../../types";
import { AdminTable } from "../../../ui/Tables/AdminTable/AdminTable";
import { ModalCrearEditarUsuario } from "../../../ui/Forms/ModalCrearEditarUsuario/ModalCrearEditarUsuario";
import { ServiceUsuario } from "../../../../services/usuarioService";
import Swal from "sweetalert2";


export const Usuarios = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioActivo, setUsuarioActivo] = useState<Usuario | null>(null);
  const usuarioService = new ServiceUsuario();

  useEffect(() => {
    fetchUsuarios();

  }, []);

  const fetchUsuarios = async () => {
    try {
      const data = await usuarioService.getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios", error);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setUsuarioActivo(usuario);
    setModalOpen(true);
  };

  const handleDelete = async (usuario: Usuario) => {
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
        await usuarioService.eliminarUsuario(usuario.id!);
        await fetchUsuarios();
        Swal.fire({
          title: "¡Eliminado!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al eliminar usuario", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (usuario: Usuario) => {
    try {
      if (usuario.id) {
        await usuarioService.editarUsuario(usuario.id, {
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        });
        setUsuarios((prev) =>
          prev.map((u) => (u.id === usuario.id ? usuario : u))
        );
      } else {
        const { id, ...usuarioSinId } = usuario;
        const nuevoUsuario = await usuarioService.crearUsuario(usuarioSinId);
        setUsuarios((prev) => [...prev, nuevoUsuario]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error al guardar usuario", error);
    }
  };

  return (
    <div className={styles.container}>
      <AdminTable<Usuario>
        data={usuarios}
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderItem={(usuario) => (
          <div className={styles.item}>
            <p>
              <strong>Nombre:</strong> {usuario.nombre}
            </p>
            <p>
              <strong>Email:</strong> {usuario.email}
            </p>
            <p>
              <strong>Rol:</strong> {usuario.rol}
            </p>
          </div>
        )}
      />
  
      {modalOpen && (
        <ModalCrearEditarUsuario
          usuario={usuarioActivo}
          closeModal={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};