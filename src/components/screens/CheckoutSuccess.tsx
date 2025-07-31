import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import styles from "./CheckoutStatus.module.css";
import { useCartStore } from "../../store/useCartStore";
import axios from "axios";
import { OrdenCompra } from "../../types"; // Ajusta el path si es necesario
const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vaciarCarrito = useCartStore((state) => state.vaciar);
  const [orden, setOrden] = useState<OrdenCompra | null>(null);
  const ordenEnviadaRef = useRef(false); // <-- bandera con useRef

  useEffect(() => {
    if (ordenEnviadaRef.current) return; // <-- evita doble envío

    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    if (status !== "approved") {
      navigate("/", { replace: true });
      return;
    }

    const checkoutDataRaw = localStorage.getItem("checkout_data");
    if (!checkoutDataRaw) {
      navigate("/", { replace: true });
      return;
    }

    const checkoutData = JSON.parse(checkoutDataRaw);
    const usuario = checkoutData.usuario;
    const direccionEnvio = checkoutData.direccionEnvio;
    const direccionEnvioId = direccionEnvio?.id ?? checkoutData.direccionEnvioId;

    interface ItemCheckoutData {
      productoId: number | string;
      detalleId: number | string;
      cantidad: number | string;
    }

    interface ItemOrden {
      productoId: number;
      detalleId: number;
      cantidad: number;
    }

    const itemsOrden: ItemOrden[] = (checkoutData.items || []).map((item: ItemCheckoutData): ItemOrden => ({
      productoId: Number(item.productoId),
      detalleId: Number(item.detalleId),
      cantidad: Number(item.cantidad),
    })).filter(
      (item: ItemOrden) =>
        !!item.productoId &&
        !!item.detalleId &&
        !isNaN(item.productoId) &&
        !isNaN(item.detalleId)
    );

    if (itemsOrden.length === 0) {
      return;
    }

    ordenEnviadaRef.current = true; // <-- marca como enviada

    axios
      .post(
        "http://localhost:3000/ordenes-compra",
        {
          direccionEnvioId: direccionEnvioId,
          items: itemsOrden,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data) {
          setOrden(res.data);
          vaciarCarrito();
          localStorage.removeItem("checkout_data");
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      })
      .catch((err) => {
        console.log("Error backend:", err.response?.data);
      });

  // Solo depende de location.search y navigate
  }, [location.search, navigate, vaciarCarrito]);

  return (
    <div className={styles.statusContainer + " " + styles.success}>
      <div className={styles.icon}>✅</div>
      <h1>¡Pago exitoso!</h1>
      <p>
        Tu pago fue procesado correctamente.<br />
        Gracias por tu compra.
      </p>
      {orden && (
        <div>
          <h2>Resumen de tu orden</h2>
          <p>Número de orden: {orden.id}</p>
          <p>Total: ${orden.total}</p>
         
        </div>
      )}
      <span className={styles.redirectMsg}>Redirigiendo a inicio...</span>
    </div>
  );
};

export default CheckoutSuccess;
