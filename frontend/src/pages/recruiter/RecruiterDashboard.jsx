
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

import {
  BriefcaseBusiness,
  Plus,
  MapPin,
  Building2,
  Wallet,
  RefreshCw,
  AlertCircle,
  Users,
  LoaderCircle,
  LogOut,
  BrainCircuit,
  ScanSearch,
  ArrowRight,
} from "lucide-react";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const fetchJobs = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/recruiter/jobs", {
        signal,
      });

      if (!Array.isArray(response.data)) {
        throw new Error(
          "Unexpected jobs response. Expected an array."
        );
      }

      setJobs(response.data);
    } catch (err) {
      if (
        err.code === "ERR_CANCELED" ||
        signal?.aborted
      ) {
        return;
      }

      console.error("Failed to fetch recruiter jobs:", err);

      const status = err.response?.status;

      if (status === 401) {
        setError(
          "Authentication failed. Please log in again."
        );
      } else if (status === 403) {
        setError(
          "Access denied. Check your recruiter account permissions."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load your jobs."
        );
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchJobs(controller.signal);

    return () => controller.abort();
  }, [fetchJobs]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Recruiter Dashboard
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your posted jobs and recruitment activities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/recruiter/jobs/new"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              Post New Job
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* ERROR MESSAGE */}

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <AlertCircle
              size={20}
              className="shrink-0"
            />
            <p>{error}</p>
          </div>
        )}

        {/* AI TOOLS */}

        <section className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            AI Recruitment Tools
          </h2>

          <p className="mb-5 text-slate-500">
            AI-powered tools for candidate screening and
            interview preparation.
          </p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <Link
              to="/recruiter/ai/resume-screening"
              className="group rounded-xl border border-blue-200 bg-white p-6 shadow-sm transition hover:border-blue-400 hover:shadow-lg"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                <ScanSearch size={28} />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                AI Resume Screening
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Analyze candidate profiles against job
                requirements using AI.
              </p>

              <div className="mt-6 flex items-center gap-2 font-semibold text-blue-600">
                Start Screening
                <ArrowRight size={18} />
              </div>
            </Link>

            <Link
              to="/recruiter/ai/interview-questions"
              className="group rounded-xl border border-purple-200 bg-white p-6 shadow-sm transition hover:border-purple-400 hover:shadow-lg"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white">
                <BrainCircuit size={28} />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                AI Interview Question Generator
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Generate technical and behavioral interview
                questions based on job requirements.
              </p>

              <div className="mt-6 flex items-center gap-2 font-semibold text-purple-600">
                Generate Questions
                <ArrowRight size={18} />
              </div>
            </Link>

          </div>
        </section>

        {/* TOTAL JOBS */}

        <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Total Posted Jobs
            </span>

            <BriefcaseBusiness
              className="text-blue-600"
              size={24}
            />
          </div>

          <p className="text-4xl font-bold text-slate-900">
            {loading ? "..." : error ? "—" : jobs.length}
          </p>
        </div>

        {/* JOB LIST */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">
              My Posted Jobs
            </h2>

            <button
              type="button"
              onClick={() => fetchJobs()}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-10 text-slate-500">
              <LoaderCircle
                size={22}
                className="animate-spin"
              />
              Loading your jobs...
            </div>
          ) : error ? (
            <p className="py-8 text-center text-slate-500">
              Jobs could not be loaded. Try refreshing.
            </p>
          ) : jobs.length === 0 ? (
            <div className="py-12 text-center">
              <BriefcaseBusiness
                size={42}
                className="mx-auto mb-4 text-slate-400"
              />

              <h3 className="text-lg font-semibold text-slate-800">
                No jobs posted yet
              </h3>

              <p className="mt-2 text-slate-500">
                Create your first job to start receiving applications.
              </p>

              <Link
                to="/recruiter/jobs/new"
                className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
              >
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-slate-200 p-5 transition hover:shadow-md"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900">
                      {job.title || "Untitled Job"}
                    </h3>

                    <p className="mt-1 flex items-center gap-2 text-slate-600">
                      <Building2 size={16} />
                      {job.companyName || "Not specified"}
                    </p>
                  </div>

                  <div className="space-y-3 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {job.location || "Not specified"}
                    </p>

                    <p className="flex items-center gap-2">
                      <BriefcaseBusiness size={16} />
                      {job.employmentType || "Not specified"}
                    </p>

                    <p className="flex items-center gap-2">
                      <Wallet size={16} />
                      {job.salary ?? "Not specified"}
                    </p>

                    <p>
                      <strong>Experience:</strong>{" "}
                      {job.experience || "Not specified"}
                    </p>

                    <p>
                      <strong>Skills:</strong>{" "}
                      {Array.isArray(job.skills)
                        ? job.skills.join(", ")
                        : job.skills || "Not specified"}
                    </p>

                    <p className="line-clamp-3">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-5 border-t pt-4">
                    <Link
                      to={`/recruiter/jobs/${job.id}/applicants`}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                    >
                      <Users size={16} />
                      View Applicants
                    </Link>
                  </div>

                  <p className="mt-3 text-xs text-slate-400">
                    Job ID: {job.id}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
