import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FloatingResolverButton } from "../components/FloatingResolverButton";
import { FileText, BarChart3, Target, Briefcase, FolderOpen, TrendingUp } from "lucide-react";
import "./Dashboard.css";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-page-wrapper">
      <div className="dashboard-page-inner">

        <div className="user-info">
          <div className="info-section">
            <h2>Your Profile</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <p>{user?.name}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{user?.email}</p>
              </div>
              <div className="info-item">
                <label>College</label>
                <p>{user?.college}</p>
              </div>
              <div className="info-item">
                <label>Branch</label>
                <p>{user?.branch}</p>
              </div>
              <div className="info-item">
                <label>Graduation Year</label>
                <p>{user?.graduationYear}</p>
              </div>
              <div className="info-item">
                <label>Member Since</label>
                <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h2>What&apos;s Next?</h2>
            <p>Your TrackFolio dashboard is ready! Here you can manage your resumes, track versions, and apply to positions.</p>
            <ul>
              <li><FileText size={13} /> Create and manage multiple resumes</li>
              <li><BarChart3 size={13} /> Track version history</li>
              <li><Target size={13} /> Apply to positions and track status</li>
              <li><Briefcase size={13} /> Build your professional profile</li>
            </ul>
            <button className="btn-resume-vault" onClick={() => navigate("/resumes")}>
              <FolderOpen size={14} /> Go to My Resumes Vault
            </button>
            <button className="btn-applications" onClick={() => navigate("/applications")}>
              <TrendingUp size={14} /> Track Job Applications
            </button>
          </div>
        </div>

      </div>
      <FloatingResolverButton />
    </div>
  );
};
