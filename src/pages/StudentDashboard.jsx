import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null; // safety check

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {user.username}</h1>
      <h3>Roll: {user.studentRoll}</h3>
      <h3>Role: {user.role}</h3>

      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link to="/room">
          <button style={{ padding: "10px" }}>My Room</button>
        </Link>
        <Link to="/complaints">
          <button style={{ padding: "10px" }}>My Complaints</button>
        </Link>
        <button
          onClick={logout}
          style={{ padding: "10px", marginTop: "20px", backgroundColor: "red", color: "white" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
