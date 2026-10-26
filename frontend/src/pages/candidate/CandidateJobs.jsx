import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  Building2,
  Clock,
  RefreshCw,
  FileText,
  Send,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const JOBS_API = "/api/jobs";
const APPLICATIONS_API = "/api/applications";

function getErrorMessage(error) {
  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 401) {
    return "Your session is unauthorized or expired. Please log in again.";
  }

  if (status === 403) {
    return "Access denied (403). Please check your login and permissions.";
  }

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  return (
    data?.message ||
    data?.error ||
    error.message ||
    "Something went wrong. Please try again."
  );
}

export default function CandidateJobs() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applicationsError, setApplicationsError] = useState("");
  const [applyingJobId, setApplyingJobId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError("");
      setApplicationsError("");

      try {
        if (!token) {
          throw new Error(
            "No authentication token found. Please log in again."
          );
        }

        const headers = {}; // token added by axios interceptor

        // Fetch jobs and the candidate's existing applications.
        const [jobsResult, applicationsResult] =
          await Promise.allSettled([
            api.get("/api/jobs"),
            api.get("/api/applications/my"),
          ]);

        if (cancelled) return;

        if (jobsResult.status === "rejected") {
          throw jobsResult.reason;
        }

        const data = jobsResult.value.data;

        const jobList = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : Array.isArray(data?.data)
              ? data.data
              : null;

        if (!jobList) {
          throw new Error(
            "Unexpected jobs response format. Please check the backend response."
          );
        }

        setJobs(jobList);

        if (applicationsResult.status === "fulfilled") {
          const applicationList = applicationsResult.value.data;

          if (Array.isArray(applicationList)) {
            setApplications(applicationList);
          } else {
            setApplications([]);
            setApplicationsError(
              "Could not verify your existing applications."
            );
          }
        } else {
          setApplications([]);
          setApplicationsError(
            getErrorMessage(applicationsResult.reason)
          );
        }
      } catch (err) {
        if (cancelled) return;

        setError(getErrorMessage(err));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [token]);

  function handleLoginAgain() {
    logout();
    navigate("/login", { replace: true });
  }

  async function handleApply(jobId) {
    if (!token) {
      toast.error("Please log in again.");
      return;
    }

    if (jobId == null) {
      toast.error("This job does not have a valid ID.");
      return;
    }

    if (applicationsError) {
      toast.error(
        "Please refresh the page before applying."
      );
      return;
    }

    const alreadyApplied = applications.some(
      (application) => String(application.jobId) === String(jobId)
    );

    if (alreadyApplied || applyingJobId !== null) {
      return;
    }

    setApplyingJobId(jobId);

    try {
      const response = await api.post(`/api/applications/jobs/${jobId}`);

      // The backend returns ApplicationResponse.
      setApplications((previous) => [
        ...previous,
        response.data,
      ]);

      toast.success("Job application submitted successfully!");
    } catch (err) {
      toast.error(getErrorMessage(err));

      // Recheck the backend in case another request already
      // created the application.
      try {
        const response = await api.get("/api/applications/my");

        if (Array.isArray(response.data)) {
          setApplications(response.data);
          setApplicationsError("");
        }
      } catch {
        setApplicationsError(
          "Could not verify your existing applications."
        );
      }
    } finally {
      setApplyingJobId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
              <BriefcaseBusiness size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                SmartHire
              </h1>

              <p className="text-sm text-gray-500">
                Explore career opportunities
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/candidate/applications"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <FileText size={16} />
              My Applications
            </Link>

            <Link
              to="/candidate/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Title */}
        <section className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-600 p-6 text-white shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-100">
            Candidate Portal
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Find Your Next Opportunity
          </h2>

          <p className="mt-3 max-w-2xl text-indigo-100">
            Explore available positions and discover opportunities
            that match your experience and skills.
          </p>
        </section>

        {/* Job Count */}
        {!loading && !error && (
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Available Jobs
            </h3>

            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
              {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
            </span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

            <p className="mt-4 font-medium text-gray-700">
              Loading available jobs...
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Please wait while we retrieve job listings.
            </p>
          </div>
        )}

        {/* Jobs Error */}
        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-red-700">
              Unable to Load Jobs
            </h3>

            <p className="mt-2 text-sm text-gray-700">
              {error}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
              >
                <RefreshCw size={16} />
                Try Again
              </button>

              {(error.includes("token") ||
                error.includes("log in again") ||
                error.includes("unauthorized")) && (
                <button
                  type="button"
                  onClick={handleLoginAgain}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Log In Again
                </button>
              )}
            </div>
          </div>
        )}

        {/* Applications Error */}
        {!loading && !error && applicationsError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 p-5"
          >
            <p className="font-medium text-yellow-800">
              Jobs loaded, but application status could not be verified.
            </p>

            <p className="mt-1 text-sm text-yellow-700">
              {applicationsError} Applying is temporarily disabled
              to avoid duplicate submissions.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-yellow-700 px-4 py-2 text-sm text-white hover:bg-yellow-800"
            >
              <RefreshCw size={16} />
              Refresh Page
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
            <BriefcaseBusiness
              size={44}
              className="mx-auto text-gray-400"
            />

            <h3 className="mt-4 text-xl font-bold text-gray-800">
              No Jobs Available
            </h3>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              There are currently no jobs to display.
              Please check again later.
            </p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && jobs.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job, index) => {
              const existingApplication = applications.find(
                (application) =>
                  String(application.jobId) === String(job.id)
              );

              const alreadyApplied = Boolean(existingApplication);
              const isApplying = applyingJobId === job.id;

              return (
                <article
                  key={job.id ?? index}
                  className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                      <Building2 size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-lg font-bold text-gray-900">
                        {job.title || "Untitled Position"}
                      </h3>

                      <p className="mt-1 break-words text-sm font-medium text-indigo-600">
                        {job.companyName || "Company not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 text-sm text-gray-600">
                    {job.location && (
                      <p className="flex items-center gap-2">
                        <MapPin
                          size={16}
                          className="shrink-0 text-gray-400"
                        />
                        <span>{job.location}</span>
                      </p>
                    )}

                    {job.employmentType && (
                      <p className="flex items-center gap-2">
                        <Clock
                          size={16}
                          className="shrink-0 text-gray-400"
                        />
                        <span>{job.employmentType}</span>
                      </p>
                    )}

                    {job.experience != null &&
                      job.experience !== "" && (
                        <p>
                          <span className="font-medium text-gray-700">
                            Experience:
                          </span>{" "}
                          {job.experience}
                        </p>
                      )}

                    {job.salary != null && job.salary !== "" && (
                      <p>
                        <span className="font-medium text-gray-700">
                          Salary:
                        </span>{" "}
                        {job.salary}
                      </p>
                    )}
                  </div>

                  {job.description && (
                    <p className="mt-5 line-clamp-4 text-sm leading-6 text-gray-600">
                      {job.description}
                    </p>
                  )}

                  {job.skills && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Skills
                      </p>

                      <p className="text-sm text-gray-700">
                        {Array.isArray(job.skills)
                          ? job.skills.join(", ")
                          : job.skills}
                      </p>
                    </div>
                  )}

                  {/* Job Actions */}
                  <div className="mt-auto pt-6">
                    <p className="mb-4 rounded-lg bg-gray-50 px-3 py-2 text-center text-xs text-gray-500">
                      Job ID: {job.id ?? "Not provided"}
                    </p>

                    {alreadyApplied ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                          <CheckCircle2 size={18} />
                          Application: {existingApplication.status}
                        </div>

                        <Link
                          to="/candidate/applications"
                          className="block rounded-lg border border-indigo-300 px-4 py-2.5 text-center text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                        >
                          View My Applications
                        </Link>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApply(job.id)}
                        disabled={
                          job.id == null ||
                          applyingJobId !== null ||
                          Boolean(applicationsError)
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send size={17} />

                        {isApplying
                          ? "Applying..."
                          : "Apply Now"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
