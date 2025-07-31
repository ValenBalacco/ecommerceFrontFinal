import styles from "./ScreenLoginSignup.module.css";
import logo from "../../assets/images.png";
import { useState } from "react";
import { Lock, Mail, User, BadgePlus } from "lucide-react";
import { loginService } from "../../../services/loginService";
import { registerService } from "../../../services/registerService";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import Navbar from "../../ui/Header/Navbar"; 

const ScreenLoginSignup = () => {
  const [action, setAction] = useState<"Login" | "Register">("Login");
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !contraseña) {
      alert("Completa email y contraseña");
      return;
    }
    try {
      const res = await loginService({ email, contraseña });
      if (res.usuario && res.token) {
        login(res.usuario, res.token);
        navigate("/home");
      } else {
        alert("Respuesta inválida del servidor");
      }
    } catch {
      alert("Email o contraseña incorrectos");
    }
  };

  const handleRegister = async () => {
    if (!nombre || !dni || !email || !contraseña || !confirmarContraseña) {
      alert("Completa todos los campos");
      return;
    }
    if (contraseña !== confirmarContraseña) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      const res = await registerService({ nombre, email, contraseña, dni });
      if (res.usuario && res.token) {
        login(res.usuario, res.token);
        navigate("/home");
      } else {
        alert("Respuesta inválida del servidor");
      }
    } catch (err: any) {
      if (err.response?.data?.error) {
        alert("Error: " + err.response.data.error);
      } else {
        alert("Error al registrar usuario");
      }
    }
  };

  return (
    <>
      <Navbar /> 
      <div className={styles.screenBackground}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.text}>{action === "Login" ? "Login" : "Registro"}</div>
            <div className={styles.logo}>
              <img src={logo} alt="Logo" />
            </div>
          </div>

          <div className={styles.switch_container}>
            <button
              type="button"
              className={`${styles.switchBtn} ${action === "Register" ? styles.switchBtn_active : ""}`}
              onClick={() => setAction("Register")}
            >
              Registrarse
            </button>
            <button
              type="button"
              className={`${styles.switchBtn} ${action === "Login" ? styles.switchBtn_active : ""}`}
              onClick={() => setAction("Login")}
            >
              Login
            </button>
          </div>

          <div className={styles.inputs}>
            {action === "Register" && (
              <>
                <div className={styles.inputGroup}>
                  <div className={styles.input}>
                    <User />
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <div className={styles.input}>
                    <BadgePlus />
                    <input
                      type="text"
                      placeholder="DNI"
                      value={dni}
                      onChange={(e) => setDni(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className={styles.inputGroup}>
              <div className={styles.input}>
                <Mail />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.input}>
                <Lock />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                />
              </div>
            </div>

            {action === "Register" && (
              <div className={styles.inputGroup}>
                <div className={styles.input}>
                  <Lock />
                  <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirmarContraseña}
                    onChange={(e) => setConfirmarContraseña(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className={styles.submit_container}>
            <button
              type="button"
              className={styles.submit}
              onClick={action === "Login" ? handleLogin : handleRegister}
            >
              {action === "Login" ? "Ingresar" : "Crear cuenta"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenLoginSignup;