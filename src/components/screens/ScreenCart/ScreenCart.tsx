import { useCartStore } from "../../../store/useCartStore";
import Footer from "../../ui/Footer/Footer";
import Header from "../../ui/Header/Navbar";
import { Trash2 } from "lucide-react";
import styles from "./ScreenCart.module.css";
import { ServiceDetalle } from "../../../services";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DireccionesCliente from "../../ui/DireccionesCliente/DireccionesCliente";
import ModalAgregarDireccion from "../../ui/ModalAgregarDireccion/ModalAgregarDireccion";
import { handlePagar } from "../../../services/mercadoPagoService";
import { mapCartItemsToMercadoPago } from "../../../helpers/mapCartItemsToMercadoPago";
import { isDescuentoActivo, calcularDescuento } from "../../../helpers/descuentos";

const detalleService = new ServiceDetalle();

export const ScreenCart = () => {
  const { items, eliminar, total, cambiarCantidad } = useCartStore();
  const [stockMap, setStockMap] = useState<Record<number, number>>({});
  const [direccionSeleccionadaId, setDireccionSeleccionadaId] = useState<number | null>(null);
  const [mostrarModalDireccion, setMostrarModalDireccion] = useState(false);
  const [recargarDirecciones, setRecargarDirecciones] = useState(false);

  // Forma segura de obtener el usuario desde localStorage
  let usuario: any = null;
  const rawUsuario = localStorage.getItem("usuario");
  if (rawUsuario && rawUsuario !== "undefined") {
    try {
      usuario = JSON.parse(rawUsuario);
    } catch (e) {
      usuario = null;
      localStorage.removeItem("usuario");
    }
  }

  const totalCantidad = items.reduce((acc, p) => acc + p.cantidad, 0);

  const handlePagarUnificado = async () => {
    if (direccionSeleccionadaId === null) {
      Swal.fire("Dirección requerida", "Debés seleccionar una dirección de envío", "warning");
      return;
    }

    try {
      const detalles = await Promise.all(
        items.map((item) => detalleService.getDetalleById(item.detalleId))
      );

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const detalle = detalles[i];
        if (detalle.stock < item.cantidad) {
          Swal.fire(
            "Stock insuficiente",
            `No hay suficiente stock para "${item.nombre}". Stock disponible: ${detalle.stock}`,
            "warning"
          );
          return;
        }
      }

      Swal.fire({
        title: "Redirigiendo a Mercado Pago...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // Guarda los datos necesarios en localStorage ANTES de redirigir
      localStorage.setItem("checkout_data", JSON.stringify({
        items: items.map(item => ({
          productoId: item.productoId, // <-- obligatorio
          detalleId: item.detalleId,
          cantidad: item.cantidad,
        })),
        direccionEnvioId: direccionSeleccionadaId,
        usuario: usuario,
      }));

      await handlePagar(mapCartItemsToMercadoPago(items), direccionSeleccionadaId);
    } catch (err) {
      console.error("Error al iniciar el pago:", err);
      Swal.fire("Error", "No se pudo iniciar el pago con Mercado Pago", "error");
    }
  };

  useEffect(() => {
    const fetchStocks = async () => {
      const stocks: Record<number, number> = {};
      for (const item of items) {
        const detalle = await detalleService.getDetalleById(item.detalleId);
        stocks[item.detalleId] = detalle.stock;
      }
      setStockMap(stocks);
    };

    if (items.length > 0) {
      fetchStocks();
    }
  }, [items]);

  const handleDireccionAgregada = () => {
    setRecargarDirecciones(true);
  };

  return (
    <div className={styles.contenedor}>
      <Header />
      <main className={styles.main}>
        <div className={styles.contenedorPrincipal}>
          <div className={styles.contenedorProductos}>
            <h1 className={styles.titulo}>Tu carrito</h1>
            <h3 className={styles.subtitulo}>
              {totalCantidad === 0
                ? "Aún no hay productos en tu carrito"
                : `Cantidad de productos: ${totalCantidad}`}
            </h3>

            {items.map((producto) => {
              const precioBase = producto.precioVenta ?? producto.precio ?? 0;
              const descuento = producto.descuento;
              const descuentoActivo =
                descuento && typeof descuento === "object" && isDescuentoActivo(descuento);
              const porcentaje =
                typeof descuento === "object" && descuento !== null && "porcentaje" in descuento
                  ? (descuento as { porcentaje: number }).porcentaje ?? 0
                  : 0;
              const precioFinal = descuentoActivo && porcentaje > 0
                ? calcularDescuento(precioBase, porcentaje)
                : precioBase;

              return (
                <div key={producto.detalleId} className={styles.cardProducto}>
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className={styles.imagen}
                  />

                  <div className={styles.infoProducto}>
                    <p className={styles.nombre}>{producto.nombre}</p>
                    {producto.talle && (
                      <p className={styles.talle}>Talle: {producto.talle}</p>
                    )}
                  </div>

                  <div className={styles.cantidadProducto}>
                    <div className={styles.simpleContador}>
                      <button
                        className={styles.simpleBoton}
                        onClick={() =>
                          cambiarCantidad(
                            producto.detalleId,
                            Math.max(1, producto.cantidad - 1)
                          )
                        }
                      >
                        −
                      </button>
                      <span className={styles.simpleValor}>
                        {producto.cantidad}
                      </span>
                      <button
                        className={styles.simpleBoton}
                        onClick={() =>
                          cambiarCantidad(
                            producto.detalleId,
                            producto.cantidad + 1
                          )
                        }
                        disabled={
                          producto.cantidad >= (stockMap[producto.detalleId] ?? Infinity)
                        }
                      >
                        ＋
                      </button>
                    </div>
                    {producto.cantidad >= (stockMap[producto.detalleId] ?? Infinity) && (
                      <span className={styles.simpleWarningInline}>
                        Stock máx: {stockMap[producto.detalleId]}
                      </span>
                    )}
                  </div>

                  <div className={styles.precioProducto}>
                    {descuentoActivo && porcentaje > 0 ? (
                      <>
                        <span className={styles.precioTachado}>${precioBase.toFixed(2)}</span>
                        <span className={styles.precioConDescuento}>${precioFinal.toFixed(2)}</span>
                        <span className={styles.descuentoBadge}>{porcentaje}% OFF</span>
                      </>
                    ) : (
                      <span>${precioBase.toFixed(2)}</span>
                    )}
                  </div>

                  <button
                    onClick={() => eliminar(producto.detalleId)}
                    className={styles.botonEliminar}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className={styles.resumen}>
            <h2 className={styles.resumenTitulo}>Resumen de compra</h2>

            <div className={styles.resumenItem}>
              <span>Productos ({items.length})</span>
              <span>${total().toFixed(2)}</span>
            </div>

            <hr className={styles.linea} />

            <div className={styles.resumenTotal}>
              <span>Total</span>
              <span>${total().toFixed(2)}</span>
            </div>

            <DireccionesCliente
              usuario={usuario}
              direccionSeleccionadaId={direccionSeleccionadaId}
              setDireccionSeleccionadaId={setDireccionSeleccionadaId}
              onAgregarDireccionClick={() => setMostrarModalDireccion(true)}
              recargar={recargarDirecciones}
            />

            <button
              className={styles.botonConfirmar}
              onClick={handlePagarUnificado}
              disabled={items.length === 0}
            >
              Continuar compra
            </button>
          </div>
        </div>
      </main>
      <Footer />
      {mostrarModalDireccion && (
        <ModalAgregarDireccion
          usuario={usuario}
          onDireccionAgregada={handleDireccionAgregada}
          onClose={() => {
            setMostrarModalDireccion(false);
            setRecargarDirecciones(true);
            setTimeout(() => setRecargarDirecciones(false), 200);
          }}
        />
      )}
    </div>
  );
};