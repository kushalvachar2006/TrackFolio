import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LandingPage } from "./pages/LandingPage";
import { NewDashboardPage } from "./pages/NewDashboardPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ResumesPage } from "./pages/ResumesPage";
import { ResumeAIPage } from "./pages/ResumeAIPage";
import { ApplicationsPage } from "./pages/ApplicationsPage";
import { ResolverPage } from "./pages/ResolverPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Sidebar } from "./components/Sidebar";
import { BottomNav } from "./components/BottomNav";
import "./App.css";

const contentStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  minHeight: "100vh",
};

function App() {
  const ProtectedLayout = ({ children }) => {
    const isDesktop =
      typeof window !== "undefined" && window.innerWidth >= 1024;
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: "100vh",
          background: "var(--bg-base)",
        }}
      >
        <Sidebar />
        <div style={{ ...contentStyle, marginLeft: isDesktop ? "256px" : 0 }}>
          {children}
          <BottomNav />
        </div>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <NewDashboardPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resumes"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ResumesPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-ai"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ResumeAIPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ApplicationsPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resolver"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ResolverPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Old AI tailor deep-link — redirect to new page */}
        <Route path="/ai-tailor/:id" element={<Navigate to="/resume-ai" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
