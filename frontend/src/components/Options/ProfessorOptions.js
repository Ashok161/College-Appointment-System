import React from "react";
import { useNavigate } from "react-router-dom";

const ProfessorOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Professor Portal</h1>
      <div>
        <button
          className="btn btn-primary me-3"
          onClick={() => navigate("/professor-register")}
        >
          Register
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/professor-login")}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default ProfessorOptions;
