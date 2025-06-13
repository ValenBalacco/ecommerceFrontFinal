import { useEffect, useState } from "react";
import { OrdenCompra } from "../../../types";
import Footer from "../../ui/Footer/Footer";
import Header from "../../ui/Header/Navbar";
import styles from "./ScreenUser.module.css";
import { ServiceOrdenCompra } from "../../../services";
import { useNavigate } from "react-router-dom";

export const ScreenUser = () => {
  const [ordenesUsuario, setOrdenesUsuario] = useState<OrdenCompra[]>([]);
  const [user, setUser] = useState<{ id: string; nombre: string; email: string; rol: string } | null>(null);
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

  // Menú lateral y pantalla de perfil:
  return (
    <>
      <Header />
      <div className={styles.profileLayout}>
        <aside className={styles.sidebar}>
          <h2 className={styles.title}>Mi Perfil</h2>
          <nav>
            <ul className={styles.menu}>
              <li onClick={() => navigate("/mis-pedidos")}>Mis Pedidos</li>
              <li onClick={() => navigate("/direcciones-envio")}>Direcciones de Envío</li>
              <li onClick={() => navigate("/configuracion")}>Configuración</li>
              <li
                onClick={() => {
                  localStorage.removeItem("usuario");
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
                className={styles.logout}
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
          <div className={styles.profileCard}>
            <div className={styles.editIcon} title="Editar perfil">
              <svg width="21" height="21" viewBox="0 0 21 21"><path d="M3 17.25v-2.086a2 2 0 0 1 .586-1.414l9.793-9.793a2 2 0 0 1 2.828 0l1.086 1.086a2 2 0 0 1 0 2.828l-9.793 9.793A2 2 0 0 1 5.086 18H3.75A.75.75 0 0 1 3 17.25z" fill="none" stroke="#444" strokeWidth="1.4"/></svg>
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

          {/* REGISTRO DE COMPRAS */}
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
                        <ul>
                          {orden.items?.map((item) => (
                            <li key={item.id}>
                              {item.producto?.nombre ?? "Sin nombre"} - Cantidad: {item.cantidad}
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
        </main>
      </div>
      <Footer />
    </>
  );
};