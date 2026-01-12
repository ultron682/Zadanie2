import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../AuthContext";
import { useTheme } from "../ThemeContext";

const LandingPage = () => {
  const [uniqueId, setUniqueId] = useState("");
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();

  const generateUniqueId = () => {
    return "xxxxx".replace(/x/g, () => {
      return Math.floor(Math.random() * 16).toString(16);
    });
  };

  useEffect(() => {
    setUniqueId(generateUniqueId());
  }, []);

  return (
    <div
      className={[
        styles.landing_container,
        theme === "light" ? styles.light_theme : styles.dark_theme,
      ].join(" ")}
    >
      <div className={styles.header}>
        <h1>{t("welcomeTo")}</h1>
        <p>{t("yourJourney")}</p>
      </div>

      <div className={styles.button_group}>
        <Link to={uniqueId} className={styles.landing_button}>
          {t("startHere")}
        </Link>
      </div>

      {user == null && (
        <div className={styles.button_group}>
          <Link to="/account/login" className={styles.landing_button}>
            {t("login")}
          </Link>
          <Link to="/account/register" className={styles.landing_button}>
            {t("register")}
          </Link>
        </div>
      )}

      <section className={styles.features_section}>
        <h2>{t("featuresTitle")}</h2>
        <ul className={styles.features_list}>
          <li>
            <img width="35rem" src="/icons/feature1.png" alt="Feature 1" />
            <p>{t("feature1")}</p>
          </li>
          <li>
            <img width="35rem" src="/icons/feature2.png" alt="Feature 2" />
            <p>{t("feature2")}</p>
          </li>
          <li>
            <img width="35rem" src="/icons/feature3.png" alt="Feature 3" />
            <p>{t("feature3")}</p>
          </li>
        </ul>
      </section>

      <div className={styles.video_container}>
        <video className={styles.background_video} autoPlay loop muted>
          <source src="landing_video.mp4" type="video/mp4" />
          {t("videoNotSupported")}
        </video>
        <div className={styles.video_overlay}></div>
      </div>

      <section className={styles.testimonials_section}>
        <h2>{t("userTestimonials")}</h2>
        <blockquote className={styles.testimonial}>
          <p>{t("testimonial1")}</p>
          <div className={styles.testimonial_author}>
            {t("testimonial1Author")}
          </div>
        </blockquote>
        <blockquote className={styles.testimonial}>
          <p>{t("testimonial2")}</p>
          <div className={styles.testimonial_author}>
            {t("testimonial2Author")}
          </div>
        </blockquote>
      </section>
    </div>
  );
};

export default LandingPage;
