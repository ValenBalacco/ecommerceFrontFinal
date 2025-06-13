export type Rol = "ADMIN" | "CLIENTE";

export type TipoProducto = "REMERA" | "PANTALON" | "ZAPATILLA" | "OTRO";

export interface Categoria {
  id: number;
  nombre: string;
  productos?: Producto[];
}

export interface Descuento {
  id: number;
  porcentaje: number;
  fechaInicio: Date;
  fechaFin: Date;
  precios?: Precio[];
}

export interface Talle {
  id: number;
  talle: string;
  detalles?: Detalle[];
}

export interface Direccion {
  id: number;
  localidad: string;
  pais: string;
  provincia: string;
  departamento: string;
  codigoPostal: string;
  usuarios?: UsuarioDireccion[];
}

export interface Producto {
  id: number;
  nombre: string;
  categoria: Categoria;
  categoriaId: number;
  tipoProducto: TipoProducto;
  sexo: string;
  detalles?: Detalle[];
  itemsOrden?: ItemOrden[];
}

export interface Detalle {
  descripcion: string;
  id: number;
  color: string;
  estado: string;
  stock: number;
  producto: Producto;
  productoId: number;
  talle: Talle;
  talleId: number;
  imgs?: Img[];
  precios?: Precio[];
}

export interface Img {
  id: number;
  url: string;
  detalle: Detalle;
  detalleId: number;
}
export interface Usuario {
  id: string;
  nombre: string;
  contraseña: string;
  email: string;
  dni: string;
  rol: Rol;
  direcciones?: UsuarioDireccion[];
  ordenes?: OrdenCompra[];
}

export interface UsuarioDireccion {
  id: number;
  usuario: Usuario;
  usuarioId: string;
  direccion: Direccion;
  direccionId: number;
  ordenesEnvio?: OrdenCompra[];
}

export interface OrdenCompra {
  id: number;
  total: number;
  descuento: number;
  fechaCompra: string;
  usuario: Usuario;
  usuarioId: string;
  direccionEnvio: UsuarioDireccion;
  direccionEnvioId: number;
  items?: ItemOrden[];
}

export interface ItemOrden {
  id: number;
  cantidad: number;
  ordenCompra: OrdenCompra;
  ordenCompraId: number;
  producto: Producto;
  productoId: number;
}

export interface Precio {
  id: number;
  precioCompra: number;
  precioVenta: number;
  detalle: Detalle;
  detalleId: number;
  descuento: Descuento;
  descuentoId: number;
}

export interface ItemCarrito {
  title: string;
  quantity: number;
  unit_price: number;
  picture_url?: string;
  category_id?: string;
  currency_id?: string;
}