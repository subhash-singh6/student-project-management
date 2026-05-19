const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    roomId: { type: String, required: true },
  },
  { timestamps: true }
);

messageSchema.index({ team: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
