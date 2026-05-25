const User  = require("../models/User");
const path  = require("path");
const fs    = require("fs");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("subjects", "name code");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const allowedFields = ["name", "phone", "subjects", "branch", "semester", "enrollmentNumber", "employeeId", "department"];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ success: true, user, message: "Profile updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Both current and new password fields are required." });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "The new password must be at least 6 characters long." })

    const user = await User.findById(req.user.id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect." });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully! 🔐" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file was uploaded." });

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findById(req.user.id);
    if (user.avatar && user.avatar.startsWith("/uploads")) {
      const oldPath = path.join(__dirname, "..", user.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.avatar = avatarUrl;
    await user.save();

    res.status(200).json({
      success:   true,
      avatarUrl,
      message:   "Avatar updated successfully! 🖼️"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").populate("subjects", "name code");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, changePassword, uploadAvatar, getUserById };