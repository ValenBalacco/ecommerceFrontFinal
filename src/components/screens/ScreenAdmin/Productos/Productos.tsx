import { useEffect, useState } from "react";
import styles from "./Productos.module.css";
import { Producto } from "../../../../types";
import { AdminTable } from "../../../ui/Tables/AdminTable/AdminTable";
import ModalCrearEditarFormAdmin from "../../../ui/Forms/ModalCrearEditarProducto/ModalCrearEditarProducto";
import { ServiceProducto } from "../../../../services/productService";
import { ModalCrearTalle } from "../../../ui/Forms/ModalCrearTalle/ModalCrearTalle";
import { Detalle } from "../../../../types";
import { ServiceDetalle } from "../../../../services";
import { ImagePlus, Pencil, Trash2 } from "lucide-react";
import { ModalCrearEditarDetalle } from "../../../ui/Forms/ModalCrearEditarDetalle/ModalCrearEditarDetalle";
import { ModalAgregarImagen } from "../../../ui/Forms/ModalAgregarImagen/ModalAgregarImagen";
import Swal from "sweetalert2";

export const Productos = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoActivo, setProductoActivo] = useState<Producto | null>(null);
  const [modalTalle, setModalTalle] = useState<boolean>(false);
  const [modalDetalle, setModalDetalle] = useState<boolean>(false);
  const [modalAddImagen, setModalAddImagen] = useState<boolean>(false);
  const [productoExpandido, setProductoExpandido] = useState<number | null>(null);
  const [detallesPorProducto, setDetallesPorProducto] = useState<Record<number, Detalle[]>>({});
  const [productoActivoDetalle, setProductoActivoDetalle] = useState<Producto | null>(null);
  const [detalleActivo, setDetalleActivo] = useState<Detalle | null>(null);
  const productoService = new ServiceProducto();
  const detalleService = new ServiceDetalle();

  const fetchProductos = async () => {
    try {
      const data = await productoService.getProductos();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos", error);
    }
  };

  useEffect(() => {
    fetchProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Cambiado: ahora filtra en frontend
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
      setProductoExpandido(null); // Si ya está expandido, cerrar
    } else {
      if (!detallesPorProducto[id]) {
        await getDetallesProductos(id); // Si no está cargado, traer detalles
      }
      setProductoExpandido(id);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (producto: Producto) => {
    try {
      if (producto.id) {
        await productoService.editarProducto(producto.id, {
          nombre: producto.nombre,
          categoriaId: producto.categoriaId, // solo enviar ID
          tipoProducto: producto.tipoProducto,
          sexo: producto.sexo,
        });
        setProductos((prev) =>
          prev.map((u) => (u.id === producto.id ? producto : u))
        );
      } else {
        const { id, categoria, detalles, itemsOrden, ...productoSinExtras } = producto;
        const nuevoProducto = await productoService.crearProducto({
          ...productoSinExtras,
          categoriaId: producto.categoriaId, // solo enviar ID
        });
        setProductos((prev) => [...prev, nuevoProducto]);
      }
      setModalOpen(false);
      fetchProductos(); // Para refrescar la lista después de crear/editar
    } catch (error) {
      console.error("Error al guardar el Producto", error);
    }
  };

  const handleCreateDetalle = (producto: Producto) => {
    setProductoActivoDetalle(producto);
    setModalDetalle(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerButtonsFunctions}>
        <button
          onClick={() => {
            setModalTalle(true);
          }}
        >
          Añadir Talle
        </button>
      </div>
      <AdminTable<Producto>
        data={productos}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onArrow={(producto) => toggleDetalle(producto.id)}
        onDelete={handleDelete}
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
      {/* Quita la paginación si no la necesitas */}
      {modalOpen && (
        <ModalCrearEditarFormAdmin
          closeModal={handleCloseModal}
          onSubmit={handleSubmit}
          producto={productoActivo}
        />
      )}
      {modalTalle && (
        <ModalCrearTalle
          closeModal={() => {
            setModalTalle(false);
          }}
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