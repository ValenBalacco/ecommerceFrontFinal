import { Navigate, Route, Routes } from "react-router";
import ScreenHome from "../components/screens/ScreenHome/ScreenHome";
import ScreenProductPage from "../components/screens/ScreenProductPage/ScreenProductPage";
import ScreenHombre from "../components/screens/ScreenCategories/ScreenMen/ScreenHombre";
import ScreenWomen from "../components/screens/ScreenCategories/ScreenWomen/ScreenWomen";
import ScreenNiño from "../components/screens/ScreenCategories/ScreenNiño/ScreenNiño";
import ScreenLoginSignup from "../components/screens/ScreenLoginSignup/ScreenLoginSignup";
import { ScreenCart } from "../components/screens/ScreenCart/ScreenCart";
import ScreenAdmin from "../components/screens/ScreenAdmin/ScreenAdmin";
import { ScreenUser } from "../components/screens/ScreenUser/ScreenUser";
import ScreenZapatillas from "../components/screens/ScreenCategories/ScreenZapatillas/ScreenZapatillas";
import ScreenClothes from "../components/screens/ScreenClothes/ScreenClothes";
import CheckoutSuccess from "../components/screens/CheckoutSuccess";
import CheckoutFailure from "../components/screens/CheckoutFailure";
import CheckoutPending from "../components/screens/CheckoutPending";

const AppRouter = () => {

	return (
		<Routes>
			<Route
				path="/"
				element={<Navigate to="home" />}
			/>
			<Route
				path="/home"
				element={<ScreenHome />}
			/>
			<Route
				path="/login"
				element={<ScreenLoginSignup />}
			/>
			<Route
				path="/user"
				element={<ScreenUser />}
			/>
			<Route
				path="/product/:id"
				element={<ScreenProductPage />}
			/>
			<Route
				path="/admin"
				element={<ScreenAdmin />}
			/>
			<Route
				path="/hombre"
				element={<ScreenHombre />}
			/>
			<Route
				path="/mujer"
				element={<ScreenWomen />}
			/>
			<Route
				path="/niño"
				element={<ScreenNiño />}
			/>
			<Route
				path="/clothes"
				element={<ScreenClothes />}
			/>
			<Route
				path="/cart"
				element={<ScreenCart />}
			/>
			<Route
				path="/zapatillas"
				element={<ScreenZapatillas />}
			/>
    {/* Rutas de Mercado Pago */}
    <Route path="/checkout/success" element={<CheckoutSuccess />} />
    <Route path="/checkout/failure" element={<CheckoutFailure />} />
    <Route path="/checkout/pending" element={<CheckoutPending />} />
		</Routes>
		
	);
};

export default AppRouter;
