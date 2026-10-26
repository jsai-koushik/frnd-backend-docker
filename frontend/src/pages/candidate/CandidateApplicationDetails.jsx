import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  User,
  Mail,
  Hash,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const API_URL = "/api/applications";

function getErrorMessage(error) {
  const data = error.response?.data;

  if (error.response?.status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (error.response?.status === 403) {
    return "You do not have permission to view this application.";
  }

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  return (
    data?.message ||
    data?.error ||
    error.message ||
    "Unable to load application."
  );
}

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

export default function CandidateApplicationDetails() {
  const { applicationId } = useParams();
  const { token } = useAuth();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchApplication() {
      setLoading(true);
      setError("");

      try {
        if (!token) {
          throw new Error("Please log in again.");
        }

        const response = await api.get(`/api/applications/${applicationId}`);

        if (!cancelled) {
          setApplication(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchApplication();

    return () => {
      cancelled = true;
    };
  }, [applicationId, token, reloadKey]);

  async function handleWithdraw() {
    if (!application || withdrawing) return;

    const confirmed = window.confirm(
      "Are you sure you want to withdraw this application?"
    );

    if (!confirmed) return;

    setWithdrawing(true);

    try {
      await api.put(`/api/applications/${application.applicationId}/withdraw`);

      toast.success("Application withdrawn successfully");

      setReloadKey((previous) => previous + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setWithdrawing(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">

        <Link
          to="/candidate/applications"
          className="mb-6 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft size={18} />
          Back to My Applications
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Application Details
          </h1>

          <p className="mt-2 text-gray-600">
            View your submitted job application.
          </p>
        </div>

        {loading && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            Loading application details...
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-6"
          >
            <p className="text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && application && (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <BriefcaseBusiness size={28} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {application.jobTitle}
                  </h2>

                  <p className="mt-2 flex items-center gap-2 text-gray-600">
                    <Building2 size={18} />
                    {application.companyName}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                  application.status
                )}`}
              >
                {application.status}
              </span>
            </div>

            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <Hash size={16} />
                  Application ID
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {application.applicationId}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <BriefcaseBusiness size={16} />
                  Job ID
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {application.jobId}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <User size={16} />
                  Candidate Name
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {application.candidateName}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail size={16} />
                  Candidate Email
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {application.candidateEmail}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
              {application.status !== "WITHDRAWN" && (
                <button
                  type="button"
                  onClick={handleWithdraw}
                  disabled={withdrawing}
                  className="rounded-lg border border-red-300 px-5 py-2.5 font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {withdrawing
                    ? "Withdrawing..."
                    : "Withdraw Application"}
                </button>
              )}

              <Link
                to="/candidate/applications"
                className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
              >
                My Applications
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
