import { useEffect, useState } from "react";
import { ServiceOrdenCompra } from "../../../../services";
import { OrdenCompra } from "../../../../types";
import styles from "./Ordenes.module.css";

export const Ordenes = () => {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);

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
                <th>Descuento</th>
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
                    <span className={styles.descuento}>
                      {typeof orden.descuento === "number"
                        ? `${orden.descuento}%`
                        : "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};