const Team =
  require("../models/Team");

const User =
  require("../models/User");

const Project =
  require("../models/Project");

/* ====================================== */
/* CREATE TEAM */
/* ====================================== */

const createTeam =
  async (req, res) => {

    try {

      const {

        name,

        description,

        projectId,

        maxMembers,

        category,

        subject,

      } = req.body;

      /* USER ALREADY IN TEAM */

      const existingTeam =
        await Team.findOne({

          "members.user":
            req.user._id,

          isActive: true,

        });

      if (existingTeam) {

        return res
          .status(400)
          .json({

            message:
              "You are already part of another team.",

          });

      }

      /* CREATE TEAM */

      const team =
        await Team.create({

          name,

          description,

          leader:
            req.user._id,

          category,

          subject,

          maxMembers:
            maxMembers || 5,

          members: [

            {

              user:
                req.user._id,

              role:
                "leader",

            },

          ],

          project:
            projectId || null,

        });

      /* LINK PROJECT */

      if (projectId) {

        await Project.findByIdAndUpdate(

          projectId,

          {

            team:
              team._id,

          }

        );

      }

      res.status(201).json({

        success: true,

        team,

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ====================================== */
/* GET MY TEAM */
/* ====================================== */

const getMyTeam =
  async (req, res) => {

    try {

      const team =
        await Team.findOne({

          "members.user":
            req.user._id,

          isActive: true,

        })

          .populate(

            "members.user",

            "name email avatar enrollmentNumber semester branch"

          )

          .populate(

            "leader",

            "name email"

          )

          .populate(

            "project",

            "title status progress"

          );

      if (!team) {

        return res
          .status(404)
          .json({

            message:
              "You are not part of any team.",

          });

      }

      res.status(200).json({

        success: true,

        team,

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ====================================== */
/* GET ALL TEAMS */
/* ====================================== */

const getAllTeams =
  async (req, res) => {

    try {

      const teams =
        await Team.find({

          isActive: true,

        })

          .populate(

            "members.user",

            "name email enrollmentNumber semester branch"

          )

          .populate(

            "leader",

            "name email"

          )

          .populate(

            "project",

            "title status"

          );

      res.status(200).json({

        success: true,

        count:
          teams.length,

        teams,

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ====================================== */
/* ADD MEMBER */
/* ====================================== */

const addMember =
  async (req, res) => {

    try {

      const {

        email,

        role,

      } = req.body;

      const team =
        await Team.findById(

          req.params.id

        );

      if (!team) {

        return res
          .status(404)
          .json({

            message:
              "Team not found.",

          });

      }

      /* ONLY LEADER */

      if (

        team.leader.toString() !==

        req.user._id.toString()

      ) {

        return res
          .status(403)
          .json({

            message:
              "Only leader can add members.",

          });

      }

      /* MAX LIMIT */

      if (

        team.members.length >=

        team.maxMembers

      ) {

        return res
          .status(400)
          .json({

            message:
              `Maximum ${team.maxMembers} members allowed.`,

          });

      }

      /* FIND USER */

      const newMember =
        await User.findOne({

          email,

        });

      if (!newMember) {

        return res
          .status(404)
          .json({

            message:
              "Student not found.",

          });

      }

      /* ONLY STUDENT */

      if (
        newMember.role !==
        "student"
      ) {

        return res
          .status(400)
          .json({

            message:
              "Only students can join teams.",

          });

      }

      /* CHECK TEAM */

      const alreadyInTeam =
        await Team.findOne({

          "members.user":
            newMember._id,

          isActive: true,

        });

      if (alreadyInTeam) {

        return res
          .status(400)
          .json({

            message:
              "Student already belongs to another team.",

          });

      }

      /* DUPLICATE */

      const alreadyMember =
        team.members.find(

          (m) =>

            m.user.toString() ===

            newMember._id.toString()

        );

      if (alreadyMember) {

        return res
          .status(400)
          .json({

            message:
              "Already added.",

          });

      }

      /* PUSH */

      team.members.push({

        user:
          newMember._id,

        role:
          role || "member",

      });

      await team.save();

      const updatedTeam =
        await Team.findById(
          team._id
        ).populate(

          "members.user",

          "name email avatar enrollmentNumber semester branch"

        );

      res.status(200).json({

        success: true,

        team:
          updatedTeam,

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ====================================== */
/* REMOVE MEMBER */
/* ====================================== */

const removeMember =
  async (req, res) => {

    try {

      const team =
        await Team.findById(

          req.params.id

        );

      if (!team) {

        return res
          .status(404)
          .json({

            message:
              "Team not found.",

          });

      }

      /* ONLY LEADER */

      if (

        team.leader.toString() !==

        req.user._id.toString()

      ) {

        return res
          .status(403)
          .json({

            message:
              "Only leader can remove members.",

          });

      }

      /* LEADER REMOVE BLOCK */

      if (

        team.leader.toString() ===

        req.params.userId

      ) {

        return res
          .status(400)
          .json({

            message:
              "Leader cannot remove themselves.",

          });

      }

      team.members =
        team.members.filter(

          (m) =>

            m.user.toString() !==

            req.params.userId

        );

      await team.save();

      res.status(200).json({

        success: true,

        message:
          "Member removed successfully.",

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ====================================== */
/* UPDATE TEAM */
/* ====================================== */

const updateTeam =
  async (req, res) => {

    try {

      const {

        name,

        description,

        maxMembers,

        category,

        subject,

      } = req.body;

      const team =
        await Team.findById(

          req.params.id

        );

      if (!team) {

        return res
          .status(404)
          .json({

            message:
              "Team not found.",

          });

      }

      /* ONLY LEADER */

      if (

        team.leader.toString() !==

        req.user._id.toString()

      ) {

        return res
          .status(403)
          .json({

            message:
              "Only leader can edit team.",

          });

      }

      team.name =
        name || team.name;

      team.description =
        description ||
        team.description;

      team.maxMembers =
        maxMembers ||
        team.maxMembers;

      team.category =
        category ||
        team.category;

      team.subject =
        subject ||
        team.subject;

      await team.save();

      res.status(200).json({

        success: true,

        team,

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ====================================== */
/* DELETE TEAM */
/* ====================================== */

const deleteTeam =
  async (req, res) => {

    try {

      const team =
        await Team.findById(

          req.params.id

        );

      if (!team) {

        return res
          .status(404)
          .json({

            message:
              "Team not found.",

          });

      }

      /* ONLY LEADER */

      if (

        team.leader.toString() !==

        req.user._id.toString()

      ) {

        return res
          .status(403)
          .json({

            message:
              "Only leader can delete the team.",

          });

      }

      await team.deleteOne();

      res.status(200).json({

        success: true,

        message:
          "Team deleted successfully.",

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ====================================== */
/* LEAVE TEAM */
/* ====================================== */

const leaveTeam =
  async (req, res) => {

    try {

      const team =
        await Team.findById(

          req.params.id

        );

      if (!team) {

        return res
          .status(404)
          .json({

            message:
              "Team not found.",

          });

      }

      /* LEADER CANNOT LEAVE */

      if (

        team.leader.toString() ===

        req.user._id.toString()

      ) {

        return res
          .status(400)
          .json({

            message:
              "Leader cannot leave team. Transfer leadership first.",

          });

      }

      team.members =
        team.members.filter(

          (m) =>

            m.user.toString() !==

            req.user._id.toString()

        );

      await team.save();

      res.status(200).json({

        success: true,

        message:
          "You left the team.",

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

module.exports = {

  createTeam,

  getMyTeam,

  getAllTeams,

  addMember,

  removeMember,

  updateTeam,

  deleteTeam,

  leaveTeam,

};