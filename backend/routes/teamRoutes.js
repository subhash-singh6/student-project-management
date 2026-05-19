const express = require("express");
const router  = express.Router();
const {
  createTeam,
  getMyTeam,
  getAllTeams,
  addMember,
  removeMember,
} = require("../controllers/teamController");
const { protect }    = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.use(protect);

router.route("/")
  .get(allowRoles("teacher", "mentor"), getAllTeams)
  .post(allowRoles("student"),          createTeam);

router.get("/my", allowRoles("student"), getMyTeam);

router.post("/:id/add-member",              allowRoles("student"), addMember);
router.delete("/:id/remove-member/:userId", allowRoles("student"), removeMember);

module.exports = router;