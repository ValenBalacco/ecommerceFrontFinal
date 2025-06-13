import { ArrowLeft } from "lucide-react";
import styles from "./HeaderAdmin.module.css";
import logo from "../../assets/images.png";
import { useNavigate } from "react-router";

export const HeaderAdmin = () => {
	const navigate = useNavigate();
	const handleNavigate = (category: string) => {
		navigate(`/${category}`);
	};
	return (
		<>
			<div className={styles.headerContainer}>
				<div
					onClick={() => handleNavigate("home")}
					className={styles.logo}
				>
					<img
						src={logo}
						alt=""
					/>
				</div>
				<div className={styles.navContainer}>
					<h2>Administrador</h2>
				</div>
				<div className={styles.iconsContainer}>
					<div onClick={()=> handleNavigate("home")}>
						<ArrowLeft size={32}/>
					</div>
				</div>
			</div>
		</>
	);
};
