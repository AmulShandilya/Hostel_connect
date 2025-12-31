import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const Complaints = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [roomAllocated, setRoomAllocated] = useState(true); // new state

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints/my", {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      setComplaints(res.data);
    } catch (err) {
      if (err.response?.data?.message === "Student has no room allocated") {
        setRoomAllocated(false); // no room
      } else {
        alert(err.response?.data?.message || "Failed to fetch complaints");
      }
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/complaints",
        { title, message },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      setTitle("");
      setMessage("");
      fetchComplaints(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit complaint");
    }
  };

  if (!roomAllocated) {
    return <p>You cannot submit a complaint until a room is allocated. Please contact admin.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Complaints</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <input
          type="text"
          name="message"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "8px" }}>
          Submit
        </button>
      </form>

      <ul>
        {complaints.map((c) => (
          <li key={c._id} style={{ marginBottom: "10px" }}>
            <strong>{c.title}</strong> - {c.message}{" "}
            {c.status && <span>({c.status})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Complaints;
