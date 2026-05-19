const Team    = require("../models/Team");
const User    = require("../models/User");
const Project = require("../models/Project");

// ─────────────────────────────────────────────
// @route  POST /api/teams
// @access Student
// ─────────────────────────────────────────────
const createTeam = async (req, res) => {
  try {
    const { name, description, projectId } = req.body;

    const team = await Team.create({
      name,
      description,
      leader: req.user._id,
      members: [{
        user:   req.user._id,
        role:   "leader",
      }],
      project: projectId || null,
    });

    // Project ke saath link karo
    if (projectId) {
      await Project.findByIdAndUpdate(projectId, { team: team._id });
    }

    res.status(201).json({ success: true, team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @route  GET /api/teams/my
// @access Student
// ─────────────────────────────────────────────
const getMyTeam = async (req, res) => {
  try {
    const team = await Team.findOne({
      "members.user": req.user._id,
    })
      .populate("members.user", "name email avatar enrollmentNumber")
      .populate("leader",       "name email")
      .populate("project",      "title status progress");

    if (!team) {
      return res.status(404).json({ message: "You are not part of any team yet." });
    }

    res.status(200).json({ success: true, team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @route  GET /api/teams
// @access Teacher, Mentor
// ─────────────────────────────────────────────
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({ isActive: true })
      .populate("members.user", "name email")
      .populate("leader",       "name email")
      .populate("project",      "title status");

    res.status(200).json({ success: true, count: teams.length, teams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @route  POST /api/teams/:id/add-member
// @access Team Leader
// ─────────────────────────────────────────────
const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) return res.status(404).json({ message: "Team not found." });

    // Sirf leader add kar sakta hai
    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the team leader can add members." });
    }

    // Max limit check
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ message: `Team is full. Maximum ${team.maxMembers} members allowed.` });
    }

    // User dhundo
    const newMember = await User.findOne({ email });
    if (!newMember) return res.status(404).json({ message: "No user found with this email." });

    // Already member hai kya
    const alreadyMember = team.members.find(
      m => m.user.toString() === newMember._id.toString()
    );
    if (alreadyMember) return res.status(400).json({ message: "This user is already a member of the team." });

    team.members.push({ user: newMember._id, role: role || "member" });
    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate("members.user", "name email avatar");

    res.status(200).json({ success: true, team: updatedTeam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @route  DELETE /api/teams/:id/remove-member/:userId
// @access Team Leader
// ─────────────────────────────────────────────
const removeMember = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found." });

    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the team leader can remove members." });
    }

    team.members = team.members.filter(
      m => m.user.toString() !== req.params.userId
    );
    await team.save();

    res.status(200).json({ success: true, message: "Member removed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTeam, getMyTeam, getAllTeams, addMember, removeMember };