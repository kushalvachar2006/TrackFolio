import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Header } from "../components/Header";
import {
  User,
  Mail,
  Building,
  BookOpen,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Camera,
} from "lucide-react";
import "./ProfilePage.css";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth(); // assume updateUser exists or adapt

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    college: user?.college || "",
    branch: user?.branch || "",
    graduationYear: user?.graduationYear || new Date().getFullYear(),
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [profileStatus, setProfileStatus] = useState(null); // "success" | "error"
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setProfileStatus(null);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordStatus(null);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim() || !profileData.email.trim()) {
      setProfileStatus("error");
      setProfileMsg("Name and email are required.");
      return;
    }
    setProfileLoading(true);
    try {
      // Replace with your actual API call, e.g.:
      // await userAPI.updateProfile(profileData);
      // updateUser(profileData);
      await new Promise((r) => setTimeout(r, 800)); // demo delay
      setProfileStatus("success");
      setProfileMsg("Profile updated successfully.");
    } catch {
      setProfileStatus("error");
      setProfileMsg("Failed to update profile. Try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordStatus("error");
      setPasswordMsg("Please fill in all password fields.");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordStatus("error");
      setPasswordMsg("New password must be at least 8 characters.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus("error");
      setPasswordMsg("New passwords do not match.");
      return;
    }
    setPasswordLoading(true);
    try {
      // Replace with your actual API call
      await new Promise((r) => setTimeout(r, 800));
      setPasswordStatus("success");
      setPasswordMsg("Password changed successfully.");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setPasswordStatus("error");
      setPasswordMsg("Incorrect current password or server error.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const initials = profileData.name
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="profile-layout">
      <Header title="Profile" subtitle="Manage your account details" />

      <main className="profile-main">
        <div className="profile-container">

          {/* Back button */}
          <button className="btn-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Avatar + name hero */}
          <div className="profile-hero">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">
                <div className="profile-avatar-inner">{initials}</div>
              </div>
              <button className="avatar-camera-btn" title="Change photo (coming soon)">
                <Camera size={14} />
              </button>
            </div>
            <div className="profile-hero-info">
              <h2 className="profile-hero-name">{profileData.name || "Your Name"}</h2>
              <p className="profile-hero-email">{profileData.email}</p>
              <div className="profile-hero-badges">
                {profileData.college && (
                  <span className="hero-badge">
                    <Building size={12} /> {profileData.college}
                  </span>
                )}
                {profileData.branch && (
                  <span className="hero-badge">
                    <BookOpen size={12} /> {profileData.branch}
                  </span>
                )}
                {profileData.graduationYear && (
                  <span className="hero-badge">
                    <Calendar size={12} /> Class of {profileData.graduationYear}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-grid">

            {/* ── Personal Info Card ── */}
            <div className="profile-card">
              <div className="card-header">
                <div className="card-icon"><User size={18} /></div>
                <div>
                  <h3 className="card-title">Personal Information</h3>
                  <p className="card-subtitle">Update your name, email and academic details</p>
                </div>
              </div>

              {profileStatus && (
                <div className={`status-banner status-banner--${profileStatus}`}>
                  {profileStatus === "success"
                    ? <CheckCircle size={15} />
                    : <AlertCircle size={15} />}
                  {profileMsg}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-wrap">
                      <User size={15} className="input-icon" />
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        placeholder="John Doe"
                        disabled={profileLoading}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrap">
                      <Mail size={15} className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        placeholder="you@example.com"
                        disabled={profileLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>College / University</label>
                    <div className="input-wrap">
                      <Building size={15} className="input-icon" />
                      <input
                        type="text"
                        name="college"
                        value={profileData.college}
                        onChange={handleProfileChange}
                        placeholder="Your institution"
                        disabled={profileLoading}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Branch / Major</label>
                    <div className="input-wrap">
                      <BookOpen size={15} className="input-icon" />
                      <input
                        type="text"
                        name="branch"
                        value={profileData.branch}
                        onChange={handleProfileChange}
                        placeholder="Computer Science"
                        disabled={profileLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group form-group--half">
                  <label>Graduation Year</label>
                  <div className="input-wrap">
                    <Calendar size={15} className="input-icon" />
                    <select
                      name="graduationYear"
                      value={profileData.graduationYear}
                      onChange={handleProfileChange}
                      disabled={profileLoading}
                    >
                      {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-save"
                  disabled={profileLoading}
                >
                  <Save size={16} />
                  {profileLoading ? "Saving…" : "Save Changes"}
                </button>
              </form>
            </div>

            {/* ── Change Password Card ── */}
            <div className="profile-card">
              <div className="card-header">
                <div className="card-icon card-icon--amber"><Lock size={18} /></div>
                <div>
                  <h3 className="card-title">Change Password</h3>
                  <p className="card-subtitle">Keep your account secure with a strong password</p>
                </div>
              </div>

              {passwordStatus && (
                <div className={`status-banner status-banner--${passwordStatus}`}>
                  {passwordStatus === "success"
                    ? <CheckCircle size={15} />
                    : <AlertCircle size={15} />}
                  {passwordMsg}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="profile-form">
                {[
                  { field: "currentPassword", label: "Current Password", key: "current" },
                  { field: "newPassword",     label: "New Password",     key: "new" },
                  { field: "confirmPassword", label: "Confirm New Password", key: "confirm" },
                ].map(({ field, label, key }) => (
                  <div className="form-group" key={field}>
                    <label>{label}</label>
                    <div className="input-wrap">
                      <Lock size={15} className="input-icon" />
                      <input
                        type={showPasswords[key] ? "text" : "password"}
                        name={field}
                        value={passwordData[field]}
                        onChange={handlePasswordChange}
                        placeholder={field === "currentPassword" ? "Your current password" : "Min 8 characters"}
                        disabled={passwordLoading}
                      />
                      <button
                        type="button"
                        className="input-eye"
                        onClick={() =>
                          setShowPasswords((p) => ({ ...p, [key]: !p[key] }))
                        }
                        tabIndex={-1}
                      >
                        {showPasswords[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  className="btn-save btn-save--amber"
                  disabled={passwordLoading}
                >
                  <Lock size={16} />
                  {passwordLoading ? "Updating…" : "Update Password"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};