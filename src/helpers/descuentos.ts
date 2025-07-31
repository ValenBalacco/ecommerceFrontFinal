import { Descuento } from "../types";

export function isDescuentoActivo(descuento?: Descuento): boolean {
  if (!descuento) return false;
  const hoy = new Date();
  const inicio = new Date(descuento.fechaInicio);
  const fin = new Date(descuento.fechaFin);
  return hoy >= inicio && hoy <= fin;
}

export function calcularPrecioConDescuento(precioOriginal: number, descuento?: Descuento): number {
  if (!descuento || !isDescuentoActivo(descuento)) return precioOriginal;
  const porcentajeDescuento = descuento.porcentaje;
  return precioOriginal - (precioOriginal * porcentajeDescuento / 100);
}

export function calcularDescuento(precioVenta: number, porcentajeDescuento?: number): number {
  if (!porcentajeDescuento || porcentajeDescuento <= 0) return precioVenta;
  return precioVenta - precioVenta * (porcentajeDescuento / 100);
}