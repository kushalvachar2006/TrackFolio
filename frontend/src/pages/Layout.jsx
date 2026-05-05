import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import "./Layout.css";

export const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`app-content ${collapsed ? "app-content--collapsed" : ""}`}>
        <Outlet />
      </div>
    </div>
  );
};