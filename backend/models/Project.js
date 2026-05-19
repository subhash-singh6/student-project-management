const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title zaroori hai"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description zaroori hai"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "in-progress", "completed", "rejected"],
      default: "pending",
    },
    category: {
      type: String,
      enum: ["Web Development", "Mobile App", "ML/AI", "IoT", "Cybersecurity", "Other"],
      default: "Other",
    },

    // Relations
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Progress
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Dates
    startDate:  { type: Date },
    deadline:   { type: Date },
    completedAt:{ type: Date },

    // Teacher grade
    grade: {
      type: String,
      enum: ["A+", "A", "B+", "B", "C", "D", "F", ""],
      default: "",
    },
    gradeRemarks: { type: String, default: "" },

    // Tags
    techStack: { type: [String] },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);