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
  
  // Store full user data (which includes subscription) in context
  const [fullUserData, setFullUserData] = useState(null);

  // Derived membership/subscription status
  const hasActiveSubscription = (() => {
    if (!fullUserData?.subscription || !fullUserData.subscription.is_active) {
      return false;
    }
    // If there is an end date, check it's still in the future
    const endDate = new Date(fullUserData.subscription.end_date);
    return endDate > new Date();
  })();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const userData = localStorage.getItem("userData");

    // ✅ if token exists, restore immediately
    if (token && user) {
      try {
        setUser(JSON.parse(user));
        setFullUserData(userData ? JSON.parse(userData) : null);
        setIsAuth(true);
      } catch (err) {
        console.error("Error restoring auth:", err);
        setUser(null);
        setFullUserData(null);
        setIsAuth(false);
      }
    }
  }, []);

  
  // ✅ Conditionally add/remove class based on subscription
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
    // Save to localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("userData", JSON.stringify(data)); 
      // Note: I stored `data` (which includes subscription, user, token etc)
      // If your data object has a different shape, adjust accordingly.

    // Update local context state
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

  // ✅ New: refresh user data after subscription update
  const updateUserData = async () => {
    try {
      const res = await api.get("/user"); // get latest data from backend
      setFullUserData(res.data);
      localStorage.setItem("userData", JSON.stringify(res.data));
    } catch (err) {
      console.error("Error refreshing user data:", err);
    }
  };

  

  return (
    <AuthContext.Provider value={{
      user,
      isAuth,
      fullUserData,
      hasActiveSubscription,
      updateUserData,
      loginUser,
      logoutUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the context
export const useAuth = () => useContext(AuthContext);
