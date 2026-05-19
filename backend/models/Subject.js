const mongoose = require("mongoose")

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name zaroori hai"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Subject code zaroori hai"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department zaroori hai"],
      enum: ["CSE", "ECE", "ME", "CE", "IT", "Other"],
    },
    semester: {
      type: Number,
      required: [true, "Semester zaroori hai"],
      min: 1,
      max: 8,
    },
    description: {
      type: String,
      default: "",
    },
    credits: {
      type: Number,
      default: 3,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model("Subject", subjectSchema)