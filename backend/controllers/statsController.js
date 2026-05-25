const Project    = require("../models/Project");
const User       = require("../models/User");
const Team       = require("../models/Team");
const Submission = require("../models/Submission");

const calcPoints = (projects) => {
  let pts = 0;
  pts += projects.length * 10;
  pts += projects.filter((p) => p.status === "approved").length * 20;
  pts += projects.filter((p) => p.status === "completed").length * 50;
  pts += projects.filter((p) => p.grade === "A+").length * 30;
  pts += projects.filter((p) => p.grade === "A").length * 25;
  pts += projects.filter((p) => p.grade === "B+").length * 20;
  pts += projects.filter((p) => p.grade === "B").length * 15;
  return pts;
};

// @route GET /api/stats/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true })
      .populate("createdBy", "name email branch enrollmentNumber avatar role");

    const studentMap = {};
    projects.forEach((p) => {
      const id = p.createdBy?._id?.toString();
      if (!id || p.createdBy?.role !== "student") return;
      if (!studentMap[id]) {
        studentMap[id] = {
          id,
          name: p.createdBy.name,
          email: p.createdBy.email,
          branch: p.createdBy.branch,
          avatar: p.createdBy.avatar,
          projects: [],
        };
      }
      studentMap[id].projects.push(p);
    });

    const leaderboard = Object.values(studentMap)
      .map((s) => ({
        ...s,
        points: calcPoints(s.projects),
        projectCount: s.projects.length,
        completedCount: s.projects.filter((p) => p.status === "completed").length,
        gradedCount: s.projects.filter((p) => p.grade).length,
      }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 20);

    res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/stats/system
const getSystemStats = async (req, res) => {
  try {
    const [users, projects, teams, submissions] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Project.countDocuments({ isActive: true }),
      Team.countDocuments({ isActive: true }),
      Submission.countDocuments(),
    ]);

    const byStatus = await Project.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const byRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        users,
        projects,
        teams,
        submissions,
        projectsByStatus: byStatus,
        usersByRole: byRole,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/stats/my
const getMyStats = async (req, res) => {
  try {
    let projectQuery = {};
    if (req.user.role === "student") projectQuery.createdBy = req.user._id;
    if (req.user.role === "teacher") projectQuery.teacher = req.user._id;
    // Admin ko pure institution stats milenge

    const projects = await Project.find(projectQuery);
    const submissions = await Submission.countDocuments({
      submittedBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      stats: {
        projects: projects.length,
        pending: projects.filter((p) => p.status === "pending").length,
        approved: projects.filter((p) => p.status === "approved").length,
        completed: projects.filter((p) => p.status === "completed").length,
        submissions,
        points: req.user.role === "student" ? calcPoints(projects) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaderboard, getSystemStats, getMyStats };