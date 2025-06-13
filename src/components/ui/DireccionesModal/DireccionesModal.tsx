import { FC, useEffect, useState } from "react";
import { Direccion, UsuarioDireccion } from "../../../types";
import { ServiceDireccion } from "../../../services";
import styles from "./DireccionesModal.module.css";

interface Props {
  cerrar: () => void;
  seleccionarDireccion: (dir: Direccion) => void;
}

const DireccionesModal: FC<Props> = ({ cerrar, seleccionarDireccion }) => {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [seleccionada, setSeleccionada] = useState<number | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingGuardar, setLoadingGuardar] = useState(false);

  const [nuevaDireccion, setNuevaDireccion] = useState({
    localidad: "",
    provincia: "",
    pais: "",
    departamento: "",
    codigoPostal: "",
  });

  const storedUser = localStorage.getItem("usuario");
  const usuarioId = storedUser ? JSON.parse(storedUser).id : null;

  const serviceDireccion = new ServiceDireccion();

  // Cargar las direcciones del usuario desde la tabla intermedia
  const cargarDirecciones = async () => {
    if (!usuarioId) {
      setDirecciones([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const usuarioDirecciones: UsuarioDireccion[] = await serviceDireccion.getUsuarioDirecciones(usuarioId);
      const direcciones = usuarioDirecciones.map((ud) => ud.direccion);
      setDirecciones(direcciones);
      if (direcciones.length > 0 && seleccionada === null) setSeleccionada(direcciones[0].id);
    } catch (error) {
      setDirecciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDirecciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guardar = () => {
    const dir = direcciones.find((d) => d.id === seleccionada);
    if (dir) {
      seleccionarDireccion(dir);
      cerrar();
    }
  };

  const manejarNuevaDireccion = async () => {
    const camposVacios = Object.values(nuevaDireccion).some((v) => v.trim() === "");
    if (camposVacios) {
      alert("Completá todos los campos.");
      return;
    }

    setLoadingGuardar(true);

    try {
      // SOLO se envían los campos básicos de dirección
      const { localidad, provincia, pais, departamento, codigoPostal } = nuevaDireccion;
      const direccionCreada = await serviceDireccion.crearDireccion({
        localidad,
        provincia,
        pais,
        departamento,
        codigoPostal,
      });

      // SOLO se envían usuarioId y direccionId
      await serviceDireccion.crearUsuarioDireccion({
        usuarioId,
        direccionId: direccionCreada.id,
      });

      await cargarDirecciones();
      setSeleccionada(direccionCreada.id);
      setMostrarFormulario(false);
      setNuevaDireccion({
        localidad: "",
        provincia: "",
        pais: "",
        departamento: "",
        codigoPostal: "",
      });
    } catch (error) {
      alert("Ocurrió un error al guardar la dirección.");
    } finally {
      setLoadingGuardar(false);
    }
  };

  return (
    <div className={styles.fondoModal}>
      <div className={styles.modal}>
        <h2 className={styles.titulo}>Elegí dónde recibir tus compras</h2>

        {mostrarFormulario ? (
          <div className={styles.formulario}>
            {["Localidad", "Provincia", "País", "Departamento", "Código Postal"].map(
              (label, idx) => {
                const key = Object.keys(nuevaDireccion)[idx] as keyof typeof nuevaDireccion;
                return (
                  <input
                    key={key}
                    type="text"
                    placeholder={label}
                    className={styles.input}
                    value={nuevaDireccion[key]}
                    onChange={(e) =>
                      setNuevaDireccion({
                        ...nuevaDireccion,
                        [key]: e.target.value,
                      })
                    }
                  />
                );
              }
            )}

            <div className={styles.botonesFila}>
              <button
                onClick={() => setMostrarFormulario(false)}
                className={styles.botonCancelar}
                disabled={loadingGuardar}
              >
                Cancelar
              </button>
              <button
                onClick={manejarNuevaDireccion}
                className={styles.botonGuardar}
                disabled={loadingGuardar}
              >
                {loadingGuardar ? "Guardando..." : "Guardar dirección"}
              </button>
            </div>
          </div>
        ) : loading ? (
          <p>Cargando direcciones...</p>
        ) : (
          <>
            <div className={styles.listaDirecciones}>
              {direcciones.length === 0 ? (
                <p>No hay direcciones registradas.</p>
              ) : (
                direcciones.map((dir) => (
                  <label
                    key={dir.id}
                    className={`${styles.opcionDireccion} ${
                      seleccionada === dir.id ? styles.opcionActiva : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="direccion"
                      className={styles.radio}
                      checked={seleccionada === dir.id}
                      onChange={() => setSeleccionada(dir.id)}
                    />
                    <div>
                      <p className={styles.labelDireccion}>
                        {dir.localidad}, {dir.provincia}
                      </p>
                      <p className={styles.textoDireccion}>
                        CP: {dir.codigoPostal} - {dir.pais} - {dir.departamento}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>

            <button
              onClick={() => setMostrarFormulario(true)}
              className={styles.agregarLink}
            >
              + Agregar nueva dirección
            </button>

            <div className={styles.botonesFinal}>
              <button
                onClick={cerrar}
                className={styles.botonCancelar}
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                className={styles.botonGuardar}
                disabled={direcciones.length === 0}
              >
                Guardar cambios
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DireccionesModal;