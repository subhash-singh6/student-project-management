// backend/routes/projectRoutes.js

const express = require("express");

const router = express.Router();

/* ====================================== */
/* CONTROLLERS */
/* ====================================== */

const {

  createProject,

  getAllProjects,

  getProjectById,

  updateProject,

  approveProject,

  gradeProject,

  deleteProject,

  uploadProjectAttachment,

} = require("../controllers/projectController");

/* ====================================== */
/* MIDDLEWARES */
/* ====================================== */

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  allowRoles,
} = require("../middleware/roleMiddleware");

const {
  uploadSubmission,
} = require("../middleware/uploadMiddleware");

/* ====================================== */
/* PROTECTED ROUTES */
/* ====================================== */

router.use(protect);

/* ====================================== */
/* PROJECT ROUTES */
/* ====================================== */

router
  .route("/")

  .get(getAllProjects)

  .post(
    allowRoles("student"),
    createProject
  );

router
  .route("/:id")

  .get(getProjectById)

  .put(updateProject)

  .delete(
    allowRoles("student"),
    deleteProject
  );

/* ====================================== */
/* APPROVE / REJECT */
/* ====================================== */

router.put(

  "/:id/approve",

  allowRoles(
    "teacher",
    "admin"
  ),

  approveProject

);

/* ====================================== */
/* GRADE PROJECT */
/* ====================================== */

router.put(

  "/:id/grade",

  allowRoles("teacher"),

  gradeProject

);

/* ====================================== */
/* UPLOAD PROJECT ATTACHMENT */
/* ====================================== */

router.post(

  "/:id/upload",

  allowRoles("student"),

  uploadSubmission.single("file"),

  uploadProjectAttachment

);

/* ====================================== */
/* EXPORT */
/* ====================================== */

module.exports = router;