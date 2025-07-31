import { FC, useEffect, useState } from "react";
import { Detalle, Producto, Talle, Descuento } from "../../../../types";
import styles from "./ModalCrearEditarDetalle.module.css";
import { ServiceTalle } from "../../../../services/talleService";
import { ServiceDetalle } from "../../../../services/detalleService";
import { ServicePrecio } from "../../../../services/precioService";
import { ServiceDescuento } from "../../../../services/descuentoService";
import Swal from "sweetalert2";

interface IProps {
  closeModal: () => void;
  detalle?: Detalle | null;
  producto: Producto;
  onSubmit?: () => void;
}

export const ModalCrearEditarDetalle: FC<IProps> = ({
  closeModal,
  detalle,
  onSubmit,
  producto,
}) => {
  const [tallesDisponibles, setTallesDisponibles] = useState<Talle[]>([]);
  const [descuentosDisponibles, setDescuentosDisponibles] = useState<Descuento[]>([]);
  const [formState, setFormState] = useState({
    color: detalle?.color || "",
    estado: detalle?.estado || "",
    stock: detalle?.stock || 0,
    talleId: detalle?.talleId || 0,
  });
  const [precioState, setPrecioState] = useState({
    precioCompra: detalle?.precios?.[0]?.precioCompra || 0,
    descuentoId: detalle?.precios?.[0]?.descuentoId || 0,
  });

  const serviceTalle = new ServiceTalle();
  const serviceDetalle = new ServiceDetalle();
  const servicePrecio = new ServicePrecio();
  const serviceDescuento = new ServiceDescuento();

  useEffect(() => {
    const getAllTalles = async () => {
      setTallesDisponibles(await serviceTalle.getTalles());
    };
    const getAllDescuentos = async () => {
      setDescuentosDisponibles(await serviceDescuento.getDescuentos());
    };
    getAllTalles();
    getAllDescuentos();
  }, []);

  useEffect(() => {
    setFormState({
      color: detalle?.color || "",
      estado: detalle?.estado || "",
      stock: detalle?.stock || 0,
      talleId: detalle?.talleId || 0,
    });
    setPrecioState({
      precioCompra: detalle?.precios?.[0]?.precioCompra || 0,
      descuentoId: detalle?.precios?.[0]?.descuentoId || 0,
    });
  }, [detalle]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const detallePayload = {
        color: formState.color,
        estado: formState.estado,
        stock: formState.stock,
        productoId: producto.id,
        talleId: formState.talleId,
      };

      let detalleCreado: Detalle;
      if (detalle?.id) {
        detalleCreado = await serviceDetalle.editarDetalle(detalle.id, detallePayload);
      } else {
        detalleCreado = await serviceDetalle.crearDetalle(detallePayload);
      }

      // Busca el porcentaje de descuento seleccionado y verifica su vigencia
      const descuentoSeleccionado = descuentosDisponibles.find(
        (d) => d.id === precioState.descuentoId
      );

      const hoy = new Date();
      const inicio = descuentoSeleccionado ? new Date(descuentoSeleccionado.fechaInicio) : null;
      const fin = descuentoSeleccionado ? new Date(descuentoSeleccionado.fechaFin) : null;

      const descuentoVigente =
        descuentoSeleccionado &&
        inicio &&
        fin &&
        hoy >= inicio &&
        hoy <= fin;

      const descuentoPorcentaje = Number(descuentoVigente ? descuentoSeleccionado?.porcentaje : 0);
      const precioVenta =
        precioState.precioCompra -
        (precioState.precioCompra * descuentoPorcentaje / 100);

      // Si el precioVenta es NaN, ponlo en 0
      const precioPayload = {
        precioCompra: precioState.precioCompra,
        precioVenta: isNaN(precioVenta) ? precioState.precioCompra : precioVenta,
        detalleId: detalleCreado.id,
        descuentoId: descuentoVigente ? precioState.descuentoId : null, // null si no hay descuento vigente
      };

      if (detalle?.precios?.[0]?.id) {
        await servicePrecio.editarPrecio(detalle.precios[0].id, precioPayload);
      } else {
        await servicePrecio.crearPrecio(precioPayload);
      }

      Swal.fire({
        title: detalle ? "Detalle editado!" : "Detalle creado!",
        icon: "success",
      });
      onSubmit?.();
      closeModal();
    } catch (error: any) {
      console.error("Error guardando detalle o precio", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el detalle o el precio. Verifica los datos.",
        icon: "error",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "stock" || name === "talleId" ? Number(value) : value,
    }));
  };

  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPrecioState((prev) => ({
      ...prev,
      [name]: name === "precioCompra"
        ? Number(value)
        : name === "descuentoId"
        ? value === "" ? null : Number(value)
        : value,
    }));
  };

  // Calcula el precio de venta en tiempo real para mostrarlo
  const descuentoSeleccionado = descuentosDisponibles.find(
    (d) => d.id === precioState.descuentoId
  );
  const hoy = new Date();
  const inicio = descuentoSeleccionado ? new Date(descuentoSeleccionado.fechaInicio) : null;
  const fin = descuentoSeleccionado ? new Date(descuentoSeleccionado.fechaFin) : null;

  const descuentoVigente =
    descuentoSeleccionado &&
    inicio &&
    fin &&
    hoy >= inicio &&
    hoy <= fin;

  const descuentoPorcentaje = descuentoVigente ? descuentoSeleccionado.porcentaje : 0;
  const precioVentaCalculado =
    precioState.precioCompra - (precioState.precioCompra * descuentoPorcentaje / 100);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{detalle ? "Editar Detalle" : "Crear Detalle"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Color</label>
            <input
              type="text"
              name="color"
              placeholder="Ingrese el color"
              value={formState.color}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              placeholder="Ingrese el stock"
              min={0}
              value={formState.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Estado</label>
            <input
              type="text"
              name="estado"
              placeholder="Ingrese el estado"
              value={formState.estado}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Talle</label>
            <select
              name="talleId"
              value={formState.talleId}
              onChange={handleChange}
              required
            >
              <option disabled value={0}>
                Selecciona un talle
              </option>
              {tallesDisponibles.map((talle) => (
                <option key={talle.id} value={talle.id}>
                  {talle.talle}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Precio Compra</label>
            <input
              type="number"
              name="precioCompra"
              value={precioState.precioCompra}
              onChange={handlePrecioChange}
              required
              min={0}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Descuento</label>
            <select
              name="descuentoId"
              value={precioState.descuentoId === 0 ? "" : precioState.descuentoId}
              onChange={handlePrecioChange}
            >
              <option value="">Sin descuento</option>
              {descuentosDisponibles.map((descuento) => (
                <option key={descuento.id} value={descuento.id}>
                  {`${descuento.porcentaje}% (${new Date(descuento.fechaInicio).toLocaleDateString()} a ${new Date(descuento.fechaFin).toLocaleDateString()})`}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Precio Venta (calculado)</label>
            <input
              type="number"
              value={isNaN(precioVentaCalculado) ? 0 : precioVentaCalculado}
              readOnly
              disabled
            />
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={closeModal}
            >
              Cancelar
            </button>
            <button className={styles.submitButton} type="submit">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};