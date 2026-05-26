const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(

  {

    /* ==================================== */
    /* PROJECT */
    /* ==================================== */

    project: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Project",

      required: true,

    },

    /* ==================================== */
    /* CREATOR */
    /* ==================================== */

    createdBy: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },

    /* ==================================== */
    /* TITLE */
    /* ==================================== */

    title: {

      type: String,

      required: true,

      trim: true,

      maxlength: 120,

    },

    /* ==================================== */
    /* DESCRIPTION */
    /* ==================================== */

    description: {

      type: String,

      default: "",

      maxlength: 1000,

    },

    /* ==================================== */
    /* PRIORITY */
    /* ==================================== */

    priority: {

      type: String,

      enum: [

        "low",

        "medium",

        "high",

      ],

      default: "medium",

    },

    /* ==================================== */
    /* ASSIGNEE */
    /* ==================================== */

    assignee: {

      type: String,

      default: "",

    },

    /* ==================================== */
    /* COLUMN */
    /* ==================================== */

    column: {

      type: String,

      enum: [

        "todo",

        "inprogress",

        "review",

        "done",

      ],

      default: "todo",

    },

    /* ==================================== */
    /* ORDER */
    /* ==================================== */

    order: {

      type: Number,

      default: 0,

    },

    /* ==================================== */
    /* DEADLINE */
    /* ==================================== */

    deadline: {

      type: Date,

      default: null,

    },

    /* ==================================== */
    /* COMPLETED */
    /* ==================================== */

    completed: {

      type: Boolean,

      default: false,

    },

  },

  {

    timestamps: true,

  }

);

/* ======================================== */
/* INDEX */
/* ======================================== */

taskSchema.index({

  project: 1,

  column: 1,

});

/* ======================================== */
/* AUTO COMPLETE */
/* ======================================== */

taskSchema.pre(

  "save",

  function (next) {

    if (

      this.column === "done"

    ) {

      this.completed = true;

    } else {

      this.completed = false;

    }

    next();

  }

);

module.exports = mongoose.model(

  "Task",

  taskSchema

);