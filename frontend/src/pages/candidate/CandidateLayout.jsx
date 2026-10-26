
import { useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  BriefcaseBusiness,
  LayoutDashboard,
  FileText,
  UserRound,
  CalendarDays,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import "./candidate-layout.css";

const navigation = [
  {
    label: "Dashboard",
    path: "/candidate/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Browse Jobs",
    path: "/candidate/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "My Applications",
    path: "/candidate/applications",
    icon: FileText,
  },
  {
    label: "My Profile",
    path: "/candidate/profile",
    icon: UserRound,
  },
  {
    label: "Interviews",
    path: "/candidate/interviews",
    icon: CalendarDays,
  },
  {
    label: "AI Resume Analysis",
    path: "/candidate/resume-analysis",
    icon: Sparkles,
  },
];

export default function CandidateLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.email ||
    "Candidate";

  const currentPage =
    [...navigation]
      .sort((a, b) => b.path.length - a.path.length)
      .find(
        (item) =>
          location.pathname === item.path ||
          location.pathname.startsWith(item.path + "/")
      )?.label || "Candidate Portal";

  return (
    <div className="candidate-shell">
      {menuOpen && (
        <button
          type="button"
          className="candidate-overlay"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`candidate-sidebar ${
          menuOpen ? "open" : ""
        }`}
      >
        <div className="candidate-brand">
          <BriefcaseBusiness size={28} />

          <span>SmartHire</span>

          <button
            type="button"
            className="candidate-mobile-close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <p className="candidate-nav-heading">
          CANDIDATE WORKSPACE
        </p>

        <nav
          className="candidate-navigation"
          aria-label="Candidate navigation"
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={
                  item.path !== "/candidate/applications"
                }
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `candidate-nav-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={19} />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="candidate-sidebar-bottom">
          <span>SmartHire Candidate Portal</span>
        </div>
      </aside>

      <div className="candidate-main">
        <header className="candidate-topbar">
          <div className="candidate-topbar-left">
            <button
              type="button"
              className="candidate-menu-button"
              aria-label="Open navigation"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={23} />
            </button>

            <span>{currentPage}</span>
          </div>

          <div className="candidate-user">
            <span>{displayName}</span>

            <div className="candidate-avatar">
              {String(displayName)
                .charAt(0)
                .toUpperCase()}
            </div>
          </div>
        </header>

        <main className="candidate-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
