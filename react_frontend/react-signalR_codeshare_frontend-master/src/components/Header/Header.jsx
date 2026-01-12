import React, { useContext, useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import { useTheme } from "../ThemeContext";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { AuthContext } from "../AuthContext";
import { useTranslation } from "react-i18next";

function Header() {
  const { toggleTheme, theme } = useTheme();
  const { user } = useContext(AuthContext);
  const {
    //  t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "pl" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
    localStorage.setItem("i18nextLng", currentLanguage);
  };
  return (
    <header
      className={`header ${theme === "light" ? "light-theme" : "dark-theme"}`}
    >
      <div className="header-content">
        <div className="logo-container">
          <Link to="/" className="logo">
            <h1>CodeShare</h1>
          </Link>
        </div>
        {/* <nav className="nav">
          <Link to="/contact">{t("contact")}</Link>
        </nav> */}
        <div className="actions">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === "light" ? (
              <MdLightMode size={24} />
            ) : (
              <MdDarkMode size={24} />
            )}
          </button>
          <button
            onClick={handleChangeLanguage}
            className="language-toggle-btn"
          >
            {currentLanguage.toUpperCase()}
          </button>
          {user ? (
            <Link to="/account" className="account-link">
              <VscAccount size={24} /> <span>{user.userName}</span>
            </Link>
          ) : (
            <Link to="/account/login" className="account-link">
              <VscAccount size={24} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
