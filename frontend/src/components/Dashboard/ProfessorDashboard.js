import React, { useState, useEffect, useContext } from "react";
import api from "../../utils/api";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const ProfessorDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [availabilities, setAvailabilities] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newSlotStart, setNewSlotStart] = useState("");
  const [newSlotEnd, setNewSlotEnd] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "professor") navigate("/");
  }, [user, navigate]);

  const fetchAvailabilities = async () => {
    try {
      const professorId = localStorage.getItem("userId");
      const res = await api.get(`/availability/${professorId}`);
      setAvailabilities(res.data);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments");
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const addAvailability = async () => {
    if (!newSlotStart || !newSlotEnd) {
      alert("Please select both start and end times");
      return;
    }
    try {
      await api.post("/availability", {
        availabilities: [{ startTime: newSlotStart, endTime: newSlotEnd }],
      });
      alert("Availability added");
      setNewSlotStart("");
      setNewSlotEnd("");
      fetchAvailabilities();
    } catch (error) {
      console.error("Error adding availability:", error);
      alert("Failed to add availability");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await api.delete(`/appointments/cancel/${appointmentId}`);
      alert("Appointment cancelled successfully!");
      fetchAppointments();
      fetchAvailabilities();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    fetchAvailabilities();
    fetchAppointments();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end">
        <button onClick={logout} className="btn btn-outline-secondary">
          Logout
        </button>
      </div>
      <h2 className="mt-3">Professor Dashboard</h2>
      <div className="mt-4">
        <h4>Set Availability</h4>
        <div className="row g-2 align-items-center mb-3">
          <div className="col-md-5">
            <input
              type="datetime-local"
              className="form-control"
              value={newSlotStart}
              onChange={(e) => setNewSlotStart(e.target.value)}
            />
          </div>
          <div className="col-md-5">
            <input
              type="datetime-local"
              className="form-control"
              value={newSlotEnd}
              onChange={(e) => setNewSlotEnd(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button onClick={addAvailability} className="btn btn-primary w-100">
              Add
            </button>
          </div>
        </div>
        {availabilities.length === 0 ? (
          <p>No availabilities set.</p>
        ) : (
          <ul className="list-group">
            {availabilities.map((slot) => (
              <li key={slot._id} className="list-group-item">
                <strong>Time Range:</strong>{" "}
                {new Date(slot.startTime).toLocaleString()} -{" "}
                {new Date(slot.endTime).toLocaleString()} |{" "}
                <strong>Booked:</strong> {slot.isBooked ? "Yes" : "No"}
              </li>
            ))}
          </ul>
        )}
      </div>
      <hr />
      <div className="mt-4">
        <h4>Your Appointments</h4>
        {appointments.length === 0 ? (
          <p>No appointments scheduled.</p>
        ) : (
          <ul className="list-group">
            {appointments.map((app) => (
              <li key={app._id} className="list-group-item">
                <strong>Student:</strong>{" "}
                {app.student && app.student.name ? app.student.name : "Unknown"}{" "}
                <br />
                <strong>Time Range:</strong>{" "}
                {new Date(app.startTime).toLocaleString()} -{" "}
                {new Date(app.endTime).toLocaleString()} <br />
                <strong>Status:</strong> {app.status} <br />
                {app.status === "booked" && (
                  <button
                    onClick={() => cancelAppointment(app._id)}
                    className="btn btn-sm btn-danger mt-2"
                  >
                    Cancel Appointment
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfessorDashboard;
