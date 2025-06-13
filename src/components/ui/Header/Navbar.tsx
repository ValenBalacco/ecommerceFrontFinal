import { useCallback, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  // Manejo click usuario
  const handleUserClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const userString = localStorage.getItem("usuario");
      if (userString) {
        navigate("/user");
      } else {
        navigate("/login");
      }
    },
    [navigate]
  );

  return (
    <header>
      <div className="container">
        {/* Logo */}
        <Link to="/" className="logo">
          a
        </Link>

        {/* Mensaje de bienvenida */}
        <div className="welcome-container">
          <span className="welcome-text">
            ¡Bienvenido a aShop! Encontrá la mejor moda para vos.
          </span>
        </div>

        {/* Iconos del perfil y carrito */}
        <div className="icon-container">
          <a href="#" onClick={handleUserClick}>
            <User size={26} />
          </a>
          <Link to="/cart" className="cart">
            <ShoppingCart size={26} />
            <span className="badge">$</span>
          </Link>
        </div>
      </div>
    </header>
  );
}