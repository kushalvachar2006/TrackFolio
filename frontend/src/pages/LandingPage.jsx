import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap, GraduationCap, Phone, Search, FileText, Bot, Briefcase,
  Upload, Plus, CheckCircle, ArrowDown, AlertCircle, Eye,
  Download, Star, Users, BarChart3, Clock, Menu, X
} from "lucide-react";
import "./LandingPage.css";

const useCountUp = (target, duration = 1600, start = false) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
};

const useInView = (threshold = 0.2) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const StatNum = ({ value, suffix = "", label, trigger, icon: Icon }) => {
  const count = useCountUp(value, 1600, trigger);
  return (
    <div className="stat-item">
      {Icon && <div className="stat-icon"><Icon size={20} /></div>}
      <span className="stat-num">{count}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [statsRef, statsInView] = useInView(0.3);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="lp-root">

      {/* ══ NAVBAR ══ */}
      <nav className={`lp-nav ${scrolled ? "lp-nav--scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <div className="lp-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="lp-logo-icon-wrap"><Zap size={18} /></div>
            <span className="lp-logo-text">Track<em>Folio</em></span>
          </div>

          <div className="lp-nav-links">
            <button onClick={() => scrollTo("features")}>Features</button>
            <button onClick={() => scrollTo("how-it-works")}>How It Works</button>
            <button onClick={() => scrollTo("stats")}>For Students</button>
          </div>

          <div className="lp-nav-actions">
            <button className="lp-btn-ghost" onClick={() => navigate("/login")}>Sign In</button>
            <button className="lp-btn-ember" onClick={() => navigate("/register")}>Get Started</button>
          </div>

          <button className="lp-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="lp-mobile-menu">
            <button onClick={() => scrollTo("features")}>Features</button>
            <button onClick={() => scrollTo("how-it-works")}>How It Works</button>
            <button onClick={() => scrollTo("stats")}>For Students</button>
            <hr />
            <button onClick={() => navigate("/login")}>Sign In</button>
            <button className="lp-btn-ember-full" onClick={() => navigate("/register")}>Create Free Account</button>
          </div>
        )}
      </nav>

      {/* ══ HERO ══ */}
      <section className="lp-hero">
        <div className="lp-hero-glow" />
        <div className="lp-hero-inner">
          <div className="lp-hero-text">
            <div className="lp-badge">
              <GraduationCap size={14} className="lp-badge-icon" />
              Built for students on the job hunt
            </div>

            <h1 className="lp-hero-headline">
              Stop Guessing.<br />
              <span className="lp-headline-accent">
                Start Tracking.
                <svg className="lp-underline-svg" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 9 Q75 2 150 8 Q225 14 298 6" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="lp-hero-sub">
              TrackFolio is your AI-powered job application companion. Upload and organize multiple resume
              versions, track every application with precision, and instantly retrieve which resume you
              sent when recruiters call — all in one powerful platform.
            </p>

            <div className="lp-hero-ctas">
              <button className="lp-cta-primary" onClick={() => navigate("/register")}>
                Create Free Account
              </button>
              <button className="lp-cta-secondary" onClick={() => scrollTo("how-it-works")}>
                See How It Works <ArrowDown size={14} />
              </button>
            </div>

            <div className="lp-trust-line">
              <span><CheckCircle size={13} /> No credit card required</span>
              <span><CheckCircle size={13} /> Free for students</span>
              <span><CheckCircle size={13} /> 2 min setup</span>
            </div>
          </div>

          {/* Right — mock UI card */}
          <div className="lp-hero-visual">
            <div className="lp-mock-card">
              <div className="lp-mock-header">
                <span className="lp-mock-title"><Phone size={14} /> Recruiter Called?</span>
                <div className="lp-mock-dots"><span /><span /><span /></div>
              </div>
              <div className="lp-mock-search">
                <Search size={14} className="lp-mock-search-icon" />
                <span className="lp-mock-search-text">Search company or role...</span>
              </div>
              <div className="lp-mock-results">
                {[
                  { company: "Google", role: "SDE Intern", date: "Mar 12", resume: "Backend_v3.pdf", status: "Interview", color: "#ff6b35" },
                  { company: "Swiggy", role: "Product Intern", date: "Feb 28", resume: "PM_Resume_Final.pdf", status: "Applied", color: "#64748b" },
                  { company: "Zepto", role: "Frontend Dev", date: "Feb 14", resume: "Frontend_v2.pdf", status: "Shortlisted", color: "#f39c12" },
                ].map((item, i) => (
                  <div className="lp-mock-result" key={i} style={{ animationDelay: `${0.8 + i * 0.15}s` }}>
                    <div className="lp-mock-result-left">
                      <div className="lp-mock-company">{item.company}</div>
                      <div className="lp-mock-role">{item.role} · {item.date}</div>
                      <div className="lp-mock-resume"><FileText size={11} /> {item.resume}</div>
                    </div>
                    <span className="lp-mock-status" style={{ color: item.color, borderColor: item.color }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lp-hero-glow-card" />
          </div>
        </div>
      </section>

      {/* ══ PROBLEM ══ */}
      <section className="lp-problem" id="problem">
        <div className="lp-section-inner">
          <p className="lp-eyebrow">THE STRUGGLE IS REAL</p>
          <h2 className="lp-section-heading">Every student applying for jobs<br />knows this pain.</h2>
          <div className="lp-pain-grid">
            {[
              { icon: AlertCircle, title: "Resume Chaos", desc: "You have resume_final.pdf, resume_v2.pdf, resume_NEW.pdf and you have no idea which is which." },
              { icon: Phone, title: "The Recruiter Panic", desc: "A recruiter calls. Your mind goes blank. You can't remember which version you sent — or if you even applied." },
              { icon: BarChart3, title: "Zero Visibility", desc: "No idea how many places you've applied, what's pending, or what's been ghosting you for weeks." },
            ].map((p, i) => (
              <div className="lp-pain-card" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="lp-pain-icon-wrap"><p.icon size={22} /></div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="lp-features" id="features">
        <div className="lp-section-inner">
          <p className="lp-eyebrow">WHAT YOU GET</p>
          <h2 className="lp-section-heading">Everything you need.<br />Nothing you don't.</h2>

          {[
            {
              tag: "01 — RESUME VAULT",
              heading: "One place for every version of you.",
              body: "Upload, label, and organize every resume you've ever made. SDE resume, product resume, design resume — all stored, all one click away.",
              bullets: ["Upload PDF or DOCX files", "Label by role type or company", "Preview without downloading"],
              visual: (
                <div className="lp-feat-visual lp-vault-visual">
                  {["SDE Resume v3", "PM Internship", "Frontend Dev", "ML Engineer"].map((name, i) => (
                    <div className="lp-feat-file-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                      <FileText size={16} className="lp-feat-file-icon" />
                      <div>
                        <div className="lp-feat-file-name">{name}</div>
                        <div className="lp-feat-file-meta">PDF · Uploaded recently</div>
                      </div>
                      <span className="lp-feat-file-badge">PDF</span>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              tag: "02 — AI RESUME TAILOR",
              heading: "Let AI optimize your resume for every job.",
              body: "Paste any job description and watch AI analyze your resume, suggest improvements, and generate a perfectly tailored version. Get match scores, missing keywords, and smart recommendations.",
              bullets: ["AI-powered resume analysis", "Match score with visual insights", "Download tailored DOCX files"],
              visual: (
                <div className="lp-feat-visual lp-ai-visual">
                  <div className="lp-feat-ai-card">
                    <div className="lp-feat-ai-header">
                      <Bot size={16} className="lp-feat-ai-icon" />
                      <span className="lp-feat-ai-title">AI Analysis Complete</span>
                    </div>
                    <div className="lp-feat-ai-score">
                      <div className="lp-feat-ai-ring"><span className="lp-feat-ai-num">87</span></div>
                      <div className="lp-feat-ai-text">
                        <div className="lp-feat-ai-label">Match Score</div>
                        <div className="lp-feat-ai-desc">Strong alignment with job requirements</div>
                      </div>
                    </div>
                    <div className="lp-feat-ai-chips">
                      <span className="lp-feat-chip chip-green"><CheckCircle size={10} /> React</span>
                      <span className="lp-feat-chip chip-green"><CheckCircle size={10} /> Node.js</span>
                      <span className="lp-feat-chip chip-orange"><AlertCircle size={10} /> AWS</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              tag: "03 — APPLICATION TRACKER",
              heading: "Every application. Perfectly logged.",
              body: "Log where you applied, when you applied, and exactly which resume you sent. Watch your pipeline move from Applied all the way to Offer.",
              bullets: ["Status pipeline: Applied → Interview → Offer", "Attach a resume to every application", "Add notes and job descriptions"],
              visual: (
                <div className="lp-feat-visual lp-tracker-visual">
                  {[
                    { company: "Google", role: "SDE Intern", status: "Interview", color: "#ff6b35" },
                    { company: "Swiggy", role: "Product", status: "Applied", color: "#64748b" },
                    { company: "Zepto", role: "Frontend", status: "Offer", color: "#2ecc71" },
                    { company: "Meesho", role: "Backend", status: "Shortlisted", color: "#f39c12" },
                  ].map((row, i) => (
                    <div className="lp-feat-table-row" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                      <span className="lp-feat-table-company">{row.company}</span>
                      <span className="lp-feat-table-role">{row.role}</span>
                      <span className="lp-feat-table-status" style={{ color: row.color, borderColor: row.color }}>{row.status}</span>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              tag: "04 — RECRUITER RESOLVER",
              heading: "Answer every recruiter call with confidence.",
              body: "Search the company name the moment your phone rings. See exactly which resume you sent and when — in under 3 seconds.",
              bullets: ["Instant search across all applications", "Resume preview in one click", "Works perfectly on mobile"],
              visual: (
                <div className="lp-feat-visual lp-resolver-visual">
                  <div className="lp-feat-search-bar">
                    <Search size={14} />
                    <span className="lp-feat-search-text">Google</span>
                    <span className="lp-feat-search-cursor">|</span>
                  </div>
                  <div className="lp-feat-resolver-result">
                    <div className="lp-feat-rr-top">
                      <div>
                        <div className="lp-feat-rr-company">Google</div>
                        <div className="lp-feat-rr-role">SDE Intern · Mar 12, 2025</div>
                      </div>
                      <span className="lp-feat-rr-status">Interview</span>
                    </div>
                    <div className="lp-feat-rr-resume">
                      <FileText size={13} /> Backend_Focused_v3.pdf
                      <div className="lp-feat-rr-btns">
                        <span><Eye size={11} /> Preview</span>
                        <span className="lp-feat-rr-dl"><Download size={11} /> Download</span>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            },
          ].map((feat, i) => (
            <div className={`lp-feat-block ${i % 2 !== 0 ? "lp-feat-block--reverse" : ""}`} key={i}>
              <div className="lp-feat-text">
                <span className="lp-feat-tag">{feat.tag}</span>
                <h3 className="lp-feat-heading">{feat.heading}</h3>
                <p className="lp-feat-body">{feat.body}</p>
                <ul className="lp-feat-bullets">
                  {feat.bullets.map((b, j) => <li key={j}><CheckCircle size={13} /> {b}</li>)}
                </ul>
              </div>
              <div className="lp-feat-visual-wrap">{feat.visual}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="lp-how" id="how-it-works">
        <div className="lp-section-inner">
          <p className="lp-eyebrow">HOW IT WORKS</p>
          <h2 className="lp-section-heading">Set up in minutes.<br />Use it for months.</h2>
          <div className="lp-steps">
            {[
              { num: "01", icon: Upload, title: "Upload Your Resumes", desc: "Add all your resume versions to your vault and label them clearly by role or target company." },
              { num: "02", icon: Bot, title: "Tailor with AI", desc: "Paste any job description and let AI analyze your resume, suggest improvements, and generate a tailored version." },
              { num: "03", icon: Plus, title: "Log Your Applications", desc: "Every time you apply somewhere, log it in 30 seconds. Pick the resume you used from your vault." },
              { num: "04", icon: Phone, title: "Answer With Confidence", desc: "When a recruiter calls, search their company name and instantly see which resume you sent them." },
            ].map((step, i) => (
              <div className="lp-step" key={i}>
                <div className="lp-step-num">{step.num}</div>
                <div className="lp-step-icon-wrap"><step.icon size={22} /></div>
                <h3 className="lp-step-title">{step.title}</h3>
                <p className="lp-step-desc">{step.desc}</p>
                {i < 3 && <div className="lp-step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="lp-stats" id="stats" ref={statsRef}>
        <div className="lp-stats-inner">
          <StatNum value={500} suffix="+" label="Students Using TrackFolio" trigger={statsInView} icon={Users} />
          <StatNum value={3200} suffix="+" label="Applications Tracked" trigger={statsInView} icon={Briefcase} />
          <StatNum value={98} suffix="%" label="Feel More Confident in Interviews" trigger={statsInView} icon={Star} />
          <div className="stat-item">
            <div className="stat-icon"><Clock size={20} /></div>
            <span className="stat-num">&lt; 3s</span>
            <span className="stat-label">Average Time to Find a Resume</span>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="lp-cta-section">
        <div className="lp-cta-glow" />
        <div className="lp-section-inner lp-cta-inner">
          <h2 className="lp-cta-heading">
            Your next recruiter call<br />
            deserves a <em>confident</em> answer.
          </h2>
          <p className="lp-cta-sub">Join thousands of students who stopped guessing and started tracking.</p>
          <button className="lp-cta-big" onClick={() => navigate("/register")}>
            Get Started — It's Free
          </button>
          <p className="lp-cta-fine">No credit card. No fluff. Just clarity.</p>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <div className="lp-logo">
              <div className="lp-logo-icon-wrap"><Zap size={16} /></div>
              <span className="lp-logo-text">Track<em>Folio</em></span>
            </div>
            <p className="lp-footer-tagline">Track smarter. Interview better.</p>
          </div>
          <div className="lp-footer-links">
            <button onClick={() => scrollTo("features")}>Features</button>
            <button onClick={() => scrollTo("how-it-works")}>How It Works</button>
            <button onClick={() => navigate("/register")}>Register</button>
            <button onClick={() => navigate("/login")}>Login</button>
          </div>
          <div className="lp-footer-credit">
            Built with care for students
          </div>
        </div>
        <div className="lp-footer-bottom">
          © 2025 TrackFolio. All rights reserved.
        </div>
      </footer>

    </div>
  );
};