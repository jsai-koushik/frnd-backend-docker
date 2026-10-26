import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Users,
  UserRound,
  BriefcaseBusiness,
  Briefcase,
  FileText,
  CalendarDays,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import "./AdminDashboard.css";

const dashboardCards = [
  { title: "Total Users",    key: "totalUsers",        icon: Users,            colorClass: "stat-card-colorful stat-card-colorful-1", iconClass: "icon-colorful-1" },
  { title: "Candidates",     key: "totalCandidates",   icon: UserRound,        colorClass: "stat-card-colorful stat-card-colorful-2", iconClass: "icon-colorful-2" },
  { title: "Recruiters",     key: "totalRecruiters",   icon: BriefcaseBusiness,colorClass: "stat-card-colorful stat-card-colorful-3", iconClass: "icon-colorful-3" },
  { title: "Total Jobs",     key: "totalJobs",         icon: Briefcase,        colorClass: "stat-card-colorful stat-card-colorful-4", iconClass: "icon-colorful-4" },
  { title: "Applications",   key: "totalApplications", icon: FileText,         colorClass: "stat-card-colorful stat-card-colorful-5", iconClass: "icon-colorful-5" },
  { title: "Interviews",     key: "totalInterviews",   icon: CalendarDays,     colorClass: "stat-card-colorful stat-card-colorful-6", iconClass: "icon-colorful-6" },
];

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  async function fetchDashboard() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/admin/dashboard");
      setStats(response.data);
    } catch (err) {
      if (err.response?.status === 401) setError("Session expired. Please log in again.");
      else if (err.response?.status === 403) setError("Access denied. ADMIN role required.");
      else setError("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchDashboard(); }, []);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome to SmartHire platform management.</p>
          </div>
          <button
            type="button"
            onClick={fetchDashboard}
            disabled={loading}
            className="refresh-button"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="error-alert">
          <AlertCircle size={22} />
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="stats-grid">
          {dashboardCards.map((c) => (
            <div key={c.key} className="skeleton-card" />
          ))}
        </div>
      )}

      {!loading && stats && (
        <div className="stats-section">
          <h2>Platform Overview</h2>
          <div className="stats-grid">
            {dashboardCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.key} className={`stat-card ${card.colorClass}`}>
                  <div className="stat-card-content">
                    <div className="stat-card-info">
                      <div className="stat-card-label">{card.title}</div>
                      <div className="stat-card-value">{stats[card.key] ?? "—"}</div>
                    </div>
                    <div className={`stat-card-icon ${card.iconClass}`}>
                      <Icon size={28} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
