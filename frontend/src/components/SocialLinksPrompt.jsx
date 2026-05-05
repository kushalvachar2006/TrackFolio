import { useState } from "react";
import { resumeAPI } from "../utils/api";
import { Globe, Link, Code2, Link2, X } from "lucide-react";
import "./SocialLinksPrompt.css";

export const SocialLinksPrompt = ({ resumeId, parsedDetails, onUpdate, onDismiss }) => {
  const [linkedin, setLinkedin] = useState(parsedDetails?.linkedin || "");
  const [github, setGithub] = useState(parsedDetails?.github || "");
  const [portfolio, setPortfolio] = useState(parsedDetails?.portfolio || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const needsLinkedIn = parsedDetails?.needsLinkedIn;
  const needsGitHub = parsedDetails?.needsGitHub;

  // Don't show if both are already present
  if (!needsLinkedIn && !needsGitHub) {
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    setError("");
    
    const updatedDetails = {
      ...parsedDetails,
      linkedin: linkedin.trim(),
      github: github.trim(),
      portfolio: portfolio.trim(),
      needsLinkedIn: false,
      needsGitHub: false,
    };

    try {
      await resumeAPI.updateParsedDetails(resumeId, updatedDetails);
      await onUpdate(updatedDetails);
    } catch (err) {
      setError("Failed to update social links. Please try again.");
      setSaving(false);
      return;
    }
    
    setSaving(false);
  };

  return (
    <div className="slp-container">
      <div className="slp-header">
        <span className="slp-icon"><Link2 size={16} /></span>
        <div className="slp-header-text">
          <h3 className="slp-title">Missing Social Links</h3>
          <p className="slp-subtitle">
            We couldn't find {needsLinkedIn && needsGitHub ? "LinkedIn and GitHub" : needsLinkedIn ? "LinkedIn" : "GitHub"} links in your resume. Add them to improve your applications!
          </p>
        </div>
        <button className="slp-close" onClick={onDismiss} aria-label="Dismiss">
          <X size={14} />
        </button>
      </div>

      <div className="slp-form">
        {error && (
          <div className="slp-error-banner">
            {error}
          </div>
        )}

        {needsLinkedIn && (
          <div className="slp-field">
            <label className="slp-label">
              <span className="slp-label-icon"><Link size={13} /></span>
              LinkedIn Profile
            </label>
            <input
              type="url"
              className="slp-input"
              placeholder="https://linkedin.com/in/yourprofile"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              disabled={saving}
            />
          </div>
        )}

        {needsGitHub && (
          <div className="slp-field">
            <label className="slp-label">
              <span className="slp-label-icon"><Code2 size={13} /></span>
              GitHub Profile
            </label>
            <input
              type="url"
              className="slp-input"
              placeholder="https://github.com/yourusername"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              disabled={saving}
            />
          </div>
        )}

        <div className="slp-field">
          <label className="slp-label">
            <span className="slp-label-icon"><Globe size={13} /></span>
            Portfolio Website <span className="slp-optional">(Optional)</span>
          </label>
          <input
            type="url"
            className="slp-input"
            placeholder="https://yourportfolio.com"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            disabled={saving}
          />
        </div>

        <div className="slp-actions">
          <button
            className="slp-btn-save"
            onClick={handleSave}
            disabled={saving || (needsLinkedIn && !linkedin) || (needsGitHub && !github)}
          >
            {saving ? (
              <>
                <span className="slp-spinner" /> Saving...
              </>
            ) : (
              "💾 Save Links"
            )}
          </button>
          <button className="slp-btn-skip" onClick={onDismiss} disabled={saving}>
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
};