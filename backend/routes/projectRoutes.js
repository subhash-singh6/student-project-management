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

router.use(protect);

router.route("/")
  .get(getAllProjects)
  .post(allowRoles("student"), createProject);

router.route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(allowRoles("student"), deleteProject);

// 🧠 Fix: Mentor hata kar 'admin' add kiya taaki higher authority bhi approve kar sake
router.put("/:id/approve", allowRoles("teacher", "admin"), approveProject);
router.put("/:id/grade",   allowRoles("teacher"),           gradeProject);

module.exports = router;