const Project = require("../models/Project");
const Notification = require("../models/Notification");

// @desc    Create a new project
// @route   POST /api/projects
// @access  Student
const createProject = async (req, res) => {
  try {
    const { title, description, tags, teacherId } = req.body;

    const project = await Project.create({
      title,
      description,
      tags: tags || [],
      teacher: teacherId || null,
      createdBy: req.user._id,
    });

    if (teacherId) {
      await Notification.create({
        recipient: teacherId,
        sender: req.user._id,
        type: "project_created",
        title: "New Project Proposal",
        message: `Student ${req.user.name} has submitted a new project proposal: "${title}".`,
      });
    }

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active projects
// @route   GET /api/projects
// @access  Authenticated Users
// 🌟 Express Route Handler function for projectRoutes.js line 18
const getAllProjects = async (req, res) => {
  try {
    let query = {};

    // Filter projects based on roles if necessary
    if (req.user.role === "student") {
      query = { createdBy: req.user._id };
    } else if (req.user.role === "teacher") {
      query = { teacher: req.user._id };
    }

    const projects = await Project.find(query)
      .populate("createdBy", "name email enrollmentNumber branch")
      .populate("teacher", "name email department")
      .populate("team", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Authenticated Users
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email enrollmentNumber branch semester avatar")
      .populate("teacher", "name email department avatar")
      .populate("team", "name members.user");

    if (!project) {
      return res.status(404).json({ message: "Project context not found in the database." });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project details
// @route   PUT /api/projects/:id
// @access  Project Owner / Faculty
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found." });

    // Authorization safeguard layer check
    const isOwner = project.createdBy.toString() === req.user._id.toString();
    const isTeacher = project.teacher && project.teacher.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isTeacher && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this project entity." });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or Reject project proposal
// @route   PUT /api/projects/:id/approve
// @access  Teacher / Admin
const approveProject = async (req, res) => {
  try {
    const { status } = req.body; // status can be 'approved' or 'rejected'
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status parameters provided." });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project record missing." });

    project.status = status;
    await project.save();

    await Notification.create({
      recipient: project.createdBy,
      sender: req.user._id,
      type: "project_status_changed",
      title: `Project Proposal ${status.toUpperCase()}!`,
      message: `Your project proposal "${project.title}" has been updated to "${status}" status by faculty review.`,
    });

    res.status(200).json({ success: true, project, message: `Project status successfully registered as ${status}.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade and score project
// @route   PUT /api/projects/:id/grade
// @access  Teacher
const gradeProject = async (req, res) => {
  try {
    const { grade, marks, gradeRemarks } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project registry entry not found." });

    project.grade = grade || project.grade;
    project.marks = marks !== undefined ? marks : project.marks;
    project.gradeRemarks = gradeRemarks || project.gradeRemarks;
    await project.save();

    await Notification.create({
      recipient: project.createdBy,
      sender: req.user._id,
      type: "project_graded",
      title: "Project Assessment Graded! 🎓",
      message: `Your evaluation scorecard for "${project.title}" has been published. Grade: ${grade || "N/A"}`,
    });

    res.status(200).json({ success: true, project, message: "Grades synchronized and broadcasted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project profile
// @route   DELETE /api/projects/:id
// @access  Student (Owner)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project target entry missing." });

    if (project.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only the project creator can delete this entity." });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Project metadata clean slate wipe executed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧠 CRITICAL RESOLUTION LOCK: Export blocks correctly mapped with zero naming bugs
module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  approveProject,
  gradeProject,
  deleteProject,
};