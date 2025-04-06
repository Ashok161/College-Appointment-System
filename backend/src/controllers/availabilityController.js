const Availability = require("../models/Availability");

exports.setAvailability = async (req, res) => {
  try {
    if (req.user.role !== "professor") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { availabilities } = req.body;
    if (!availabilities || !Array.isArray(availabilities)) {
      return res
        .status(400)
        .json({ message: "Availabilities must be an array" });
    }
    const availabilitiesData = availabilities.map((range) => ({
      professor: req.user.id,
      startTime: new Date(range.startTime),
      endTime: new Date(range.endTime),
    }));
    const createdAvailabilities = await Availability.insertMany(
      availabilitiesData
    );
    return res.status(201).json({
      message: "Availability set successfully",
      availabilities: createdAvailabilities,
    });
  } catch (error) {
    console.error("Set availability error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAvailabilityByProfessor = async (req, res) => {
  try {
    const { professorId } = req.params;
    const availabilities = await Availability.find({
      professor: professorId,
      isBooked: false,
    });
    return res.status(200).json(availabilities);
  } catch (error) {
    console.error("Get availability error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllAvailability = async (req, res) => {
  try {
    const availabilities = await Availability.find({ isBooked: false });
    return res.status(200).json(availabilities);
  } catch (error) {
    console.error("Get all availability error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
