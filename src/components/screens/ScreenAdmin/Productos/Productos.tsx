import { useEffect, useState } from "react";
import styles from "./Productos.module.css";
import { Producto } from "../../../../types";
import { AdminTable } from "../../../ui/Tables/AdminTable/AdminTable";
import ModalCrearEditarFormAdmin from "../../../ui/Forms/ModalCrearEditarProducto/ModalCrearEditarProducto";
import { ServiceProducto } from "../../../../services/productService";
import { Detalle } from "../../../../types";
import { ServiceDetalle } from "../../../../services";
import { ImagePlus, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { ModalCrearEditarDetalle } from "../../../ui/Forms/ModalCrearEditarDetalle/ModalCrearEditarDetalle";
import { ModalAgregarImagen } from "../../../ui/Forms/ModalAgregarImagen/ModalAgregarImagen";
import Swal from "sweetalert2";

export const Productos = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoActivo, setProductoActivo] = useState<Producto | null>(null);
  const [modalDetalle, setModalDetalle] = useState<boolean>(false);
  const [modalAddImagen, setModalAddImagen] = useState<boolean>(false);
  const [productoExpandido, setProductoExpandido] = useState<number | null>(null);
  const [detallesPorProducto, setDetallesPorProducto] = useState<Record<number, Detalle[]>>({});
  const [productoActivoDetalle, setProductoActivoDetalle] = useState<Producto | null>(null);
  const [detalleActivo, setDetalleActivo] = useState<Detalle | null>(null);
  const [mostrarNoActivos, setMostrarNoActivos] = useState(false); // NUEVO ESTADO
  const productoService = new ServiceProducto();
  const detalleService = new ServiceDetalle();

  const fetchProductos = async () => {
    try {
      // Pide todos los productos si mostrarNoActivos es true
      const data = await productoService.getProductos(mostrarNoActivos);
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos", error);
    }
  };

  useEffect(() => {
    fetchProductos();
    // Agrega mostrarNoActivos como dependencia para recargar cuando cambie el filtro
  }, [mostrarNoActivos]);

  const handleAdd = () => {
    setProductoActivo(null);
    setModalOpen(true);
  };

  const handleEdit = (producto: Producto) => {
    setProductoActivo(producto);
    setModalOpen(true);
  };

  const handleDelete = async (producto: Producto) => {
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
        await productoService.eliminarProducto(producto.id);
        await fetchProductos();
        Swal.fire({
          title: "¡Eliminado!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al eliminar producto", error);
    }
  };

  const handleEnable = async (producto: Producto) => {
    try {
      await productoService.habilitarProducto(producto.id);
      await fetchProductos();
      Swal.fire({
        title: "¡Producto activado!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error al activar producto", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo activar el producto.",
        icon: "error",
      });
    }
  };

  const handleDeleteDetalle = async (detalle: Detalle) => {
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
        await detalleService.eliminarDetalle(detalle.id!);
        await getDetallesProductos(detalle.producto.id);
        Swal.fire({
          title: "¡Eliminado!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al eliminar detalle del producto", error);
    }
  };

  const getDetallesProductos = async (productoId: number) => {
    try {
      const todosLosDetalles = await detalleService.getDetalles();
      const detalles = todosLosDetalles.filter(
        (detalle) => detalle.producto && detalle.producto.id === productoId
      );
      setDetallesPorProducto((prev) => ({ ...prev, [productoId]: detalles }));
    } catch (error) {
      console.error("Error al cargar detalles del producto", error);
    }
  };

  const handleRefreshDetalles = async (productoId: number) => {
    await getDetallesProductos(productoId);
  };

  const toggleDetalle = async (id: number) => {
    if (productoExpandido === id) {
      setProductoExpandido(null);
    } else {
      if (!detallesPorProducto[id]) {
        await getDetallesProductos(id);
      }
      setProductoExpandido(id);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (
    producto: Omit<Producto, "detalles" | "itemsOrden" | "categoria" | "id"> & { id?: number }
  ) => {
    try {
      // Si producto tiene id, es edición; si no, es creación
      if (producto.id) {
        await productoService.editarProducto(producto.id, {
          nombre: producto.nombre,
          categoriaId: producto.categoriaId,
          tipoProducto: producto.tipoProducto,
          sexo: producto.sexo,
        });
        setProductos((prev) =>
          prev.map((u) => (u.id === producto.id ? { ...u, ...producto } : u))
        );
      } else {
        const nuevoProducto = await productoService.crearProducto({
          ...producto,
          categoriaId: producto.categoriaId,
        });
        setProductos((prev) => [...prev, nuevoProducto]);
      }
      setModalOpen(false);
      fetchProductos();
    } catch (error) {
      console.error("Error al guardar el Producto", error);
    }
  };

  const handleCreateDetalle = (producto: Producto) => {
    setProductoActivoDetalle(producto);
    setModalDetalle(true);
  };

  // Filtrar productos según el estado mostrarNoActivos
  const productosFiltrados = productos.filter((p) =>
    mostrarNoActivos ? !p.activo : p.activo
  );

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button
          className={styles.toggleButton}
          onClick={() => setMostrarNoActivos((prev) => !prev)}
        >
          {mostrarNoActivos ? "Ver productos activos" : "Ver productos no activos"}
        </button>
      </div>
      <AdminTable<Producto>
        data={productosFiltrados}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onArrow={(producto) => toggleDetalle(producto.id)}
        onAddItem={handleCreateDetalle}
        expandedId={productoExpandido}
        renderItem={(producto) => (
          <div
            key={producto.id}
            className={`${styles.item} ${
              productoExpandido === producto.id ? styles.expanded : ""
            }`}
          >
            <div className={styles.dd}>
              <div>
                <p>
                  <strong>{producto.nombre}</strong>
                </p>
                <p>
                  {producto.tipoProducto} | Categoría:{" "}
                  {producto.categoria?.nombre || "Sin categoría"}
                </p>
                {!producto.activo && (
                  <span className={styles.inactiveLabel}>No activo</span>
                )}
              </div>
              <div className={styles.containerButtons}>
                {producto.activo ? (
                  <span
                    onClick={() => handleDelete(producto)}
                    title="Eliminar producto"
                    style={{ cursor: "pointer" }}
                  >
                    <Trash2 size={22} />
                  </span>
                ) : (
                  <span
                    onClick={() => handleEnable(producto)}
                    title="Activar producto"
                    style={{ cursor: "pointer", color: "#28a745" }}
                  >
                    <CheckCircle2 size={22} />
                  </span>
                )}
              </div>
            </div>
            {productoExpandido === producto.id && (
              <div className={styles.detalleContainer}>
                {detallesPorProducto[producto.id] ? (
                  detallesPorProducto[producto.id].length > 0 ? (
                    detallesPorProducto[producto.id].map((detalle) => (
                      <div key={detalle.id} className={styles.detalleItem}>
                        <p>Talle: {detalle.talle?.talle}</p>
                        <p>Stock: {detalle.stock}</p>
                        <p>Color: {detalle.color}</p>
                        <div className={styles.containerButtons}>
                          <span
                            onClick={() => {
                              setDetalleActivo(detalle);
                              setModalAddImagen(true);
                            }}
                          >
                            <ImagePlus size={22} />
                          </span>
                          <span
                            onClick={() => {
                              setProductoActivoDetalle(producto);
                              setDetalleActivo(detalle);
                              setModalDetalle(true);
                            }}
                          >
                            <Pencil size={22} />
                          </span>
                          <span
                            onClick={() => {
                              handleDeleteDetalle(detalle);
                            }}
                          >
                            <Trash2 size={22} />
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.text}>
                      No hay detalles para este producto
                    </p>
                  )
                ) : (
                  <p>Cargando detalles...</p>
                )}
              </div>
            )}
          </div>
        )}
      />
      {modalOpen && (
        <ModalCrearEditarFormAdmin
          closeModal={handleCloseModal}
          onSubmit={handleSubmit}
          producto={productoActivo}
        />
      )}
      {modalDetalle && productoActivoDetalle && (
        <ModalCrearEditarDetalle
          closeModal={() => {
            setModalDetalle(false);
            setProductoActivoDetalle(null);
            setDetalleActivo(null);
          }}
          producto={productoActivoDetalle}
          detalle={detalleActivo}
          onSubmit={async () => {
            await handleRefreshDetalles(productoActivoDetalle!.id);
          }}
        />
      )}
      {modalAddImagen && (
        <ModalAgregarImagen
          detalle={detalleActivo!}
          closeModal={async () => {
            setModalAddImagen(false);
            if (detalleActivo?.producto.id) {
              await getDetallesProductos(detalleActivo.producto.id);
            }
          }}
        />
      )}
    </div>
  );
};
