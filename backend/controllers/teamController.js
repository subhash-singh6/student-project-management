const Team    = require("../models/Team");
const User    = require("../models/User");
const Project = require("../models/Project");

const createTeam = async (req, res) => {
  try {
    const { name, description, projectId } = req.body;

    const existingTeam = await Team.findOne({ "members.user": req.user._id, isActive: true });
    if (existingTeam) {
      return res.status(400).json({ message: "You are already an active member of another team. Cannot create a new one." });
    }

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

    if (projectId) {
      await Project.findByIdAndUpdate(projectId, { team: team._id });
    }

    res.status(201).json({ success: true, team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyTeam = async (req, res) => {
  try {
    const team = await Team.findOne({
      "members.user": req.user._id,
      isActive: true
    })
      .populate("members.user", "name email avatar enrollmentNumber")
      .populate("leader",       "name email")
      .populate("project",      "title status progress");

    if (!team) {
      return res.status(404).json({ message: "You are not a part of any project team yet." });
    }

    res.status(200).json({ success: true, team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({ isActive: true })
      .populate("members.user", "name email enrollmentNumber branch")
      .populate("leader",       "name email")
      .populate("project",      "title status");

    res.status(200).json({ success: true, count: teams.length, teams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) return res.status(404).json({ message: "Team not found." });

    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the team leader can add new members." });
    }

    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ message: `The team is full. Maximum ${team.maxMembers} members are allowed.` });
    }

    const newMember = await User.findOne({ email });
    if (!newMember) return res.status(404).json({ message: "No user found with this email in the database." });
    if (newMember.role !== "student") return res.status(400).json({ message: "You cannot add faculty or admin accounts to a student team." });

    const userAlreadyInATeam = await Team.findOne({ "members.user": newMember._id, isActive: true });
    if (userAlreadyInATeam) {
      return res.status(400).json({ message: "This student is already a member of another team." });
    }

    const alreadyMember = team.members.find(
      m => m.user.toString() === newMember._id.toString()
    );
    if (alreadyMember) return res.status(400).json({ message: "This user is already a member of your team." });

    team.members.push({ user: newMember._id, role: role || "member" });
    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate("members.user", "name email avatar enrollmentNumber branch");

    res.status(200).json({ success: true, team: updatedTeam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found." });

    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the team leader can remove members." });
    }
    if (team.leader.toString() === req.params.userId) {
      return res.status(400).json({ message: "The leader cannot remove themselves from the team." });
    }

    team.members = team.members.filter(
      m => m.user.toString() !== req.params.userId
    );
    await team.save();

    res.status(200).json({ success: true, message: "Member has been successfully removed from the team." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTeam, getMyTeam, getAllTeams, addMember, removeMember };