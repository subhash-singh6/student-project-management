const multer = require("multer")
const path   = require("path")
const fs     = require("fs")

// Upload folder banao agar nahi hai
const createDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

// Avatar storage config
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/avatars"
    createDir(dir)
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`)
  },
})

// File filter — sirf images
const imageFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp"]
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error("Sirf JPG, PNG, WEBP files allowed hain."), false)
  }
}

// Submission file storage
const submissionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/submissions"
    createDir(dir)
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname)
    const name = file.originalname.replace(/\s+/g, "_").replace(ext, "")
    cb(null, `${name}_${Date.now()}${ext}`)
  },
})

const uploadAvatar = multer({
  storage:  avatarStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
})

const uploadSubmission = multer({
  storage: submissionStorage,
  limits:  { fileSize: 20 * 1024 * 1024 }, // 20MB max
})

module.exports = { uploadAvatar, uploadSubmission }