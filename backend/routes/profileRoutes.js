const express = require("express")
const router  = express.Router()

const {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  getUserById,
} = require("../controllers/profileController")

const { protect }     = require("../middleware/authMiddleware")
const { uploadAvatar: uploadAvatarMiddleware } = require("../middleware/uploadMiddleware")

router.use(protect)

router.get("/",               getProfile)
router.put("/update",         updateProfile)
router.put("/change-password", changePassword)
router.post("/avatar",        uploadAvatarMiddleware.single("avatar"), uploadAvatar)
router.get("/:id",            getUserById)

module.exports = router