import { useState } from "react";
import { resumeAPI, getErrorMessage } from "../utils/api";
import { SocialLinksPrompt } from "./SocialLinksPrompt";
import { Bot, Sparkles, Mail, Phone, MapPin, Link, Code2, Globe } from "lucide-react";
import "./ResumeDetailsPanel.css";

export const ResumeDetailsPanel = ({ resume, onParsed }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSocialPrompt, setShowSocialPrompt] = useState(true);
  const details = resume.parsedDetails;
  const isParsed = details?.isParsed;

  const handleParse = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await resumeAPI.parse(resume._id);
      onParsed(resume._id, response.data.parsedDetails);
      setShowSocialPrompt(true); // Show prompt after parsing
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLinksUpdate = async (updatedDetails) => {
    try {
      // Update the resume with new social links
      // You would typically make an API call here to save the updated details
      onParsed(resume._id, updatedDetails);
      setShowSocialPrompt(false);
    } catch (err) {
      setError("Failed to update social links");
    }
  };

  if (!isParsed) {
    return (
      <div className="rdp-empty">
        <div className="rdp-empty-icon"><Bot size={28} /></div>
        <p>Extract structured details from this resume using AI.</p>
        {error && <div className="rdp-error">{error}</div>}
        <button
          className="rdp-parse-btn"
          onClick={handleParse}
          disabled={loading}
        >
          {loading ? (
            <span className="rdp-spinner" />
          ) : (
            <><Sparkles size={14} /> Extract Resume Details</>
          )}
        </button>
      </div>
    );
  }

  const d = details;

  return (
    <div className="rdp-container">
      {/* Social Links Prompt - show if links are missing and user hasn't dismissed */}
      {showSocialPrompt && (d.needsLinkedIn || d.needsGitHub) && (
        <SocialLinksPrompt
          resumeId={resume._id}
          parsedDetails={d}
          onUpdate={handleSocialLinksUpdate}
          onDismiss={() => setShowSocialPrompt(false)}
        />
      )}

      {/* Header */}
      <div className="rdp-header">
        <div className="rdp-name-block">
          <h2 className="rdp-name">{d.name || "—"}</h2>
          <div className="rdp-contact-row">
            {d.email && <span className="rdp-contact-chip"><Mail size={11} /> {d.email}</span>}
            {d.phone && <span className="rdp-contact-chip"><Phone size={11} /> {d.phone}</span>}
            {d.location && <span className="rdp-contact-chip"><MapPin size={11} /> {d.location}</span>}
            {d.linkedin && <span className="rdp-contact-chip"><Link size={11} /> {d.linkedin}</span>}
            {d.github && <span className="rdp-contact-chip"><Code2 size={11} /> {d.github}</span>}
            {d.portfolio && <span className="rdp-contact-chip"><Globe size={11} /> {d.portfolio}</span>}
          </div>
        </div>
        <button
          className="rdp-reparse-btn"
          onClick={handleParse}
          disabled={loading}
          title="Re-parse"
        >
          {loading ? <span className="rdp-spinner" /> : "↺ Re-parse"}
        </button>
      </div>

      {error && <div className="rdp-error">{error}</div>}

      {/* Summary */}
      {d.summary && (
        <div className="rdp-section">
          <div className="rdp-section-title">Summary</div>
          <p className="rdp-summary">{d.summary}</p>
        </div>
      )}

      {/* Skills */}
      {d.skills?.length > 0 && (
        <div className="rdp-section">
          <div className="rdp-section-title">Skills</div>
          <div className="rdp-tags">
            {d.skills.map((s, i) => (
              <span key={i} className="rdp-tag">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {d.experience?.length > 0 && (
        <div className="rdp-section">
          <div className="rdp-section-title">Experience</div>
          <div className="rdp-timeline">
            {d.experience.map((exp, i) => (
              <div key={i} className="rdp-timeline-item">
                <div className="rdp-timeline-header">
                  <span className="rdp-role">{exp.role}</span>
                  {exp.company && (
                    <span className="rdp-company"> @ {exp.company}</span>
                  )}
                  {exp.duration && (
                    <span className="rdp-duration">{exp.duration}</span>
                  )}
                </div>
                {exp.description && (
                  <p className="rdp-desc">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {d.education?.length > 0 && (
        <div className="rdp-section">
          <div className="rdp-section-title">Education</div>
          <div className="rdp-timeline">
            {d.education.map((edu, i) => (
              <div key={i} className="rdp-timeline-item">
                <div className="rdp-timeline-header">
                  <span className="rdp-role">{edu.degree}</span>
                  {edu.institution && (
                    <span className="rdp-company"> @ {edu.institution}</span>
                  )}
                  {edu.year && (
                    <span className="rdp-duration">{edu.year}</span>
                  )}
                </div>
                {edu.gpa && <p className="rdp-desc">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {d.projects?.length > 0 && (
        <div className="rdp-section">
          <div className="rdp-section-title">Projects</div>
          <div className="rdp-projects">
            {d.projects.map((proj, i) => (
              <div key={i} className="rdp-project-item">
                <div className="rdp-project-name">
                  {proj.name}
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="rdp-project-link">↗</a>
                  )}
                </div>
                {proj.techStack && (
                  <div className="rdp-project-tech">{proj.techStack}</div>
                )}
                {proj.description && (
                  <p className="rdp-desc">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {d.certifications?.length > 0 && (
        <div className="rdp-section">
          <div className="rdp-section-title">Certifications</div>
          <div className="rdp-tags">
            {d.certifications.map((c, i) => (
              <span key={i} className="rdp-tag rdp-tag-cert">{c}</span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {d.achievements?.length > 0 && (
        <div className="rdp-section">
          <div className="rdp-section-title">Achievements</div>
          <ul className="rdp-list">
            {d.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {d.languages?.length > 0 && (
        <div className="rdp-section">
          <div className="rdp-section-title">Languages</div>
          <div className="rdp-tags">
            {d.languages.map((l, i) => (
              <span key={i} className="rdp-tag">{l}</span>
            ))}
          </div>
        </div>
      )}

      <div className="rdp-footer">
        Parsed {d.parsedAt ? new Date(d.parsedAt).toLocaleDateString() : ""}
      </div>
    </div>
  );
};