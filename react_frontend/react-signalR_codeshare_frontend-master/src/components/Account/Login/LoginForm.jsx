import React, { useState, useContext } from "react";
import axios from "axios";
import "../Form.css";
import "./LoginForm.module.css";
import { AuthContext } from "../../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, resendConfirmationEmail } = useContext(AuthContext);
  const [emailResent, setEmailResent] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5555/account/login", {
        email,
        password,
      });
      console.log(response.data);
      // Obsługa pomyślnego logowania
      login(response.data.accessToken);
      console.log("Login successful:", response.data.accessToken);
      navigate("/account");
    } catch (error) {
      // Obsługa błędu logowania
      console.error("Error logging in:", error);

      if (error.response.status === 470) {
        setError("Please confirm your email address");
        setEmailConfirmed(false);
      } else {
        setError("Invalid email or password");
      }
    }

    setIsLoading(false);
  };

  const handleResendEmail = async (e) => {
    e.preventDefault();
    try {
      await resendConfirmationEmail(email);
      setEmailResent(true);
    } catch (error) {
      console.error("Error resending confirmation email:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>{t("login")}</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
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

        {!emailConfirmed && (
          <div className="email-confirmation-box">
            <p>{t("notEmailConfirmed")}</p>
            <p>{t("pleaseConfAccount")}</p>
            {emailResent ? (
              <p className="email-resent-message">{t("emailResent")}</p>
            ) : (
              <button
                className="resend-email-button"
                onClick={handleResendEmail}
              >
                {t("resendEmail")}
              </button>
            )}
          </div>
        )}

        <button type="submit" className="submit-btn">
          Login {<BounceLoader loading={isLoading} size="20px" color="white" />}
        </button>
      </form>
      <p className="toggle-text">
        <Link to="/account/register" className="account-link">
          {t("noAccount")} <span>{t("registerHere")}</span>
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
