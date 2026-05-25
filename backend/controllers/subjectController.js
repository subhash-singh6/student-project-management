const Subject        = require("../models/Subject");
const ProjectRequest = require("../models/ProjectRequest");
const Project        = require("../models/Project");
const Notification   = require("../models/Notification");

// @route  POST /api/subjects
// @access Teacher/Admin only
const createSubject = async (req, res) => {
  try {
    const { name, code, department, semester, description, credits } = req.body;

    const existing = await Subject.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: `Subject code ${code} pehle se exist karta hai.` });
    }

    // ✅ Single teacher reference se badalkar array push logic setup kiya
    const subject = await Subject.create({
      name,
      code: code.toUpperCase(),
      department,
      semester,
      description,
      credits,
      teachers: [req.user._id], 
    });

    res.status(201).json({ success: true, subject, message: "Subject successfully create ho gaya!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/subjects
// @access All (Students, Teachers, Admins)
const getAllSubjects = async (req, res) => {
  try {
    const { department, semester } = req.query;
    const query = { isActive: true };

    if (department) query.department = department;
    if (semester)   query.semester   = Number(semester);

    const subjects = await Subject.find(query)
      .populate("teachers", "name email department employeeId")
      .sort({ department: 1, semester: 1, name: 1 });

    res.status(200).json({ success: true, count: subjects.length, subjects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/subjects/my
// @access Teacher (Apne assigned subjects)
const getMySubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ teachers: req.user._id })
      .populate("enrolledStudents", "name email enrollmentNumber branch semester")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/subjects/:id
// @access Teacher/Admin
const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, teachers: req.user._id });
    if (!subject) return res.status(404).json({ message: "Subject nahi mila ya aap authorized nahi hain." });

    const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, subject: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/subjects/:id
// @access Teacher/Admin
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, teachers: req.user._id });
    if (!subject) return res.status(404).json({ message: "Subject nahi mila ya aap authorized nahi hain." });

    await subject.deleteOne();
    res.status(200).json({ success: true, message: "Subject delete ho gaya." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/subjects/request
// @access Student
const sendProjectRequest = async (req, res) => {
  try {
    const { projectId, subjectId, teacherId, message } = req.body; // ✅ MentorId ki jagah teacherId mandatory kiya

    if (!teacherId) return res.status(400).json({ message: "Project guide/teacher select karna zaroori hai." });

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject nahi mila." });

    const existing = await ProjectRequest.findOne({
      student: req.user._id,
      project: projectId,
      subject: subjectId,
    });
    if (existing) {
      return res.status(400).json({ message: "Is project ke liye request pehle se bheji ja chuki hai." });
    }

    const request = await ProjectRequest.create({
      student: req.user._id,
      teacher: teacherId, 
      project: projectId,
      subject: subjectId,
      message: message || "",
    });

    // Project schema link update
    await Project.findByIdAndUpdate(projectId, {
      teacher: teacherId,
      subject: subjectId,
    });

    // Teacher Notification pipeline
    await Notification.create({
      recipient: teacherId,
      sender:    req.user._id,
      type:      "project_submitted",
      title:     "New Project Request! 📋",
      message:   `${req.user.name} ne ${subject.name} (${subject.code}) ke liye project guide banane ki request ki hai.`,
    });

    res.status(201).json({
      success: true,
      request,
      message: "Request bhej di gayi! Selected Professor jald hi ise review karenge.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/subjects/requests
// @access Teacher (Apni mapping requests)
const getMyRequests = async (req, res) => {
  try {
    const requests = await ProjectRequest.find({ teacher: req.user._id })
      .populate("student", "name email enrollmentNumber branch semester avatar")
      .populate("project", "title description category techStack status")
      .populate("subject", "name code department semester")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/subjects/my-requests
// @access Student
const getStudentRequests = async (req, res) => {
  try {
    const requests = await ProjectRequest.find({ student: req.user._id })
      .populate("teacher", "name email department")
      .populate("project", "title status")
      .populate("subject", "name code department")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/subjects/requests/:id/respond
// @access Teacher
const respondToRequest = async (req, res) => {
  try {
    const { status, teacherRemarks } = req.body;

    const request = await ProjectRequest.findOne({
      _id:     req.params.id,
      teacher: req.user._id,
    }).populate("student project subject");

    if (!request) return res.status(404).json({ message: "Request nahi mili." });

    request.status         = status;
    request.teacherRemarks = teacherRemarks || "";
    await request.save();

    if (status === "approved") {
      await Project.findByIdAndUpdate(request.project._id, {
        status:  "approved",
        teacher: req.user._id,
      });

      // Student mapping into subject roster
      await Subject.findByIdAndUpdate(request.subject._id, {
        $addToSet: { enrolledStudents: request.student._id }
      });
    } else if (status === "rejected") {
      await Project.findByIdAndUpdate(request.project._id, {
        status: "rejected"
      });
    }

    await Notification.create({
      recipient: request.student._id,
      sender:    req.user._id,
      type:      status === "approved" ? "project_approved" : "project_rejected",
      title:     status === "approved" ? "Project Request Approved! 🎉" : "Project Request Rejected",
      message:   status === "approved"
        ? `Tumhari project request "${request.subject.name} (${request.subject.code})" ke liye approve ho gayi!`
        : `Tumhari project request reject hui. Reason: ${teacherRemarks || "Koi reason nahi diya."}`,
    });

    res.status(200).json({
      success: true,
      request,
      message: `Request successfully ${status} ho gayi!`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubject,
  getAllSubjects,
  getMySubjects,
  updateSubject,
  deleteSubject,
  sendProjectRequest,
  getMyRequests,
  getStudentRequests,
  respondToRequest,
};