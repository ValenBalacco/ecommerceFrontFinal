import { useEffect, useState } from "react";
import Footer from "../../ui/Footer/Footer";
import Header from "../../ui/Header/Navbar";
import styles from "./ScreenProductPage.module.css";
import { useParams } from "react-router";
import { Detalle } from "../../../types";
import { ServiceDetalle } from "../../../services";
import { useCartStore } from "../../../store/useCartStore";
import Swal from "sweetalert2";
import { isDescuentoActivo, calcularDescuento } from "../../../helpers/descuentos"; // ajusta el path

const ScreenProductPage = () => {
  const { id } = useParams();
  const [cantidad, setCantidad] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string>("");
  const [talleSeleccionado, setTalleSeleccionado] = useState<number | null>(null);
  const [producto, setProducto] = useState<Detalle>();
  const detalleService = new ServiceDetalle();
  const { agregar, items } = useCartStore(); 
  const [detallesProducto, setDetallesProducto] = useState<Detalle[]>([]);
  const [colorSeleccionado, setColorSeleccionado] = useState<string>("");

 
  useEffect(() => {
    getProductsByID();
   
  }, [id]);

  
  useEffect(() => {
    if (producto?.producto?.id) {
      getDetallesPorProducto();
    }
 
  }, [producto]);

  const getProductsByID = async () => {
    if (!id) return;
    const product = await detalleService.getDetalleById(parseInt(id));
    setProducto(product);
    if (product && Array.isArray(product.imgs) && product.imgs.length > 0 && product.imgs[0]?.url) {
      setMainImage(product.imgs[0].url);
    }
  };

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

  const detallesPorColor: Record<string, Detalle[]> = {};
  detallesProducto.forEach((detalle) => {
    if (!detalle.color) return;
    if (!detallesPorColor[detalle.color]) detallesPorColor[detalle.color] = [];
    detallesPorColor[detalle.color].push(detalle);
  });
  const coloresDisponibles = Object.keys(detallesPorColor);


  const tallesDisponibles = colorSeleccionado
    ? detallesPorColor[colorSeleccionado].map((d) => d.talle?.talle).filter(Boolean)
    : [];

  
  const detalleSeleccionado = detallesProducto.find(
    (d) =>
      d.color === colorSeleccionado &&
      d.id === talleSeleccionado
  );

  
  const precioDetalle = detalleSeleccionado?.precios?.[0]?.precioVenta ?? 0;
  const descuentoDetalle = detalleSeleccionado?.precios?.[0]?.descuento;
  const descuentoActivoDetalle = isDescuentoActivo(descuentoDetalle);
  const porcentajeDescuento = descuentoDetalle?.porcentaje ?? 0;
  const precioFinal = descuentoActivoDetalle
    ? calcularDescuento(precioDetalle, porcentajeDescuento)
    : precioDetalle;

  const stockMaximo = detalleSeleccionado?.stock ?? 1;

  
  const increment = () =>
    setCantidad((prev) => (prev < stockMaximo ? prev + 1 : prev));
  const decrement = () =>
    setCantidad((prev) => (prev > 1 ? prev - 1 : prev));

  
  useEffect(() => {
    setCantidad(1);
  }, [detalleSeleccionado]);

  const cantidadEnCarrito = items.find(i => i.detalleId === detalleSeleccionado?.id)?.cantidad ?? 0;

  if (!producto || !producto.producto)
    return <h2 style={{ textAlign: "center" }}>Cargando producto...</h2>;

  return (
    <div className={styles.screenProductPage}>
      <Header />
      <div className={styles.productDetail}>
        <div className={styles.secondaryImage}>
          {(detalleSeleccionado?.imgs ?? producto.imgs)?.map((img, index) => (
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
          <img src={mainImage} alt={producto.imgs?.[0]?.url ?? "Imagen no disponible"} />
        </div>
        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{producto.producto?.nombre ?? "Producto sin nombre"}</h1>
          <p className={styles.productType}>
            <span>Tipo:</span> {producto.producto?.tipoProducto ?? "Sin tipo"}
          </p>
          <p className={styles.productCategory}>
            <span>Categoría:</span> {producto.producto?.categoria?.nombre ?? "Sin categoría"}
          </p>
         
          <div>
            <h3 className={styles.tituloColor}>Selecciona el color</h3>
            <div className={styles.colorGrid}>
              {coloresDisponibles.map((color) => (
                <button
                  key={color}
                  className={`${styles.colorButton} ${
                    colorSeleccionado === color ? styles.selectedColor : ""
                  }`}
                  style={{ borderColor: colorSeleccionado === color ? "#333" : "#ccc" }}
                  onClick={() => {
                    setColorSeleccionado(color);
                    setTalleSeleccionado(null);
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className={styles.tituloTalle}>Selecciona el talle</h3>
            <div className={styles.sizeGrid}>
              {tallesDisponibles.map((talle) => {
                const detalle = detallesPorColor[colorSeleccionado].find((d) => d.talle?.talle === talle);
                return (
                  <button
                    key={talle}
                    className={`${styles.sizeButton} ${
                      detalle && talleSeleccionado === detalle.id ? styles.selected : ""
                    }`}
                    onClick={() => {
                      setTalleSeleccionado(detalle?.id ?? null);
                      if (detalle?.imgs && detalle.imgs.length > 0) {
                        setMainImage(detalle.imgs[0].url);
                      }
                    }}
                  >
                    {talle}
                  </button>
                );
              })}
            </div>
          </div>
          {detalleSeleccionado && detalleSeleccionado.precios?.[0] ? (() => {
            const precioObj = detalleSeleccionado.precios[0];
            const precioCompra = precioObj.precioCompra ?? 0;
            const precioVenta = precioObj.precioVenta ?? 0;
            const descuento = precioObj.descuento;
            const porcentaje = descuento?.porcentaje ?? 0;

            
            const mostrarPrecioTachado = precioCompra > precioVenta;

            return mostrarPrecioTachado ? (
              <div>
                <span className={styles.precioTachado}>${precioCompra.toFixed(2)}</span>
                <br />
                <span
                  className={styles.precioConDescuento}
                  style={{ fontSize: "2em", fontWeight: "bold" }}
                >
                  ${precioVenta.toFixed(2)}
                </span>
                {porcentaje > 0 && (
                  <span className={styles.descuentoBadge}>{porcentaje}% OFF</span>
                )}
              </div>
            ) : (
              <span className={styles.precioNormal}>${precioVenta.toFixed(2)}</span>
            );
          })() : (
            <p className={styles.precioNoDisponible}>Precio no disponible</p>
          )}
          <div className={styles.quantityContainer}>
            <span>
              Cantidad: {cantidad}{" "}
              <span style={{ color: "#888", fontSize: "0.95em" }}>
                (Stock: {stockMaximo})
              </span>
            </span>
            <div className={styles.quantityButtons}>
              <button onClick={increment} disabled={cantidad >= stockMaximo}>+</button>
              <button onClick={decrement} disabled={cantidad <= 1}>-</button>
            </div>
          </div>
          <div className={styles.addToCartButton}>
            <button
              onClick={() => {
                if (!colorSeleccionado) {
                  Swal.fire({
                    icon: "warning",
                    title: "Color no seleccionado",
                    text: "Debes seleccionar un color antes de agregar al carrito.",
                  });
                  return;
                }
                if (!talleSeleccionado) {
                  Swal.fire({
                    icon: "warning",
                    title: "Talle no seleccionado",
                    text: "Debes seleccionar un talle antes de agregar al carrito.",
                  });
                  return;
                }
                if (!detalleSeleccionado || !detalleSeleccionado.precios?.[0]) {
                  Swal.fire({
                    icon: "warning",
                    title: "Selección inválida",
                    text: "Debes seleccionar un color y talle válido.",
                  });
                  return;
                }
                if (stockMaximo === 0) {
                  Swal.fire({
                    icon: "error",
                    title: "Producto no disponible",
                    text: "No hay stock disponible para este producto.",
                  });
                  return;
                }
                if (cantidadEnCarrito >= stockMaximo) {
                  Swal.fire({
                    icon: "warning",
                    title: "Stock máximo en carrito",
                    text: "Ya tienes todos los productos disponibles en el carrito.",
                  });
                  return;
                }
                if (cantidadEnCarrito + cantidad > stockMaximo) {
                  Swal.fire({
                    icon: "warning",
                    title: "Stock máximo en carrito",
                    text: "Ya tienes el máximo disponible en el carrito.",
                  });
                  return;
                }
                agregar({
                  productoId: producto.producto.id,
                  detalleId: detalleSeleccionado.id!,
                  nombre: producto.producto?.nombre ?? "Sin nombre",
                  imagen: detalleSeleccionado.imgs?.[0]?.url || "",
                  precio: precioFinal,
                  precioVenta: precioDetalle,
                  descuento: porcentajeDescuento,
                  talle: detalleSeleccionado.talle?.talle ?? "",
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
              disabled={!detalleSeleccionado}
            >
              {stockMaximo === 0 ? "Producto no disponible" : "Agregar al carrito"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ScreenProductPage;