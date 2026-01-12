import React, { useEffect, useContext, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import CodeEditor from "./components/CodeEditor/CodeEditor";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LoginForm from "./components/Account/Login/LoginForm.jsx";
import RegisterForm from "./components/Account/Register/RegisterForm.jsx";
import AccountDashboard from "./components/Account/Dashboard/AccountDashboard.jsx";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import { AuthContext } from "./components/AuthContext";

import { useTheme } from "./components/ThemeContext";
import "./i18n.js";
import "./App.css";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import ConfirmedEmail from "./components/Account/ConfirmedEmail/ConfirmedEmail.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { theme } = useTheme();
  const { token } = useContext(AuthContext);
  const [isFooterHidden, setIsFooterHidden] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (location.pathname === "/") {
      setIsFooterHidden(false);
    } else {
      setIsFooterHidden(true);
    }
  }, [location]);

  return (
    <div className="app-container">
      <Header />

      <main
        className={[
          isFooterHidden ? "footer__hidden" : "",
          theme === "light" ? "light_theme" : "dark_theme",
        ].join(" ")}
      >
        <Routes>
          <Route path="/account/login" element={<LoginForm />} />
          <Route path="/account/register" element={<RegisterForm />} />
          <Route path="/account/confirmedEmail" element={<ConfirmedEmail />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute token={token}>
                <AccountDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/:id" element={<CodeEditor class="CodeEditor" />} />
          <Route index path="/" element={<LandingPage />} />
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </main>

      <Footer isHidden={isFooterHidden} />
    </div>
  );
}

export default App;
