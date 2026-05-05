import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    label: {
      type: String,
      required: [true, "Resume label is required"],
      trim: true,
      maxlength: [100, "Label cannot exceed 100 characters"],
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
    },
    fileType: {
      type: String,
      enum: ["pdf", "docx"],
      required: [true, "File type must be PDF or DOCX"],
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
    },
    version: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    // Parsed resume details extracted via AI
    parsedDetails: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      summary: { type: String, default: "" },
      skills: { type: [String], default: [] },
      experience: [
        {
          company: String,
          role: String,
          duration: String,
          description: String,
        },
      ],
      education: [
        {
          institution: String,
          degree: String,
          year: String,
          gpa: String,
        },
      ],
      projects: [
        {
          name: String,
          description: String,
          techStack: String,
          link: String,
        },
      ],
      certifications: { type: [String], default: [] },
      languages: { type: [String], default: [] },
      achievements: { type: [String], default: [] },
      isParsed: { type: Boolean, default: false },
      parsedAt: { type: Date },
    },
  },
  { timestamps: true }
);

// Index for faster queries
resumeSchema.index({ userId: 1, uploadedAt: -1 });

export default mongoose.model("Resume", resumeSchema);