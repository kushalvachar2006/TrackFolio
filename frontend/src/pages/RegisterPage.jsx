import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authAPI, getErrorMessage } from "../utils/api";
import { Zap } from "lucide-react";
import "./AuthPages.css";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, setError: setAuthError } = useAuth();
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    college: "", branch: "", graduationYear: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.college || !formData.branch) {
      setError("Please fill in all fields"); return false;
    }
    if (formData.name.length < 2) { setError("Name must be at least 2 characters"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError("Please enter a valid email"); return false; }
    if (formData.password.length < 8) { setError("Password must be at least 8 characters"); return false; }
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await authAPI.register({
        name: formData.name, email: formData.email, password: formData.password,
        college: formData.college, branch: formData.branch,
        graduationYear: parseInt(formData.graduationYear),
      });
      register(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      if (setAuthError) setAuthError(msg);
    } finally { setLoading(false); }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><Zap size={20} /></div>
          <span className="auth-logo-text">Track<span>Folio</span></span>
        </div>

        <h1>Create account</h1>
        <p className="auth-subtitle">Free for students. No credit card needed.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name}
                onChange={handleChange} placeholder="John Doe" disabled={loading} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="you@example.com" disabled={loading} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="college">College</label>
              <input type="text" id="college" name="college" value={formData.college}
                onChange={handleChange} placeholder="Your college" disabled={loading} />
            </div>
            <div className="form-group">
              <label htmlFor="branch">Branch</label>
              <input type="text" id="branch" name="branch" value={formData.branch}
                onChange={handleChange} placeholder="Computer Science" disabled={loading} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="graduationYear">Graduation Year</label>
            <select id="graduationYear" name="graduationYear"
              value={formData.graduationYear} onChange={handleChange} disabled={loading}>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={formData.password}
                onChange={handleChange} placeholder="Min 8 characters" disabled={loading} />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange}
                placeholder="Repeat password" disabled={loading} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Creating account..." : "Create Free Account"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
