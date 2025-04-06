const Appointment = require("../models/Appointment");
const Availability = require("../models/Availability");

exports.bookAppointment = async (req, res) => {
  try {
    const { availabilityId } = req.body;
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }
    if (!availabilityId) {
      return res.status(400).json({ message: "Availability ID is required" });
    }
    const availability = await Availability.findById(availabilityId);
    if (!availability || availability.isBooked) {
      return res.status(400).json({ message: "Time range not available" });
    }
    const appointment = new Appointment({
      student: req.user.id,
      professor: availability.professor,
      startTime: availability.startTime,
      endTime: availability.endTime,
      status: "booked",
    });
    await appointment.save();
    availability.isBooked = true;
    availability.appointment = appointment._id;
    await availability.save();
    return res
      .status(201)
      .json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    console.error("Book appointment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    if (req.user.role !== "professor") {
      return res.status(403).json({ message: "Access denied" });
    }
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (appointment.professor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    appointment.status = "cancelled";
    await appointment.save();
    const availability = await Availability.findOne({
      appointment: appointment._id,
    });
    if (availability) {
      availability.isBooked = false;
      availability.appointment = null;
      await availability.save();
    }
    return res
      .status(200)
      .json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "student") {
      query.student = req.user.id;
    } else if (req.user.role === "professor") {
      query.professor = req.user.id;
    }
    const appointments = await Appointment.find(query)
      .populate("student", "name")
      .populate("professor", "name");
    return res.status(200).json(appointments);
  } catch (error) {
    console.error("Get appointments error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
