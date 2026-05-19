const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  toggleUserStatus,
  getAdminOverview,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.use(protect);
router.use(allowRoles("teacher"));

router.get("/overview", getAdminOverview);
router.get("/users", getAllUsers);
router.put("/users/:id/toggle", toggleUserStatus);

module.exports = router;
