import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../api/axios";

import {
  ArrowLeft,
  Users,
  RefreshCw,
  AlertCircle,
  LoaderCircle,
  Mail,
  FileText,
  BriefcaseBusiness,
  CalendarPlus,
  ScanSearch,
} from "lucide-react";

function getStatusStyle(status) {
  switch (String(status).toUpperCase()) {
    case "APPLIED":
      return "bg-blue-100 text-blue-700";
    case "SHORTLISTED":
      return "bg-green-100 text-green-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    case "WITHDRAWN":
      return "bg-gray-200 text-gray-600";
    case "INTERVIEW_SCHEDULED":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function RecruiterApplicants() {
  const { jobId } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplicants = useCallback(async () => {
    if (!jobId) {
      setError("Job ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        `/api/recruiter/jobs/${jobId}/applicants`
      );

      if (!Array.isArray(response.data)) {
        throw new Error("Unexpected applicants response.");
      }

      setApplicants(response.data);
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) setError("Please log in again.");
      else if (status === 403)
        setError("You do not have permission to view these applicants.");
      else if (status === 404)
        setError("Job not found or no applicants endpoint.");
      else
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load applicants."
        );
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* BACK */}
        <Link
          to="/recruiter/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* HEADER */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
              <Users className="text-blue-600" size={30} />
              Job Applicants
            </h1>
            <p className="mt-2 text-slate-500">
              Applications received for Job #{jobId}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchApplicants}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <AlertCircle size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* COUNT */}
        <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Applicants
          </p>
          <p className="mt-3 text-4xl font-bold text-slate-900">
            {loading ? "..." : error ? "—" : applicants.length}
          </p>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-xl border bg-white py-16 text-slate-500">
            <LoaderCircle size={24} className="animate-spin" />
            Loading applicants...
          </div>
        ) : error ? null : applicants.length === 0 ? (
          <div className="rounded-xl border bg-white px-6 py-16 text-center shadow-sm">
            <Users size={46} className="mx-auto mb-4 text-slate-400" />
            <h2 className="text-xl font-semibold text-slate-800">
              No applications yet
            </h2>
            <p className="mt-2 text-slate-500">
              Applications for this job will appear here once candidates apply.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {applicants.map((application, index) => {
              const name =
                application.candidateName ||
                application.candidate?.name ||
                "Candidate";

              const email =
                application.candidateEmail ||
                application.candidate?.email ||
                "";

              const status = application.status ?? "APPLIED";

              const applicationId =
                application.applicationId ?? application.id;

              const canSchedule =
                status !== "WITHDRAWN" &&
                status !== "REJECTED";

              return (
                <article
                  key={applicationId ?? index}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {name}
                      </h2>

                      {email && (
                        <p className="mt-1 flex items-center gap-2 break-all text-sm text-slate-600">
                          <Mail size={15} />
                          {email}
                        </p>
                      )}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(status)}`}
                    >
                      {String(status).replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="space-y-2 border-t pt-4 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <BriefcaseBusiness size={15} />
                      Job ID: {jobId}
                    </p>

                    {applicationId != null && (
                      <p className="flex items-center gap-2">
                        <FileText size={15} />
                        Application ID: {applicationId}
                      </p>
                    )}

                    {application.appliedAt && (
                      <p>
                        <strong>Applied:</strong>{" "}
                        {String(application.appliedAt)}
                      </p>
                    )}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="mt-5 flex flex-wrap gap-3 border-t pt-4">

                    {/* AI Screening */}
                    {applicationId != null && (
                      <Link
                        to={`/recruiter/ai/resume-screening`}
                        state={{ preselectedApplicationId: applicationId, preselectedJobId: jobId }}
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                      >
                        <ScanSearch size={15} />
                        AI Screen
                      </Link>
                    )}

                    {/* Schedule Interview */}
                    {canSchedule && applicationId != null && (
                      <Link
                        to={`/recruiter/interviews/schedule/${applicationId}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        <CalendarPlus size={15} />
                        Schedule Interview
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
