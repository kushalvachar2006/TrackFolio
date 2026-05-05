import JobApplication from "../models/JobApplication.js";
import Resume from "../models/Resume.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get stats with MongoDB countDocuments
    const [totalApplications, interviewCount, offerCount, totalResumes] =
      await Promise.all([
        JobApplication.countDocuments({ userId }),
        JobApplication.countDocuments({ userId, status: "Interview" }),
        JobApplication.countDocuments({ userId, status: "Offer" }),
        Resume.countDocuments({ userId }),
      ]);

    // Get recent applications (last 5)
    const recentApplications = await JobApplication.find({ userId })
      .sort({ appliedDate: -1 })
      .limit(5)
      .populate("resumeId", "label")
      .lean();

    return res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      stats: {
        totalApplications,
        interviewCount,
        offerCount,
        totalResumes,
      },
      recentApplications,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "STATS_FAILED",
        message: error.message || "Failed to retrieve dashboard stats",
        statusCode: 500,
      },
    });
  }
};
