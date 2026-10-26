
import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

import {
  Bell,
  CalendarDays,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  BrainCircuit,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const API_URL = "";

// ==========================================
// FORMAT INTERVIEW DATE
// ==========================================

function formatDate(date) {
  if (!date) return "Not available";

  const parts = String(date).split("-");

  if (parts.length !== 3) return date;

  const [year, month, day] = parts.map(Number);

  const parsedDate = new Date(year, month - 1, day);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ==========================================
// FORMAT INTERVIEW TIME
// ==========================================

function formatTime(time) {
  if (!time) return "Not available";

  const [hours, minutes] = String(time)
    .split(":")
    .map(Number);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes)
  ) {
    return time;
  }

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

// ==========================================
// CANDIDATE DASHBOARD
// ==========================================

export default function CandidateDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [interviewsLoading, setInterviewsLoading] =
    useState(true);

  const [interviewsError, setInterviewsError] =
    useState("");

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // FETCH CANDIDATE INTERVIEWS
  // ==========================================

  const fetchInterviews = useCallback(async (signal) => {
    setInterviewsLoading(true);
    setInterviewsError("");

    try {
      if (!localStorage.getItem("smarthire_token")) {
        throw new Error("Session expired. Please log in again.");
      }

      const response = await api.get("/api/interviews/my", { signal });

      if (!Array.isArray(response.data)) {
        throw new Error(
          "Unexpected response received from the server."
        );
      }

      setInterviews(response.data);
    } catch (error) {
      if (
        error.code === "ERR_CANCELED" ||
        error.name === "CanceledError"
      ) {
        return;
      }

      console.error(
        "Failed to fetch candidate interviews:",
        error
      );

      setInterviews([]);

      if (error.response?.status === 401) {
        setInterviewsError(
          "Your session has expired. Please log in again."
        );
      } else if (error.response?.status === 403) {
        setInterviewsError(
          "You do not have permission to view these interviews."
        );
      } else {
        setInterviewsError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load interview notifications."
        );
      }
    } finally {
      if (!signal?.aborted) {
        setInterviewsLoading(false);
      }
    }
  }, []);

  // ==========================================
  // LOAD INTERVIEWS ON DASHBOARD OPEN
  // ==========================================

  useEffect(() => {
    const controller = new AbortController();

    fetchInterviews(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchInterviews]);

  // ==========================================
  // CANDIDATE WORKSPACE FEATURES
  // ==========================================

  const features = [
    {
      icon: "💼",
      title: "Browse Jobs",
      description:
        "Discover job opportunities matching your skills.",
      path: "/candidate/jobs",
    },
    {
      icon: "📋",
      title: "My Applications",
      description:
        "Track your submitted job applications.",
      path: "/candidate/applications",
    },
    {
      icon: "👤",
      title: "My Profile",
      description:
        "Manage your personal and educational details.",
      path: "/candidate/profile",
    },
    {
      icon: "📅",
      title: "My Interviews",
      description:
        "View scheduled interviews, dates, times and meeting details.",
      path: "/candidate/interviews",
    },
    {
      icon: "🧠",
      title: "AI Resume Analysis",
      description:
        "Analyze your resume using SmartHire AI and get useful feedback.",
      path: "/candidate/resume-analysis",
      isNew: true,
    },
    {
      icon: "🎯",
      title: "AI Job Match",
      description:
        "See how well your profile matches a job and get improvement tips.",
      path: "/candidate/job-match",
      isNew: true,
    },
    {
      icon: "💬",
      title: "Interview Prep",
      description:
        "Generate AI practice questions for any job you are applying for.",
      path: "/candidate/interview-prep",
      isNew: true,
    },
  ];

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-5 shadow-sm">

        <Link
          to="/candidate/dashboard"
          className="text-2xl font-bold text-indigo-700"
        >
          SmartHire
        </Link>

        <div className="flex items-center gap-4">

          <span className="text-gray-600">
            {user?.name ||
              user?.email ||
              "Candidate"}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Logout
          </button>

        </div>
      </header>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* =====================================
            WELCOME BANNER
        ===================================== */}

        <section className="rounded-2xl bg-indigo-600 p-8 text-white shadow-md">

          <p className="text-sm font-medium text-indigo-100">
            CANDIDATE PORTAL
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Welcome, {user?.name || "Candidate"}!
          </h2>

          <p className="mt-3 max-w-2xl text-indigo-100">
            Find your next opportunity, manage applications,
            check scheduled interviews, analyze your resume
            with AI, and keep your professional profile up
            to date.
          </p>

          {/* AI RESUME ANALYSIS QUICK ACTION */}

          <Link
            to="/candidate/resume-analysis"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            <BrainCircuit size={20} />

            Analyze My Resume

            <ArrowRight size={17} />
          </Link>

        </section>

        {/* =====================================
            INTERVIEW NOTIFICATIONS
        ===================================== */}

        <section className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">

          {/* NOTIFICATION HEADER */}

          <div className="flex flex-wrap items-start justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-indigo-100 p-3">
                <Bell
                  size={24}
                  className="text-indigo-700"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Interview Notifications
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Stay updated with interviews scheduled
                  by recruiters.
                </p>
              </div>

            </div>

            {/* REFRESH BUTTON */}

            <button
              type="button"
              onClick={() => fetchInterviews()}
              disabled={interviewsLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  interviewsLoading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

          </div>

          {/* =====================================
              LOADING STATE
          ===================================== */}

          {interviewsLoading ? (

            <p className="mt-6 text-sm text-gray-600">
              Checking your scheduled interviews...
            </p>

          ) : interviewsError ? (

            /* =====================================
                ERROR STATE
            ===================================== */

            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
            >
              <AlertCircle
                size={19}
                className="shrink-0"
              />

              <p className="text-sm">
                {interviewsError}
              </p>
            </div>

          ) : interviews.length > 0 ? (

            /* =====================================
                SCHEDULED INTERVIEWS
            ===================================== */

            <div className="mt-6">

              <p className="mb-4 font-semibold text-indigo-800">
                You have {interviews.length} scheduled{" "}
                {interviews.length === 1
                  ? "interview"
                  : "interviews"}!
              </p>

              <div className="space-y-3">

                {interviews.map((interview, index) => (

                  <div
                    key={
                      interview.interviewId ??
                      index
                    }
                    className="rounded-xl border border-indigo-100 bg-white p-4"
                  >

                    <div className="flex flex-wrap items-start justify-between gap-3">

                      <div>

                        <h4 className="font-bold text-gray-900">
                          {interview.jobTitle ||
                            "Job Interview"}
                        </h4>

                        <p className="mt-1 text-sm text-gray-600">
                          {interview.companyName ||
                            "Company not available"}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-700">

                          {/* DATE */}

                          <span className="inline-flex items-center gap-2">
                            <CalendarDays
                              size={16}
                              className="text-indigo-600"
                            />

                            {formatDate(
                              interview.interviewDate
                            )}
                          </span>

                          {/* TIME */}

                          <span>
                            Time:{" "}
                            <strong>
                              {formatTime(
                                interview.interviewTime
                              )}
                            </strong>
                          </span>

                          {/* INTERVIEW TYPE */}

                          <span>
                            Type:{" "}
                            <strong>
                              {interview.interviewType ||
                                "Not specified"}
                            </strong>
                          </span>

                        </div>

                      </div>

                      {/* APPLICATION STATUS */}

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {interview.applicationStatus ||
                          "Scheduled"}
                      </span>

                    </div>

                    {/* VIEW INTERVIEW DETAILS */}

                    <Link
                      to="/candidate/interviews"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                    >
                      View Interview Details

                      <ArrowRight size={16} />
                    </Link>

                  </div>

                ))}

              </div>

              {/* VIEW ALL INTERVIEWS */}

              <Link
                to="/candidate/interviews"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                <CalendarDays size={18} />

                View All Interviews
              </Link>

            </div>

          ) : (

            /* =====================================
                NO INTERVIEWS
            ===================================== */

            <div className="mt-6 rounded-xl border border-indigo-100 bg-white p-5">

              <p className="font-semibold text-gray-800">
                No interviews scheduled yet.
              </p>

              <p className="mt-2 text-sm text-gray-600">
                When a recruiter schedules an interview
                for one of your applications, it will
                appear here.
              </p>

            </div>

          )}

        </section>

        {/* =====================================
            WORKSPACE
        ===================================== */}

        <h3 className="mb-5 mt-10 text-2xl font-bold text-gray-800">
          Your Workspace
        </h3>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

          {features.map((feature) => (

            <Link
              key={feature.title}
              to={feature.path}
              className={`relative rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                feature.isNew
                  ? "border-2 border-indigo-300"
                  : "border border-transparent"
              }`}
            >

              {/* NEW FEATURE BADGE */}

              {feature.isNew && (
                <span className="absolute right-3 top-3 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  AI Feature
                </span>
              )}

              {/* FEATURE ICON */}

              <span className="text-4xl">
                {feature.icon}
              </span>

              {/* FEATURE TITLE */}

              <h4 className="mt-4 text-xl font-semibold text-gray-800">
                {feature.title}
              </h4>

              {/* FEATURE DESCRIPTION */}

              <p className="mt-2 text-sm text-gray-600">
                {feature.description}
              </p>

              {/* OPEN PAGE */}

              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-indigo-600">
                Open page

                <ArrowRight size={16} />
              </span>

            </Link>

          ))}

        </div>

        {/* =====================================
            GETTING STARTED
        ===================================== */}

        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold text-gray-800">
            Getting Started
          </h3>

          <p className="mt-2 text-gray-600">
            Start by updating your profile, analyze your
            resume using SmartHire AI, browse available
            jobs, submit applications that match your
            interests, and check your interview
            notifications.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">

            <Link
              to="/candidate/profile"
              className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Update Profile
            </Link>

            <Link
              to="/candidate/resume-analysis"
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-600 px-5 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              <BrainCircuit size={18} />

              AI Resume Analysis
            </Link>

          </div>

        </section>

      </main>
    </div>
  );
}
