const Submission = require("../models/Submission");
const Project = require("../models/Project");
const Notification = require("../models/Notification");

const createSubmission = async (req, res) => {
  try {
    const { title, description, project } = req.body;

    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ message: "Project not found." });
    
    if (proj.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only submit files to your own project." });
    }

    const version =
      (await Submission.countDocuments({ project, submittedBy: req.user._id })) + 1;

    const fileUrl = req.file ? `/uploads/submissions/${req.file.filename}` : "";
    const fileName = req.file ? req.file.originalname : "";

    const submission = await Submission.create({
      project,
      submittedBy: req.user._id,
      title,
      description: description || "",
      fileUrl,
      fileName,
      fileType: req.file?.mimetype || "",
      version,
    });

    if (proj.teacher) {
      await Notification.create({
        recipient: proj.teacher,
        sender: req.user._id,
        type: "submission_received",
        title: "New Submission Received",
        message: `${req.user.name} has submitted "${title}" for project "${proj.title}" (v${version})`,
      });
    }

    res.status(201).json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ submittedBy: req.user._id })
      .populate("project", "title status")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ project: req.params.projectId })
      .populate("submittedBy", "name email enrollmentNumber")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reviewSubmission = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const submission = await Submission.findById(req.params.id).populate("project", "title createdBy");
    if (!submission) return res.status(404).json({ message: "Submission not found." });

    submission.status = status;
    submission.feedback = feedback || "";
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();
    await submission.save();

    await Notification.create({
      recipient: submission.submittedBy,
      sender: req.user._id,
      type: "submission_reviewed",
      title: "Submission Reviewed",
      message: `Your submission "${submission.title}" status has been updated to "${status}".`,
    });

    res.status(200).json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubmission,
  getMySubmissions,
  getProjectSubmissions,
  reviewSubmission,
};