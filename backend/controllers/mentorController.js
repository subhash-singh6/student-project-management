const User         = require("../models/User");
const Project      = require("../models/Project");
const Notification = require("../models/Notification");

// ─────────────────────────────────────────────
// @route  GET /api/mentor/students
// @access Mentor
// ─────────────────────────────────────────────
const getAssignedStudents = async (req, res) => {
  try {
    const mentor = await User.findById(req.user._id)
      .populate("assignedStudents", "name email enrollmentNumber branch semester avatar");

    res.status(200).json({
      success: true,
      students: mentor.assignedStudents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @route  POST /api/mentor/assign-student
// @access Teacher (teacher mentor ko assign karta hai)
// ─────────────────────────────────────────────
const assignStudentToMentor = async (req, res) => {
  try {
    const { mentorId, studentId, projectId } = req.body;

    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "Mentor not found." });
    }

    // Mentor ke assignedStudents mein add karo
    if (!mentor.assignedStudents.includes(studentId)) {
      mentor.assignedStudents.push(studentId);
    }
    if (projectId && !mentor.assignedProjects.includes(projectId)) {
      mentor.assignedProjects.push(projectId);
      await Project.findByIdAndUpdate(projectId, { mentor: mentorId });
    }
    await mentor.save();

    // Mentor ko notification
    await Notification.create({
      recipient: mentorId,
      sender:    req.user._id,
      type:      "general",
      title:     "New Student Assigned!",
      message:   `A new student has been assigned to you.`,
    });

    res.status(200).json({ success: true, message: "Student assigned to mentor successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @route  POST /api/mentor/feedback
// @access Mentor
// ─────────────────────────────────────────────
const giveFeedback = async (req, res) => {
  try {
    const { projectId, feedback } = req.body;

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $set: { mentorFeedback: feedback } },
      { new: true }
    ).populate("createdBy", "name");

    if (!project) return res.status(404).json({ message: "Project not found." });

    // Student ko notification
    await Notification.create({
      recipient: project.createdBy._id,
      sender:    req.user._id,
      type:      "feedback_given",
      title:     "Mentor Feedback Received! 💬",
      message:   `You have received feedback on "${project.title}"`,
    });

    res.status(200).json({ success: true, message: "Feedback submitted successfully.", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @route  POST /api/mentor/schedule-meeting
// @access Mentor
// ─────────────────────────────────────────────
const scheduleMeeting = async (req, res) => {
  try {
    const { studentId, projectId, title, date, time, link } = req.body;

    // Student ko notification bhejo meeting ki
    await Notification.create({
      recipient: studentId,
      sender:    req.user._id,
      type:      "meeting_scheduled",
      title:     "Meeting Scheduled! 📅",
      message:   `${req.user.name} scheduled a meeting: "${title}" — ${date} at ${time}. Link: ${link || "TBD"}`,
    });

    res.status(200).json({
      success: true,
      message: "Meeting scheduled and student notified successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @route  GET /api/mentor/all
// @access Teacher, Student
// ─────────────────────────────────────────────
const getAllMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: "mentor", isActive: true })
      .select("name email expertise organization avatar");

    res.status(200).json({ success: true, mentors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAssignedStudents,
  assignStudentToMentor,
  giveFeedback,
  scheduleMeeting,
  getAllMentors,
};