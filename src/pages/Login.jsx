import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      if (res.data.role === "student") {
  try {
    await axios.post(
      "http://localhost:5000/api/rooms/allocate",
      {},
      {
        headers: {
          Authorization: `Bearer ${res.data.accessToken}`,
        },
      }
    );
  } catch (err) {
    // Ignore error if already allocated
    console.log("Room allocation skipped:", err.response?.data?.message);
  }
}
      console.log("LOGIN RESPONSE:", res.data);

      // Save user in context + localStorage
      login(res.data);

      // Redirect based on role
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Login</button>
      </form>
      <p>
  Don't have an account? <a href="/register">Register here</a>
</p>
    </div>
  );
};

export default Login;
