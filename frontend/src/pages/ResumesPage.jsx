import { useState, useEffect } from "react";
import { resumeAPI, getErrorMessage } from "../utils/api";
import { ResumeCard } from "../components/ResumeCard";
import { UploadResumeModal } from "../components/UploadResumeModal";
import { FloatingResolverButton } from "../components/FloatingResolverButton";
import { Header } from "../components/Header";
import { Upload, FileText, Sparkles, Info } from "lucide-react";
import "./Resumes.css";

export const ResumesPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await resumeAPI.getAll();
      setResumes(response.data.resumes || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (formData) => {
    try {
      const response = await resumeAPI.upload(formData);
      setResumes([response.data.resume, ...resumes]);
      setShowModal(false);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  const handleDeleteResume = async (id) => {
    try {
      await resumeAPI.delete(id);
      setResumes(resumes.filter((r) => r._id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="resumes-container">
      <Header title="My Resumes" />

      <div className="resumes-page-header">
        <div className="resumes-page-title">
          <h1>Resume Vault</h1>
          <p>Manage and organize all your resume versions</p>
        </div>
        <button className="btn-upload-primary" onClick={() => setShowModal(true)}>
          <Upload size={16} />
          Upload Resume
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading your resumes...</p>
        </div>
      ) : resumes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FileText size={32} /></div>
          <h2>No resumes yet</h2>
          <p>Upload your first resume to start tracking which one goes where.</p>
          <button className="btn-upload-secondary" onClick={() => setShowModal(true)}>
            Upload Your First Resume
          </button>
        </div>
      ) : (
        <div className="resumes-grid">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              onDelete={handleDeleteResume}
            />
          ))}
        </div>
      )}

      {resumes.length > 0 && (
        <div className="resumes-footer">
          <p><Sparkles size={13} /> Use <strong>Resume AI</strong> in the sidebar to extract details &amp; tailor to a job</p>
          <p><Info size={13} /> Max file size: 5MB &nbsp;|&nbsp; Supported: PDF, DOCX</p>
        </div>
      )}

      <UploadResumeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUpload={handleUpload}
      />

      <FloatingResolverButton />
    </div>
  );
};