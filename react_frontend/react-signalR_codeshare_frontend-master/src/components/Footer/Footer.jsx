import React from "react";
import styles from "./Footer.module.css";
import { useTranslation } from "react-i18next";
import { useTheme } from "../ThemeContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

function Footer({ isHidden }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <footer
      className={[
        styles.Footer,
        theme === "light" ? styles.light_theme : styles.dark_theme,
        isHidden ? styles.hidden : ''
      ].join(' ')}
    >
      <div className={styles.links}>
        <a href="/privacy-policy" className={styles.link}>{t("privacyPolicy")}</a>
        <a href="/terms-of-service" className={styles.link}>{t("termsOfService")}</a>
      </div>
      <div className={styles.socialMedia}>
        <a href="https://twitter.com/ultron682" className={styles.socialLink} aria-label="Twitter" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faXTwitter} />
        </a>
        <a href="https://facebook.com/ultron682" className={styles.socialLink} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFacebook} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
