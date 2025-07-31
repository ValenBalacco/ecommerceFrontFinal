import styles from "./CardProducts.module.css";
import { FC } from "react";
import { Detalle } from "../../../../types";
import { useNavigate } from "react-router";
import { Descuento } from "../../../../types";
import { useCartStore } from "../../../../store/useCartStore";
import Swal from "sweetalert2";
// Ajusta el path según la ubicación real del archivo descuentos.ts
import { isDescuentoActivo } from "../../../../helpers/descuentos";

interface IProps {
  products: Detalle;
}

const CardProducts: FC<IProps> = ({ products }) => {
  const navigate = useNavigate();

  const precioObj = products.precios?.[0];
  const descuento: Descuento | undefined = precioObj?.descuento;

  const precioCompra = precioObj?.precioCompra ?? 0;
  const precioVenta = precioObj?.precioVenta ?? 0;
  const descuentoActivo = isDescuentoActivo(descuento);
  const porcentaje = descuento?.porcentaje ?? 0;

  // Mostrar precio tachado siempre que el precio de compra sea mayor al de venta
  const mostrarPrecioTachado = precioCompra > precioVenta;

  const handleAddToCart = () => {
    const nombreProducto = products.producto?.nombre ?? null;
    const precioVenta = products.precios?.[0]?.precioVenta;
    const stockMaximo = products.stock ?? 0;

    // Obtiene la cantidad actual en el carrito para este detalle
    const itemsCarrito = useCartStore.getState().items;
    const cantidadEnCarrito =
      itemsCarrito.find((i) => i.detalleId === products.id)?.cantidad ?? 0;

    if (stockMaximo === 0) {
      Swal.fire(
        "Producto no disponible",
        "No hay stock disponible para este producto.",
        "error"
      );
      return;
    }

    if (cantidadEnCarrito >= stockMaximo) {
      Swal.fire(
        "Stock máximo en carrito",
        "Ya tienes todos los productos disponibles en el carrito.",
        "warning"
      );
      return;
    }

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
      productoId: products.producto?.id ?? 0,
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

  if (!products || !products.producto) {
    return <div>Producto no disponible</div>;
  }

  const imgPrincipal = products.imgs?.[0];

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
          <div className={styles.productPrice}>
            {mostrarPrecioTachado ? (
              <div>
                <span className={styles.precioTachado}>
                  ${precioCompra.toFixed(2)}
                </span>
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
            )}
          </div>
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