import { BrowserRouter } from "react-router";
import AppRouter from "./routes/AppRouter";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

function App() {
	const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

	useEffect(() => {
		loadFromStorage();
	}, []);

	return (
		<>
			<BrowserRouter>
				<AppRouter />
			</BrowserRouter>
		</>
	);
}

export default App;
