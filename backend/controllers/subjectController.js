const Subject        = require("../models/Subject")
const ProjectRequest = require("../models/ProjectRequest")
const Project        = require("../models/Project")
const Notification   = require("../models/Notification")

// ─────────────────────────────────────────────
// @route  POST /api/subjects
// @access Teacher only
// ─────────────────────────────────────────────
const createSubject = async (req, res) => {
  try {
    const { name, code, department, semester, description, credits } = req.body

    // Code already exists check
    const existing = await Subject.findOne({ code: code.toUpperCase() })
    if (existing) {
      return res.status(400).json({ message: `Subject code ${code} pehle se exist karta hai.` })
    }

    const subject = await Subject.create({
      name,
      code: code.toUpperCase(),
      department,
      semester,
      description,
      credits,
      teacher: req.user._id,
    })

    res.status(201).json({ success: true, subject, message: "Subject create ho gaya!" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// @route  GET /api/subjects
// @access All (students subjects dekhenge)
// ─────────────────────────────────────────────
const getAllSubjects = async (req, res) => {
  try {
    const { department, semester } = req.query
    const query = { isActive: true }

    if (department) query.department = department
    if (semester)   query.semester   = Number(semester)

    const subjects = await Subject.find(query)
      .populate("teacher", "name email department employeeId")
      .sort({ department: 1, semester: 1, name: 1 })

    res.status(200).json({ success: true, count: subjects.length, subjects })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// @route  GET /api/subjects/my
// @access Teacher (apne subjects)
// ─────────────────────────────────────────────
const getMySubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ teacher: req.user._id })
      .populate("enrolledStudents", "name email enrollmentNumber branch semester")
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, subjects })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// @route  PUT /api/subjects/:id
// @access Teacher (apna subject)
// ─────────────────────────────────────────────
const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, teacher: req.user._id })
    if (!subject) return res.status(404).json({ message: "Subject nahi mila." })

    const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json({ success: true, subject: updated })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// @route  DELETE /api/subjects/:id
// @access Teacher (apna subject)
// ─────────────────────────────────────────────
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, teacher: req.user._id })
    if (!subject) return res.status(404).json({ message: "Subject nahi mila." })

    await subject.deleteOne()
    res.status(200).json({ success: true, message: "Subject delete ho gaya." })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// @route  POST /api/subjects/request
// @access Student
// ─────────────────────────────────────────────
const sendProjectRequest = async (req, res) => {
  try {
    const { projectId, subjectId, mentorId, message } = req.body

    const subject = await Subject.findById(subjectId).populate("teacher")
    if (!subject) return res.status(404).json({ message: "Subject nahi mila." })

    // Already request hai kya check karo
    const existing = await ProjectRequest.findOne({
      student: req.user._id,
      project: projectId,
      subject: subjectId,
    })
    if (existing) {
      return res.status(400).json({ message: "Is project ke liye request pehle se bheji ja chuki hai." })
    }

    const request = await ProjectRequest.create({
      student: req.user._id,
      teacher: subject.teacher._id,
      project: projectId,
      subject: subjectId,
      mentor:  mentorId || null,
      message: message || "",
    })

    // Project mein teacher aur subject link karo
    await Project.findByIdAndUpdate(projectId, {
      teacher: subject.teacher._id,
      subject: subjectId,
    })

    // Teacher ko notification
    await Notification.create({
      recipient: subject.teacher._id,
      sender:    req.user._id,
      type:      "project_submitted",
      title:     "New Project Request! 📋",
      message:   `${req.user.name} ne ${subject.name} (${subject.code}) ke liye project assign karne ki request ki hai.`,
    })

    res.status(201).json({
      success: true,
      request,
      message: "Request bhej di gayi! Teacher approve karenge.",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// @route  GET /api/subjects/requests
// @access Teacher (apni requests)
// ─────────────────────────────────────────────
const getMyRequests = async (req, res) => {
  try {
    const requests = await ProjectRequest.find({ teacher: req.user._id })
      .populate("student", "name email enrollmentNumber branch semester avatar")
      .populate("project", "title description category techStack status")
      .populate("subject", "name code department semester")
      .populate("mentor",  "name email organization")
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, requests })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// @route  GET /api/subjects/my-requests
// @access Student (apni requests)
// ─────────────────────────────────────────────
const getStudentRequests = async (req, res) => {
  try {
    const requests = await ProjectRequest.find({ student: req.user._id })
      .populate("teacher", "name email department")
      .populate("project", "title status")
      .populate("subject", "name code department")
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, requests })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// @route  PUT /api/subjects/requests/:id/respond
// @access Teacher
// ─────────────────────────────────────────────
const respondToRequest = async (req, res) => {
  try {
    const { status, teacherRemarks } = req.body

    const request = await ProjectRequest.findOne({
      _id:     req.params.id,
      teacher: req.user._id,
    }).populate("student project subject")

    if (!request) return res.status(404).json({ message: "Request nahi mili." })

    request.status         = status
    request.teacherRemarks = teacherRemarks || ""
    await request.save()

    // Project status update karo
    if (status === "approved") {
      await Project.findByIdAndUpdate(request.project._id, {
        status:  "approved",
        teacher: req.user._id,
      })

      // Subject mein student enroll karo
      await Subject.findByIdAndUpdate(request.subject._id, {
        $addToSet: { enrolledStudents: request.student._id }
      })
    }

    // Student ko notification
    await Notification.create({
      recipient: request.student._id,
      sender:    req.user._id,
      type:      status === "approved" ? "project_approved" : "project_rejected",
      title:     status === "approved" ? "Project Request Approved! 🎉" : "Project Request Rejected",
      message:   status === "approved"
        ? `Tumhari project request "${request.subject.name} (${request.subject.code})" ke liye approve ho gayi!`
        : `Tumhari project request reject hui. Reason: ${teacherRemarks || "Koi reason nahi diya."}`,
    })

    res.status(200).json({
      success: true,
      request,
      message: `Request ${status} ho gayi!`,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

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
}