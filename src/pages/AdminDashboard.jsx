import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);

  if (!user) return null; // safety check

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints", {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      setComplaints(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch complaints");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleResolve = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/resolve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      fetchComplaints(); // refresh after resolving
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resolve complaint");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <h3>Welcome, {user.username}</h3>

      <button
        onClick={logout}
        style={{ padding: "10px", marginBottom: "20px", backgroundColor: "red", color: "white" }}
      >
        Logout
      </button>

      <h2>All Complaints</h2>
      <ul>
        {complaints.map((c) => (
          <li key={c._id} style={{ marginBottom: "10px" }}>
            <strong>{c.title}</strong> - {c.message} <br />
            Student: {c.student?.username} ({c.student?.studentRoll}) <br />
            Room: {c.room?.hostelName} - {c.room?.roomNumber} <br />
            Status: {c.status || "Pending"}{" "}
            {c.status !== "Resolved" && (
              <button onClick={() => handleResolve(c._id)} style={{ marginLeft: "10px" }}>
                Resolve
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
