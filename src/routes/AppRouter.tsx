import { Navigate, Route, Routes } from "react-router";
import ScreenHome from "../components/screens/ScreenHome/ScreenHome";
import ScreenProductPage from "../components/screens/ScreenProductPage/ScreenProductPage";
import ScreenMen from "../components/screens/ScreenCategories/ScreenMen/ScreenMen";
import ScreenWomen from "../components/screens/ScreenCategories/ScreenWomen/ScreenWomen";
import ScreenKids from "../components/screens/ScreenCategories/ScreenKids/ScreenKids";
import ScreenLoginSignup from "../components/screens/ScreenLoginSignup/ScreenLoginSignup";
import { ScreenCart } from "../components/screens/ScreenCart/ScreenCart";
import ScreenAdmin from "../components/screens/ScreenAdmin/ScreenAdmin";
import { ScreenUser } from "../components/screens/ScreenUser/ScreenUser";
import { ScreenDestacados } from "../components/screens/ScreenCategories/ScreenDestacados/ScreenDestacados";

import ScreenClothes from "../components/screens/ScreenClothes/ScreenClothes";

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
				element={<ScreenMen />}
			/>
			<Route
				path="/mujer"
				element={<ScreenWomen />}
			/>
			<Route
				path="/niño"
				element={<ScreenKids />}
			/>
			<Route
				path="/clothes"
				element={<ScreenClothes />}
			/>
			<Route
				path="/destacados"
				element={<ScreenDestacados />}
			/>
			<Route
				path="/cart"
				element={<ScreenCart />}
			/>

		</Routes>
	);
};

export default AppRouter;
