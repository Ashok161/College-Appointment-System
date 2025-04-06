import React from "react";
import { useNavigate } from "react-router-dom";

const StudentOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Student Portal</h1>
      <div>
        <button
          className="btn btn-primary me-3"
          onClick={() => navigate("/student-register")}
        >
          Register
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/student-login")}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default StudentOptions;
