import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./CheckoutStatus.module.css";

const CheckoutPending: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.statusContainer + " " + styles.pending}>
      <div className={styles.icon}>⏳</div>
      <h1>Pago pendiente</h1>
      <p>
        Tu pago está pendiente de acreditación.<br />
        Te avisaremos cuando se confirme.
      </p>
      <span className={styles.redirectMsg}>Redirigiendo a inicio...</span>
    </div>
  );
};

export default CheckoutPending;