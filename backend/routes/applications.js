import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  searchApplications,
} from "../controllers/applicationController.js";

const router = express.Router();

// All routes protected by authMiddleware
router.use(authMiddleware);

// Create application
router.post("/", createApplication);

// Get all applications
router.get("/", getAllApplications);

// Search applications - MUST be before /:id to avoid conflict
router.get("/search", searchApplications);

// Get single application
router.get("/:id", getApplicationById);

// Update application (PATCH for partial updates)
router.patch("/:id", updateApplication);

// Delete application
router.delete("/:id", deleteApplication);

export default router;
