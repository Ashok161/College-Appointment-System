import React, { useState, useEffect, useContext } from "react";
import api from "../../utils/api";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "student") navigate("/");
  }, [user, navigate]);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments");
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchAvailabilities = async () => {
    try {
      const res = await api.get("/availability");
      setAvailabilities(res.data);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    }
  };

  const bookAppointment = async (availabilityId) => {
    try {
      await api.post("/appointments/book", { availabilityId });
      alert("Appointment booked successfully!");
      fetchAppointments();
      fetchAvailabilities();
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Error booking appointment");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    fetchAppointments();
    fetchAvailabilities();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end">
        <button onClick={logout} className="btn btn-outline-secondary">
          Logout
        </button>
      </div>
      <h2 className="mt-3">Student Dashboard</h2>
      <div className="mt-4">
        <h4>My Appointments</h4>
        {appointments.length === 0 ? (
          <p>No appointments booked.</p>
        ) : (
          <ul className="list-group">
            {appointments.map((app) => (
              <li key={app._id} className="list-group-item">
                <strong>Teacher:</strong>{" "}
                {app.professor && app.professor.name
                  ? app.professor.name
                  : "Unknown"}{" "}
                <br />
                <strong>Time Range:</strong>{" "}
                {new Date(app.startTime).toLocaleString()} -{" "}
                {new Date(app.endTime).toLocaleString()} <br />
                <strong>Status:</strong> {app.status}
              </li>
            ))}
          </ul>
        )}
      </div>
      <hr />
      <div className="mt-4">
        <h4>Available Appointments</h4>
        {availabilities.length === 0 ? (
          <p>No availabilities found.</p>
        ) : (
          <ul className="list-group">
            {availabilities.map((slot) => (
              <li
                key={slot._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>Time Range:</strong>{" "}
                  {new Date(slot.startTime).toLocaleString()} -{" "}
                  {new Date(slot.endTime).toLocaleString()}
                </div>
                <button
                  onClick={() => bookAppointment(slot._id)}
                  className="btn btn-sm btn-primary"
                >
                  Book Appointment
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
