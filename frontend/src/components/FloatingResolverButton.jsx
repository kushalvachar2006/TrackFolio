import { useNavigate, useLocation } from "react-router-dom";
import { Zap } from "lucide-react";
import "./FloatingResolverButton.css";

export const FloatingResolverButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/resolver") {
    return null;
  }

  return (
    <button
      className="floating-resolver-btn"
      onClick={() => navigate("/resolver")}
      title="Quick Resolver"
    >
      <Zap size={20} strokeWidth={2.5} />
      <span className="btn-text">Quick Search</span>
    </button>
  );
};