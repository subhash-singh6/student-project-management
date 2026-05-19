const express = require("express");
const router  = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  approveProject,
  gradeProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect }    = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// Sab protected hain
router.use(protect);

router.route("/")
  .get(getAllProjects)
  .post(allowRoles("student"), createProject);

router.route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(allowRoles("student"), deleteProject);

router.put("/:id/approve", allowRoles("teacher", "mentor"), approveProject);
router.put("/:id/grade",   allowRoles("teacher"),           gradeProject);

module.exports = router;