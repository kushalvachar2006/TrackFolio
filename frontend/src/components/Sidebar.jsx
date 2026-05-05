import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Sparkles,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import "./Sidebar.css";

const navItems = [
  { label: "Dashboard",    path: "/dashboard",    icon: LayoutDashboard },
  { label: "Resumes",      path: "/resumes",      icon: FileText },
  { label: "AI Studio",    path: "/resume-ai",    icon: Sparkles },
  { label: "Applications", path: "/applications", icon: Briefcase },
  { label: "Resolver",     path: "/resolver",     icon: Zap },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>

      {/* Top accent line via CSS ::before */}

      {/* ── Header ── */}
      <div className="sidebar-header">
        <div className="logo" onClick={() => navigate("/dashboard")}>
          <div className="logo-icon">
            <Zap size={22} strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <span className="logo-text">Track<em>Folio</em></span>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          className="btn-collapse"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              className={`nav-link ${isActive(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
              title={item.label}
            >
              <Icon size={20} className="nav-icon" strokeWidth={2} />
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {isActive(item.path) && !collapsed && <div className="nav-indicator" />}
            </button>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="sidebar-footer">
        <div
          className="user-card"
          onClick={() => navigate("/profile")}
          title="Edit profile"
        >
          <div className="user-avatar">
            <div className="avatar-gradient">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          {!collapsed && (
            <div className="user-info">
              <div className="user-name">{user?.name || "User"}</div>
              <div className="user-email">{user?.email || "user@example.com"}</div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button className="btn-logout" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        )}

        {collapsed && (
          <button
            className="btn-logout btn-logout--collapsed"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </div>
  );
};