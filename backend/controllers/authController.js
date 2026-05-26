const User =
  require("../models/User");

const jwt =
  require("jsonwebtoken");

/* ====================================== */
/* GENERATE TOKEN */
/* ====================================== */

const generateToken =
  (id, role) => {

    return jwt.sign(

      {

        id,

        role,

      },

      process.env.JWT_SECRET,

      {

        expiresIn: "7d",

      }

    );

  };

/* ====================================== */
/* REGISTER */
/* ====================================== */

const register =
  async (req, res) => {

    try {

      const {

        name,

        email,

        password,

        role,

        enrollmentNumber,

        semester,

        branch,

        employeeId,

        department,

        subjects,

      } = req.body;

      /* EMAIL EXISTS */

      const existingUser =
        await User.findOne({

          email:
            email.toLowerCase(),

        });

      if (existingUser) {

        return res
          .status(400)
          .json({

            message:
              "Email already registered.",

          });

      }

      /* CREATE USER */

      const user =
        await User.create({

          name,

          email,

          password,

          role:
            role || "student",

          /* STUDENT */

          enrollmentNumber,

          semester,

          branch,

          /* TEACHER */

          employeeId,

          department,

          subjects,

        });

      /* TOKEN */

      const token =
        generateToken(

          user._id,

          user.role

        );

      /* RESPONSE */

      res.status(201).json({

        success: true,

        token,

        user: {

          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          enrollmentNumber:
            user.enrollmentNumber,

          semester:
            user.semester,

          branch:
            user.branch,

          employeeId:
            user.employeeId,

          department:
            user.department,

          subjects:
            user.subjects,

        },

      });

    } catch (error) {

      console.log(
        "REGISTER ERROR:",
        error
      );

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ====================================== */
/* LOGIN */
/* ====================================== */

const login =
  async (req, res) => {

    try {

      const {

        email,

        password,

      } = req.body;

      const user =
        await User.findOne({

          email:
            email.toLowerCase(),

        }).select(
          "+password"
        );

      if (

        !user ||

        !(await user.comparePassword(
          password
        ))

      ) {

        return res
          .status(401)
          .json({

            message:
              "Invalid email or password.",

          });

      }

      if (!user.isActive) {

        return res
          .status(403)
          .json({

            message:
              "Account deactivated.",

          });

      }

      /* LAST LOGIN */

      user.lastLogin =
        new Date();

      await user.save({

        validateBeforeSave:
          false,

      });

      /* TOKEN */

      const token =
        generateToken(

          user._id,

          user.role

        );

      res.status(200).json({

        success: true,

        token,

        user: {

          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          enrollmentNumber:
            user.enrollmentNumber,

          semester:
            user.semester,

          branch:
            user.branch,

          employeeId:
            user.employeeId,

          department:
            user.department,

          subjects:
            user.subjects,

        },

      });

    } catch (error) {

      res.status(500).json({

        message:
          "Server Error: " +
          error.message,

      });

    }

  };

/* ====================================== */
/* GET ME */
/* ====================================== */

const getMe =
  async (req, res) => {

    try {

      const user =
        await User.findById(

          req.user.id

        ).select("-password");

      res.status(200).json({

        success: true,

        user,

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

/* ====================================== */
/* LOGOUT */
/* ====================================== */

const logout =
  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "Logged out successfully.",

    });

  };

module.exports = {

  register,

  login,

  getMe,

  logout,

};