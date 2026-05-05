import { useState } from "react";
import { FileText, Eye, Download, Calendar, Globe, X, ExternalLink } from "lucide-react";
import "./ResolverResultCard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getStatusColor = (status) => {
  const colors = {
    Applied: "#3498db",
    Shortlisted: "#9b59b6",
    Interview: "#f39c12",
    Offer: "#2ecc71",
    Rejected: "#e74c3c",
  };
  return colors[status] || "#95a5a6";
};

const getStatusBg = (status) => {
  const bgs = {
    Applied: "rgba(52,152,219,0.12)",
    Shortlisted: "rgba(155,89,182,0.12)",
    Interview: "rgba(243,156,18,0.12)",
    Offer: "rgba(46,204,113,0.12)",
    Rejected: "rgba(231,76,60,0.12)",
  };
  return bgs[status] || "rgba(149,165,166,0.12)";
};

export const ResolverResultCard = ({ application }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const resume = application?.resumeId;

  const fullFileUrl = resume?.fileUrl
    ? resume.fileUrl.startsWith("http")
      ? resume.fileUrl
      : `${API_URL}${resume.fileUrl}`
    : null;

  const displayFileType = (() => {
    if (resume?.fileType) return String(resume.fileType).toUpperCase();
    if (resume?.fileName?.includes("."))
      return resume.fileName.split(".").pop().toUpperCase();
    return "FILE";
  })();

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleDownload = () => {
    if (!fullFileUrl) return;
    const link = document.createElement("a");
    link.href = fullFileUrl;
    link.download = resume?.label || "resume";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = () => {
    if (!fullFileUrl) return;
    // PDFs can be embedded; DOCX fall back to opening in new tab
    if (displayFileType === "PDF") {
      setPreviewOpen(true);
    } else {
      window.open(fullFileUrl, "_blank");
    }
  };

  return (
    <>
      <div className="resolver-result-card">
        {/* Header */}
        <div className="result-header">
          <div className="result-company-info">
            <h2 className="result-company">{application.companyName}</h2>
            <p className="result-role">{application.jobRole}</p>
          </div>
          <div
            className="result-status-badge"
            style={{
              color: getStatusColor(application.status),
              background: getStatusBg(application.status),
              border: `1px solid ${getStatusColor(application.status)}40`,
            }}
          >
            {application.status}
          </div>
        </div>

        {/* Meta */}
        <div className="result-meta">
          <span className="meta-item">
            <Calendar size={12} /> Applied: <strong>{formatDate(application.appliedDate)}</strong>
          </span>
          {application.portalUsed && (
            <span className="meta-item">
              <Globe size={12} /> Portal: <strong>{application.portalUsed}</strong>
            </span>
          )}
        </div>

        {/* Resume section */}
        {resume ? (
          <div className="result-resume-section">
            <div className="resume-label-row">
              <span className="resume-icon"><FileText size={14} /></span>
              <span className="resume-name">{resume.label}</span>
              <span className={`resume-type-badge rtype-${displayFileType.toLowerCase()}`}>
                {displayFileType}
              </span>
            </div>
            <div className="resume-actions">
              <button
                className="btn-preview"
                onClick={handlePreview}
                title="Preview resume"
                disabled={!fullFileUrl}
              >
                <Eye size={13} /> Preview
              </button>
              <button
                className="btn-download"
                onClick={handleDownload}
                title="Download resume"
                disabled={!fullFileUrl}
              >
                <Download size={13} /> Download
              </button>
            </div>
          </div>
        ) : (
          <div className="result-no-resume">
            <p>No resume linked to this application</p>
          </div>
        )}

        {/* Notes */}
        {application.notes && (
          <div className="result-notes">
            <p>
              <strong>Notes:</strong> {application.notes}
            </p>
          </div>
        )}
      </div>

      {/* Inline PDF preview modal */}
      {previewOpen && fullFileUrl && (
        <div className="pdf-overlay" onClick={() => setPreviewOpen(false)}>
          <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <span><FileText size={14} /> {resume?.label}</span>
              <div className="pdf-modal-actions">
                <button
                  className="pdf-btn-newtab"
                  onClick={() => window.open(fullFileUrl, "_blank")}
                  title="Open in new tab"
                >
                  <ExternalLink size={13} /> New Tab
                </button>
                <button
                  className="pdf-btn-close"
                  onClick={() => setPreviewOpen(false)}
                  title="Close"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="pdf-modal-body">
              <iframe
                src={`${fullFileUrl}#toolbar=0`}
                title={resume?.label}
                className="pdf-iframe"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
