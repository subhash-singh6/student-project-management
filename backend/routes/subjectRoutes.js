const express = require("express")
const router  = express.Router()

const {
  createSubject,
  getAllSubjects,
  getMySubjects,
  updateSubject,
  deleteSubject,
  sendProjectRequest,
  getMyRequests,
  getStudentRequests,
  respondToRequest,
} = require("../controllers/subjectController")

const { protect }    = require("../middleware/authMiddleware")
const { allowRoles } = require("../middleware/roleMiddleware")

router.use(protect)

// Subject CRUD
router.get("/",    getAllSubjects)
router.get("/my",  allowRoles("teacher"), getMySubjects)
router.post("/",   allowRoles("teacher"), createSubject)
router.put("/:id", allowRoles("teacher"), updateSubject)
router.delete("/:id", allowRoles("teacher"), deleteSubject)

// Requests
router.post("/request",            allowRoles("student"),  sendProjectRequest)
router.get("/requests",            allowRoles("teacher"),  getMyRequests)
router.get("/my-requests",         allowRoles("student"),  getStudentRequests)
router.put("/requests/:id/respond", allowRoles("teacher"), respondToRequest)

module.exports = router