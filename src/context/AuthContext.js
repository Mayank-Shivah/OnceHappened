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
    if (isLoggedIn()) {
      const u = loggedUser();
      const full = getFullUserData();
      setUser(u);
      setFullUserData(full);
      setIsAuth(true);
    }
  }, []);

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

  return (
    <AuthContext.Provider value={{
      user,
      isAuth,
      fullUserData,
      hasActiveSubscription,
      loginUser,
      logoutUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the context
export const useAuth = () => useContext(AuthContext);
