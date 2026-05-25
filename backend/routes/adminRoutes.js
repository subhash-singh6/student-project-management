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
router.use(allowRoles("admin")); // 🧠 Fix: Teacher ko hata kar direct Admin role lock lagaya

router.get("/overview", getAdminOverview);
router.get("/users", getAllUsers);
router.put("/users/:id/toggle", toggleUserStatus);

module.exports = router;