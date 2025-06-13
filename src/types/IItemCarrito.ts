import { ICartItem } from "../store/useCartStore";

export interface IItemCarrito {
	title: string;
	quantity: number;
	unit_price: number;
	picture_url?: string;
	category_id?: string;
	currency_id?: string;
}

export const mapCartItemsToMercadoPago = (items: ICartItem[]): IItemCarrito[] => {
	return items.map((item) => ({
		title: item.nombre || "Producto",
		quantity: item.cantidad ?? 1,
		unit_price: item.precio ?? 0,
		picture_url: item.imagen,
		category_id: "general",
		currency_id: "ARS",
	}));
};
