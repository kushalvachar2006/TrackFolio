import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Briefcase, Phone, BrainCircuit } from "lucide-react";
import "./BottomNav.css";

const navItems = [
  { label: "Dashboard",    path: "/dashboard",    icon: LayoutDashboard },
  { label: "Resumes",      path: "/resumes",      icon: FileText },
  { label: "Resume AI",    path: "/resume-ai",    icon: BrainCircuit },
  { label: "Applications", path: "/applications", icon: Briefcase },
  { label: "Recruiter",    path: "/resolver",     icon: Phone },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            className={`bottom-nav-link ${isActive(item.path) ? "active" : ""}`}
            onClick={() => navigate(item.path)}
            title={item.label}
          >
            <Icon size={22} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
