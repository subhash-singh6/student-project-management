const User  = require("../models/User")
const path  = require("path")
const fs    = require("fs")

// ─────────────────────────────────────────────
// @route  GET /api/profile
// @access Private
// ─────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.status(200).json({ success: true, user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// @route  PUT /api/profile/update
// @access Private
// ─────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const allowedFields = ["name", "phone", "expertise", "organization", "subjects", "branch", "semester"]
    const updates = {}

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    })

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password")

    res.status(200).json({ success: true, user, message: "Profile update ho gaya!" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// @route  PUT /api/profile/change-password
// @access Private
// ─────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Dono passwords zaroori hain." })

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Naya password kam se kam 6 characters ka hona chahiye." })

    const user = await User.findById(req.user.id).select("+password")
    const isMatch = await user.comparePassword(currentPassword)

    if (!isMatch)
      return res.status(400).json({ message: "Current password galat hai." })

    user.password = newPassword
    await user.save()

    res.status(200).json({ success: true, message: "Password change ho gaya! 🔐" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// @route  POST /api/profile/avatar
// @access Private
// ─────────────────────────────────────────────
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Koi file upload nahi ki." })

    const avatarUrl = `/uploads/avatars/${req.file.filename}`

    // Purana avatar delete karo
    const user = await User.findById(req.user.id)
    if (user.avatar && user.avatar.startsWith("/uploads")) {
      const oldPath = path.join(__dirname, "..", user.avatar)
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
    }

    user.avatar = avatarUrl
    await user.save()

    res.status(200).json({
      success:   true,
      avatarUrl,
      message:   "Avatar update ho gaya! 🖼️"
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// @route  GET /api/profile/:id
// @access Private
// ─────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    if (!user) return res.status(404).json({ message: "User nahi mila." })
    res.status(200).json({ success: true, user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getProfile, updateProfile, changePassword, uploadAvatar, getUserById }