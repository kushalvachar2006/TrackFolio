import { useState, useEffect } from "react";
import { resumeAPI, getErrorMessage } from "../utils/api";
import { Header } from "../components/Header";
import { ResumeDetailsPanel } from "../components/ResumeDetailsPanel";
import { ChevronDown, Wand2, Download, ChevronUp, BrainCircuit, FileText, FolderOpen, Sparkles, Bot, AlertCircle } from "lucide-react";
import "./ResumeAI.css";

// ─── Score ring ───────────────────────────────────────────────────────────────
const ScoreBadge = ({ score }) => {
  const color = score >= 75 ? "#2ecc71" : score >= 50 ? "#f39c12" : "#e74c3c";
  const circ = 2 * Math.PI * 15.9;
  const dash = (score / 100) * circ;
  return (
    <div className="rai-score-badge">
      <svg viewBox="0 0 36 36" className="rai-score-ring">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border-subtle)" strokeWidth="3" />
        <circle
          cx="18" cy="18" r="15.9" fill="none"
          stroke={color} strokeWidth="3"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <span className="rai-score-number" style={{ color }}>{score}</span>
    </div>
  );
};

// ─── Suggestion card ──────────────────────────────────────────────────────────
const SuggestionCard = ({ suggestion, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rai-suggestion ${open ? "open" : ""}`}>
      <div className="rai-suggestion-header" onClick={() => setOpen((v) => !v)}>
        <div className="rai-suggestion-meta">
          <span className="rai-sug-idx">{index + 1}</span>
          <span className="rai-sug-section">{suggestion.section}</span>
          <span className={`rai-sug-type stype-${suggestion.type}`}>{suggestion.type}</span>
        </div>
        <button className="rai-sug-toggle">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>
      {open && (
        <div className="rai-suggestion-body">
          {suggestion.original && (
            <div className="rai-sug-block sug-original">
              <div className="sug-block-label">Original</div>
              <p>{suggestion.original}</p>
            </div>
          )}
          <div className="rai-sug-block sug-suggested">
            <div className="sug-block-label">Suggested</div>
            <p>{suggestion.suggested}</p>
          </div>
          <p className="rai-sug-reason"><strong>Why:</strong> {suggestion.reason}</p>
        </div>
      )}
    </div>
  );
};

// ─── Resume selector dropdown ─────────────────────────────────────────────────
const ResumeSelector = ({ resumes, selected, onSelect }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (r) => {
    onSelect(r);
    setOpen(false);
  };

  return (
    <div className="rai-selector-wrapper">
      <button
        className={`rai-selector-btn ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        {selected ? (
          <span className="rai-selector-chosen">
            <span className="rai-sel-icon"><FileText size={14} /></span>
            <span className="rai-sel-label">{selected.label}</span>
            <span className={`rai-sel-badge badge-${selected.fileType}`}>
              {selected.fileType?.toUpperCase()}
            </span>
            {selected.parsedDetails?.isParsed && (
              <span className="rai-sel-parsed">✓ Parsed</span>
            )}
          </span>
        ) : (
          <span className="rai-selector-placeholder">
            <span className="rai-sel-icon"><FolderOpen size={14} /></span> Select a resume…
          </span>
        )}
        <ChevronDown size={16} className={`rai-sel-chevron ${open ? "rotated" : ""}`} />
      </button>

      {open && (
        <div className="rai-selector-dropdown">
          {resumes.length === 0 ? (
            <div className="rai-sel-empty">No resumes found. Upload one first.</div>
          ) : (
            resumes.map((r) => (
              <button
                key={r._id}
                className={`rai-sel-option ${selected?._id === r._id ? "active" : ""}`}
                onClick={() => handleSelect(r)}
              >
                <span className="rai-sel-icon"><FileText size={14} /></span>
                <span className="rai-sel-option-label">{r.label}</span>
                <div className="rai-sel-option-right">
                  <span className={`rai-sel-badge badge-${r.fileType}`}>
                    {r.fileType?.toUpperCase()}
                  </span>
                  {r.parsedDetails?.isParsed && (
                    <span className="rai-sel-parsed">✓</span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const ResumeAIPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [activeTab, setActiveTab] = useState("details"); // "details" | "tailor"
  const [fetchError, setFetchError] = useState("");

  // AI Tailor state
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [tailorError, setTailorError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await resumeAPI.getAll();
        setResumes(res.data.resumes || []);
      } catch (err) {
        setFetchError(getErrorMessage(err));
      } finally {
        setLoadingResumes(false);
      }
    };
    load();
  }, []);

  // When resume's parsed details are updated from the panel
  const handleParsed = (id, parsedDetails) => {
    setResumes((prev) =>
      prev.map((r) => (r._id === id ? { ...r, parsedDetails } : r))
    );
    setSelectedResume((prev) =>
      prev?._id === id ? { ...prev, parsedDetails } : prev
    );
  };

  // AI Tailor
  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setTailorError("Please paste a job description first.");
      return;
    }
    if (!selectedResume?.parsedDetails?.isParsed) {
      setTailorError(
        "Extract resume details first — go to the 'Details' tab and click Extract Resume Details."
      );
      return;
    }
    setAnalyzing(true);
    setTailorError("");
    setAnalysis(null);
    try {
      const res = await resumeAPI.redefine(selectedResume._id, jobDescription);
      setAnalysis(res.data.analysis);
    } catch (err) {
      setTailorError(getErrorMessage(err));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownload = async () => {
    if (!analysis?.updatedResume) return;
    setDownloading(true);
    try {
      const res = await resumeAPI.downloadTailored(
        selectedResume._id,
        analysis.updatedResume
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${selectedResume?.label || "resume"}_tailored.docx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setTailorError("Failed to download. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const wordCount = jobDescription.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="rai-container">
      <Header title="Resume AI" />

      <div className="rai-inner">
        {/* Page title */}
        <div className="rai-page-title">
          <BrainCircuit size={28} className="rai-title-icon" />
          <div>
            <h1>Resume AI</h1>
            <p>Extract structured details & tailor your resume to any job</p>
          </div>
        </div>

        {/* Resume selector */}
        <div className="rai-section">
          <div className="rai-section-label">Select Resume</div>
          {loadingResumes ? (
            <div className="rai-loading-row">
              <span className="rai-spinner" /> Loading resumes…
            </div>
          ) : fetchError ? (
            <div className="rai-error-inline">{fetchError}</div>
          ) : (
            <ResumeSelector
              resumes={resumes}
              selected={selectedResume}
              onSelect={(r) => {
                setSelectedResume(r);
                setAnalysis(null);
                setTailorError("");
              }}
            />
          )}
        </div>

        {/* Tab bar — only show when resume selected */}
        {selectedResume && (
          <>
            <div className="rai-tabs">
              <button
                className={`rai-tab ${activeTab === "details" ? "active" : ""}`}
                onClick={() => setActiveTab("details")}
              >
                <FileText size={14} /> Resume Details
              </button>
              <button
                className={`rai-tab ${activeTab === "tailor" ? "active" : ""}`}
                onClick={() => setActiveTab("tailor")}
              >
                <Wand2 size={14} /> AI Tailor
              </button>
            </div>

            {/* ── DETAILS TAB ── */}
            {activeTab === "details" && (
              <div className="rai-panel">
                <ResumeDetailsPanel
                  resume={selectedResume}
                  onParsed={handleParsed}
                />
              </div>
            )}

            {/* ── AI TAILOR TAB ── */}
            {activeTab === "tailor" && (
              <div className="rai-panel rai-tailor-panel">
                {/* Parse warning */}
                {!selectedResume.parsedDetails?.isParsed && (
                  <div className="rai-warn-banner">
                    <AlertCircle size={14} /> Resume not yet parsed. Go to the{" "}
                    <button
                      className="rai-warn-link"
                      onClick={() => setActiveTab("details")}
                    >
                      <FileText size={12} /> Details tab
                    </button>{" "}
                    and extract details first.
                  </div>
                )}

                {/* JD input */}
                <div className="rai-jd-block">
                  <label className="rai-label">Paste Job Description</label>
                  <textarea
                    className="rai-jd-input"
                    placeholder="Paste the full job description — requirements, responsibilities, skills, company overview…"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={10}
                    disabled={analyzing}
                  />
                  <div className="rai-jd-meta">
                    <span className="rai-word-count">{wordCount} words</span>
                  </div>
                </div>

                {tailorError && (
                  <div className="rai-error-banner">
                    <p>{tailorError}</p>
                    <button onClick={() => setTailorError("")}>✕</button>
                  </div>
                )}

                <button
                  className="rai-analyze-btn"
                  onClick={handleAnalyze}
                  disabled={analyzing || !jobDescription.trim()}
                >
                  {analyzing ? (
                    <><span className="rai-spinner rai-spinner-dark" /> Analyzing with Gemini…</>
                  ) : (
                    <><Wand2 size={16} /> Analyze & Tailor</>
                  )}
                </button>

                {/* Results */}
                {analysis && (
                  <div className="rai-results">
                    {/* Overview */}
                    <div className="rai-overview">
                      <ScoreBadge score={analysis.matchScore} />
                      <div className="rai-overview-text">
                        <div className="rai-overview-title">Match Score</div>
                        <p>{analysis.summary}</p>
                      </div>
                    </div>

                    {/* Chips row */}
                    <div className="rai-chips-row">
                      <div className="rai-chip-group">
                        <div className="rai-chip-label match">✓ Strong Matches</div>
                        <div className="rai-chips">
                          {analysis.strongMatches?.map((m, i) => (
                            <span key={i} className="rai-chip chip-match">{m}</span>
                          ))}
                        </div>
                      </div>
                      <div className="rai-chip-group">
                        <div className="rai-chip-label missing">⚠ Missing Keywords</div>
                        <div className="rai-chips">
                          {analysis.missingKeywords?.map((k, i) => (
                            <span key={i} className="rai-chip chip-missing">{k}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Suggestions */}
                    {analysis.suggestions?.length > 0 && (
                      <div className="rai-sub-section">
                        <div className="rai-sub-title">Suggested Changes</div>
                        <div className="rai-suggestions-list">
                          {analysis.suggestions.map((s, i) => (
                            <SuggestionCard key={i} suggestion={s} index={i} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preview */}
                    {analysis.updatedResume && (
                      <div className="rai-sub-section">
                        <div className="rai-sub-title">Tailored Resume Preview</div>
                        <div className="rai-preview-card">
                          <div className="rai-preview-name">
                            {analysis.updatedResume.name}
                          </div>
                          {analysis.updatedResume.summary && (
                            <p className="rai-preview-summary">
                              {analysis.updatedResume.summary}
                            </p>
                          )}
                          {analysis.updatedResume.skills?.length > 0 && (
                            <div className="rai-preview-skills">
                              {analysis.updatedResume.skills
                                .slice(0, 14)
                                .map((s, i) => (
                                  <span key={i} className="rai-preview-skill">{s}</span>
                                ))}
                              {analysis.updatedResume.skills.length > 14 && (
                                <span className="rai-preview-more">
                                  +{analysis.updatedResume.skills.length - 14} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Download */}
                    <button
                      className="rai-download-btn"
                      onClick={handleDownload}
                      disabled={downloading}
                    >
                      {downloading ? (
                        <><span className="rai-spinner rai-spinner-dark" /> Generating DOCX…</>
                      ) : (
                        <><Download size={16} /> Download Tailored Resume (.docx)</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Empty state when no resume selected */}
        {!selectedResume && !loadingResumes && (
          <div className="rai-empty-state">
            <div className="rai-empty-icon"><Bot size={36} /></div>
            <h3>Select a resume to get started</h3>
            <p>
              Choose a resume above to extract structured details or tailor it to
              a job description using AI.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};