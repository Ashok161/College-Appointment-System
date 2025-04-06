// frontend/src/components/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container home-container mt-5">
      <h1 className="text-center mb-5">College Appointment System</h1>
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div
            className="card home-card mb-4 shadow-sm"
            onClick={() => navigate("/student-options")}
          >
            <div className="card-body text-center">
              <h2 className="card-title">Student</h2>
              <p className="card-text">
                Access the student portal to register, login, and book
                appointments with professors.
              </p>
              <button
                className="btn btn-primary mt-3"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/student-options");
                }}
              >
                Go to Student Portal
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div
            className="card home-card mb-4 shadow-sm"
            onClick={() => navigate("/professor-options")}
          >
            <div className="card-body text-center">
              <h2 className="card-title">Professor</h2>
              <p className="card-text">
                Manage your availability, register, and login to view or cancel
                appointments.
              </p>
              <button
                className="btn btn-secondary mt-3"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/professor-options");
                }}
              >
                Go to Professor Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
