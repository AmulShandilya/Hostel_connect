import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [gender, setGender] = useState("");
  const [selectedHostel, setSelectedHostel] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");

  // Hardcoded hostels (minimal change)
  const hostels = ["Kautilya", "Aryabhatt", "Kadambari"];

  // Fetch rooms whenever hostel changes
 useEffect(() => {
  const fetchRooms = async () => {
    if (!selectedHostel) {
      setAvailableRooms([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/rooms/available/${selectedHostel}`
      );

      setAvailableRooms(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch rooms for selected hostel");
      setAvailableRooms([]);
    }
  };

  fetchRooms();
}, [selectedHostel]);


 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!username || !password || !studentRoll || !gender) {
    return alert("Please fill all required fields");
  }

  try {
    // 1️⃣ Register user
    const res = await axios.post("http://localhost:5000/api/auth/register", {
      username,
      password,
      studentRoll,
    });

    console.log("REGISTER RESPONSE:", res.data);

    // 2️⃣ Log in the user
    login(res.data);

    // 3️⃣ Allocate room automatically
    await axios.post(
      "http://localhost:5000/api/rooms/allocate",
      {},
      { headers: { Authorization: `Bearer ${res.data.accessToken}` } }
    );

    // 4️⃣ Navigate to dashboard
    if (res.data.role === "student") {
      navigate("/"); // student dashboard
    } else {
      navigate("/admin");
    }
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Registration failed");
  }
};

  return (
    <div style={{ padding: "40px" }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          name="studentRoll"
          placeholder="Student Roll"
          value={studentRoll}
          onChange={(e) => setStudentRoll(e.target.value)}
          required
        />
        <br /><br />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <br /><br />

        <select
          value={selectedHostel}
          onChange={(e) => setSelectedHostel(e.target.value)}
          required
        >
          <option value="">Select Hostel</option>
          {hostels.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        <br /><br />

        <select
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          required
        >
          <option value="">Select Room</option>
          {availableRooms.map((r) => (
            <option key={r._id} value={r.roomNumber}>
              {r.roomNumber} ({r.occupants?.length || 0}/{r.capacity})
            </option>
          ))}
        </select>
        <br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
