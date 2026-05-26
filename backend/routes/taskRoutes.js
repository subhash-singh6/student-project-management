const express = require("express");

const router = express.Router();

const {

  getTasksByProject,

  createTask,

  updateTask,

  deleteTask,

  moveTask,

} = require("../controllers/taskController");

const {

  protect,

} = require("../middleware/authMiddleware");

/* ======================================== */
/* PROTECTED ROUTES */
/* ======================================== */

router.use(protect);

/* ======================================== */
/* GET PROJECT TASKS */
/* ======================================== */

router.get(

  "/project/:projectId",

  getTasksByProject

);

/* ======================================== */
/* CREATE TASK */
/* ======================================== */

router.post(

  "/",

  createTask

);

/* ======================================== */
/* UPDATE TASK */
/* ======================================== */

router.put(

  "/:id",

  updateTask

);

/* ======================================== */
/* MOVE TASK */
/* ======================================== */

router.put(

  "/:id/move",

  moveTask

);

/* ======================================== */
/* DELETE TASK */
/* ======================================== */

router.delete(

  "/:id",

  deleteTask

);

module.exports = router;