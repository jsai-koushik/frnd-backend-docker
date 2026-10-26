import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  FileText,
  RefreshCw,
  Eye,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const API_URL = "/api/applications";

// ==========================================
// ERROR HANDLING
// ==========================================

function getErrorMessage(error) {
  const data = error.response?.data;

  if (error.response?.status === 401) {
    return "Your session is invalid or expired. Please log in again.";
  }

  if (error.response?.status === 403) {
    return "You do not have permission to access this application.";
  }

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  return (
    data?.message ||
    data?.error ||
    "Something went wrong. Please try again."
  );
}

// ==========================================
// APPLICATION STATUS STYLES
// ==========================================

function getStatusStyle(status) {
  switch (status) {
    case "APPLIED":
      return "bg-blue-100 text-blue-700";

    case "SHORTLISTED":
      return "bg-green-100 text-green-700";

    case "REJECTED":
      return "bg-red-100 text-red-700";

    case "WITHDRAWN":
      return "bg-gray-200 text-gray-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

// ==========================================
// CANDIDATE APPLICATIONS PAGE
// ==========================================

export default function CandidateApplications() {
  const { token } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawingId, setWithdrawingId] = useState(null);

  // ==========================================
  // FETCH MY APPLICATIONS
  // ==========================================

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!token) {
        throw new Error("Please log in to view your applications.");
      }

      const response = await api.get("/api/applications/my");

      if (!Array.isArray(response.data)) {
        throw new Error(
          "Unexpected applications response from backend."
        );
      }

      setApplications(response.data);
    } catch (err) {
      setError(
        err.response
          ? getErrorMessage(err)
          : err.message || "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // ==========================================
  // WITHDRAW APPLICATION
  // ==========================================

  async function handleWithdraw(applicationId) {
    if (withdrawingId !== null) return;

    const confirmed = window.confirm(
      "Are you sure you want to withdraw this application?"
    );

    if (!confirmed) return;

    setWithdrawingId(applicationId);

    try {
      await api.put(`/api/applications/${applicationId}/withdraw`);

      toast.success("Application withdrawn successfully");

      // Reload applications to get updated status.
      await fetchApplications();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setWithdrawingId(null);
    }
  }

  // ==========================================
  // PAGE UI
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">

        {/* =====================================
            HEADER
        ===================================== */}

        <Link
          to="/candidate/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
              <FileText className="text-indigo-600" />
              My Applications
            </h1>

            <p className="mt-2 text-gray-600">
              Track and manage your submitted job applications.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchApplications}
            disabled={loading || !token}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* =====================================
            LOADING STATE
        ===================================== */}

        {loading && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            Loading your applications...
          </div>
        )}

        {/* =====================================
            ERROR STATE
        ===================================== */}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={fetchApplications}
              disabled={!token}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              Try Again
            </button>
          </div>
        )}

        {/* =====================================
            EMPTY STATE
        ===================================== */}

        {!loading && !error && applications.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <BriefcaseBusiness
              size={42}
              className="mx-auto mb-4 text-gray-400"
            />

            <h2 className="text-xl font-semibold text-gray-800">
              No applications yet
            </h2>

            <p className="mt-2 text-gray-500">
              Browse available jobs and start applying.
            </p>

            <Link
              to="/candidate/jobs"
              className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        {/* =====================================
            APPLICATIONS LIST
        ===================================== */}

        {!loading && !error && applications.length > 0 && (
          <>
            <p className="mb-5 text-sm text-gray-500">
              {applications.length} application(s)
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              {applications.map((application) => (
                <article
                  key={application.applicationId}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                >

                  {/* Job Details */}

                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {application.jobTitle}
                      </h2>

                      <p className="mt-2 flex items-center gap-2 text-gray-600">
                        <Building2 size={17} />
                        {application.companyName}
                      </p>
                    </div>

                    {/* Application Status */}

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                  </div>

                  {/* Application Information */}

                  <div className="mt-5 space-y-2 border-t pt-4 text-sm text-gray-600">
                    <p>
                      Application ID: {application.applicationId}
                    </p>

                    <p>
                      Job ID: {application.jobId}
                    </p>
                  </div>

                  {/* =====================================
                      APPLICATION ACTION BUTTONS
                  ===================================== */}

                  <div className="mt-6 flex flex-wrap gap-3">

                    {/* NEW: VIEW DETAILS BUTTON */}

                    <Link
                      to={`/candidate/applications/${application.applicationId}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>

                    {/* WITHDRAW APPLICATION */}

                    {application.status !== "WITHDRAWN" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleWithdraw(application.applicationId)
                        }
                        disabled={withdrawingId !== null}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {withdrawingId === application.applicationId
                          ? "Withdrawing..."
                          : "Withdraw Application"}
                      </button>
                    )}

                    {/* BROWSE MORE JOBS */}

                    <Link
                      to="/candidate/jobs"
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Browse More Jobs
                    </Link>

                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
