import { Descuento } from "../types";

/**
 * Verifica si un descuento está activo según la fecha actual.
 */
export function isDescuentoActivo(descuento?: Descuento): boolean {
  if (!descuento) return false;
  const hoy = new Date();
  const inicio = new Date(descuento.fechaInicio);
  const fin = new Date(descuento.fechaFin);
  return hoy >= inicio && hoy <= fin;
}

/**
 * Calcula el precio final aplicando el porcentaje de descuento.
 * @param precioOriginal El precio antes de aplicar el descuento.
 * @param descuento El objeto de descuento que contiene el porcentaje a aplicar.
 * @returns El precio final con el descuento aplicado.
 */
export function calcularPrecioConDescuento(precioOriginal: number, descuento?: Descuento): number {
  if (!descuento || !isDescuentoActivo(descuento)) return precioOriginal;
  const porcentajeDescuento = descuento.porcentaje;
  return precioOriginal - (precioOriginal * porcentajeDescuento / 100);
}

/**
 * Calcula el descuento aplicado a un precio de venta.
 * @param precioVenta El precio original de venta.
 * @param porcentajeDescuento El porcentaje de descuento a aplicar.
 * @returns El precio con el descuento aplicado.
 */
export function calcularDescuento(precioVenta: number, porcentajeDescuento?: number): number {
  if (!porcentajeDescuento || porcentajeDescuento <= 0) return precioVenta;
  return precioVenta - precioVenta * (porcentajeDescuento / 100);
}