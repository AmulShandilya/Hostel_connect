import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  /**
   * ✅ LOGIN
   * Stores authenticated user data from backend
   */
  const login = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  /**
   * ✅ LOGOUT
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  /**
   * ✅ Automatically attach token to all axios requests
   */
  useEffect(() => {
    if (user?.accessToken) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${user.accessToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
