import { useState, useEffect, useRef } from "react";
import { applicationAPI, resumeAPI, getErrorMessage } from "../utils/api";
import { ApplicationCard } from "../components/ApplicationCard";
import { ApplicationFormModal } from "../components/ApplicationFormModal";
import { FloatingResolverButton } from "../components/FloatingResolverButton";
import { Header } from "../components/Header";
import { Plus, Lightbulb, Briefcase } from "lucide-react";
import "./Applications.css";

export const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => { fetchApplications(); fetchResumes(); }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!searchQuery.trim()) { setFilteredApplications(applications); setSearching(false); return; }

    setSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await applicationAPI.search(searchQuery);
        setFilteredApplications(response.data.applications);
      } catch (err) {
        console.error("Search error:", err);
        setFilteredApplications([]);
      } finally { setSearching(false); }
    }, 300);
  }, [searchQuery, applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true); setError("");
      const response = await applicationAPI.getAll();
      setApplications(response.data.applications || []);
      setFilteredApplications(response.data.applications || []);
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  const fetchResumes = async () => {
    try {
      const response = await resumeAPI.getAll();
      setResumes(response.data.resumes || []);
    } catch (err) { console.error(err); }
  };

  const handleCreateApplication = async (formData) => {
    try {
      setIsProcessing(true);
      const response = await applicationAPI.create(formData);
      const updated = [response.data.application, ...applications];
      setApplications(updated); setFilteredApplications(updated);
      setShowModal(false); setEditingApplication(null);
    } catch (err) { throw new Error(getErrorMessage(err)); }
    finally { setIsProcessing(false); }
  };

  const handleUpdateApplication = async (formData) => {
    try {
      setIsProcessing(true);
      const response = await applicationAPI.update(editingApplication._id, formData);
      const updated = response.data.application;
      setApplications(applications.map((a) => (a._id === updated._id ? updated : a)));
      setFilteredApplications(filteredApplications.map((a) => (a._id === updated._id ? updated : a)));
      setShowModal(false); setEditingApplication(null);
    } catch (err) { throw new Error(getErrorMessage(err)); }
    finally { setIsProcessing(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await applicationAPI.update(id, { status: newStatus });
      const updated = response.data.application;
      setApplications(applications.map((a) => (a._id === updated._id ? updated : a)));
      setFilteredApplications(filteredApplications.map((a) => (a._id === updated._id ? updated : a)));
    } catch (err) { setError(getErrorMessage(err)); }
  };

  const handleDeleteApplication = async (id) => {
    try {
      await applicationAPI.delete(id);
      setApplications(applications.filter((a) => a._id !== id));
      setFilteredApplications(filteredApplications.filter((a) => a._id !== id));
    } catch (err) { setError(getErrorMessage(err)); }
  };

  const handleOpenModal = (application = null) => {
    setEditingApplication(application);
    setShowModal(true);
  };

  return (
    <div className="applications-container">
      <Header title="Applications" />

      <div className="applications-header">
        <div className="header-content">
          <h1>Job Applications</h1>
          <p>Track and manage every application you've submitted</p>
        </div>
        <button className="btn-log-application" onClick={() => handleOpenModal()}>
          <Plus size={16} />
          Log Application
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by company or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searching && <span className="search-indicator">Searching...</span>}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading your applications...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Briefcase size={32} /></div>
          <h2>{searchQuery ? "No results found" : "No applications yet"}</h2>
          <p>{searchQuery ? "Try a different search term" : "Log your first job application to start tracking"}</p>
          {!searchQuery && (
            <button className="btn-log-application-secondary" onClick={() => handleOpenModal()}>
              Log Your First Application
            </button>
          )}
        </div>
      ) : (
        <>
          {!isMobile && (
            <div className="table-wrapper">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Company</th><th>Role</th><th>Applied</th>
                    <th>Portal</th><th>Resume</th><th>Status</th>
                    <th>Notes</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <ApplicationCard
                      key={app._id} application={app}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteApplication}
                      onEdit={handleOpenModal} isMobile={false}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {isMobile && (
            <div className="card-grid">
              {filteredApplications.map((app) => (
                <ApplicationCard
                  key={app._id} application={app}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteApplication}
                  onEdit={handleOpenModal} isMobile={true}
                />
              ))}
            </div>
          )}
        </>
      )}

      <ApplicationFormModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingApplication(null); }}
        onSubmit={editingApplication ? handleUpdateApplication : handleCreateApplication}
        resumes={resumes}
        editData={editingApplication}
      />

      {filteredApplications.length > 0 && (
        <div className="applications-footer">
          <p><Lightbulb size={13} /> Use search to quickly find applications by company or role</p>
        </div>
      )}

      <FloatingResolverButton />
    </div>
  );
};
