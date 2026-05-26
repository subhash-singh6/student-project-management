const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(

  {

    /* ====================================== */
    /* BASIC INFO */
    /* ====================================== */

    name: {

      type: String,

      required: [true, "Name is required"],

      trim: true,

    },

    email: {

      type: String,

      required: [true, "Email is required"],

      unique: true,

      lowercase: true,

      trim: true,

    },

    password: {

      type: String,

      required: [true, "Password is required"],

      minlength: 6,

      select: false,

    },

    role: {

      type: String,

      enum: [

        "student",

        "teacher",

        "admin",

      ],

      default: "student",

    },

    /* ====================================== */
    /* STUDENT FIELDS */
    /* ====================================== */

    enrollmentNumber: {

      type: String,

      default: "",

      trim: true,

    },

    semester: {

      type: Number,

      default: null,

    },

    branch: {

      type: String,

      default: "",

      trim: true,

    },

    /* ====================================== */
    /* TEACHER FIELDS */
    /* ====================================== */

    employeeId: {

      type: String,

      default: "",

      trim: true,

    },

    department: {

      type: String,

      default: "",

      trim: true,

    },

    subjects: {

      type: [String],

      default: [],

    },

    /* ====================================== */
    /* EXTRA */
    /* ====================================== */

    avatar: {

      type: String,

      default: "",

    },

    isActive: {

      type: Boolean,

      default: true,

    },

    lastLogin: {

      type: Date,

    },

  },

  {

    timestamps: true,

  }

);

/* ====================================== */
/* HASH PASSWORD */
/* ====================================== */

userSchema.pre(

  "save",

  async function () {

    if (

      !this.isModified(
        "password"
      )

    )

      return;

    this.password =
      await bcrypt.hash(

        this.password,

        12

      );

  }

);

/* ====================================== */
/* COMPARE PASSWORD */
/* ====================================== */

userSchema.methods.comparePassword =
  async function (
    enteredPassword
  ) {

    return await bcrypt.compare(

      enteredPassword,

      this.password

    );

  };

module.exports =
  mongoose.model(
    "User",
    userSchema
  );