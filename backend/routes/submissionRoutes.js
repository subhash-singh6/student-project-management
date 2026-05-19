const express = require("express");
const router = express.Router();
const {
  createSubmission,
  getMySubmissions,
  getProjectSubmissions,
  reviewSubmission,
} = require("../controllers/submissionController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { uploadSubmission } = require("../middleware/uploadMiddleware");

router.use(protect);

router.post("/", uploadSubmission.single("file"), allowRoles("student"), createSubmission);
router.get("/my", allowRoles("student"), getMySubmissions);
router.get("/project/:projectId", getProjectSubmissions);
router.put("/:id/review", allowRoles("teacher", "mentor"), reviewSubmission);

module.exports = router;
