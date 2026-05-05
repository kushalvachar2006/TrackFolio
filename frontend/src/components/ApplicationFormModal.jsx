import { useState, useEffect } from "react";
import "./ApplicationFormModal.css";

export const ApplicationFormModal = ({ isOpen, onClose, onSubmit, resumes, editData }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    jobRole: "",
    appliedDate: new Date().toISOString().split("T")[0],
    portalUsed: "",
    status: "Applied",
    resumeId: "",
    notes: "",
    jobDescriptionText: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      const appliedDateStr = editData.appliedDate
        ? new Date(editData.appliedDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      setFormData({
        companyName: editData.companyName || "",
        jobRole: editData.jobRole || "",
        appliedDate: appliedDateStr,
        portalUsed: editData.portalUsed || "",
        status: editData.status || "Applied",
        resumeId: editData.resumeId?._id || "",
        notes: editData.notes || "",
        jobDescriptionText: editData.jobDescriptionText || "",
      });
    } else {
      setFormData({
        companyName: "",
        jobRole: "",
        appliedDate: new Date().toISOString().split("T")[0],
        portalUsed: "",
        status: "Applied",
        resumeId: "",
        notes: "",
        jobDescriptionText: "",
      });
    }
    setError("");
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.companyName.trim()) {
      setError("Company name is required");
      return false;
    }
    if (!formData.jobRole.trim()) {
      setError("Job role is required");
      return false;
    }
    if (!formData.appliedDate) {
      setError("Applied date is required");
      return false;
    }
    if (new Date(formData.appliedDate) > new Date()) {
      setError("Applied date cannot be in the future");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = {
      companyName: formData.companyName.trim(),
      jobRole: formData.jobRole.trim(),
      appliedDate: new Date(formData.appliedDate),
      portalUsed: formData.portalUsed.trim() || undefined,
      status: formData.status,
      resumeId: formData.resumeId || undefined,
      notes: formData.notes.trim() || undefined,
      jobDescriptionText: formData.jobDescriptionText.trim() || undefined,
    };

    setLoading(true);
    try {
      await onSubmit(submitData);
      setFormData({
        companyName: "",
        jobRole: "",
        appliedDate: new Date().toISOString().split("T")[0],
        portalUsed: "",
        status: "Applied",
        resumeId: "",
        notes: "",
        jobDescriptionText: "",
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      companyName: "",
      jobRole: "",
      appliedDate: new Date().toISOString().split("T")[0],
      portalUsed: "",
      status: "Applied",
      resumeId: "",
      notes: "",
      jobDescriptionText: "",
    });
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editData ? "Edit Application" : "Log New Application"}</h2>
          <button className="modal-close" onClick={handleCancel}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="companyName">Company Name *</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                placeholder="e.g., Google, Microsoft"
                value={formData.companyName}
                onChange={handleChange}
                disabled={loading}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="jobRole">Job Role *</label>
              <input
                type="text"
                id="jobRole"
                name="jobRole"
                placeholder="e.g., Software Engineer"
                value={formData.jobRole}
                onChange={handleChange}
                disabled={loading}
                maxLength={100}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appliedDate">Applied Date *</label>
              <input
                type="date"
                id="appliedDate"
                name="appliedDate"
                value={formData.appliedDate}
                onChange={handleChange}
                disabled={loading}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="portalUsed">Portal Used</label>
              <input
                type="text"
                id="portalUsed"
                name="portalUsed"
                placeholder="e.g., LinkedIn, Indeed, Company Website"
                value={formData.portalUsed}
                onChange={handleChange}
                disabled={loading}
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label htmlFor="resumeId">Resume Used</label>
              <select
                id="resumeId"
                name="resumeId"
                value={formData.resumeId}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">None selected</option>
                {resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">
              Notes ({formData.notes.length}/2000)
            </label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Add any notes about this application..."
              value={formData.notes}
              onChange={handleChange}
              disabled={loading}
              maxLength={2000}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobDescriptionText">
              Job Description ({formData.jobDescriptionText.length}/5000)
            </label>
            <textarea
              id="jobDescriptionText"
              name="jobDescriptionText"
              placeholder="Paste the job description here for reference..."
              value={formData.jobDescriptionText}
              onChange={handleChange}
              disabled={loading}
              maxLength={5000}
              rows={4}
            />
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
              disabled={loading || !formData.companyName.trim() || !formData.jobRole.trim()}
            >
              {loading
                ? editData
                  ? "Updating..."
                  : "Creating..."
                : editData
                  ? "Update Application"
                  : "Log Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
