const Project = require("../models/Project");
const Notification = require("../models/Notification");

/* ================================================= */
/* CREATE PROJECT */
/* ================================================= */

const createProject = async (req, res) => {

  try {

    const {

      title,
      description,
      category,
      teacher,
      subject,
      techStack,
      startDate,
      deadline,

    } = req.body;

    const project = await Project.create({

      title,

      description,

      category,

      teacher: teacher || null,

      subject,

      techStack:
        techStack || [],

      startDate,

      deadline,

      createdBy:
        req.user._id,

    });

    if (teacher) {

      await Notification.create({

        recipient: teacher,

        sender:
          req.user._id,

        type:
          "project_created",

        title:
          "New Project Submitted",

        message:
          `${req.user.name} submitted "${title}"`,

      });

    }

    res.status(201).json({

      success: true,

      project,

    });

  } catch (error) {

    res.status(500).json({

      message:
        error.message,

    });

  }

};

/* ================================================= */
/* GET ALL PROJECTS */
/* ================================================= */

const getAllProjects = async (req, res) => {

  try {

    let query = {

      isActive: true,

    };

    /* ================= ROLE FILTER ================= */

    if (
      req.user.role ===
      "student"
    ) {

      query.createdBy =
        req.user._id;

    }

    if (
      req.user.role ===
      "teacher"
    ) {

      query.teacher =
        req.user._id;

    }

    const projects =
      await Project.find(query)

        .populate(
          "createdBy",
          "name email enrollmentNumber branch semester"
        )

        .populate(
          "teacher",
          "name email department"
        )

        .populate(
          "team",
          "name members"
        )

        .populate(
          "subject",
          "name code"
        )

        .sort({
          createdAt: -1,
        });

    res.status(200).json({

      success: true,

      count:
        projects.length,

      projects,

    });

  } catch (error) {

    res.status(500).json({

      message:
        error.message,

    });

  }

};

/* ================================================= */
/* GET PROJECT BY ID */
/* ================================================= */

const getProjectById =
  async (req, res) => {

    try {

      const project =
        await Project.findById(
          req.params.id
        )

          .populate(
            "createdBy",
            "name email enrollmentNumber branch semester"
          )

          .populate(
            "teacher",
            "name email department"
          )

          .populate(
            "team"
          )

          .populate(
            "subject",
            "name code"
          );

      if (!project) {

        return res.status(404).json({

          message:
            "Project not found.",

        });

      }

      res.status(200).json({

        success: true,

        project,

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ================================================= */
/* UPDATE PROJECT */
/* ================================================= */

const updateProject =
  async (req, res) => {

    try {

      const project =
        await Project.findById(
          req.params.id
        );

      if (!project) {

        return res.status(404).json({

          message:
            "Project not found.",

        });

      }

      const isOwner =
        project.createdBy.toString() ===
        req.user._id.toString();

      const isTeacher =
        project.teacher &&
        project.teacher.toString() ===
          req.user._id.toString();

      const isAdmin =
        req.user.role ===
        "admin";

      if (
        !isOwner &&
        !isTeacher &&
        !isAdmin
      ) {

        return res.status(403).json({

          message:
            "Not authorized.",

        });

      }

      const updatedProject =
        await Project.findByIdAndUpdate(

          req.params.id,

          {
            $set: req.body,
          },

          {
            new: true,
            runValidators: true,
          }

        )

          .populate(
            "teacher",
            "name"
          )

          .populate(
            "subject",
            "name code"
          );

      res.status(200).json({

        success: true,

        project:
          updatedProject,

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ================================================= */
/* APPROVE / REJECT PROJECT */
/* ================================================= */

const approveProject =
  async (req, res) => {

    try {

      const { status } =
        req.body;

      if (
        ![
          "approved",
          "rejected",
        ].includes(status)
      ) {

        return res.status(400).json({

          message:
            "Invalid status.",

        });

      }

      const project =
        await Project.findById(
          req.params.id
        );

      if (!project) {

        return res.status(404).json({

          message:
            "Project not found.",

        });

      }

      project.status =
        status;

      await project.save();

      await Notification.create({

        recipient:
          project.createdBy,

        sender:
          req.user._id,

        type:
          "project_status",

        title:
          `Project ${status}`,

        message:
          `Your project "${project.title}" was ${status}.`,

      });

      res.status(200).json({

        success: true,

        project,

        message:
          `Project ${status} successfully.`,

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ================================================= */
/* GRADE PROJECT */
/* ================================================= */

const gradeProject =
  async (req, res) => {

    try {

      const {

        grade,
        gradeRemarks,

      } = req.body;

      const project =
        await Project.findById(
          req.params.id
        );

      if (!project) {

        return res.status(404).json({

          message:
            "Project not found.",

        });

      }

      project.grade =
        grade;

      project.gradeRemarks =
        gradeRemarks;

      await project.save();

      await Notification.create({

        recipient:
          project.createdBy,

        sender:
          req.user._id,

        type:
          "project_graded",

        title:
          "Project Graded",

        message:
          `Your project "${project.title}" received grade ${grade}.`,

      });

      res.status(200).json({

        success: true,

        project,

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ================================================= */
/* DELETE PROJECT */
/* ================================================= */

const deleteProject =
  async (req, res) => {

    try {

      const project =
        await Project.findById(
          req.params.id
        );

      if (!project) {

        return res.status(404).json({

          message:
            "Project not found.",

        });

      }

      const isOwner =
        project.createdBy.toString() ===
        req.user._id.toString();

      const isAdmin =
        req.user.role ===
        "admin";

      if (
        !isOwner &&
        !isAdmin
      ) {

        return res.status(403).json({

          message:
            "Access denied.",

        });

      }

      project.isActive =
        false;

      await project.save();

      res.status(200).json({

        success: true,

        message:
          "Project deleted successfully.",

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };
  /* ================================================= */
/* UPLOAD PROJECT ATTACHMENT */
/* ================================================= */

const uploadProjectAttachment =
  async (req, res) => {

    try {

      const project =
        await Project.findById(
          req.params.id
        );

      if (!project) {

        return res.status(404).json({

          message:
            "Project not found.",

        });

      }

      const isOwner =
        project.createdBy.toString() ===
        req.user._id.toString();

      if (!isOwner) {

        return res.status(403).json({

          message:
            "Access denied.",

        });

      }

      if (!req.file) {

        return res.status(400).json({

          message:
            "No file uploaded.",

        });

      }

      const fileData = {

        fileName:
          req.file.originalname,

        fileUrl:
          `/uploads/submissions/${req.file.filename}`,
        fileType:
          req.file.mimetype,
      };
      project.attachments.push(
        fileData
      );
      await project.save();
      res.status(200).json({
        success: true,
        message:
          "Attachment uploaded successfully.",
        attachment:
          fileData,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
/* ================================================= */
/* EXPORTS */
/* ================================================= */
module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  approveProject,
  gradeProject,
  deleteProject,
  uploadProjectAttachment,

};