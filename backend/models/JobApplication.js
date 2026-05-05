import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    jobRole: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
      maxlength: [100, "Job role cannot exceed 100 characters"],
    },
    appliedDate: {
      type: Date,
      required: [true, "Applied date is required"],
      default: Date.now,
    },
    portalUsed: {
      type: String,
      trim: true,
      maxlength: [50, "Portal name cannot exceed 50 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["Applied", "Shortlisted", "Interview", "Offer", "Rejected"],
        message: "Status must be one of: Applied, Shortlisted, Interview, Offer, Rejected",
      },
      default: "Applied",
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: false,
    },
    notes: {
      type: String,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
    },
    jobDescriptionText: {
      type: String,
      maxlength: [5000, "Job description cannot exceed 5000 characters"],
    },
  },
  { timestamps: true }
);

// Index for fast user-specific queries sorted by date
jobApplicationSchema.index({ userId: 1, appliedDate: -1 });

// Populate resume fields needed for resolver + preview + download
const RESUME_FIELDS = "label fileUrl fileName fileType";

jobApplicationSchema.pre("findOne", function () {
  this.populate("resumeId", RESUME_FIELDS);
});

jobApplicationSchema.pre("find", function () {
  this.populate("resumeId", RESUME_FIELDS);
});

jobApplicationSchema.methods.toJSON = function () {
  return this.toObject();
};

export default mongoose.model("JobApplication", jobApplicationSchema);
