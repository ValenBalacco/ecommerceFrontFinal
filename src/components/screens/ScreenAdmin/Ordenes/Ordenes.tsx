import { useEffect, useState } from "react";
import { ServiceOrdenCompra } from "../../../../services";
import { OrdenCompra } from "../../../../types";
import styles from "./Ordenes.module.css";

export const Ordenes = () => {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenCompra | null>(null);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const service = new ServiceOrdenCompra();
        const data = await service.getOrdenes();
        setOrdenes(data);
      } catch (error) {
        console.error("Error al cargar órdenes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdenes();
  }, []);

  const handleVerDetalle = (orden: OrdenCompra) => {
    setOrdenSeleccionada(orden);
   
  };

  return (
    <div className={styles.ordenesContainer}>
      <h2 className={styles.title}>Órdenes de Compra</h2>
      {loading ? (
        <div className={styles.loader}>Cargando...</div>
      ) : ordenes.length === 0 ? (
        <p className={styles.emptyMsg}>No hay órdenes registradas.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.ordenesTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id}>
                  <td>{orden.id}</td>
                  <td>{orden.usuario?.nombre}</td>
                  <td>{orden.usuario?.email}</td>
                  <td>
                    {orden.fechaCompra
                      ? new Date(orden.fechaCompra).toLocaleString()
                      : ""}
                  </td>
                  <td>
                    <span className={styles.price}>
                      ${orden.total?.toFixed(2) ?? "0.00"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.detalleBtn}
                      onClick={() => handleVerDetalle(orden)}
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {ordenSeleccionada && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Detalle de la Orden #{ordenSeleccionada.id}</h3>
            <p><strong>Usuario:</strong> {ordenSeleccionada.usuario?.nombre} ({ordenSeleccionada.usuario?.email})</p>
            <p><strong>Fecha:</strong> {ordenSeleccionada.fechaCompra ? new Date(ordenSeleccionada.fechaCompra).toLocaleString() : ""}</p>
            <p><strong>Total:</strong> ${ordenSeleccionada.total?.toFixed(2) ?? "0.00"}</p>
            <hr />
            <h4>Dirección de Envío</h4>
            <p>
              {ordenSeleccionada.direccionEnvio && ordenSeleccionada.direccionEnvio.direccion ? (
                <>
                  {ordenSeleccionada.direccionEnvio.direccion.localidad}, {ordenSeleccionada.direccionEnvio.direccion.provincia}, {ordenSeleccionada.direccionEnvio.direccion.pais}, {ordenSeleccionada.direccionEnvio.direccion.departamento}, CP: {ordenSeleccionada.direccionEnvio.direccion.codigoPostal}
                </>
              ) : (
                "Sin dirección"
              )}
            </p>
            <hr />
            <h4>Productos</h4>
            <ul>
              {ordenSeleccionada.items?.map((item) => (
                <li key={item.id}>
                  <strong>{item.producto?.nombre ?? "Sin nombre"}</strong> - 
                  Cantidad: {item.cantidad} - 
                  Color: {item.detalle?.color ?? "Sin color"} - 
                  Talle: {item.detalle?.talle?.talle ?? "Sin talle"}
                </li>
              ))}
            </ul>
            <button
              className={styles.detalleBtn}
              onClick={() => setOrdenSeleccionada(null)}
              style={{ marginTop: 16 }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};