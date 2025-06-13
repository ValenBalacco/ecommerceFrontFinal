import { Facebook, Instagram, Twitter } from "lucide-react";
import logo from "../../assets/images.png";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLogo}>
          <img src={logo} alt="Logo aShop" />
          <span className={styles.shopName}>aShop</span>
        </div>

        <div className={styles.footerInfo}>
          <span>Argentina</span>
          <span>|</span>
          <a href="mailto:info@ashop.com">info@ashop.com</a>
          <span>|</span>
          <span>+54 11 1111 1111</span>
          <span>|</span>
          <span>Lun a Vie 9-20h</span>
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
      <div className={styles.footerCopy}>
        &copy; {new Date().getFullYear()} aShop. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;