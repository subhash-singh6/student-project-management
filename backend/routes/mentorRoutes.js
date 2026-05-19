const express = require("express");
const router  = express.Router();
const {
  getAssignedStudents,
  assignStudentToMentor,
  giveFeedback,
  scheduleMeeting,
  getAllMentors,
} = require("../controllers/mentorController");
const { protect }    = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.use(protect);

router.get("/all",       getAllMentors);
router.get("/students",  allowRoles("mentor"),  getAssignedStudents);
router.post("/assign",   allowRoles("teacher"), assignStudentToMentor);
router.post("/feedback", allowRoles("mentor"),  giveFeedback);
router.post("/meeting",  allowRoles("mentor"),  scheduleMeeting);

module.exports = router;