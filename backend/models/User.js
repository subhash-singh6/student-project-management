const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name zaroori hai"], trim: true },
    email: { type: String, required: [true, "Email zaroori hai"], unique: true, lowercase: true },
    password: { type: String, required: [true, "Password zaroori hai"], minlength: 6, select: false },
    role: { type: String, enum: ["student", "mentor", "teacher"], required: true },
    enrollmentNumber: { type: String },
    semester: { type: Number, min: 1, max: 8 },
    branch: { type: String },
    expertise: { type: [String] },
    organization: { type: String },
    assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    assignedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    employeeId: { type: String },
    department: { type: String },
    subjects: { type: [String] },
    avatar: { type: String, default: "" },
    phone: { type: String },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);