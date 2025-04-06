const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const auth = require("../middleware/auth");

router.post("/book", auth, appointmentController.bookAppointment);
router.delete(
  "/cancel/:appointmentId",
  auth,
  appointmentController.cancelAppointment
);
router.get("/", auth, appointmentController.getAppointments);

module.exports = router;
