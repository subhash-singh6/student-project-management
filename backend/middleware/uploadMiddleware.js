// 📄 Location: backend/middleware/uploadMiddleware.js
const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

const createDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/avatars";
    createDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const userId = req.user ? req.user._id : "guest";
    cb(null, `avatar_${userId}_${Date.now()}${ext}`);
  },
});

const imageFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG, and WEBP image formats are allowed."), false);
  }
};

const submissionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/submissions";
    createDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = file.originalname.replace(/\s+/g, "_").replace(ext, "");
    cb(null, `${name}_${Date.now()}${ext}`);
  },
});

const uploadAvatar = multer({
  storage:  avatarStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

const uploadSubmission = multer({
  storage: submissionStorage,
  limits:  { fileSize: 20 * 1024 * 1024 },
});

module.exports = { uploadAvatar, uploadSubmission };