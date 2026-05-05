import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GraduationCap, CheckCircle } from "lucide-react";
import "./Hero.css";

export const Hero = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="hero">
      <div className="hero-glow"></div>

      <div className="hero-container">
        <motion.div
          className="hero-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div className="badge" variants={itemVariants}>
            <span className="badge-dot"><GraduationCap size={13} /></span>
            <span className="badge-text">
              Built for students on the job hunt
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 className="headline" variants={itemVariants}>
            Stop Guessing.
            <br />
            Start <span className="tracking-animated">Tracking.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p className="subheadline" variants={itemVariants}>
            TrackFolio keeps every resume version organized, every application
            logged, and tells you exactly which resume you sent — the moment a
            recruiter calls.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className="cta-group" variants={itemVariants}>
            <button
              className="btn-primary"
              onClick={() => navigate("/register")}
            >
              Create Free Account
            </button>
            <button
              className="btn-secondary"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              See How It Works →
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div className="social-proof" variants={itemVariants}>
            <span><CheckCircle size={13} /> No credit card required</span>
            <span><CheckCircle size={13} /> Free for students</span>
            <span><CheckCircle size={13} /> 2 min setup</span>
          </motion.div>
        </motion.div>

        {/* Right Side - Mock UI */}
        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          <div className="mock-card-glow"></div>
          <motion.div
            className="mock-card"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="mock-search">
              <input
                type="text"
                placeholder="Search company or role..."
                disabled
              />
            </div>
            <div className="mock-results">
              <div className="mock-result-item">
                <div className="mock-result-left">
                  <div className="mock-company">Google</div>
                  <div className="mock-role">SDE Intern</div>
                  <div className="mock-meta">Applied Mar 12 • LinkedIn</div>
                </div>
                <div className="mock-result-right">
                  <span className="mock-badge">Backend_v3.pdf</span>
                </div>
              </div>
              <div className="mock-result-item">
                <div className="mock-result-left">
                  <div className="mock-company">Swiggy</div>
                  <div className="mock-role">Product Intern</div>
                  <div className="mock-meta">Applied Feb 28 • Direct</div>
                </div>
                <div className="mock-result-right">
                  <span className="mock-badge">PM_Final.pdf</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
