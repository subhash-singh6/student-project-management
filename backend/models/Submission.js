const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title:       { type: String, required: true },
    description: { type: String, default: "" },

    // File info
    fileUrl:  { type: String, default: "" },
    fileName: { type: String, default: "" },
    fileType: { type: String, default: "" },

    // Version tracking
    version: { type: Number, default: 1 },

    status: {
      type: String,
      enum: ["submitted", "reviewed", "approved", "rejected"],
      default: "submitted",
    },

    // Mentor/Teacher feedback
    feedback: { type: String, default: "" },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);