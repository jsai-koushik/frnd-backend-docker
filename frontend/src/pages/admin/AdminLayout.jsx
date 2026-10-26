
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserRound,
  Building2,
  BriefcaseBusiness,
  FileText,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Manage Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Manage Candidates",
      path: "/admin/candidates",
      icon: UserRound,
    },
    {
      name: "Manage Recruiters",
      path: "/admin/recruiters",
      icon: Building2,
    },
    {
      name: "Manage Jobs",
      path: "/admin/jobs",
      icon: BriefcaseBusiness,
    },
    {
      name: "Manage Applications",
      path: "/admin/applications",
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold text-indigo-700">
              SmartHire Admin
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Welcome, {user?.name || user?.email || "Admin"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </header>

      {/* MAIN LAYOUT */}

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 lg:grid-cols-[230px_minmax(0,1fr)]">

        {/* SIDEBAR */}

        <aside className="rounded-xl bg-white p-4 shadow-sm">

          <nav className="flex flex-wrap gap-2 lg:flex-col">

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 hover:bg-indigo-50"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              );
            })}

          </nav>

        </aside>

        {/* PAGE CONTENT */}

        <main className="min-w-0">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
