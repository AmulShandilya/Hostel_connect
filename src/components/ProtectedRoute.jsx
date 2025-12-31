import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

/**
 * ProtectedRoute component
 * @param {ReactNode} children - component to render if authorized
 * @param {string[]} roles - array of allowed roles, e.g., ["admin"]
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (roles.length && !roles.includes(user.role)) {
    // Logged in but role not allowed
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
