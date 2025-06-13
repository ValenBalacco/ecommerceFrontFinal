import { FC } from "react";
import styles from "./CardAdmin.module.css";
import { Detalle } from "../../../../types";

type IProps = {
  producto: Detalle[];
  onEdit: (producto: Detalle) => void;
};

const CardAdmin: FC<IProps> = ({ producto, onEdit }) => {
  return (
    <div className={styles.gridContainer}>
      {producto && producto.length > 0 ? (
        producto.map((item) => (
          <div className={styles.card} key={item.id}>
            <img
              src={
                item.imgs && item.imgs.length > 0
                  ? item.imgs[0].url
                  : "default-image-url"
              }
          
              className={styles.image}
            />
            <h3 className={styles.title}>
              Título: {item.producto?.nombre ?? "Sin nombre"}
            </h3>
            <p className={styles.description}>
              Color: {item.color}
            </p>
            <p className={styles.price}>
              $ {item.precios?.[0]?.precioVenta ?? "Sin precio"}
            </p>
            <p className={styles.meta}>
              Categoría: {item.producto?.categoria?.nombre ?? "Sin categoría"}
            </p>
            <p className={styles.meta}>
              Sexo: {item.producto?.sexo ?? "Sin sexo"}
            </p>
            <p className={styles.meta}>
              Tipo: {item.producto?.tipoProducto ?? "Sin tipo"}
            </p>
            <div className={styles.actions}>
              <button type="button" className={styles.deleteButton}>
                Eliminar
              </button>
              <button type="button" className={styles.editButton} onClick={() => onEdit(item)}>
                Editar
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>No hay productos disponibles</div>
      )}
    </div>
  );
};

export default CardAdmin;