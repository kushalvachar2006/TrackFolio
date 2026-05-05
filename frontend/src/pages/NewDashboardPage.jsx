import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { dashboardAPI, getErrorMessage } from "../utils/api";
import { Header } from "../components/Header";
import { StatCard } from "../components/StatCard";
import { FloatingResolverButton } from "../components/FloatingResolverButton";
import { Briefcase, CheckCircle, Award, FileText, Upload, Plus, TrendingUp, Calendar, Building } from "lucide-react";
import "./Dashboard.css";

const getStatusColor = (status) => {
  const colors = {
    Applied: "#64748b", 
    Shortlisted: "#f59e0b",
    Interview: "#059669", 
    Offer: "#10b981", 
    Rejected: "#ef4444",
  };
  return colors[status] || "#94a3b8";
};

const getStatusBg = (status) => {
  const backgrounds = {
    Applied: "rgba(100, 116, 139, 0.12)",
    Shortlisted: "rgba(245, 158, 11, 0.12)",
    Interview: "rgba(5, 150, 105, 0.12)",
    Offer: "rgba(16, 185, 129, 0.12)",
    Rejected: "rgba(239, 68, 68, 0.12)",
  };
  return backgrounds[status] || "rgba(148, 163, 184, 0.12)";
};

export const NewDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalApplications: 0, interviewCount: 0, offerCount: 0, totalResumes: 0 });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchDashboardStats(); }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true); setError("");
      const response = await dashboardAPI.getStats();
      setStats(response.data.stats);
      setRecentApplications(response.data.recentApplications || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally { setLoading(false); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="dashboard-layout">
      <Header title="Dashboard" subtitle="Track your job search progress" />

      <main className="dashboard-main">
        <div className="container">

          {/* Stat Cards */}
          <section className="stats-section">
            <div className="stats-grid">
              <StatCard icon={Briefcase} label="Total Applications" value={stats.totalApplications} color="emerald" />
              <StatCard icon={TrendingUp} label="Interviews" value={stats.interviewCount} color="teal" />
              <StatCard icon={Award} label="Offers" value={stats.offerCount} color="green" />
              <StatCard icon={FileText} label="Resumes" value={stats.totalResumes} color="gold" />
            </div>
          </section>

          {/* Recent Applications */}
          {!loading && recentApplications.length > 0 && (
            <section className="recent-section">
              <div className="section-header">
                <h2 className="section-title">Recent Applications</h2>
                <button className="btn-ghost btn-sm" onClick={() => navigate("/applications")}>
                  View All
                </button>
              </div>
              <div className="recent-list">
                {recentApplications.map((app) => (
                  <div key={app._id} className="recent-item">
                    <div className="recent-icon">
                      <Building size={20} />
                    </div>
                    <div className="recent-content">
                      <div className="recent-company">{app.companyName}</div>
                      <div className="recent-role">{app.jobRole}</div>
                      <div className="recent-meta">
                        <span className="meta-item">
                          <Calendar size={12} />
                          {formatDate(app.appliedDate)}
                        </span>
                        {app.portalUsed && (
                          <span className="meta-item">
                            {app.portalUsed}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="recent-resume">
                      {app.resumeId && (
                        <span className="resume-badge">
                          <FileText size={14} />
                          {app.resumeId.label}
                        </span>
                      )}
                    </div>
                    <div className="recent-status">
                      <span 
                        className="status-badge" 
                        style={{ 
                          color: getStatusColor(app.status),
                          background: getStatusBg(app.status),
                          borderColor: getStatusColor(app.status)
                        }}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick Actions */}
          <section className="quick-actions-section">
            <div className="section-header">
              <h3 className="section-title">Quick Actions</h3>
            </div>
            <div className="actions-grid">
              <button className="action-card" onClick={() => navigate("/resumes")}>
                <div className="action-icon">
                  <Upload size={24} />
                </div>
                <div className="action-content">
                  <div className="action-title">Upload Resume</div>
                  <div className="action-desc">Add a new resume version</div>
                </div>
              </button>
              <button className="action-card" onClick={() => navigate("/applications")}>
                <div className="action-icon">
                  <Plus size={24} />
                </div>
                <div className="action-content">
                  <div className="action-title">Log Application</div>
                  <div className="action-desc">Track a new job application</div>
                </div>
              </button>
              <button className="action-card" onClick={() => navigate("/resume-ai")}>
                <div className="action-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="action-content">
                  <div className="action-title">AI Studio</div>
                  <div className="action-desc">Optimize your resume</div>
                </div>
              </button>
            </div>
          </section>

        </div>
      </main>

      <FloatingResolverButton />
    </div>
  );
};