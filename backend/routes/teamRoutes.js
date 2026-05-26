const express = require("express");

const router = express.Router();

const {
  createTeam,

  getMyTeam,

  getAllTeams,

  addMember,

  removeMember,

  updateTeam,

  deleteTeam,

  leaveTeam,
} = require("../controllers/teamController");

const { protect } = require("../middleware/authMiddleware");

const { allowRoles } = require("../middleware/roleMiddleware");

/* ====================================== */
/* PROTECT */
/* ====================================== */

router.use(protect);

/* ====================================== */
/* TEAM ROUTES */
/* ====================================== */

router
  .route("/")

  .get(
    allowRoles("teacher", "admin"),

    getAllTeams,
  )

  .post(
    allowRoles("student"),

    createTeam,
  );

/* ====================================== */
/* MY TEAM */
/* ====================================== */

router.get(
  "/my-team",

  allowRoles("student"),

  getMyTeam,
);

/* ====================================== */
/* ADD MEMBER */
/* ====================================== */

router.post(
  "/:id/add-member",

  allowRoles("student"),

  addMember,
);

/* ====================================== */
/* REMOVE MEMBER */
/* ====================================== */

router.delete(
  "/:id/remove-member/:userId",

  allowRoles("student"),

  removeMember,
);

/* ====================================== */
/* UPDATE TEAM */
/* ====================================== */

router.put(
  "/:id",

  allowRoles("student"),

  updateTeam,
);

/* ====================================== */
/* DELETE TEAM */
/* ====================================== */

router.delete(
  "/:id",

  allowRoles("student"),

  deleteTeam,
);

/* ====================================== */
/* LEAVE TEAM */
/* ====================================== */

router.put(
  "/:id/leave",

  allowRoles("student"),

  leaveTeam,
);

module.exports = router;
