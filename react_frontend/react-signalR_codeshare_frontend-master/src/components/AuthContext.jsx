import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const fetchAccountInfo = useCallback(async () => {
    try {
      if (token === "") return;

      const response = await axios.get("http://localhost:5555/account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Błąd podczas pobierania informacji o koncie:", error);

      if (error.code === "ERR_NETWORK") {
        logout();
      }
    }
  }, [token]);

  const deleteSnippet = async (id) => {
    try {
      await axios.delete(`http://localhost:5555/account/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAccountInfo();
    } catch (error) {
      console.error("Błąd podczas usuwania kodu:", error);
    }
  };

  const changeNickname = async (newNickname) => {
    try {
      await axios.patch(
        "http://localhost:5555/account/nickname",
        { newUsername: newNickname },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/x-www-form-urlencoded",
          },
        }
      );
      fetchAccountInfo();
    } catch (error) {
      console.error("Błąd podczas zmiany pseudonimu:", error);
    }
  };

  const resendConfirmationEmail = async (email) => {
    try {
      await axios.post(
        "http://localhost:5555/account/send-confirmation-email",
        { email },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/x-www-form-urlencoded",
          },
        }
      );
    } catch (error) {
      console.error(
        "Błąd podczas ponownego wysyłania emaila potwierdzającego:",
        error
      );
    }
  };

  useEffect(() => {
    if (token) {
      fetchAccountInfo();
    }
  }, [token, fetchAccountInfo]);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        deleteSnippet,
        fetchAccountInfo,
        changeNickname,
        resendConfirmationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
