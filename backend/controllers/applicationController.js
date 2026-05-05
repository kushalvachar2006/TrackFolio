import JobApplication from "../models/JobApplication.js";
import Resume from "../models/Resume.js";

export const createApplication = async (req, res) => {
  try {
    const {
      companyName,
      jobRole,
      appliedDate,
      portalUsed,
      status,
      resumeId,
      notes,
      jobDescriptionText,
    } = req.body;

    // Validation
    if (!companyName || !jobRole) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_FIELDS",
          message: "Company name and job role are required",
          statusCode: 400,
        },
      });
    }

    if (!appliedDate) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_FIELDS",
          message: "Applied date is required",
          statusCode: 400,
        },
      });
    }

    // Verify status is valid
    const validStatuses = [
      "Applied",
      "Shortlisted",
      "Interview",
      "Offer",
      "Rejected",
    ];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_STATUS",
          message: `Status must be one of: ${validStatuses.join(", ")}`,
          statusCode: 400,
        },
      });
    }

    // Verify resume ownership if provided
    if (resumeId) {
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(400).json({
          success: false,
          error: {
            code: "INVALID_RESUME",
            message: "Resume not found",
            statusCode: 400,
          },
        });
      }
      if (resume.userId.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Resume does not belong to you",
            statusCode: 403,
          },
        });
      }
    }

    // Create application
    const application = new JobApplication({
      userId: req.user.userId,
      companyName: companyName.trim(),
      jobRole: jobRole.trim(),
      appliedDate,
      portalUsed: portalUsed ? portalUsed.trim() : undefined,
      status: status || "Applied",
      resumeId: resumeId || undefined,
      notes: notes ? notes.trim() : undefined,
      jobDescriptionText: jobDescriptionText
        ? jobDescriptionText.trim()
        : undefined,
    });

    await application.save();
    await application.populate("resumeId", "label fileUrl fileType");

    return res.status(201).json({
      success: true,
      message: "Application logged successfully",
      application,
    });
  } catch (error) {
    console.error("Create application error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "CREATE_FAILED",
        message: error.message || "Failed to create application",
        statusCode: 500,
      },
    });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({
      userId: req.user.userId,
    })
      .sort({ appliedDate: -1 })
      .populate("resumeId", "label fileUrl fileType");

    return res.status(200).json({
      success: true,
      message: "Applications retrieved successfully",
      applications,
    });
  } catch (error) {
    console.error("Get applications error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "FETCH_FAILED",
        message: error.message || "Failed to fetch applications",
        statusCode: 500,
      },
    });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findById(id).populate(
      "resumeId",
      "label fileUrl",
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Application not found",
          statusCode: 404,
        },
      });
    }

    if (application.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to view this application",
          statusCode: 403,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application retrieved successfully",
      application,
    });
  } catch (error) {
    console.error("Get application error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "FETCH_FAILED",
        message: error.message || "Failed to fetch application",
        statusCode: 500,
      },
    });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, jobDescriptionText, resumeId } = req.body;

    const application = await JobApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Application not found",
          statusCode: 404,
        },
      });
    }

    if (application.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to update this application",
          statusCode: 403,
        },
      });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = [
        "Applied",
        "Shortlisted",
        "Interview",
        "Offer",
        "Rejected",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: {
            code: "INVALID_STATUS",
            message: `Status must be one of: ${validStatuses.join(", ")}`,
            statusCode: 400,
          },
        });
      }
      application.status = status;
    }

    // Verify new resume if provided
    if (resumeId && resumeId !== application.resumeId.toString()) {
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(400).json({
          success: false,
          error: {
            code: "INVALID_RESUME",
            message: "Resume not found",
            statusCode: 400,
          },
        });
      }
      if (resume.userId.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Resume does not belong to you",
            statusCode: 403,
          },
        });
      }
      application.resumeId = resumeId;
    }

    if (notes !== undefined) {
      application.notes = notes ? notes.trim() : undefined;
    }

    if (jobDescriptionText !== undefined) {
      application.jobDescriptionText = jobDescriptionText
        ? jobDescriptionText.trim()
        : undefined;
    }

    await application.save();
    await application.populate("resumeId", "label fileUrl fileType");

    return res.status(200).json({
      success: true,
      message: "Application updated successfully",
      application,
    });
  } catch (error) {
    console.error("Update application error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "UPDATE_FAILED",
        message: error.message || "Failed to update application",
        statusCode: 500,
      },
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Application not found",
          statusCode: 404,
        },
      });
    }

    if (application.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to delete this application",
          statusCode: 403,
        },
      });
    }

    await JobApplication.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete application error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "DELETE_FAILED",
        message: error.message || "Failed to delete application",
        statusCode: 500,
      },
    });
  }
};

export const searchApplications = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_QUERY",
          message: "Search query is required",
          statusCode: 400,
        },
      });
    }

    if (q.length > 100) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_QUERY",
          message: "Search query cannot exceed 100 characters",
          statusCode: 400,
        },
      });
    }

    const applications = await JobApplication.find({
      userId: req.user.userId,
      $or: [
        { companyName: { $regex: q, $options: "i" } },
        { jobRole: { $regex: q, $options: "i" } },
      ],
    })
      .sort({ appliedDate: -1 })
      .populate("resumeId", "label fileUrl fileType");

    return res.status(200).json({
      success: true,
      message: "Search completed successfully",
      applications,
      count: applications.length,
    });
  } catch (error) {
    console.error("Search applications error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "SEARCH_FAILED",
        message: error.message || "Failed to search applications",
        statusCode: 500,
      },
    });
  }
};
