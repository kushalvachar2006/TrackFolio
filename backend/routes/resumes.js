import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  uploadMiddleware,
  handleMulterError,
} from "../middleware/uploadMiddleware.js";
import {
  uploadResume,
  getAllResumes,
  deleteResume,
  getResumeFile,
  parseResumeDetails,
  redefineResume,
  downloadTailoredResume,
  updateParsedDetails,
} from "../controllers/resumeController.js";

const router = express.Router();

// All routes protected by authMiddleware
router.use(authMiddleware);

// Upload resume
router.post("/", uploadMiddleware.single("file"), handleMulterError, uploadResume);

// Get all resumes for user
router.get("/", getAllResumes);

// Get resume file URL
router.get("/:id/view", getResumeFile);

// Parse resume details using AI
router.post("/:id/parse", parseResumeDetails);

// Update parsed details (e.g., social links)
router.put("/:id/parsed-details", updateParsedDetails);

// Redefine resume based on job description (AI Tailor)
router.post("/:id/redefine", redefineResume);

// Download tailored resume as DOCX
router.post("/:id/download-tailored", downloadTailoredResume);

// Delete resume
router.delete("/:id", deleteResume);

export default router;