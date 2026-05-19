const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team name zaroori hai"],
      trim: true,
    },
    description: { type: String, default: "" },

    // Team leader
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Members array
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: {
          type: String,
          enum: ["leader", "developer", "designer", "tester", "member"],
          default: "member",
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    maxMembers: { type: Number, default: 5 },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);