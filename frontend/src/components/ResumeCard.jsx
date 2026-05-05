import { Eye, Trash2 } from "lucide-react";
import "./ResumeCard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const ResumeCard = ({ resume, onDelete }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handlePreview = () => {
    const fullUrl = `${API_URL}${resume.fileUrl}`;
    window.open(fullUrl, "_blank");
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${resume.label}"?`
    );
    if (confirmed) onDelete(resume._id);
  };

  const isParsed = resume.parsedDetails?.isParsed;

  return (
    <div className="resume-card">
      <div className="resume-card-header">
        <h3 className="resume-label">{resume.label}</h3>
        <span className={`file-badge badge-${resume.fileType}`}>
          {resume.fileType.toUpperCase()}
        </span>
      </div>

      <div className="resume-card-body">
        <div className="resume-meta">
          <p className="meta-item">
            <span className="meta-label">Uploaded</span>
            <span>{formatDate(resume.uploadedAt)}</span>
          </p>
          <p className="meta-item">
            <span className="meta-label">Size</span>
            <span>{formatFileSize(resume.fileSize)}</span>
          </p>
          {resume.version && (
            <p className="meta-item">
              <span className="meta-label">Version</span>
              <span>v{resume.version}</span>
            </p>
          )}
          <p className="meta-item">
            <span className="meta-label">AI Details</span>
            <span className={isParsed ? "parsed-badge" : "unparsed-badge"}>
              {isParsed ? "✓ Extracted" : "Not yet"}
            </span>
          </p>
        </div>
      </div>

      <div className="resume-card-footer">
        <button onClick={handlePreview} className="btn btn-preview">
          <Eye size={14} /> Preview
        </button>
        <button onClick={handleDelete} className="btn btn-delete">
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
};
