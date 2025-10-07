import React, { createContext, useContext, useState, useEffect } from "react";
import { isLoggedIn, loggedUser, logout } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      setUser(loggedUser());
      setIsAuth(true);
    }
  }, []);

  const loginUser = (data) => {
    // Save to localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("userData", JSON.stringify(data.userData));
    setUser(data.user);
    setIsAuth(true);
  };

  const logoutUser = () => {
    logout(); // clears storage
    setUser(null);
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuth, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the context
export const useAuth = () => useContext(AuthContext);
