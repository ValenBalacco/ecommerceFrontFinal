import styles from "./CardProducts.module.css";
import { FC } from "react";
import { Detalle } from "../../../../types";
import { useNavigate } from "react-router";
import { Descuento } from "../../../../types";
import { useCartStore } from "../../../../store/useCartStore";
import Swal from "sweetalert2";

interface IProps {
  products: Detalle;
}

const CardProducts: FC<IProps> = ({ products }) => {
  const navigate = useNavigate();

  const precioObj = products.precios?.[0];
  const descuento: Descuento | undefined = precioObj?.descuento;
  const precioVenta = precioObj?.precioVenta ?? 0;

  const isDescuentoActivo = (descuento: Descuento | undefined): boolean => {
    if (!descuento) return false;
    const hoy = new Date();
    const fechaInicio = new Date(descuento.fechaInicio);
    const fechaFin = new Date(descuento.fechaFin);
    return hoy >= fechaInicio && hoy <= fechaFin;
  };

  const descuentoActivo = isDescuentoActivo(descuento);

  const calcularDescuento = (
    precioVenta: number,
    porcentajeDescuento: number
  ) => {
    if (porcentajeDescuento <= 0) {
      return precioVenta;
    }
    return precioVenta - precioVenta * (porcentajeDescuento / 100);
  };

  if (!products || !products.producto) {
    return <div>Producto no disponible</div>;
  }

  const imgPrincipal = products.imgs?.[0];


  const handleAddToCart = () => {
    const nombreProducto = products.producto?.nombre ?? null;
    const precioVenta = products.precios?.[0]?.precioVenta;

    if (
      !nombreProducto ||
      typeof precioVenta !== "number" ||
      isNaN(precioVenta) ||
      precioVenta <= 0
    ) {
      Swal.fire(
        "Error",
        "No se puede agregar un producto sin nombre o con precio inválido.",
        "error"
      );
      return;
    }

    const itemCarrito = {
      detalleId: products.id,
      nombre: nombreProducto,
      imagen: products.imgs?.[0]?.url || "",
      precio: precioVenta,
      cantidad: 1,
      talle: products.talle?.talle,
    };

    useCartStore.getState().agregar(itemCarrito);
    Swal.fire("¡Agregado!", "El producto fue agregado al carrito.", "success");
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        {descuentoActivo && descuento && (
          <div className={styles.divDescuento}>
            <p>- {descuento.porcentaje}%</p>
          </div>
        )}

        {imgPrincipal ? (
          <img
            src={imgPrincipal.url || "/fallback.jpg"}
            onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
          />
        ) : (
          <div className={styles.imagePlaceholder}>Sin imagen</div>
        )}
      </div>

      <div className={styles.productDetails}>
        <div className={styles.productInfo}>
          <p className={styles.productName}>
            {products.producto?.nombre ?? "Sin nombre"} {products.color}
          </p>
          <p className={styles.productPrice}>
            {descuentoActivo && descuento ? (
              <>
                <span className={styles.precioTachado}>
                  ${precioVenta}
                </span>
                <span className={styles.totalDescuento}>
                  $
                  {calcularDescuento(
                    precioVenta,
                    descuento.porcentaje
                  ).toFixed(2)}
                </span>
              </>
            ) : (
              <>${precioVenta}</>
            )}
          </p>
        </div>

        <div className={styles.productActions}>
          <button
            className={styles.productButton}
            onClick={() => navigate(`/product/${products.id}`)}
          >
            Ver más
          </button>
          <button
            className={styles.productButton}
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProducts;