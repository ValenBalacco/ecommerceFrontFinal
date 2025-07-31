import { FC, useEffect, useState, useRef } from "react";
import { Direccion, Usuario, UsuarioDireccion } from "../../../types";
import { ServiceDireccion } from "../../../services";
import styles from "./DireccionesCliente.module.css";

interface IProps {
  usuario?: Usuario | null;
  direccionSeleccionadaId: number | null;
  setDireccionSeleccionadaId: (id: number) => void;
  onAgregarDireccionClick: () => void;
  recargar: boolean;
}

const DireccionesCliente: FC<IProps> = ({
  usuario,
  direccionSeleccionadaId,
  setDireccionSeleccionadaId,
  onAgregarDireccionClick,
  recargar,
}) => {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  
  const serviceDireccion = new ServiceDireccion();

  useEffect(() => {
    if (!usuario || !usuario.id) {
      setDirecciones([]);
      setLoading(false);
      return;
    }
    const cargarDirecciones = async () => {
      setLoading(true);
      try {
   
        const usuarioDirecciones: UsuarioDireccion[] = await serviceDireccion.getUsuarioDirecciones(usuario.id);

        if (!Array.isArray(usuarioDirecciones)) {
          console.error("La respuesta del backend NO es un array. Recibido:", usuarioDirecciones);
          setDirecciones([]);
          return;
        }

       
        const direccionesUsuario: Direccion[] = usuarioDirecciones
          .map((ud: UsuarioDireccion) => ud?.direccion)
          .filter(Boolean);

        setDirecciones(direccionesUsuario);

        if (direccionesUsuario.length > 0 && direccionSeleccionadaId === null) {
          setDireccionSeleccionadaId(direccionesUsuario[0].id);
        }
      } catch (error) {
        console.error("Error cargando direcciones:", error);
        setDirecciones([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDirecciones();

  }, [usuario?.id, recargar]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!usuario || !usuario.id) {
    return <p className={styles.noDirecciones}>Debes iniciar sesión para ver tus direcciones.</p>;
  }

  if (loading) return <p className={styles.loading}>Cargando...</p>;

  const direccionActual = direcciones.find((d) => d.id === direccionSeleccionadaId);

  return (
    <div className={styles.contenedor} ref={dropdownRef}>
      <p className={styles.titulo}>Dirección</p>

      {direcciones.length === 0 ? (
        <p className={styles.noDirecciones}>No hay direcciones registradas.</p>
      ) : (
        <div className={styles.dropdownContainer}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={styles.dropdownBoton}
          >
            {direccionActual ? (
              <span>
                {direccionActual.localidad}, {direccionActual.provincia}, CP: {direccionActual.codigoPostal}
              </span>
            ) : (
              <span className={styles.placeholder}>Seleccioná una dirección</span>
            )}
          </button>

          {dropdownOpen && (
            <div className={styles.dropdownLista}>
              {direcciones.map((direccion) => (
                <div
                  key={direccion.id}
                  onClick={() => {
                    setDireccionSeleccionadaId(direccion.id);
                    setDropdownOpen(false);
                  }}
                  className={`${styles.itemLista} ${
                    direccionSeleccionadaId === direccion.id
                      ? styles.itemSeleccionado
                      : ""
                  }`}
                >
                  {direccion.localidad}, {direccion.provincia}, CP: {direccion.codigoPostal}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className={styles.botonAgregar}
        onClick={onAgregarDireccionClick}
      >
        + Agregar nueva dirección
      </button>
    </div>
  );
};

export default DireccionesCliente;