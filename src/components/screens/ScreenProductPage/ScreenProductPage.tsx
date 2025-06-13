import { useEffect, useState } from "react";
import Footer from "../../ui/Footer/Footer";
import Header from "../../ui/Header/Navbar";
import styles from "./ScreenProductPage.module.css";
import { useParams } from "react-router";
import { Detalle, Descuento } from "../../../types";
import { ServiceDetalle } from "../../../services";
import { useCartStore } from "../../../store/useCartStore";
import Swal from "sweetalert2";

const ScreenProductPage = () => {
  const { id } = useParams();
  const [cantidad, setCantidad] = useState<number>(1);
  const increment = () => setCantidad((prev) => (prev < 10 ? prev + 1 : prev));
  const decrement = () => setCantidad((prev) => (prev > 1 ? prev - 1 : prev));
  const [mainImage, setMainImage] = useState<string>("");
  const [talleSeleccionado, setTalleSeleccionado] = useState<number | null>(null);
  const [producto, setProducto] = useState<Detalle>();
  const detalleService = new ServiceDetalle();
  const { agregar } = useCartStore();
  const [descuentoActivo, setDescuentoActivo] = useState<boolean>(false);
  const [detallesProducto, setDetallesProducto] = useState<Detalle[]>([]);

  useEffect(() => {
    if (producto?.precios?.[0]) {
      setDescuentoActivo(isDescuentoActivo(producto.precios[0].descuento));
    }
  }, [producto]);

  useEffect(() => {
    if (producto?.producto?.id) {
      getDetallesPorProducto();
    }
  }, [producto]);

  useEffect(() => {
    getProductsByID();
  }, [id]);

  const getProductsByID = async () => {
    if (!id) return;
    const product = await detalleService.getDetalleById(parseInt(id));
    setProducto(product);
    if (product && Array.isArray(product.imgs) && product.imgs.length > 0 && product.imgs[0]?.url) {
      setMainImage(product.imgs[0].url);
    }
  };

  if (!producto || !producto.producto)
    return <h2 style={{ textAlign: "center" }}>Cargando producto...</h2>;

  function isDescuentoActivo(descuento: Descuento | undefined): boolean {
    if (!descuento) return false;
    const hoy = new Date();
    const fechaInicio = new Date(descuento.fechaInicio);
    const fechaFin = new Date(descuento.fechaFin);
    return hoy >= fechaInicio && hoy <= fechaFin;
  }

  function calcularDescuento(precioVenta: number, porcentajeDescuento: number) {
    if (porcentajeDescuento <= 0) {
      return precioVenta;
    }
    return precioVenta - precioVenta * (porcentajeDescuento / 100);
  }

  const getDetallesPorProducto = async () => {
    try {
      if (!producto || !producto.producto) return;
      const todosLosDetalles = await detalleService.getDetalles();
      const detalles = todosLosDetalles.filter(
        (detalle) => detalle.producto && detalle.producto.id === producto.producto.id
      );
      setDetallesProducto(detalles);
    } catch (error) {
      console.error("Error al obtener detalles del producto", error);
    }
  };

  return (
    <div className={styles.screenProductPage}>
      <Header />

      <div className={styles.productDetail}>
        <div className={styles.secondaryImage}>
          {producto.imgs &&
            producto.imgs.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Vista ${img ?? ""}`}
                className={styles.thumbnail}
                onClick={() => setMainImage(img.url)}
              />
            ))}
        </div>
        <div className={styles.mainImage}>
          <img src={mainImage} alt={producto.imgs?.[0] ?? "Imagen no disponible"} />
        </div>
        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{producto.producto?.nombre ?? "Producto sin nombre"}</h1>
          <p className={styles.productType}>
            <span>Tipo:</span> {producto.producto?.tipoProducto ?? "Sin tipo"}
          </p>
          <p className={styles.productCategory}>
            <span>Categoría:</span> {producto.producto?.categoria?.nombre ?? "Sin categoría"}
          </p>
          {producto.precios?.[0] ? (
            <>
              {descuentoActivo && producto.precios[0].descuento ? (
                <div className={styles.divDescuento}>
                  <p className={styles.precioConDescuento}>
                    ${calcularDescuento(
                      producto.precios[0].precioVenta,
                      producto.precios[0].descuento.porcentaje
                    ).toFixed(2)}
                  </p>
                  <p className={styles.precioTachado}>
                    ${producto.precios[0].precioVenta}
                  </p>
                  <p className={styles.totalDesacuento}>
                    {producto.precios[0].descuento.porcentaje}% OFF
                  </p>
                </div>
              ) : (
                <p className={styles.precioSinDescuento}>${producto.precios[0].precioVenta}</p>
              )}
            </>
          ) : (
            <p className={styles.precioNoDisponible}>Precio no disponible</p>
          )}
          <div>
            <h3 className={styles.tituloTalle}>Selecciona el talle</h3>
            <div className={styles.sizeGrid}>
              {detallesProducto.map((detalle) => (
                <button
                  key={detalle.id}
                  className={`${styles.sizeButton} ${
                    talleSeleccionado === detalle.talle.id
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => {
                    setTalleSeleccionado(detalle.talle.id);
                    setProducto(detalle);
                    if (detalle.imgs && detalle.imgs.length > 0) {
                      setMainImage(detalle.imgs[0].url);
                    }
                  }}
                >
                  {detalle.talle.talle}
                </button>
              ))}
            </div>
            <div className={styles.quantityContainer}>
              <span>Cantidad: {cantidad}</span>
              <div className={styles.quantityButtons}>
                <button onClick={increment}>+</button>
                <button onClick={decrement}>-</button>
              </div>
            </div>
            <div className={styles.addToCartButton}>
              <button
                onClick={() => {
                  if (!producto || !producto.precios?.[0]) {
                    Swal.fire({
                      icon: "warning",
                      title: "Talle no válido",
                      text: "Debes seleccionar un talle válido",
                    });
                    return;
                  }
                  const precioBase = producto.precios[0].precioVenta;
                  const descuento = producto.precios[0].descuento?.porcentaje ?? 0;
                  const precioFinal = calcularDescuento(
                    precioBase,
                    descuento
                  );

                  agregar({
                    detalleId: producto.id!,
                    nombre: producto.producto?.nombre ?? "Sin nombre",
                    imagen: producto.imgs?.[0]?.url || "",
                    precio: precioFinal,
                    precioVenta: precioBase,
                    descuento: descuento,
                    talle: producto.talle?.talle ?? "",
                    cantidad,
                  });

                  Swal.fire({
                    icon: "success",
                    title: "Agregado al carrito",
                    text: "Producto agregado al carrito",
                    timer: 1000,
                    showConfirmButton: false,
                  });
                }}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ScreenProductPage;