// import React, { createContext, useContext, useState, useEffect } from "react";
// import { isLoggedIn, loggedUser, logout } from "../services/authService";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuth, setIsAuth] = useState(false);

//   useEffect(() => {
//     if (isLoggedIn()) {
//       setUser(loggedUser());
//       setIsAuth(true);
//     }
//   }, []);

//   const loginUser = (data) => {
//     // Save to localStorage
//     localStorage.setItem("token", data.token);
//     localStorage.setItem("user", JSON.stringify(data.user));
//     localStorage.setItem("userData",JSON.stringify(data.subscription || null));
//     setUser(data.user);
//     setIsAuth(true);
//   };

//   const logoutUser = () => {
//     logout(); // clears storage
//     setUser(null);
//     setIsAuth(false);
//   };

//   return (
//     <AuthContext.Provider value={{ user, isAuth, loginUser, logoutUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook to use the context
// export const useAuth = () => useContext(AuthContext);


import React, { createContext, useContext, useState, useEffect } from "react";
import { isLoggedIn, loggedUser, logout, getFullUserData } from "../services/authService";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [fullUserData, setFullUserData] = useState(null);

  const hasActiveSubscription = (() => {
    if (!fullUserData?.subscription || !fullUserData.subscription.is_active) return false;
    const endDate = new Date(fullUserData.subscription.end_date);
    return endDate > new Date();
  })();

  useEffect(() => {
    // ✅ Don’t immediately logout if token missing after redirect (graceful check)
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const userData = localStorage.getItem("userData");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setFullUserData(userData ? JSON.parse(userData) : null);
        setIsAuth(true);
      } catch (err) {
        console.error("Error restoring auth:", err);
        setUser(null);
        setIsAuth(false);
      }
    }

    setAuthLoading(false); // ✅ Mark done even if no token to prevent redirect loops
  }, []);

  useEffect(() => {
    const mainParent = document.querySelector(".main-section-parent");
    if (!mainParent) return;

    if (hasActiveSubscription) {
      mainParent.classList.add("sub-main-padding");
    } else {
      mainParent.classList.remove("sub-main-padding");
    }
  }, [hasActiveSubscription]);

  const loginUser = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("userData", JSON.stringify(data));
    setUser(data.user);
    setFullUserData(data);
    setIsAuth(true);
  };

  const logoutUser = () => {
    logout(); // clears storage
    setUser(null);
    setFullUserData(null);
    setIsAuth(false);
  };

  const updateUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // ✅ Prevent calling API when token missing (no logout)
    try {
      const res = await api.get("/user");
      setFullUserData(res.data);
      localStorage.setItem("userData", JSON.stringify(res.data));
    } catch (err) {
      console.error("Error refreshing user data:", err);
      // ❌ Do NOT logout automatically here
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        authLoading,
        fullUserData,
        hasActiveSubscription,
        updateUserData,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
