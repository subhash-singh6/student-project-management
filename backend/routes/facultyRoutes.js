const express = require("express");
const router  = express.Router();
const {
  getAssignedStudents,
  giveFeedback,
  scheduleMeeting,
  getAllTeachers,
} = require("../controllers/facultyController"); // 🧠 Fix: Updated controller map
const { protect }     = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.use(protect);

router.get("/all",       getAllTeachers);
router.get("/students",  allowRoles("teacher"),  getAssignedStudents); // 🧠 Fix: Mentor roles shifted to teacher
router.post("/feedback", allowRoles("teacher"),  giveFeedback);
router.post("/meeting",  allowRoles("teacher"),  scheduleMeeting);

module.exports = router;