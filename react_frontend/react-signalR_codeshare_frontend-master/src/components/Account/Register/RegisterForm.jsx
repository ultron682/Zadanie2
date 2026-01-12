import React, { useState } from "react";
import axios from "axios";
import "../Form.css";
import { Link } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5555/account/register",
        {
          username,
          email,
          password,
        }
      );
      // Obsługa pomyślnej rejestracji
      console.log("Registration successful:", response.data);
      setSuccess(
        "Registration successful. Please check your email to confirm."
      );
      setError("");
    } catch (error) {
      // Obsługa błędu rejestracji
      console.error("Error registering:", error);

      if (error.response.status === 450) {
        setError("Username already taken");
      } else if (error.response.status === 452) {
        setError("Email already taken");
      } else if (error.response.status === 454) {
        // weak password
        if (error.response.data === "PasswordTooShort") {
          setError("Password is too short. Minimum 6 characters required.");
        } else if (error.response.data === "PasswordRequiresNonAlphanumeric") {
          setError(
            "Password must have at least one non-alphanumeric character."
          );
        } else if (error.response.data === "PasswordRequiresDigit") {
          setError("Password must have at least one digit ('0'-'9').");
        } else if (error.response.data === "PasswordRequiresLower") {
          setError("Password must have at least one lowercase ('a'-'z').");
        } else if (error.response.data === "PasswordRequiresUpper") {
          setError("Password must have at least one uppercase ('A'-'Z').");
        } else if (error.response.data === "InvalidUserName") {
          setError(
            "Username is invalid. Only letters, digits, and underscores are allowed."
          );
        } else {
          setError("Registration failed. Please try again.");
        }
      } else {
        setError("Registration failed. Please try again.");
      }

      setSuccess("");
    }

    setIsLoading(false);
  };

  return (
    <div className="form-container">
      <h2>{t("register")}</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>{t("username")}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>{t("email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>{t("password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        {!success && (
          <button type="submit" className="submit-btn">
            {t("register")}
            {<BounceLoader loading={isLoading} size="20px" color="white" />}
          </button>
        )}
      </form>
      <p className="toggle-text">
        <Link to="/account/login" className="account-link">
          {t("alreadytHaveAccount")} <span>{t("loginHere")}</span>
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
