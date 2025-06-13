import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  // Función para manejar el click en el icono de usuario
  const handleUserClick = useCallback(
    (e) => {
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

        {/* Barra de búsqueda */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar ropa, zapatillas..."
            className=""
          />
          <Search className="search-icon" />
        </div>

        {/* Iconos del perfil y carrito */}
        <div className="icon-container">
          <a href="#" onClick={handleUserClick} className="">
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