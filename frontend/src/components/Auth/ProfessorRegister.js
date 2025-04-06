import React, { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

const ProfessorRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { ...formData, role: "professor" });
      alert("Registration successful, please login.");
      navigate("/professor-login");
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Professor Registration</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit" style={{ marginTop: "20px" }}>
          Register
        </button>
      </form>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/professor-login")}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default ProfessorRegister;
