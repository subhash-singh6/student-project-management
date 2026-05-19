const Project      = require("../models/Project");
const Notification = require("../models/Notification");

// ─────────────────────────────────────────────
// @route  POST /api/projects
// @access Student
// ─────────────────────────────────────────────
const createProject = async (req, res) => {
  try {
    const { title, description, category, techStack, deadline } = req.body;

    const project = await Project.create({
      title,
      description,
      category,
      techStack,
      deadline,
      createdBy: req.user._id,
      status: "pending",
    });

    // Teacher ko notification bhejo
    const notification = await Notification.create({
      recipient: req.body.teacher || req.user._id,
      sender:    req.user._id,
      type:      "project_submitted",
      title:     "New Project Submitted!",
      message:   `${req.user.name} submitted a project: "${title}"`,
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @route  GET /api/projects
// @access Private (role ke hisaab se filter)
// ─────────────────────────────────────────────
const getAllProjects = async (req, res) => {
  try {
    let query = {};

    // Student sirf apne projects dekhe
    if (req.user.role === "student") {
      query.createdBy = req.user._id;
    }
    // Mentor sirf assigned projects dekhe
    if (req.user.role === "mentor") {
      query.mentor = req.user._id;
    }
    // Teacher sab dekhe

    const projects = await Project.find(query)
      .populate("createdBy", "name email enrollmentNumber")
      .populate("mentor",    "name email")
      .populate("teacher",   "name email")
      .populate("team",      "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @route  GET /api/projects/:id
// @access Private
// ─────────────────────────────────────────────
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("mentor",    "name email")
      .populate("teacher",   "name email")
      .populate("team",      "name members");

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @route  PUT /api/projects/:id
// @access Student (apna), Teacher (status/grade)
// ─────────────────────────────────────────────
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Student sirf apna update kar sakta hai
    if (req.user.role === "student" && project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this project." });
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });

    res.status(200).json({ success: true, project: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @route  PUT /api/projects/:id/approve
// @access Teacher, Mentor
// ─────────────────────────────────────────────
const approveProject = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status, gradeRemarks: remarks || "" },
      { new: true }
    ).populate("createdBy", "name email");

    if (!project) return res.status(404).json({ message: "Project not found." });

    // Student ko notification
    await Notification.create({
      recipient: project.createdBy._id,
      sender:    req.user._id,
      type:      status === "approved" ? "project_approved" : "project_rejected",
      title:     status === "approved" ? "Project Approved! 🎉" : "Project Rejected",
      message:   status === "approved"
        ? `Your project "${project.title}" has been approved!`
        : `Your project "${project.title}" was rejected. Remarks: ${remarks}`,
    });

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @route  PUT /api/projects/:id/grade
// @access Teacher only
// ─────────────────────────────────────────────
const gradeProject = async (req, res) => {
  try {
    const { grade, gradeRemarks } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { grade, gradeRemarks },
      { new: true }
    ).populate("createdBy", "name");

    if (!project) return res.status(404).json({ message: "Project not found." });

    // Student ko notification
    await Notification.create({
      recipient: project.createdBy._id,
      sender:    req.user._id,
      type:      "grade_given",
      title:     "Grade Received! ⭐",
      message:   `Your project "${project.title}" has been graded: ${grade}`,
    });

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @route  DELETE /api/projects/:id
// @access Student (apna)
// ─────────────────────────────────────────────
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found." });

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this project." });
    }

    await project.deleteOne();
    res.status(200).json({ success: true, message: "Project deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  approveProject,
  gradeProject,
  deleteProject,
};