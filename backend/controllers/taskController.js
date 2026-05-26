const Task = require("../models/Task");

const Project = require("../models/Project");

const Team = require("../models/Team");

/* ======================================== */
/* ACCESS CONTROL */
/* ======================================== */

const canAccessProject =
  async (projectId, user) => {

    const project =
      await Project.findById(
        projectId
      );

    if (!project) {

      return {

        ok: false,

        status: 404,

        message:
          "Project not found.",

      };

    }

    /* ADMIN */

    if (
      user.role === "admin"
    ) {

      return {

        ok: true,

        project,

      };

    }

    /* TEACHER */

    if (
      user.role === "teacher"
    ) {

      if (

        project.teacher &&

        project.teacher.toString() ===
          user._id.toString()

      ) {

        return {

          ok: true,

          project,

        };

      }

    }

    /* PROJECT OWNER */

    if (

      project.createdBy.toString() ===
      user._id.toString()

    ) {

      return {

        ok: true,

        project,

      };

    }

    /* TEAM MEMBER */

    if (project.team) {

      const team =
        await Team.findOne({

          _id:
            project.team,

          "members.user":
            user._id,

        });

      if (team) {

        return {

          ok: true,

          project,

        };

      }

    }

    return {

      ok: false,

      status: 403,

      message:
        "Access denied.",

    };

  };

/* ======================================== */
/* GET TASKS */
/* ======================================== */

const getTasksByProject =
  async (req, res) => {

    try {

      const access =
        await canAccessProject(

          req.params.projectId,

          req.user

        );

      if (!access.ok) {

        return res.status(
          access.status
        ).json({

          message:
            access.message,

        });

      }

      const tasks =
        await Task.find({

          project:
            req.params.projectId,

        }).sort({

          order: 1,

          createdAt: 1,

        });

      const grouped = {

        todo: [],

        inprogress: [],

        review: [],

        done: [],

      };

      tasks.forEach((task) => {

        const col =
          grouped[task.column]

            ? task.column

            : "todo";

        grouped[col].push(task);

      });

      res.status(200).json({

        success: true,

        tasks: grouped,

        all: tasks,

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ======================================== */
/* CREATE TASK */
/* ======================================== */

const createTask =
  async (req, res) => {

    try {

      const {

        projectId,

        title,

        description,

        priority,

        assignee,

        column,

        deadline,

      } = req.body;

      const access =
        await canAccessProject(

          projectId,

          req.user

        );

      if (!access.ok) {

        return res.status(
          access.status
        ).json({

          message:
            access.message,

        });

      }

      const count =
        await Task.countDocuments({

          project:
            projectId,

          column:
            column || "todo",

        });

      const task =
        await Task.create({

          project:
            projectId,

          createdBy:
            req.user._id,

          title,

          description:
            description || "",

          priority:
            priority || "medium",

          assignee:
            assignee || "",

          column:
            column || "todo",

          deadline:
            deadline || null,

          order: count,

        });

      res.status(201).json({

        success: true,

        task,

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ======================================== */
/* UPDATE TASK */
/* ======================================== */

const updateTask =
  async (req, res) => {

    try {

      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {

        return res.status(404).json({

          message:
            "Task not found.",

        });

      }

      const access =
        await canAccessProject(

          task.project.toString(),

          req.user

        );

      if (!access.ok) {

        return res.status(
          access.status
        ).json({

          message:
            access.message,

        });

      }

      const updated =
        await Task.findByIdAndUpdate(

          req.params.id,

          req.body,

          {

            new: true,

            runValidators: true,

          }

        );

      res.status(200).json({

        success: true,

        task: updated,

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ======================================== */
/* MOVE TASK */
/* ======================================== */

const moveTask =
  async (req, res) => {

    try {

      const {

        column,

        order,

      } = req.body;

      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {

        return res.status(404).json({

          message:
            "Task not found.",

        });

      }

      const access =
        await canAccessProject(

          task.project.toString(),

          req.user

        );

      if (!access.ok) {

        return res.status(
          access.status
        ).json({

          message:
            access.message,

        });

      }

      task.column =
        column || task.column;

      if (
        order !== undefined
      ) {

        task.order = order;

      }

      await task.save();

      res.status(200).json({

        success: true,

        task,

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ======================================== */
/* DELETE TASK */
/* ======================================== */

const deleteTask =
  async (req, res) => {

    try {

      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {

        return res.status(404).json({

          message:
            "Task not found.",

        });

      }

      const access =
        await canAccessProject(

          task.project.toString(),

          req.user

        );

      if (!access.ok) {

        return res.status(
          access.status
        ).json({

          message:
            access.message,

        });

      }

      await task.deleteOne();

      res.status(200).json({

        success: true,

        message:
          "Task deleted successfully.",

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

module.exports = {

  getTasksByProject,

  createTask,

  updateTask,

  deleteTask,

  moveTask,

};