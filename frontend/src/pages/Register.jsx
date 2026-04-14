import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {   // ✅ changed name
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", { // ✅ changed API
        username,
        password,
      });

      alert("Registered successfully!");
      navigate("/login"); // ✅ redirect to login
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Register</h2>  {/* ✅ changed title */}

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

        <button type="submit">Register</button> {/* ✅ changed text */}
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link> {/* ✅ reversed */}
      </p>
    </div>
  );
};

export default Register; // ✅ changed export