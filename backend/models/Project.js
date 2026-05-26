const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Project title zaroori hai"], trim: true },
    description: { type: String, required: [true, "Description zaroori hai"] },
    category: {
      type: String,
      enum: ["Web Development", "Mobile App", "ML/AI", "IoT", "Cybersecurity", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "in-progress", "completed", "rejected"],
      default: "pending",
    },
    
    // Relations
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", default: null },

    // Tracking
    progress: { type: Number, default: 0, min: 0, max: 100 },
    startDate: Date,
    deadline: Date,
    completedAt: Date,

    // Grading
    grade: {
      type: String,
      enum: ["A+", "A", "B+", "B", "C", "D", "F", ""],
      default: "",
    },
    gradeRemarks: { type: String, default: "" },

    // Tech & Links
    techStack: [String],
    githubRepo: { type: String, default: "" },
    liveDemo: { type: String, default: "" },

    // Attachments
    attachments: [{
      fileName: { type: String, required: true },
      fileUrl: { type: String, required: true },
      fileType: { type: String, default: "" },
      uploadedAt: { type: Date, default: Date.now },
    }],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);