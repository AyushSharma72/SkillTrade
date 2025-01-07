"use client";

import { useState, useEffect, useContext, createContext } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("auth");

    if (data) {
      try {
        const parsedData = JSON.parse(data);

        // Set cookies when auth data is retrieved
        if (parsedData.token) {
          Cookies.set("token", parsedData.token, { expires: 7, path: "/" });
        }
        if (parsedData.user || parsedData.worker) {
          Cookies.set(
            "user",
            JSON.stringify(parsedData.user || parsedData.worker),
            { expires: 7, path: "/" }
          );
        }

        setAuth((prevAuth) => ({
          ...prevAuth,
          user: parsedData.user || parsedData.worker || null,
          token: parsedData.token || "",
        }));
      } catch (error) {
        console.error("Failed to parse auth data from localStorage:", error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
