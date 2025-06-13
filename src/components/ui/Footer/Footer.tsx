import { Facebook, Instagram, Twitter } from "lucide-react";
import logo from "../../assets/images.png";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerInfo}>
            <p>Argentina</p>
            <p>Contacto: info@ashop.com</p>
            <p>Teléfono: +54 11 1111 1111</p>
            <p>Horario: Lunes a Viernes, 9:00 - 20:00</p>
          </div>

          <div className={styles.footerLogo}>
            <img src={logo} alt="Logo aShop" />
            <p className={styles.shopName}>aShop</p>
          </div>

          <div className={styles.footerSocials}>
            <a
              href="https://instagram.com/ashop"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram />
            </a>
            <a
              href="https://twitter.com/ashop"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Twitter />
            </a>
            <a
              href="https://facebook.com/ashop"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;