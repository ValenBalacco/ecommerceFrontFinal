import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./CheckoutStatus.module.css";

const CheckoutFailure: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.statusContainer + " " + styles.failure}>
      <div className={styles.icon}>❌</div>
      <h1>Pago rechazado</h1>
      <p>
        Tu pago no pudo ser procesado.<br />
        Por favor, intenta nuevamente o usa otro medio de pago.
      </p>
      <span className={styles.redirectMsg}>Redirigiendo a inicio...</span>
    </div>
  );
};

export default CheckoutFailure;