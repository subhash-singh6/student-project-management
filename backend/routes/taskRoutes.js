const express = require("express");
const router = express.Router();
const {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/project/:projectId", getTasksByProject);
router.post("/", createTask);
router.put("/:id", updateTask);
router.put("/:id/move", moveTask);
router.delete("/:id", deleteTask);

module.exports = router;