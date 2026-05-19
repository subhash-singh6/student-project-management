const express = require("express");
const router = express.Router();
const { getTeamMessages } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/team/:teamId", getTeamMessages);

module.exports = router;
