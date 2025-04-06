const express = require("express");
const router = express.Router();
const availabilityController = require("../controllers/availabilityController");
const auth = require("../middleware/auth");

router.post("/", auth, availabilityController.setAvailability);
router.get("/", auth, availabilityController.getAllAvailability);
router.get(
  "/:professorId",
  auth,
  availabilityController.getAvailabilityByProfessor
);

module.exports = router;
