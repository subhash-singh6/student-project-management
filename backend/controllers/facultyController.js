const User        = require("../models/User");
const Project     = require("../models/Project");
const Notification = require("../models/Notification");

const getAssignedStudents = async (req, res) => {
  try {
    const projects = await Project.find({ teacher: req.user._id })
      .populate("createdBy", "name email enrollmentNumber branch semester avatar");

    const students = projects.map(p => p.createdBy).filter((v, i, a) => a.findIndex(t => t._id.toString() === v._id.toString()) === i);

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const giveFeedback = async (req, res) => {
  try {
    const { projectId, feedback } = req.body;

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $set: { gradeRemarks: feedback } },
      { new: true }
    ).populate("createdBy", "name");

    if (!project) return res.status(404).json({ message: "Project not found." });

    await Notification.create({
      recipient: project.createdBy._id,
      sender:    req.user._id,
      type:      "feedback_given",
      title:     "Faculty Feedback Received! 💬",
      message:   `Professor ${req.user.name} has provided feedback updates on your project "${project.title}".`,
    });

    res.status(200).json({ success: true, message: "Feedback submitted successfully.", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const scheduleMeeting = async (req, res) => {
  try {
    const { studentId, title, date, time, link } = req.body;

    await Notification.create({
      recipient: studentId,
      sender:    req.user._id,
      type:      "meeting_scheduled",
      title:     "Project Review Meeting! 📅",
      message:   `Faculty member ${req.user.name} has scheduled a review meeting: "${title}" on ${date} at ${time}. Join link: ${link || "TBD"}`,
    });

    res.status(200).json({
      success: true,
      message: "Meeting scheduled and student notified successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher", isActive: true })
      .select("name email department avatar");

    res.status(200).json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAssignedStudents,
  giveFeedback,
  scheduleMeeting,
  getAllTeachers,
};