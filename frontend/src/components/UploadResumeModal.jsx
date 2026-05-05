import { useState } from "react";
import { FileUp } from "lucide-react";
import "./Modal.css";

export const UploadResumeModal = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      setError("Please select a file");
      return false;
    }

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const validExtensions = [".pdf", ".docx"];

    if (!validTypes.includes(selectedFile.type)) {
      setError("Only PDF and DOCX files are allowed");
      return false;
    }

    const fileName = selectedFile.name.toLowerCase();
    const hasValidExtension = validExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!hasValidExtension) {
      setError("File must have .pdf or .docx extension");
      return false;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size cannot exceed 5MB");
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
      setError("");
    } else {
      setFile(null);
    }
  };

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    if (!label.trim()) {
      setError("Please enter a resume label");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("label", label.trim());

    setLoading(true);
    try {
      await onUpload(formData);
      setFile(null);
      setLabel("");
      setError("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to upload resume");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setLabel("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upload Resume</h2>
          <button className="modal-close" onClick={handleCancel}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="label">Resume Label</label>
            <input
              type="text"
              id="label"
              placeholder="e.g., SDE Resume v2, Frontend Role Resume"
              value={label}
              onChange={handleLabelChange}
              disabled={loading}
              maxLength={100}
            />
            <span className="char-count">{label.length}/100</span>
          </div>

          <div
            className={`drag-drop-area ${dragActive ? "active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-input"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              disabled={loading}
              className="file-input"
            />
            <label htmlFor="file-input" className="drag-drop-label">
              <div className="drag-drop-icon"><FileUp size={28} /></div>
              <p className="drag-drop-text">
                {file ? (
                  <>
                    <strong>{file.name}</strong>
                    <br />
                    <span className="file-size">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </>
                ) : (
                  <>
                    <strong>Drag and drop your resume here</strong>
                    <br />
                    <span>or click to browse (PDF or DOCX, max 5MB)</span>
                  </>
                )}
              </p>
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading || !file || !label.trim()}
            >
              {loading ? "Uploading..." : "Upload Resume"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
