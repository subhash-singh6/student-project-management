const express = require("express");
const router = express.Router();
const {
  getLeaderboard,
  getSystemStats,
  getMyStats,
} = require("../controllers/statsController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.use(protect);

router.get("/leaderboard", getLeaderboard);
router.get("/me", getMyStats);
router.get("/system", allowRoles("teacher"), getSystemStats);

module.exports = router;
