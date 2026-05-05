import { useAuth } from "../hooks/useAuth";
import { Sparkles } from "lucide-react";
import "./Header.css";

export const Header = ({ title, subtitle }) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        <div className="header-right">
          <div className="greeting-card">
            <div className="greeting-icon">
              <Sparkles size={16} />
            </div>
            <div className="greeting-text">
              <span className="greeting-label">{getGreeting()}</span>
              <span className="user-name">{user?.name?.split(" ")[0] || "User"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};