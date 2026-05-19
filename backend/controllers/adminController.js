const User = require("../models/User");
const Project = require("../models/Project");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Apna account deactivate nahi kar sakte." });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"}.`,
      user: { _id: user._id, name: user.name, isActive: user.isActive },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminOverview = async (req, res) => {
  try {
    const [users, projects, recentProjects] = await Promise.all([
      User.find().select("-password").sort({ createdAt: -1 }).limit(50),
      Project.countDocuments(),
      Project.find()
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    res.status(200).json({
      success: true,
      users,
      projectCount: projects,
      recentProjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, toggleUserStatus, getAdminOverview };
