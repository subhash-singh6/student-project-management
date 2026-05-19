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
    if (!isTeamMember(team, req.user._id)) {
      return res.status(403).json({ message: "Team member nahi ho." });
    }

    const messages = await Message.find({ team: team._id })
      .sort({ createdAt: 1 })
      .limit(200)
      .populate("sender", "name avatar");

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
