const Message = require("../models/Message");
const Team = require("../models/Team");

const isTeamMember = (team, userId) => {
  if (team.leader.toString() === userId.toString()) return true;
  return team.members.some((m) => m.user?.toString() === userId.toString());
};

const getTeamMessages = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: "Team not found." });

    const hasAccess = isTeamMember(team, req.user._id) || req.user.role === "teacher" || req.user.role === "admin";
    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied. You are not authorized to access this team chat pipeline." });
    }

    const messages = await Message.find({ team: team._id })
      .sort({ createdAt: 1 })
      .limit(200)
      .populate("sender", "name avatar role");

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveMessage = async ({ teamId, senderId, senderName, text, roomId }) => {
  return Message.create({
    team: teamId,
    sender: senderId,
    senderName,
    text,
    roomId,
  });
};

module.exports = { getTeamMessages, saveMessage, isTeamMember };