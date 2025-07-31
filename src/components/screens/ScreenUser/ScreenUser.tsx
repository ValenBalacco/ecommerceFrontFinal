import { useEffect, useState } from "react";
import { OrdenCompra, Usuario } from "../../../types";
import Footer from "../../ui/Footer/Footer";
import Header from "../../ui/Header/Navbar";
import styles from "./ScreenUser.module.css";
import { ServiceOrdenCompra } from "../../../services";
import { useNavigate } from "react-router-dom";
import ModalAgregarDireccion from "../../ui/ModalAgregarDireccion/ModalAgregarDireccion";
import DireccionesCliente from "../../ui/DireccionesCliente/DireccionesCliente";

// Modal simple para ver datos del usuario
const ModalVerUsuario = ({ user, onClose }: { user: Usuario; onClose: () => void }) => (
  <div className={styles.overlay}>
    <div className={styles.modalUsuario}>
      <h2>Datos del Usuario</h2>
      <ul className={styles.datosUsuarioLista}>
        <li><strong>Nombre:</strong> {user.nombre}</li>
        <li><strong>Email:</strong> {user.email}</li>
        {user.rol && <li><strong>Rol:</strong> {user.rol}</li>}
        {user.dni && <li><strong>DNI:</strong> {user.dni}</li>}
        {/* Agrega aquí más campos según el modelo de Usuario */}
      </ul>
      <button className={styles.botonCerrarUsuario} onClick={onClose}>Cerrar</button>
    </div>
  </div>
);

export const ScreenUser = () => {
  const [ordenesUsuario, setOrdenesUsuario] = useState<OrdenCompra[]>([]);
  const [user, setUser] = useState<Usuario | null>(null);
  const [activeSection, setActiveSection] = useState<"perfil" | "mis-pedidos" | "direcciones" | "configuracion">("perfil");
  const [showModalDireccion, setShowModalDireccion] = useState(false);

  // Para DireccionesCliente
  const [direccionSeleccionadaId, setDireccionSeleccionadaId] = useState<number | null>(null);
  const [recargarDirecciones, setRecargarDirecciones] = useState(false);

  // Modal usuario
  const [showModalUsuario, setShowModalUsuario] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("usuario");
    const userObj = userString ? JSON.parse(userString) : null;
    setUser(userObj);

    const fetchOrdenes = async () => {
      try {
        if (userObj) {
          const service = new ServiceOrdenCompra();
          const data = await service.getOrdenesPorUsuario(userObj.id);
          const ordenesOrdenadas = data.sort(
            (a: OrdenCompra, b: OrdenCompra) =>
              new Date(b.fechaCompra).getTime() - new Date(a.fechaCompra).getTime()
          );
          setOrdenesUsuario(ordenesOrdenadas);
        }
      } catch (error) {
        console.error("Error al obtener las ordenes:", error);
      }
    };

    fetchOrdenes();
  }, []);

  // Recarga de direcciones tras agregar
  const handleDireccionAgregada = () => {
    setRecargarDirecciones((prev) => !prev);
  };

  // Helper para clases de menú
  const getMenuItemClass = (section: typeof activeSection) =>
    `${styles.menuItem} ${activeSection === section ? styles.activeSection : ""}`;

  return (
    <>
      <Header />
      <div className={styles.profileLayout}>
        <aside className={styles.sidebar}>
          <h2 className={styles.title}>Mi Perfil</h2>
          <nav>
            <ul className={styles.menu}>
              <li
                className={getMenuItemClass("mis-pedidos")}
                onClick={() => setActiveSection("mis-pedidos")}
              >
                Mis Pedidos
              </li>
              <li
                className={getMenuItemClass("direcciones")}
                onClick={() => setActiveSection("direcciones")}
              >
                Direcciones de Envío
              </li>
              <li
                className={getMenuItemClass("configuracion")}
                onClick={() => setActiveSection("configuracion")}
              >
                Mis Datos
              </li>
              <li
                className={styles.logout}
                onClick={() => {
                  localStorage.removeItem("usuario");
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
              >
                Cerrar Sesión
              </li>
              {user?.rol === "ADMIN" && (
                <li
                  onClick={() => navigate("/admin")}
                  className={styles.adminOption}
                >
                  Ir a Administración
                </li>
              )}
            </ul>
          </nav>
        </aside>
        <main className={styles.profileMain}>
          {/* PERFIL INICIAL */}
          {activeSection === "perfil" && (
            <div className={styles.bienvenida}>
              <h2>¡Bienvenido/a {user?.nombre}!</h2>
              <p>Selecciona una opción del menú para ver tu información.</p>
            </div>
          )}

          {/* MIS PEDIDOS */}
          {activeSection === "mis-pedidos" && (
            <div className={styles.innerContainer}>
              <div className={styles.contentTittle}>
                <h3>Registro de Compras</h3>
              </div>
              <div className={styles.containerTable}>
                {ordenesUsuario.length > 0 ? (
                  ordenesUsuario.map((orden) => (
                    <div key={orden.id} className={styles.item}>
                      <div className={styles.containerData}>
                        <div className={styles.productosSeccion}>
                          <p>
                            <strong>Productos:</strong>
                          </p>
                          <ul className={styles.listaProductos}>
                            {orden.items?.map((item) => (
                              <li key={item.id} className={styles.productoItem}>
                                <div className={styles.productoHeader}>
                                  <span className={styles.productoNombre}>
                                    <strong>{item.producto?.nombre ?? "Sin nombre"}</strong>
                                  </span>
                                  <span className={styles.productoCantidad}>
                                    x{item.cantidad}
                                  </span>
                                </div>
                                <div className={styles.productoDetalles}>
                                  <span>
                                    <strong>Color:</strong> {item.detalle?.color ?? "Sin color"}
                                  </span>
                                  <span>
                                    <strong>Talle:</strong> {item.detalle?.talle?.talle ?? "Sin talle"}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className={styles.totalSeccion}>
                          <p>
                            <strong>Total:</strong> ${orden.total.toFixed(2)}
                          </p>
                          <p>
                            <strong>Fecha:</strong> {new Date(orden.fechaCompra).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.text}>No has realizado ninguna compra</p>
                )}
              </div>
            </div>
          )}

          {/* DIRECCIONES */}
          {activeSection === "direcciones" && (
            <div className={styles.innerContainer}>
              <div className={styles.contentTittle}>
                <h3>Direcciones de Envío</h3>
              </div>
              <DireccionesCliente
                usuario={user}
                direccionSeleccionadaId={direccionSeleccionadaId}
                setDireccionSeleccionadaId={setDireccionSeleccionadaId}
                onAgregarDireccionClick={() => setShowModalDireccion(true)}
                recargar={recargarDirecciones}
              />
              {showModalDireccion && user && (
                <ModalAgregarDireccion
                  usuario={user}
                  onDireccionAgregada={() => {
                    handleDireccionAgregada();
                    setShowModalDireccion(false);
                  }}
                  onClose={() => setShowModalDireccion(false)}
                />
              )}
            </div>
          )}

          {/* CONFIGURACION */}
          {activeSection === "configuracion" && (
            <div className={styles.profileCard}>
              <div
                className={styles.eyeIcon}
                title="Ver datos de usuario"
                onClick={() => setShowModalUsuario(true)}
                style={{ cursor: "pointer", position: "absolute", top: 12, right: 12 }}
              >
                {/* SVG de ojo */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12C3.5 7 8 4 12 4C16 4 20.5 7 23 12C20.5 17 16 20 12 20C8 20 3.5 17 1 12Z" stroke="#444" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="3.5" stroke="#444" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className={styles.avatar}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="38" r="22" fill="#dbdbdb"/>
                  <ellipse cx="50" cy="75" rx="30" ry="18" fill="#ededed"/>
                </svg>
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user?.nombre}</div>
                <div className={styles.userEmail}>{user?.email}</div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />

      {/* MODAL DATOS USUARIO */}
      {showModalUsuario && user && (
        <ModalVerUsuario user={user} onClose={() => setShowModalUsuario(false)} />
      )}
    </>
  );
};