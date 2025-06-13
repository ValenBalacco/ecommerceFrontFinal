import { useCallback, useState, ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");

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

  // Manejo input búsqueda
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Handler para buscar al presionar Enter o el icono
  const handleSearch = (e: KeyboardEvent<HTMLInputElement> | MouseEvent<SVGSVGElement>) => {
    if (
      ("key" in e && e.key === "Enter") ||
      e.type === "click"
    ) {
      if (search.trim() !== "") {
        navigate(`/buscar?query=${encodeURIComponent(search)}`);
        setSearch(""); // Limpiar input si quieres
      }
    }
  };

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
            value={search}
            onChange={handleInputChange}
            onKeyDown={handleSearch}
          />
          <Search
            className="search-icon"
            onClick={handleSearch}
            style={{ cursor: "pointer" }}
          />
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