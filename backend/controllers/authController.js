const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// const register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;
//     const existingUser = await User.findOne({ email: email.toLowerCase() });
//     if (existingUser) return res.status(400).json({ message: "Email already registered." });

//     const user = await User.create({ name, email, password, role: role || "student" });
//     const token = generateToken(user._id, user.role);
//     res.status(201).json({ success: true, token, user: { _id: user._id, name: user.name, role: user.role } });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const register = async (req, res) => {
  try {

    console.log(req.body);

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered."
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student"
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {

    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    if (!user.isActive) return res.status(403).json({ message: "Account deactivated." });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);
    res.status(200).json({ success: true, token, user: { _id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => { res.status(200).json({ success: true, message: "Logged out" }); };

module.exports = { register, login, getMe, logout };