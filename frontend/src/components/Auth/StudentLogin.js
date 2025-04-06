import React, { useState, useContext } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.role !== "student") {
        alert("Not a student account");
        return;
      }
      setUser(res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("role", res.data.role);
      navigate("/student-dashboard");
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Student Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit" style={{ marginTop: "20px" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default StudentLogin;
