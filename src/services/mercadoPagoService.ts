import axios from "axios";
import Swal from "sweetalert2";
import { IItemCarrito } from "../types/IItemCarrito";

const API_URL = import.meta.env.VITE_URL_MERCADOPAGO;

export const handlePagar = async (items: IItemCarrito[]): Promise<boolean> => {
	const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
	const token = localStorage.getItem("token");

	const itemsMP = items.map((item) => ({
		title: item.title,
		quantity: item.quantity,
		unitPrice: item.unit_price,
	}));

	try {
		const response = await axios.post(
			`${API_URL}/crear-preferencia`,
			{
				items: itemsMP,
				email: usuario.email,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		);

		const initPoint = response.data.init_point;

		if (!initPoint) {
			throw new Error("init_point no recibido");
		}

		window.location.href = initPoint;
		return true;
	} catch (error) {
		console.error("Error al iniciar pago:", error);
		Swal.fire("Error", "No se pudo iniciar el pago", "error");
		return false;
	}
};